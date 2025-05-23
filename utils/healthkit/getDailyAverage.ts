import type { CustomHealthValue } from "@/types";

function getDailyAverage(
  samples: CustomHealthValue[],
  decimalPlaces: number
): CustomHealthValue[] {
  const dayGroups: {
    [date: string]: { sum: number; count: number; min: number; max: number };
  } = {};

  for (const sample of samples) {
    if(!sample.value) continue;

    const start = new Date(sample.startDate);
    const end = new Date(sample.endDate);

    let current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    while (current <= endDay) {
      const dateStr = current.toISOString().split('T')[0];

      if (!dayGroups[dateStr]) {
        dayGroups[dateStr] = {
          sum: 0,
          count: 0,
          min: sample.value,
          max: sample.value,
        };
      }

      const group = dayGroups[dateStr];
      group.sum += sample.value;
      group.count += 1;
      group.min = Math.min(group.min, sample.value);
      group.max = Math.max(group.max, sample.value);

      current.setDate(current.getDate() + 1);
    }
  }

  const result: CustomHealthValue[] = Object.entries(dayGroups).map(
    ([date, { sum, count, min, max }]) => {
      const avg = Number((sum / count).toFixed(decimalPlaces));
      const start = new Date(`${date}T00:00:00.000Z`).toISOString();
      const end = new Date(`${date}T23:59:59.999Z`).toISOString();

      return {
        startDate: start,
        endDate: end,
        value: avg,
        min: Number(min.toFixed(decimalPlaces)),
        max: Number(max.toFixed(decimalPlaces)),
      };
    }
  );

  result.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return result;
}

export default getDailyAverage;