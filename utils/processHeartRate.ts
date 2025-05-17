import type { CustomHealthValue } from '@/types';

type DailySummary = {
  date: string;
  avg: number;
  min: number;
  minTime: string;
  max: number;
  maxTime: string;
  spikes: {
    time: string;
    value: number;
    prevValue: number;
    delta: number;
  }[];
};

export function getDailyAverage(
  samples: CustomHealthValue[],
  decimalPlaces: number
): CustomHealthValue[] {
  const dayGroups: {
    [date: string]: { sum: number; count: number; min: number; max: number };
  } = {};

  for (const sample of samples) {
    const start = new Date(sample.startDate);
    const end = new Date(sample.endDate);

    let current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    while (current <= endDay) {
      const dateStr = current.toISOString().split('T')[0];

      if (!dayGroups[dateStr]) {
        dayGroups[dateStr] = {
          sum: 0,
          count: 0,
          min: sample.value,
          max: sample.value,
        };
      }

      const group = dayGroups[dateStr];
      group.sum += sample.value;
      group.count += 1;
      group.min = Math.min(group.min, sample.value);
      group.max = Math.max(group.max, sample.value);

      current.setDate(current.getDate() + 1);
    }
  }

  const result: CustomHealthValue[] = Object.entries(dayGroups).map(
    ([date, { sum, count, min, max }]) => {
      const avg = Number((sum / count).toFixed(decimalPlaces));
      const start = new Date(`${date}T00:00:00.000Z`).toISOString();
      const end = new Date(`${date}T23:59:59.999Z`).toISOString();

      return {
        startDate: start,
        endDate: end,
        value: avg,
        min: Number(min.toFixed(decimalPlaces)),
        max: Number(max.toFixed(decimalPlaces)),
      };
    }
  );

  result.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return result;
}

export default function processHeartRate(samples: CustomHealthValue[]): DailySummary[] {
  if (samples.length === 0) return [];

  const grouped: { [date: string]: CustomHealthValue[] } = {};

  for (const sample of samples) {
    const dateStr = new Date(sample.startDate).toISOString().split('T')[0];
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(sample);
  }

  const summaries: DailySummary[] = [];

  const thresholdHigh = 130;
  const thresholdLow = 45;
  const suddenChange = 30;

  for (const date in grouped) {
    const daySamples = grouped[date];
    let sum = 0;
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    let minTime = '';
    let maxTime = '';

    const spikes: DailySummary['spikes'] = [];

    let prevValue = daySamples[0].value;
    let isInHighZone = prevValue > thresholdHigh;
    let isInLowZone = prevValue < thresholdLow;

    for (const sample of daySamples) {
      const { value, startDate } = sample;
      sum += value;

      if (value < min) {
        min = value;
        minTime = startDate;
      }
      if (value > max) {
        max = value;
        maxTime = startDate;
      }

      const delta = value - prevValue;
      const isSuddenChange = Math.abs(delta) >= suddenChange;

      // sudden spike는 항상 기록
      if (isSuddenChange) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
      }

      // High threshold 진입 감지
      if (!isInHighZone && value > thresholdHigh) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
        isInHighZone = true;
      }

      // High threshold 탈출 감지
      if (isInHighZone && value <= thresholdHigh) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
        isInHighZone = false;
      }

      // Low threshold 진입 감지
      if (!isInLowZone && value < thresholdLow) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
        isInLowZone = true;
      }

      // Low threshold 탈출 감지
      if (isInLowZone && value >= thresholdLow) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
        isInLowZone = false;
      }

      prevValue = value;
    }

    const avg = Number((sum / daySamples.length).toFixed(1));

    summaries.push({
      date,
      avg,
      min,
      minTime,
      max,
      maxTime,
      spikes,
    });
  }

  return summaries;
}
