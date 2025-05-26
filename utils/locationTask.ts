import * as TaskManager from 'expo-task-manager';

export const LOCATION_TASK_NAME = 'background-location-task';

let lastSentTime = 0;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('백그라운드 위치 오류:', error);
    return;
  }

  const now = Date.now();
  if (now - lastSentTime < 15 * 60 * 1000) {
    return;
  }
  lastSentTime = now;

  if (data) {
    const { locations } = data as any;
    const latestLocation = locations[0];
    if (latestLocation) {
      const { latitude, longitude } = latestLocation.coords;

      try {
        await fetch('https://api.momenty.co.kr/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ latitude, longitude }),
        });
      } catch (err) {
        console.warn('[BG] 위치 전송 실패:', err);
      }
    }
  }
});
