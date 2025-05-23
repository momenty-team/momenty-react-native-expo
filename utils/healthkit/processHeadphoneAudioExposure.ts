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

interface ExposureSummary {
  summary: {
    period: { start: string; end: string };
    averageDb: number;
    dangerousExposureRatio: number;
    sustainedHighSessions: SustainedSession[];
  };
};

/**
 * n분 단위 헤드폰 오디오 노출량을 ExposureSummary 형식으로 변환.
 * 하루 단위로 그룹화한 배열을 반환.
 * threshold는 고수준의 소음 노출을 나누는 기준. 고수준에 해당하면 sustainedHighSessions에 포함됨.
 * dangerousExposureRatio는 고수준 노출량 / 전체 노출량을 나타냄.
 */
export default function processHeadphoneAudioExposure(data: AudioExposure[]): ExposureSummary {
  if (data.length === 0) throw new Error('데이터가 없습니다');
  const threshold = 70;
  let total = 0;
  let dangerCount = 0;

  const sorted = data.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

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
