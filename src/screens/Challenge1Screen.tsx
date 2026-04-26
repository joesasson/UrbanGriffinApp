import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import landmarksData from '../data/landmarks.json';
import { Images } from '../utils/images';
import { C, GoldGlow, CyanGlow } from '../theme';
import { useSpeech } from '../hooks/useSpeech';
import SpeakButton from '../components/SpeakButton';
import { playTap, playCorrect, playWrong } from '../utils/soundEffects';
import { KeyboardAvoidingScroll } from '../components/KeyboardAvoidingScroll';

const Challenge1Screen = ({ navigation, route }: any) => {
  const { landmarkId } = route.params;
  const { addTokens, completeChallenge } = useGame();
  const { speak, stop, isSpeaking } = useSpeech();

  const landmark = landmarksData.landmarks.find(l => l.landmarkId === landmarkId);
  const challenge = landmark?.challenge1;

  const [currentStep, setCurrentStep] = useState<'intro' | 'fragment'>('intro');
  const [answer, setAnswer] = useState('');
  const [fragmentImageRevealed, setFragmentImageRevealed] = useState(false);

  useEffect(() => {
    if (!challenge) return;
    if (currentStep === 'intro') {
      speak(`${challenge.keeperOpening} ${challenge.riddle}`);
    } else if (currentStep === 'fragment') {
      speak(challenge.fragmentPuzzle.keeperInstructions);
    }
  }, [challenge, currentStep, speak]);

  if (!challenge) return null;

  const handleFragmentSubmit = () => {
    const norm = answer.toLowerCase().trim();
    const sol = challenge.fragmentPuzzle.solution.toLowerCase().trim();
    if (norm === sol) {
      playCorrect();
      setFragmentImageRevealed(true);
      addTokens(challenge.tokenReward);
      completeChallenge(landmarkId, 1);
      Alert.alert('Excellent!', challenge.keeperCorrect, [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('Challenge2', { landmarkId }),
        },
      ]);
    } else {
      playWrong();
      Alert.alert('Not Quite', challenge.keeperIncorrect);
    }
  };

  const renderIntro = () => (
    <View style={styles.section}>
      <View style={styles.keeperRow}>
        <Image source={Images.theKeeper} style={styles.keeperAvatar} resizeMode="cover" />
        <Text style={styles.keeperLabel}>The Keeper</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>{challenge.keeperOpening}</Text>
        <SpeakButton
          text={`${challenge.keeperOpening} ${challenge.riddle}`}
          speak={speak}
          stop={stop}
          isSpeaking={isSpeaking}
        />
      </View>
      <View style={styles.riddleBox}>
        <Text style={styles.riddleText}>{challenge.riddle}</Text>
      </View>
      <TouchableOpacity style={styles.btnPrimary} onPress={() => { playTap(); setCurrentStep('fragment'); }}>
        <Text style={styles.btnPrimaryText}>I'm Ready to Answer</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFragment = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Fragment Puzzle</Text>
      <View style={styles.textBox}>
        <Text style={styles.text}>{challenge.fragmentPuzzle.keeperInstructions}</Text>
        <SpeakButton
          text={challenge.fragmentPuzzle.keeperInstructions}
          speak={speak}
          stop={stop}
          isSpeaking={isSpeaking}
        />
      </View>
      <View style={styles.fragmentBox}>
        <Text style={styles.fragmentLetters}>{challenge.fragmentPuzzle.content}</Text>
      </View>
      <Text style={styles.inputLabel}>{challenge.keeperAnswerPrompt}</Text>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Unscramble the letters..."
        placeholderTextColor={C.textMuted}
        autoFocus
      />
      <TouchableOpacity style={styles.btnPrimary} onPress={() => { playTap(); handleFragmentSubmit(); }}>
        <Text style={styles.btnPrimaryText}>Submit Answer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={Images.fragmentBackground}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <KeyboardAvoidingScroll contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {currentStep === 'fragment' && Images.landmarkThumbnails[landmarkId] && (
            <View style={styles.landmarkHeroWrap}>
              <Image
                source={Images.landmarkThumbnails[landmarkId]}
                style={styles.landmarkHeroImage}
                resizeMode="cover"
              />
              {!fragmentImageRevealed && (
                <>
                  <BlurView
                    intensity={100}
                    tint="dark"
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View style={[StyleSheet.absoluteFillObject, styles.landmarkHeroObscure]} />
                </>
              )}
            </View>
          )}
          <Text style={styles.challengeTitle}>Challenge 1: Find the Landmark</Text>

          {currentStep === 'intro' && renderIntro()}
          {currentStep === 'fragment' && renderFragment()}
        </View>
      </KeyboardAvoidingScroll>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgDeep,
  },
  overlay: {
    backgroundColor: 'rgba(6,13,26,0.91)',
  },
  scrollContent: { flexGrow: 1, paddingBottom: 48 },
  content: { padding: 20 },

  landmarkHeroWrap: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.cyanDim,
    overflow: 'hidden',
  },
  landmarkHeroImage: {
    width: '100%',
    height: '100%',
  },
  landmarkHeroObscure: {
    // Tiny bit of transparency over blur — just enough to hint at a vague shape
    backgroundColor: 'rgba(6,13,26,0.93)',
  },
  challengeTitle: {
    fontSize: 14,
    color: C.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  section: { marginBottom: 20 },
  sectionLabel: {
    color: C.cyan,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },

  keeperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  keeperAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: C.gold,
    overflow: 'hidden',
  },
  keeperLabel: {
    color: C.gold,
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: C.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },

  textBox: {
    backgroundColor: C.bgCard,
    padding: 18,
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: C.goldDim,
    ...GoldGlow,
    shadowOpacity: 0.3,
  },
  text: {
    color: C.textPrimary,
    fontSize: 15,
    lineHeight: 24,
  },
  mt: { marginTop: 14 },

  riddleBox: {
    backgroundColor: C.bgCard,
    padding: 22,
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: C.cyan,
    ...CyanGlow,
  },
  riddleText: {
    color: C.textPrimary,
    fontSize: 16,
    lineHeight: 28,
    fontStyle: 'italic',
  },

  fragmentBox: {
    backgroundColor: C.bgDeep,
    padding: 20,
    borderRadius: 10,
    marginBottom: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.cyan,
    ...CyanGlow,
  },
  fragmentLetters: {
    color: C.cyan,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 10,
    textShadowColor: C.cyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  inputLabel: {
    color: C.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: C.bgInput,
    borderWidth: 1.5,
    borderColor: C.cyan,
    borderRadius: 10,
    padding: 14,
    color: C.textPrimary,
    fontSize: 16,
    marginBottom: 16,
    ...CyanGlow,
    shadowOpacity: 0.25,
  },

  btnPrimary: {
    backgroundColor: C.bgCard,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.gold,
    alignItems: 'center',
    ...GoldGlow,
  },
  btnPrimaryText: {
    color: C.gold,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default Challenge1Screen;
