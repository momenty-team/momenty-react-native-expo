import type { CustomHealthValue } from '@/types';

type ActivitySession = {
  start: string;
  end: string;
  energy: number;
};

type SummaryResult = {
  date: string;
  totalEnergy: number;
  highActivitySessions: ActivitySession[];
  mostActivePeriod: ActivitySession | null;
};

// threshold는 변화량임. 바꿔야함.
//  예시
// {
//   "date": "2025-05-20",
//   "totalEnergy": 327.45,
//   "highActivitySessions": [ // 활동량이 기준치 이상인 세션들
//     { "start": "10:00", "end": "10:15", "energy": 51.91 },
//     { "start": "16:00", "end": "16:15", "energy": 39.72 },
//     { "start": "21:30", "end": "22:00", "energy": 36.23 }
//   ],
//   "mostActivePeriod": { // 가장 active했던 구간
//     "hour": "16:00~17:00",
//     "energy": 70.12
//   }
// }

function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

export default function processActiveEnergyBurned(
  data: CustomHealthValue[],
  threshold = 5
): SummaryResult[] {
  const grouped: Record<string, CustomHealthValue[]> = {};

  // 1. Group data by date
  for (const entry of data) {
    const dateKey = formatDate(entry.startDate);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(entry);
  }

  // 2. Apply per-day processing
  const results: SummaryResult[] = [];

  for (const date in grouped) {
    const dayData = grouped[date].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    let totalEnergy = 0;
    let sessions: ActivitySession[] = [];
    let currentSession: ActivitySession | null = null;

    for (const entry of dayData) {
      const { startDate, endDate, value } = entry;
      if (value === null || value === undefined) continue;
      totalEnergy += value;

      if (value >= threshold) {
        if (!currentSession) {
          currentSession = {
            start: startDate,
            end: endDate,
            energy: value,
          };
        } else {
          currentSession.end = endDate;
          currentSession.energy += value;
        }
      } else {
        if (currentSession) {
          sessions.push(currentSession);
          currentSession = null;
        }
      }
    }

    if (currentSession) {
      sessions.push(currentSession);
    }

    const mostActivePeriod =
      sessions.length > 0
        ? sessions.reduce((max, s) => (s.energy > max.energy ? s : max), sessions[0])
        : null;

    results.push({
      date,
      totalEnergy: parseFloat(totalEnergy.toFixed(2)),
      highActivitySessions: sessions,
      mostActivePeriod,
    });
  }

  return results;
}
