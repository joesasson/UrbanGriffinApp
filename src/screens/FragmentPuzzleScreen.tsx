import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import landmarksData from '../data/landmarks.json';
import { Images } from '../utils/images';
import { C, GoldGlow, CyanGlow } from '../theme';
import { useSpeech } from '../hooks/useSpeech';
import SpeakButton from '../components/SpeakButton';
import { KeyboardAvoidingScroll } from '../components/KeyboardAvoidingScroll';

const FragmentPuzzleScreen = ({ navigation, route }: any) => {
  const { landmarkId } = route.params;
  const { addTokens, addKey, addFragmentLetter, gameState } = useGame();
  const { speak, stop, isSpeaking } = useSpeech();

  const landmark = landmarksData.landmarks.find(l => l.landmarkId === landmarkId);
  const fragments = landmark?.fragments;

  const [showIntro, setShowIntro] = useState(true);
  const [currentFragmentIndex, setCurrentFragmentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [showCombining, setShowCombining] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');

  useEffect(() => {
    if (fragments && showIntro) {
      speak(fragments.keeperOpening);
    }
  }, [fragments, showIntro, speak]);

  useEffect(() => {
    if (!fragments || showIntro || showCombining) return;
    speak(fragments.questions[currentFragmentIndex].question);
  }, [fragments, currentFragmentIndex, showIntro, showCombining, speak]);

  useEffect(() => {
    if (fragments && showCombining) {
      speak(fragments.keeperCombining);
    }
  }, [fragments, showCombining, speak]);

  if (!fragments) return null;

  const currentFragment = fragments.questions[currentFragmentIndex];
  const isLastFragment = currentFragmentIndex === fragments.questions.length - 1;

  const handleFragmentSubmit = () => {
    const norm = answer.toUpperCase().trim();
    const correct = currentFragment.answer.toUpperCase();
    if (norm === correct) {
      Alert.alert('Correct!', currentFragment.keeperCorrect, [
        {
          text: 'Continue',
          onPress: () => {
            addTokens(currentFragment.tokenReward);
            addFragmentLetter(landmarkId, currentFragment.answer);
            const newLetters = [...collectedLetters, currentFragment.answer];
            setCollectedLetters(newLetters);
            if (isLastFragment) {
              setShowCombining(true);
            } else {
              setCurrentFragmentIndex(currentFragmentIndex + 1);
              setAnswer('');
            }
          },
        },
      ]);
    } else {
      Alert.alert('Not Quite', `Think about: ${currentFragment.answerSource}. What's the first letter?`);
    }
  };

  const handleFinalSubmit = () => {
    const norm = finalAnswer.toLowerCase().trim();
    const sol = fragments.solution.toLowerCase().trim();
    if (norm === sol) {
      Alert.alert('✦ Key Obtained! ✦', fragments.keeperFinal, [
        {
          text: 'Claim Key',
          onPress: () => { addKey(landmarkId); navigation.navigate('KeyCollection'); },
        },
      ]);
    } else {
      Alert.alert('Try Again', fragments.keeperStruggle);
    }
  };

  const renderIntro = () => (
    <View style={styles.section}>
      <View style={styles.keeperRow}>
        <Image source={Images.theKeeper} style={styles.keeperAvatar} resizeMode="cover" />
        <Text style={styles.keeperLabel}>The Keeper</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>{fragments.keeperOpening}</Text>
        <SpeakButton
          text={fragments.keeperOpening}
          speak={speak}
          stop={stop}
          isSpeaking={isSpeaking}
        />
      </View>
      <TouchableOpacity style={styles.btnPrimary} onPress={() => setShowIntro(false)}>
        <Text style={styles.btnPrimaryText}>Begin Fragment Puzzle</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFragment = () => {
    const progress = (currentFragmentIndex + 1) / fragments.questions.length;
    return (
      <View style={styles.section}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Fragment {currentFragmentIndex + 1} of {fragments.questions.length}
          </Text>
          <View style={styles.tokenBadge}>
            <Image source={Images.token} style={styles.tokenBadgeIcon} resizeMode="contain" />
            <Text style={styles.tokenBadgeText}>{gameState.tokens}</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <View style={styles.lettersBox}>
          <Text style={styles.lettersLabel}>Letters collected:</Text>
          <Text style={styles.lettersDisplay}>
            {collectedLetters.length > 0 ? collectedLetters.join('  ') : '—'}
          </Text>
        </View>

        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{currentFragment.question}</Text>
          <Text style={styles.hintText}>Hint: {currentFragment.answerSource}</Text>
          <SpeakButton
            text={currentFragment.question}
            speak={speak}
            stop={stop}
            isSpeaking={isSpeaking}
          />
        </View>

        <Text style={styles.inputLabel}>Enter a single letter:</Text>
        <TextInput
          style={[styles.input, styles.letterInput]}
          value={answer}
          onChangeText={(t) => setAnswer(t.toUpperCase())}
          placeholder="?"
          placeholderTextColor={C.textMuted}
          maxLength={1}
        />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleFragmentSubmit}>
          <Text style={styles.btnPrimaryText}>Submit Letter</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCombining = () => (
    <View style={styles.section}>
      <View style={styles.keeperRow}>
        <Image source={Images.theKeeper} style={styles.keeperAvatar} resizeMode="cover" />
        <Text style={styles.keeperLabel}>The Keeper</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>{fragments.keeperCombining}</Text>
      </View>

      <View style={styles.allLettersBox}>
        <Text style={styles.lettersLabel}>All Letters:</Text>
        <Text style={styles.allLetters}>{collectedLetters.join(' ')} + G</Text>
      </View>

      <Text style={styles.inputLabel}>Rearrange to spell the location (two words):</Text>
      <TextInput
        style={styles.input}
        value={finalAnswer}
        onChangeText={setFinalAnswer}
        placeholder="Your answer..."
        placeholderTextColor={C.textMuted}
      />

      <TouchableOpacity style={styles.btnPrimary} onPress={handleFinalSubmit}>
        <Text style={styles.btnPrimaryText}>Submit Final Answer</Text>
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
          <Text style={styles.challengeTitle}>Fragment Puzzle</Text>

          {showIntro && renderIntro()}
          {!showIntro && !showCombining && renderFragment()}
          {showCombining && renderCombining()}
        </View>
      </KeyboardAvoidingScroll>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bgDeep },
  overlay: { backgroundColor: 'rgba(6,13,26,0.88)' },
  scrollContent: { flexGrow: 1, paddingBottom: 48 },
  content: { padding: 20 },

  challengeTitle: {
    fontSize: 14,
    color: C.cyan,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 2,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: { marginBottom: 20 },

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

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    color: C.textSecondary,
    fontSize: 13,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.goldDim,
  },
  tokenBadgeIcon: { width: 16, height: 16, marginRight: 5 },
  tokenBadgeText: { color: C.gold, fontSize: 13, fontWeight: 'bold' },

  progressTrack: {
    height: 6,
    backgroundColor: C.bgSurface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.borderSub,
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.cyan,
    shadowColor: C.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },

  lettersBox: {
    backgroundColor: C.bgCard,
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.cyanDim,
    ...CyanGlow,
    shadowOpacity: 0.25,
  },
  lettersLabel: {
    color: C.textSecondary,
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lettersDisplay: {
    color: C.cyan,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 6,
    textShadowColor: C.cyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  questionBox: {
    backgroundColor: C.bgCard,
    padding: 18,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: C.cyan,
    ...CyanGlow,
  },
  questionText: {
    color: C.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  hintText: {
    color: C.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
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
    shadowOpacity: 0.2,
  },
  letterInput: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 4,
    color: C.cyan,
  },

  allLettersBox: {
    backgroundColor: C.bgDeep,
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.gold,
    ...GoldGlow,
  },
  allLetters: {
    color: C.gold,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 8,
    textShadowColor: C.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  btnPrimary: {
    backgroundColor: C.bgCard,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.gold,
    alignItems: 'center',
    marginBottom: 16,
    ...GoldGlow,
  },
  btnPrimaryText: {
    color: C.gold,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default FragmentPuzzleScreen;
