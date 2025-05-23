import type { CustomHealthValue } from "@/types";


interface InputItem {
  startDate: string;
  endDate: string;
  data: CustomHealthValue[];
};

function fillMissingDates(input: InputItem): CustomHealthValue[] {
  const { startDate, endDate, data } = input;

  const dateMap = new Map<string, CustomHealthValue>();
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  for (const item of data) {
    const cur = new Date(item.startDate);
    const itemEnd = new Date(item.endDate);

    while (cur < itemEnd) {
      const dayKey = cur.toISOString().slice(0, 10);
      if (!dateMap.has(dayKey)) {
        const next = new Date(cur);
        next.setDate(next.getDate() + 1);
        dateMap.set(dayKey, {
          startDate: cur.toISOString(),
          endDate: next.toISOString(),
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
    const key = current.toISOString().slice(0, 10);
    if (dateMap.has(key)) {
      result.push(dateMap.get(key)!);
    } else {
      const next = new Date(current);
      next.setDate(next.getDate() + 1);
      result.push({
        startDate: current.toISOString(),
        endDate: next.toISOString(),
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
