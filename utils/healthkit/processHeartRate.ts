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
    if (!prevValue) continue;
    let isInHighZone = prevValue > thresholdHigh;
    let isInLowZone = prevValue < thresholdLow;

    for (const sample of daySamples) {
      const { value, startDate } = sample;

      if (!value) continue;

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
