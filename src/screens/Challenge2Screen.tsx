import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
import { playTap } from '../utils/soundEffects';

const Challenge2Screen = ({ navigation, route }: any) => {
  const { landmarkId } = route.params;
  const { addTokens, spendTokens, completeChallenge, gameState } = useGame();
  const { speak, stop, isSpeaking } = useSpeech();

  const landmark = landmarksData.landmarks.find(l => l.landmarkId === landmarkId);
  const challenge = landmark?.challenge2;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<number[]>([]);

  useEffect(() => {
    if (!challenge) return;
    if (showIntro) {
      speak(`${landmark?.challenge1?.keeperCorrect} ${challenge.keeperOpening}`);
    }
  }, [challenge, showIntro, speak]);

  useEffect(() => {
    if (!challenge || showIntro) return;
    speak(challenge.questions[currentQuestionIndex].question);
  }, [challenge, currentQuestionIndex, showIntro, speak]);

  if (!challenge) return null;

  const currentQuestion = challenge.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === challenge.questions.length - 1;

  const handleSubmit = () => {
    const norm = answer.toLowerCase().trim();
    let isCorrect = false;
    if (currentQuestion.acceptableAnswers) {
      isCorrect = currentQuestion.acceptableAnswers.some((a: string) =>
        norm.includes(a.toLowerCase())
      );
    } else if (currentQuestion.answer) {
      isCorrect = norm === currentQuestion.answer.toLowerCase();
    } else {
      isCorrect = norm.length > 5;
    }

    if (isCorrect) {
      Alert.alert('Correct!', currentQuestion.keeperCorrect, [
        {
          text: 'Continue',
          onPress: () => {
            if (!answeredCorrectly.includes(currentQuestion.id)) {
              addTokens(currentQuestion.tokenReward);
              setAnsweredCorrectly([...answeredCorrectly, currentQuestion.id]);
            }
            if (isLastQuestion) {
              Alert.alert('Well Done!', challenge.keeperCompletion, [
                {
                  text: 'Continue',
                  onPress: () => { completeChallenge(landmarkId, 2); navigation.navigate('Challenge3', { landmarkId }); },
                },
              ]);
            } else {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
              setAnswer('');
            }
          },
        },
      ]);
    } else {
      Alert.alert('Not Quite', currentQuestion.keeperIncorrect || 'Try again.');
    }
  };

  const handleHint = () => {
    if (spendTokens(1)) {
      Alert.alert('Hint', currentQuestion.keeperHint);
    } else {
      Alert.alert('Not Enough Tokens', 'You need 1 token to get a hint.');
    }
  };

  const renderIntro = () => (
    <View style={styles.section}>
      {Images.landmarkThumbnails[landmarkId] && (
        <Image
          source={Images.landmarkThumbnails[landmarkId]}
          style={styles.landmarkHero}
          resizeMode="cover"
        />
      )}
      <Text style={styles.congratsTitle}>You found it!</Text>
      <Text style={styles.landmarkName}>{landmark?.name}</Text>

      <View style={styles.letterReminder}>
        <Text style={styles.letterReminderText}>
          Remember to write down your letter fragment and keep it somewhere safe — you'll need it for the final puzzle.
        </Text>
      </View>

      <View style={styles.keeperRow}>
        <Image source={Images.theKeeper} style={styles.keeperAvatar} resizeMode="cover" />
        <Text style={styles.keeperLabel}>The Keeper</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>{landmark?.challenge1?.keeperCorrect}</Text>
        <Text style={[styles.text, styles.mt]}>{challenge.keeperOpening}</Text>
        <SpeakButton
          text={`${landmark?.challenge1?.keeperCorrect} ${challenge.keeperOpening}`}
          speak={speak}
          stop={stop}
          isSpeaking={isSpeaking}
        />
      </View>
      <TouchableOpacity style={styles.btnPrimary} onPress={() => { playTap(); setShowIntro(false); }}>
        <Text style={styles.btnPrimaryText}>Start Trivia</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = () => {
    const progress = (currentQuestionIndex + 1) / challenge.questions.length;
    return (
      <View style={styles.section}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {challenge.questions.length}
          </Text>
          <View style={styles.tokenBadge}>
            <Image source={Images.token} style={styles.tokenBadgeIcon} resizeMode="contain" />
            <Text style={styles.tokenBadgeText}>{gameState.tokens}</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <View style={styles.questionBox}>
          <Text style={styles.questionType}>{currentQuestion.type.toUpperCase()}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          <SpeakButton
            text={currentQuestion.question}
            speak={speak}
            stop={stop}
            isSpeaking={isSpeaking}
          />
        </View>

        <TextInput
          style={[styles.input, currentQuestion.type === 'thinking' && styles.inputMulti]}
          value={answer}
          onChangeText={setAnswer}
          placeholder="Your answer..."
          placeholderTextColor={C.textMuted}
          multiline={currentQuestion.type === 'thinking'}
        />

        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btnSecondary, styles.hintButton]} onPress={() => { playTap(); handleHint(); }}>
            <Text style={styles.btnSecondaryText}>Hint (1 🪙)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnPrimary, styles.submitButton]} onPress={() => { playTap(); handleSubmit(); }}>
            <Text style={styles.btnPrimaryText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={Images.fragmentBackground}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.landmarkName}>{landmark?.name}</Text>
          <Text style={styles.challengeTitle}>Challenge 2: Trivia & Research</Text>
          {showIntro ? renderIntro() : renderQuestion()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bgDeep },
  overlay: { backgroundColor: 'rgba(6,13,26,0.91)' },
  scrollContent: { flexGrow: 1 },
  content: { padding: 20 },

  landmarkHero: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.cyanDim,
  },
  congratsTitle: {
    fontSize: 28,
    color: C.cyan,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: C.cyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  letterReminder: {
    backgroundColor: 'rgba(212,168,39,0.1)',
    borderWidth: 1,
    borderColor: C.goldDim,
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
  },
  letterReminderText: {
    color: C.gold,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  landmarkName: {
    fontSize: 22,
    color: C.gold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: C.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  challengeTitle: {
    fontSize: 14,
    color: C.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
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
  mt: { marginTop: 14 },

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
  tokenBadgeIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  tokenBadgeText: {
    color: C.gold,
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 6,
    backgroundColor: C.bgSurface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
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

  questionBox: {
    backgroundColor: C.bgCard,
    padding: 18,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: C.cyan,
    ...CyanGlow,
    shadowOpacity: 0.35,
  },
  questionType: {
    color: C.cyan,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  questionText: {
    color: C.textPrimary,
    fontSize: 16,
    lineHeight: 24,
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
  inputMulti: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  btnRow: {
    flexDirection: 'row',
  },
  hintButton: {
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
  },
  btnPrimary: {
    backgroundColor: C.bgCard,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.gold,
    alignItems: 'center',
    ...GoldGlow,
  },
  btnPrimaryText: {
    color: C.gold,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  btnSecondary: {
    backgroundColor: C.bgCard,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.cyan,
    alignItems: 'center',
    ...CyanGlow,
    shadowOpacity: 0.35,
  },
  btnSecondaryText: {
    color: C.cyan,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Challenge2Screen;
