import type { CustomHealthValue } from '@/types';

interface DailySummary {
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

/**
 * n분 단위 심박수를 DailySummary 형식으로 변환.
 * 하루 단위로 그룹화한 배열을 반환.
 * thresholdHigh 고수준 심박수를 나누는 기준. 고수준에 해당하면 spikes에 포함됨.
 * thresholdLow 저수준 심박수를 나누는 기준. 저수준에 해당하면 spikes에 포함됨.
 * suddenChange 급격한 변화량을 나누는 기준. 급격한 변화가 발생하면 spikes에 포함됨.
 * delta는 이전 값과의 차이를 나타냄.
 * minTime과 maxTime은 각각 최소/최대 심박수가 발생한 시간을 나타냄.
 * spikes는 심박수의 급격한 변화가 발생한 시점과 그 값, 이전 값, 변화량을 포함함.
 */
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

      if (isSuddenChange) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
      }

      if (!isInHighZone && value > thresholdHigh) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
        isInHighZone = true;
      }

      if (isInHighZone && value <= thresholdHigh) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
        isInHighZone = false;
      }

      if (!isInLowZone && value < thresholdLow) {
        spikes.push({
          time: startDate,
          value,
          prevValue,
          delta: Number(delta.toFixed(1)),
        });
        isInLowZone = true;
      }

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
