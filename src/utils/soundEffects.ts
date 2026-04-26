import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

type SoundKey = 'tap' | 'correct' | 'wrong' | 'token' | 'key';

const SOUND_FILES: Record<SoundKey, any> = {
  tap:     require('../../assets/sounds/tap.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  wrong:   require('../../assets/sounds/wrong.wav'),
  token:   require('../../assets/sounds/token.wav'),
  key:     require('../../assets/sounds/key.wav'),
};

async function playSound(key: SoundKey) {
  try {
    const { sound } = await Audio.Sound.createAsync(SOUND_FILES[key]);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch {
    // silently fail — haptics still fire
  }
}

export const playTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  playSound('tap');
};

export const playCorrect = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  playSound('correct');
};

export const playWrong = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  playSound('wrong');
};

export const playTokenEarned = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  playSound('token');
};

export const playKeyObtained = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  playSound('key');
};
