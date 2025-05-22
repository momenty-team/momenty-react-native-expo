type AudioExposure = {
  startDate: string;
  endDate: string;
  value: number;
};

type SustainedSession = {
  start: string;
  end: string;
  average: number;
};

type ExposureSummary = {
  summary: {
    period: { start: string; end: string };
    averageDb: number;
    dangerousExposureRatio: number;
    sustainedHighSessions: SustainedSession[];
  };
};

export default function processHeadphoneAudioExposure(data: AudioExposure[]): ExposureSummary {
  if (data.length === 0) throw new Error('데이터가 없습니다');

  const sorted = data.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const threshold = 70;
  let total = 0;
  let dangerCount = 0;

  let sustained: SustainedSession[] = [];
  let temp: AudioExposure[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const { value } = sorted[i];
    total += value;
    if (value >= threshold) {
      temp.push(sorted[i]);
      dangerCount++;
    } else {
      if (temp.length >= 2) {
        sustained.push({
          start: temp[0].startDate,
          end: temp[temp.length - 1].endDate,
          average: parseFloat((temp.reduce((s, d) => s + d.value, 0) / temp.length).toFixed(2)),
        });
      }
      temp = [];
    }
  }

  // 마지막 연속 세션 처리
  if (temp.length >= 2) {
    sustained.push({
      start: temp[0].startDate,
      end: temp[temp.length - 1].endDate,
      average: parseFloat((temp.reduce((s, d) => s + d.value, 0) / temp.length).toFixed(2)),
    });
  }

  return {
    summary: {
      period: {
        start: sorted[0].startDate,
        end: sorted[sorted.length - 1].endDate,
      },
      averageDb: parseFloat((total / sorted.length).toFixed(2)),
      dangerousExposureRatio: parseFloat((dangerCount / sorted.length).toFixed(2)),
      sustainedHighSessions: sustained,
    },
  };
}
