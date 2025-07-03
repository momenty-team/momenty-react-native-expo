type TimeBlock = 'morning' | 'afternoon' | 'evening' | 'night';

interface AudioExposure {
  startDate: string;
  endDate: string;
  value: number;
};

interface SustainedSession {
  start: string;
  end: string;
  average: number;
};

interface SummaryOutput {
  summary: {
    period: { start: string; end: string };
    averageByTimeOfDay: Record<'morning' | 'afternoon' | 'evening' | 'night', number>;
    dangerousExposureRatio: number;
    sustainedHighSessions: SustainedSession[];
    volatility: { avgDelta: number; stdDev: number }; // 소음 변화량 분포
  };
};

/**
 * n분 단위 외부환경 소음 노출량을 SummaryOutput 형식으로 변환.
 * 하루 단위로 그룹화한 배열을 반환.
 * threshold는 고수준의 소음 노출을 나누는 기준. 고수준에 해당하면 sustainedHighSessions에 포함됨.
 * volatility는 소음 변화량의 평균과 표준편차를 포함.
 * dangerousExposureRatio는 고수준 노출량 / 전체 노출량을 나타냄.
 */
export default function processEnvironmentalAudioExposure(data: AudioExposure[]): SummaryOutput | null {
  if (data.length === 0) {
    return null;
  };
  
  const threshold = 70;
  let dangerousCount = 0;

  const parse = (d: string) => new Date(d);
  const blocks: Record<TimeBlock, number[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };

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
