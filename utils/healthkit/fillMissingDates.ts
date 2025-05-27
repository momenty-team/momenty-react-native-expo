import type { CustomHealthValue } from "@/types";

interface InputItem {
  startDate: string;
  endDate: string;
  data: CustomHealthValue[];
}

// KST 기준 YYYY-MM-DD 형식으로 키 생성
function toKSTDateKey(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10); // YYYY-MM-DD
}

// KST 기준으로 ISO 문자열 생성
function toKSTISOString(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString();
}

function fillMissingDates(input: InputItem): CustomHealthValue[] {
  const { startDate, endDate, data } = input;

  const dateMap = new Map<string, CustomHealthValue>();
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);

  for (const item of data) {
    const cur = new Date(item.startDate);
    const itemEnd = new Date(item.endDate);

    while (cur < itemEnd) {
      const dayKey = toKSTDateKey(cur);
      if (!dateMap.has(dayKey)) {
        const next = new Date(cur);
        next.setDate(next.getDate() + 1);
        dateMap.set(dayKey, {
          startDate: toKSTISOString(cur),
          endDate: toKSTISOString(next),
          value: item.value,
          min: item.min,
          max: item.max,
        });
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  const result: CustomHealthValue[] = [];
  const current = new Date(start);

  while (current <= end) {
    const key = toKSTDateKey(current);
    if (dateMap.has(key)) {
      result.push(dateMap.get(key)!);
    } else {
      const next = new Date(current);
      next.setDate(next.getDate() + 1);
      result.push({
        startDate: toKSTISOString(current),
        endDate: toKSTISOString(next),
        value: null,
        min: 0,
        max: 0,
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
}

export default fillMissingDates;
