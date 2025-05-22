// type StepSummary = {
//   date: string;
//   totalSteps: number;
//   peakInterval: {
//     start: string;
//     end: string;
//     value: number;
//   };
//   peakProportion: number; // peak / totalSteps
//   sustainedActivityCount: number; // 연속 구간에서 일정 기준 이상 유지한 횟수
//   stddev: number; // 하루의 걸음 수 편차
//   dominantPeriod: "morning" | "afternoon" | "evening"; // 시간대 중 가장 걸음 수 많은 구간
// };

import { CustomHealthValue } from '@/types';

type StepData = {
  startDate: string;
  endDate: string;
  value: number;
};

type StepSummary = {
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

export default function processStepCountSamples(
  data: CustomHealthValue[],
  burstThreshold = 100
): StepSummary[] {
  const groupByDate = new Map<string, StepData[]>();

  // 1. 날짜별로 그룹화
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

    // 시간대별 활동량 집계
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

  // 날짜 오름차순 정렬
  return results.sort((a, b) => a.date.localeCompare(b.date));
}
