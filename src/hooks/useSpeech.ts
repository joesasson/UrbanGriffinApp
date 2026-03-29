import * as Speech from 'expo-speech';
import { useState, useEffect, useCallback } from 'react';

const KEEPER_VOICE = 'en-us-x-tpd-network';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(text, {
      voice: KEEPER_VOICE,
      rate: 0.82,
      pitch: 0.58,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  }, []);

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    return () => { Speech.stop(); };
  }, []);

  return { speak, stop, isSpeaking };
}
