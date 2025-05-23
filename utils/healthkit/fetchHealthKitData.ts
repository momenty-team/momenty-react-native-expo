import type { HealthInputOptions } from "react-native-health";

const fetchHealthKitData = <T>(
  options: HealthInputOptions,
  fetcher: (
    opts: HealthInputOptions,
    callback: (error: string | null, results: any) => void
  ) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetcher(options, (error, results) => {
      if (error) {
        console.error('[ERROR] HealthKit fetch failed:', error);
        reject(error);
        return;
      }

      resolve(results);
    });
  });
};

export default fetchHealthKitData;