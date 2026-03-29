import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import landmarksData from '../data/landmarks.json';
import { Images } from '../utils/images';
import { C, GoldGlow, CyanGlow } from '../theme';
import { useSpeech } from '../hooks/useSpeech';

const LandmarkMapScreen = ({ navigation }: any) => {
  const { gameState, setCurrentLandmark } = useGame();
  const { speak } = useSpeech();

  useEffect(() => {
    speak("Choose your next destination, Hunters. The Griffin's Keys are waiting.");
  }, [speak]);

  const handleLandmarkPress = (landmarkId: number) => {
    const isCompleted = gameState.keysCollected.includes(landmarkId);
    if (isCompleted) return;
    setCurrentLandmark(landmarkId);
    navigation.navigate('Challenge1', { landmarkId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={Images.fragmentBackground}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <View style={styles.header}>
        <Text style={styles.title}>Landmark Map</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Image source={Images.token} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statNumber}>{gameState.tokens}</Text>
            <Text style={styles.statLabel}>Tokens</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxCyan]}>
            <Image source={Images.magicalKey} style={styles.statIcon} resizeMode="contain" />
            <Text style={[styles.statNumber, styles.statNumberCyan]}>
              {gameState.keysCollected.length}/20
            </Text>
            <Text style={styles.statLabel}>Keys</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.keeperText}>
            "Choose your next destination, Hunters. The Griffin's Keys are waiting."
          </Text>

          <View style={styles.landmarksList}>
            {landmarksData.landmarks.map((landmark) => {
              const isCompleted = gameState.keysCollected.includes(landmark.landmarkId);
              const isCurrentLandmark = gameState.currentLandmarkId === landmark.landmarkId;

              return (
                <TouchableOpacity
                  key={landmark.landmarkId}
                  style={[
                    styles.landmarkBox,
                    isCompleted && styles.landmarkBoxCompleted,
                    isCurrentLandmark && !isCompleted && styles.landmarkBoxCurrent,
                  ]}
                  onPress={() => handleLandmarkPress(landmark.landmarkId)}
                  disabled={isCompleted}
                  activeOpacity={0.8}
                >
                  <View style={styles.landmarkHeader}>
                    <Text style={styles.landmarkNumber}>#{landmark.landmarkId}</Text>
                    {isCompleted && (
                      <Text style={styles.completedBadge}>✓ Completed</Text>
                    )}
                    {isCurrentLandmark && !isCompleted && (
                      <Text style={styles.currentBadge}>● Active</Text>
                    )}
                  </View>

                  {isCompleted && Images.landmarkThumbnails[landmark.landmarkId] && (
                    <Image
                      source={Images.landmarkThumbnails[landmark.landmarkId]}
                      style={styles.landmarkThumb}
                      resizeMode="cover"
                    />
                  )}

                  <Text
                    style={[
                      styles.landmarkName,
                      isCompleted && styles.landmarkNameCompleted,
                    ]}
                  >
                    {isCompleted ? landmark.name : '??? Mystery Location ???'}
                  </Text>

                  <Text style={styles.landmarkAddress}>
                    {isCompleted
                      ? landmark.location.address
                      : 'Solve the clue to reveal this location'}
                  </Text>

                  {!isCompleted && (
                    <View style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Start Hunt →</Text>
                    </View>
                  )}

                  {isCompleted && (
                    <View style={styles.keyBadge}>
                      <Image source={Images.magicalKey} style={styles.keyBadgeIcon} resizeMode="contain" />
                      <Text style={styles.keyText}>Key Obtained</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {landmarksData.landmarks.length < 20 && (
              <View style={styles.comingSoonBox}>
                <Text style={styles.comingSoonText}>🔒 More Landmarks Coming Soon</Text>
                <Text style={styles.comingSoonSubtext}>
                  {20 - landmarksData.landmarks.length} additional landmarks will be unlocked
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bgDeep,
  },
  overlay: {
    backgroundColor: 'rgba(6,13,26,0.9)',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.cyanDim,
  },
  title: {
    fontSize: 26,
    color: C.gold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 1,
    textShadowColor: C.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    backgroundColor: C.bgCard,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.gold,
    ...GoldGlow,
  },
  statBoxCyan: {
    borderColor: C.cyan,
    ...CyanGlow,
  },
  statIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 22,
    color: C.gold,
    fontWeight: 'bold',
  },
  statNumberCyan: {
    color: C.cyan,
  },
  statLabel: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  keeperText: {
    color: C.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 22,
  },
  landmarksList: {
    marginBottom: 20,
  },
  landmarkBox: {
    backgroundColor: C.bgCard,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: C.gold,
    ...GoldGlow,
  },
  landmarkBoxCompleted: {
    borderColor: C.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  landmarkBoxCurrent: {
    borderColor: C.cyan,
    borderWidth: 2,
    ...CyanGlow,
  },
  landmarkThumb: {
    width: '100%',
    height: 110,
    borderRadius: 6,
    marginBottom: 10,
    opacity: 0.6,
  },
  landmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  landmarkNumber: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedBadge: {
    color: C.green,
    fontSize: 12,
    fontWeight: 'bold',
  },
  currentBadge: {
    color: C.cyan,
    fontSize: 12,
    fontWeight: 'bold',
  },
  landmarkName: {
    color: C.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  landmarkNameCompleted: {
    color: C.textMuted,
  },
  landmarkAddress: {
    color: C.textSecondary,
    fontSize: 13,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: C.bgDeep,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.cyan,
    ...CyanGlow,
  },
  actionButtonText: {
    color: C.cyan,
    fontSize: 14,
    fontWeight: 'bold',
  },
  keyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bgDeep,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.green,
  },
  keyBadgeIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  keyText: {
    color: C.green,
    fontSize: 13,
    fontWeight: 'bold',
  },
  comingSoonBox: {
    backgroundColor: C.bgSurface,
    padding: 22,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderSub,
    borderStyle: 'dashed',
  },
  comingSoonText: {
    color: C.textSecondary,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  comingSoonSubtext: {
    color: C.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LandmarkMapScreen;
