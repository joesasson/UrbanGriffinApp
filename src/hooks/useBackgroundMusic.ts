import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const VOLUME = 0.18; // light background

export function useBackgroundMusic() {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/music/background.mp3'),
          { shouldPlay: true, isLooping: true, volume: VOLUME }
        );

        if (mounted) {
          soundRef.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch (e) {
        console.log('[BackgroundMusic] failed to load:', e);
      }
    }

    start();

    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, []);
}
