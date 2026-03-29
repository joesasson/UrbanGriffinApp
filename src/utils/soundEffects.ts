import * as Haptics from 'expo-haptics';

export const playTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const playSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const playError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};
