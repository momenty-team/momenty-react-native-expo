import type { CustomHealthValue } from '@/types';

type StepSession = {
  startDate: string; // ISO8601
  endDate: string;
  value: number;
};

type TimeBlock = 'morning' | 'afternoon' | 'evening' | 'night';

type PeakSession = {
  start: string;
  end: string;
  value: number;
};

type DailySummary = {
  date: string;
  totalSteps: number;
  activeMinutes: number;
  longestActivePeriod: number;
  firstActivity: string | null;
  lastActivity: string | null;
  timeBlocks: Record<TimeBlock, number>;
  peakSessions: PeakSession[];
};

function getTimeBlock(hour: number): TimeBlock {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 24) return 'evening';
  return 'night';
}

// date: 날짜 (yyyy-mm-dd)

// totalSteps: 총 걸음 수 (threshold 이상 구간만 합산)

// activeMinutes: 활동한 총 시간 (15분 단위 누적)

// longestActivePeriod: 가장 길었던 연속 활동 시간 (분)

// firstActivity, lastActivity: 활동 시작 및 종료 시간

// timeBlocks: 오전/오후/저녁/야간별 걸음 합

// peakSessions: 상위 3개 활동 세션 (value 기준)

export default function processDistanceWalkingRunning(
  data: CustomHealthValue[],
  threshold = 100
): DailySummary[] {
  const grouped: Record<string, StepSession[]> = {};

  for (const entry of data) {
    const date = new Date(entry.startDate).toISOString().split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    if (entry.value === null || entry.value === undefined) continue; // 값이 없으면 건너뛰기
    grouped[date].push(entry as StepSession);
  }

  return Object.entries(grouped).map(([date, sessions]) => {
    let totalSteps = 0;
    let activeMinutes = 0;
    let longestActivePeriod = 0;
    let currentStreak = 0;
    let firstActivity: string | null = null;
    let lastActivity: string | null = null;

    const timeBlocks: Record<TimeBlock, number> = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };

    const peaks: PeakSession[] = [];

    for (const s of sessions.sort((a, b) => a.startDate.localeCompare(b.startDate))) {
      if (s.value > threshold) {
        totalSteps += s.value;
        activeMinutes += 15;
        currentStreak += 15;

        const hour = new Date(s.startDate).getHours();
        const block = getTimeBlock(hour);
        timeBlocks[block] += s.value;

        if (!firstActivity) firstActivity = s.startDate;
        lastActivity = s.endDate;

        peaks.push({ start: s.startDate, end: s.endDate, value: s.value });
      } else {
        longestActivePeriod = Math.max(longestActivePeriod, currentStreak);
        currentStreak = 0;
      }
    }
    longestActivePeriod = Math.max(longestActivePeriod, currentStreak);

    return {
      date,
      totalSteps: Math.round(totalSteps),
      activeMinutes,
      longestActivePeriod,
      firstActivity,
      lastActivity,
      timeBlocks,
      peakSessions: peaks.sort((a, b) => b.value - a.value).slice(0, 3),
    };
  });
}
