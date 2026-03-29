import { Audio } from 'expo-av';

class AudioPlayer {
  private currentSound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  /**
   * Initialize audio mode
   */
  async initialize() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }

  /**
   * Play an audio file
   * @param audioFile - Name of the audio file (without extension)
   * @param onComplete - Callback when audio finishes playing
   */
  async play(audioFile: string, onComplete?: () => void): Promise<void> {
    // Stop current audio if playing
    await this.stop();

    try {
      // Load and play the new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: `${audioFile}.mp3` }, // You'll need to adjust this path
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            this.isPlaying = false;
            if (onComplete) {
              onComplete();
            }
          }
        }
      );

      this.currentSound = sound;
      this.isPlaying = true;
    } catch (error) {
      console.log('Failed to load audio', error);
    }
  }

  /**
   * Stop the currently playing audio
   */
  async stop(): Promise<void> {
    if (this.currentSound && this.isPlaying) {
      await this.currentSound.stopAsync();
      await this.currentSound.unloadAsync();
      this.currentSound = null;
      this.isPlaying = false;
    }
  }

  /**
   * Pause the currently playing audio
   */
  async pause(): Promise<void> {
    if (this.currentSound && this.isPlaying) {
      await this.currentSound.pauseAsync();
      this.isPlaying = false;
    }
  }

  /**
   * Resume paused audio
   */
  async resume(): Promise<void> {
    if (this.currentSound && !this.isPlaying) {
      await this.currentSound.playAsync();
      this.isPlaying = true;
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  async setVolume(volume: number): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.setVolumeAsync(volume);
    }
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Release resources
   */
  async release(): Promise<void> {
    if (this.currentSound) {
      await this.currentSound.unloadAsync();
      this.currentSound = null;
      this.isPlaying = false;
    }
  }
}

// Export a singleton instance
export const audioPlayer = new AudioPlayer();

// Audio file mapping for Keeper dialogue
export const AudioFiles = {
  // Introduction
  intro_welcome: 'keeper_intro_welcome',
  intro_griffin: 'keeper_intro_griffin',
  intro_griffin_description: 'keeper_intro_griffin_description',
  intro_stories: 'keeper_intro_stories',
  intro_mission: 'keeper_intro_mission',
  intro_keys: 'keeper_intro_keys',
  intro_sky_snatchers: 'keeper_intro_sky_snatchers',
  intro_begin: 'keeper_intro_begin',

  // Grand Central - Challenge 1
  gc_challenge1_opening: 'keeper_gc_c1_opening',
  gc_challenge1_riddle: 'keeper_gc_c1_riddle',
  gc_challenge1_correct: 'keeper_gc_c1_correct',
  gc_challenge1_incorrect: 'keeper_gc_c1_incorrect',
  gc_challenge1_transition: 'keeper_gc_c1_transition',

  // Grand Central - Challenge 2
  gc_challenge2_opening: 'keeper_gc_c2_opening',
  gc_challenge2_completion: 'keeper_gc_c2_completion',

  // Grand Central - Challenge 3
  gc_challenge3_opening: 'keeper_gc_c3_opening',
  gc_challenge3_correct: 'keeper_gc_c3_correct',
  gc_challenge3_completion: 'keeper_gc_c3_completion',

  // Fragment Puzzle
  gc_fragments_opening: 'keeper_gc_fragments_opening',
  gc_fragments_combining: 'keeper_gc_fragments_combining',
  gc_fragments_final: 'keeper_gc_fragments_final',

  // Generic feedback
  correct_answer: 'keeper_correct',
  incorrect_answer: 'keeper_incorrect',
  hint_delivered: 'keeper_hint',
  token_earned: 'keeper_token_earned',
  key_obtained: 'keeper_key_obtained',
};

// Helper function to play Keeper dialogue via TTS
export const playKeeperDialogue = (
  audioFile: string,
  text: string,
  onComplete?: () => void
): void => {
  import('expo-speech').then((Speech) => {
    Speech.stop();
    Speech.speak(text, {
      rate: 0.85,
      pitch: 0.8,
      onDone: onComplete,
      onError: onComplete,
    });
  });
};

