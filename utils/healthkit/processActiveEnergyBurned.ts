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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

/**
 * n분 단위 활동 에너지 소모량을 SummaryResult 형식으로 변환.
 * 하루 단위로 그룹화한 배열을 반환.
 * threshold는 고수준의 활동 에너지를 나누는 기준. 고수준에 해당하면 highActivitySessions에 포함됨.
 */
export default function processActiveEnergyBurned(
  data: CustomHealthValue[],
  threshold = 5
): SummaryResult[] {
  const grouped: Record<string, CustomHealthValue[]> = {};

  for (const entry of data) {
    const dateKey = formatDate(entry.startDate);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(entry);
  }

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
