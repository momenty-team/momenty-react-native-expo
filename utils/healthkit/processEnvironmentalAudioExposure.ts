import type { CustomHealthValue } from '@/types';

type TimeBlock = 'morning' | 'afternoon' | 'evening' | 'night';

type AudioExposure = {
  startDate: string;
  endDate: string;
  value: number;
} & CustomHealthValue;

type SustainedSession = {
  start: string;
  end: string;
  average: number;
};

type SummaryOutput = {
  summary: {
    period: { start: string; end: string };
    averageByTimeOfDay: Record<'morning' | 'afternoon' | 'evening' | 'night', number>;
    dangerousExposureRatio: number;
    sustainedHighSessions: SustainedSession[];
    volatility: { avgDelta: number; stdDev: number }; // 소음 변화량 분포
  };
};

export default function processEnvironmentalAudioExposure(data: AudioExposure[]): SummaryOutput {
  if (data.length === 0) throw new Error('No data available');

  const parse = (d: string) => new Date(d);
  const blocks: Record<TimeBlock, number[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };
  const threshold = 70;
  let dangerousCount = 0;

  let sustained: SustainedSession[] = [];
  let temp: AudioExposure[] = [];

  const deltas: number[] = [];

  data.sort((a, b) => parse(a.startDate).getTime() - parse(b.startDate).getTime());

  for (let i = 0; i < data.length; i++) {
    const { startDate, value } = data[i];
    const hour = parse(startDate).getHours();

    const timeBlock =
      hour >= 6 && hour < 12
        ? 'morning'
        : hour >= 12 && hour < 18
        ? 'afternoon'
        : hour >= 18 && hour < 24
        ? 'evening'
        : 'night';

    blocks[timeBlock].push(value);

    if (value >= threshold) {
      temp.push(data[i]);
    } else {
      if (temp.length >= 2) {
        sustained.push({
          start: temp[0].startDate,
          end: temp[temp.length - 1].endDate,
          average: parseFloat((temp.reduce((sum, d) => sum + d.value, 0) / temp.length).toFixed(2)),
        });
      }
      temp = [];
    }

    if (value >= threshold) dangerousCount++;

    if (i > 0) {
      const delta = Math.abs(data[i].value - data[i - 1].value);
      deltas.push(delta);
    }
  }

  const start = data[0].startDate;
  const end = data[data.length - 1].endDate;

  const avgDelta = parseFloat((deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(2));
  const stdDev = parseFloat(
    Math.sqrt(
      deltas.reduce((sum, val) => sum + Math.pow(val - avgDelta, 2), 0) / deltas.length
    ).toFixed(2)
  );

  const averageByTimeOfDay: any = {};
  for (const key in blocks) {
    const values = blocks[key as keyof typeof blocks];
    if (values.length > 0) {
      averageByTimeOfDay[key] = parseFloat(
        (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
      );
    }
  }

  return {
    summary: {
      period: { start, end },
      averageByTimeOfDay,
      dangerousExposureRatio: parseFloat((dangerousCount / data.length).toFixed(2)),
      sustainedHighSessions: sustained,
      volatility: { avgDelta, stdDev },
    },
  };
}
