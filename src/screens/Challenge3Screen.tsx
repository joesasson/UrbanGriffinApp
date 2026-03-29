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
import * as Location from 'expo-location';
import { useSpeech } from '../hooks/useSpeech';
import SpeakButton from '../components/SpeakButton';

const Challenge3Screen = ({ navigation, route }: any) => {
  const { landmarkId } = route.params;
  const { spendTokens, completeChallenge, gameState } = useGame();
  const { speak, stop, isSpeaking } = useSpeech();

  const landmark = landmarksData.landmarks.find(l => l.landmarkId === landmarkId);
  const challenge = landmark?.challenge3;

  const [showIntro, setShowIntro] = useState(true);
  const [answer, setAnswer] = useState('');
  const [isAtLocation, setIsAtLocation] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  useEffect(() => {
    checkLocationPermission();
    if (challenge) {
      speak(`${challenge.keeperOpening} ${challenge.keeperClueDelivery}`);
    }
  }, [challenge, speak]);

  const checkLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync();
  };

  const checkIfAtLocation = async () => {
    if (!landmark) return;
    setCheckingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for this challenge.');
        setCheckingLocation(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      const distance = calculateDistance(
        latitude, longitude,
        landmark.location.coordinates.lat,
        landmark.location.coordinates.lng
      );
      if (distance < 0.1) {
        setIsAtLocation(true);
        Alert.alert('Location Verified', 'You are at the landmark. Now find what the Keeper described!');
      } else {
        Alert.alert('Not There Yet', `You are ${distance.toFixed(2)} km away from ${landmark.name}. Keep traveling!`);
      }
      setCheckingLocation(false);
    } catch {
      Alert.alert('Location Error', "Could not get your location. For testing, we'll assume you're at the landmark.");
      setIsAtLocation(true);
      setCheckingLocation(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const toRad = (v: number) => (v * Math.PI) / 180;

  const handleHint = () => {
    if (!challenge) return;
    if (hintLevel >= challenge.hints.length) {
      Alert.alert('No More Hints', "You've used all available hints!");
      return;
    }
    const hint = challenge.hints[hintLevel];
    if (spendTokens(hint.cost)) {
      Alert.alert(`Hint ${hintLevel + 1}`, hint.text);
      setHintLevel(hintLevel + 1);
    } else {
      Alert.alert('Not Enough Tokens', `You need ${hint.cost} tokens for this hint.`);
    }
  };

  const handleSubmit = () => {
    if (!challenge) return;
    const norm = answer.toLowerCase().trim();
    const isCorrect = challenge.expectedAnswers.some((e: string) => norm.includes(e.toLowerCase()));
    if (isCorrect) {
      Alert.alert('Excellent!', challenge.keeperCorrect, [
        {
          text: 'Continue',
          onPress: () => {
            Alert.alert('Challenge Complete!', challenge.keeperCompletion, [
              {
                text: 'Solve Fragment Puzzle',
                onPress: () => { completeChallenge(landmarkId, 3); navigation.navigate('FragmentPuzzle', { landmarkId }); },
              },
            ]);
          },
        },
      ]);
    } else {
      Alert.alert('Not Quite', challenge.keeperIncorrect);
    }
  };

  if (!challenge || !landmark) return null;

  const renderIntro = () => (
    <View style={styles.section}>
      <View style={styles.keeperRow}>
        <Image source={Images.theKeeper} style={styles.keeperAvatar} resizeMode="cover" />
        <Text style={styles.keeperLabel}>The Keeper</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>{challenge.keeperOpening}</Text>
        <Text style={[styles.text, styles.mt]}>{challenge.keeperClueDelivery}</Text>
        <SpeakButton
          text={`${challenge.keeperOpening} ${challenge.keeperClueDelivery}`}
          speak={speak}
          stop={stop}
          isSpeaking={isSpeaking}
        />
      </View>
      <TouchableOpacity style={styles.btnPrimary} onPress={() => setShowIntro(false)}>
        <Text style={styles.btnPrimaryText}>I'm Ready</Text>
      </TouchableOpacity>
    </View>
  );

  const renderChallenge = () => (
    <View style={styles.section}>
      {!isAtLocation && (
        <View style={styles.locationBox}>
          <Text style={styles.locationTitle}>📍 Head to {landmark.name}</Text>
          <Text style={styles.locationSubtext}>Verify your location to begin the search</Text>
          <TouchableOpacity
            style={[styles.btnPrimary, styles.verifyButton, checkingLocation && styles.btnDisabled]}
            onPress={checkIfAtLocation}
            disabled={checkingLocation}
          >
            <Text style={styles.btnPrimaryText}>
              {checkingLocation ? 'Checking...' : 'Verify Location'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSkip}
            onPress={() => setIsAtLocation(true)}
          >
            <Text style={styles.btnSkipText}>Skip (for testing)</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAtLocation && (
        <>
          <View style={styles.clueBox}>
            <Text style={styles.cluePreamble}>Your clue:</Text>
            <Text style={styles.clueText}>{challenge.clue}</Text>
            <SpeakButton
              text={challenge.clue}
              speak={speak}
              stop={stop}
              isSpeaking={isSpeaking}
            />
          </View>

          <View style={styles.textBox}>
            <Text style={styles.text}>{challenge.keeperInstructions}</Text>
          </View>

          <Text style={styles.inputLabel}>{challenge.keeperProofPrompt}</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Describe what you see..."
            placeholderTextColor={C.textMuted}
            multiline
          />

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btnSecondary, styles.hintButton]}
              onPress={handleHint}
            >
              <Text style={styles.btnSecondaryText}>
                Hint {hintLevel + 1} ({hintLevel < challenge.hints.length ? challenge.hints[hintLevel].cost : '?'} 🪙)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnPrimary, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.btnPrimaryText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tokenBadge}>
            <Image source={Images.token} style={styles.tokenBadgeIcon} resizeMode="contain" />
            <Text style={styles.tokenBadgeText}>{gameState.tokens} tokens</Text>
          </View>
        </>
      )}
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.landmarkName}>{landmark.name}</Text>
          <Text style={styles.challengeTitle}>Challenge 3: On-Location Search</Text>
          {showIntro ? renderIntro() : renderChallenge()}
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

  locationBox: {
    backgroundColor: C.bgCard,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: C.cyan,
    ...CyanGlow,
    alignItems: 'center',
  },
  locationTitle: {
    color: C.textPrimary,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  locationSubtext: {
    color: C.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },

  clueBox: {
    backgroundColor: C.bgCard,
    padding: 20,
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: C.cyan,
    ...CyanGlow,
  },
  cluePreamble: {
    color: C.cyan,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  clueText: {
    color: C.textPrimary,
    fontSize: 16,
    lineHeight: 26,
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
  inputMulti: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  btnRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  verifyButton: {
    marginBottom: 10,
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
  btnDisabled: { opacity: 0.5 },
  btnSkip: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(60,40,20,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(140,100,60,0.4)',
    alignItems: 'center',
    width: '100%',
  },
  btnSkipText: {
    color: 'rgba(200,160,80,0.7)',
    fontSize: 13,
  },

  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bgCard,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.goldDim,
  },
  tokenBadgeIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  tokenBadgeText: {
    color: C.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Challenge3Screen;
