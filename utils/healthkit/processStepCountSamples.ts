import type { CustomHealthValue } from '@/types';

interface StepData {
  startDate: string;
  endDate: string;
  value: number;
};

interface StepSummary {
  date: string;
  totalSteps: number;
  peakInterval: {
    start: string;
    end: string;
    value: number;
  };
  peakProportion: number;
  sustainedActivityCount: number;
  stddev: number;
  dominantPeriod: 'morning' | 'afternoon' | 'evening';
};


/**
 * n분 단위 걸음 수를 StepSummary 형식으로 변환.
 * 하루 단위로 그룹화한 배열을 반환.
 * burstThreshold: 고수준 활동을 나누는 기준.
 * sustainedActivityCount: 연속 구간에서 일정 기준 이상 유지한 횟수.
 * peakProportion: peak / totalSteps.
 * sustainedActivityCount:  연속 구간에서 일정 기준 이상 유지한 횟수.
 * stddev: 하루의 걸음 수 편차.
 * dominantPeriod:  시간대 중 가장 걸음 수 많은 구간.
 */
export default function processStepCountSamples(
  data: CustomHealthValue[],
  burstThreshold = 100
): StepSummary[] {
  const groupByDate = new Map<string, StepData[]>();

  data.forEach((entry) => {
    const date = new Date(entry.startDate).toISOString().split('T')[0];
    if (!groupByDate.has(date)) groupByDate.set(date, []);
    if (!entry.value) return;
    groupByDate.get(date)!.push(entry as StepData);
  });

  const results: StepSummary[] = [];

  for (const [date, entries] of groupByDate.entries()) {
    let totalSteps = 0;
    let peak = entries[0];
    let sustainedCount = 0;
    const values: number[] = [];

    let morning = 0,
      afternoon = 0,
      evening = 0;

    for (let i = 0; i < entries.length; i++) {
      const cur = entries[i];
      totalSteps += cur.value;
      values.push(cur.value);

      if (cur.value > peak.value) peak = cur;

      if (cur.value >= burstThreshold && i > 0 && entries[i - 1].value >= burstThreshold) {
        sustainedCount++;
      }

      const hour = new Date(cur.startDate).getHours();
      if (hour >= 5 && hour < 12) morning += cur.value;
      else if (hour >= 12 && hour < 18) afternoon += cur.value;
      else evening += cur.value;
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stddev = Math.sqrt(variance);

    let dominantPeriod: 'morning' | 'afternoon' | 'evening' = 'morning';
    if (afternoon >= morning && afternoon >= evening) dominantPeriod = 'afternoon';
    else if (evening >= morning && evening >= afternoon) dominantPeriod = 'evening';

    results.push({
      date,
      totalSteps: Math.round(totalSteps),
      peakInterval: {
        start: peak.startDate,
        end: peak.endDate,
        value: Math.round(peak.value),
      },
      peakProportion: parseFloat((peak.value / totalSteps).toFixed(3)),
      sustainedActivityCount: sustainedCount,
      stddev: parseFloat(stddev.toFixed(2)),
      dominantPeriod,
    });
  }

  return results.sort((a, b) => a.date.localeCompare(b.date));
}
