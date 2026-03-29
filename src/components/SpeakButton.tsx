import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface SpeakButtonProps {
  text: string;
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  style?: ViewStyle;
}

const SpeakButton = ({ text, speak, stop, isSpeaking, style }: SpeakButtonProps) => (
  <TouchableOpacity
    style={[styles.btn, style]}
    onPress={isSpeaking ? stop : () => speak(text)}
    activeOpacity={0.7}
  >
    <Text style={styles.label}>{isSpeaking ? '■ Stop' : '🔊 Read aloud'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    marginTop: 10,
  },
  label: {
    color: 'rgba(212,175,55,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SpeakButton;
