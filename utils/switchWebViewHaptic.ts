import type { HapticType } from '@/types';
import * as Haptics from 'expo-haptics';

const switchWebViewHaptic = (haptic: HapticType) => {
  switch (haptic) {
    case 'selection':
      return Haptics.selectionAsync();
    case 'noticeSuccess':
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    case 'noticeWarning':
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    case 'noticeError':
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    case 'ImpactLight':
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    case 'ImpactMedium':
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    case 'ImpactHeavy':
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    case 'ImpactRigid':
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    case 'ImpactSoft':
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    default:
      throw new Error('haptic이 존재하지 않습니다.');
  }
};

export default switchWebViewHaptic;
