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

const KeyCollectionScreen = () => {
  const { gameState } = useGame();
  const { speak } = useSpeech();
  const allLandmarks = Array.from({ length: 20 }, (_, i) => i + 1);
  const collected = gameState.keysCollected.length;

  useEffect(() => {
    speak(`You have ${collected} of 20 keys.`);
  }, [collected, speak]);

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
          <Text style={styles.title}>Key Collection</Text>

          <View style={styles.countRow}>
            <Image source={Images.magicalKey} style={styles.countIcon} resizeMode="contain" />
            <Text style={styles.countText}>{collected} / 20 Keys Found</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(collected / 20) * 100}%` }]} />
          </View>

          <View style={styles.keysGrid}>
            {allLandmarks.map((landmarkId) => {
              const isCollected = gameState.keysCollected.includes(landmarkId);
              const landmark = landmarksData.landmarks.find(l => l.landmarkId === landmarkId);

              return (
                <View
                  key={landmarkId}
                  style={[
                    styles.keyBox,
                    isCollected ? styles.keyBoxCollected : styles.keyBoxLocked,
                  ]}
                >
                  <Text style={styles.keyNumber}>#{landmarkId}</Text>
                  {isCollected ? (
                    <>
                      <Image source={Images.magicalKey} style={styles.keyImage} resizeMode="contain" />
                      {landmark && <Text style={styles.keyName}>{landmark.name}</Text>}
                    </>
                  ) : (
                    <>
                      <Text style={styles.keyIconLocked}>🔒</Text>
                      <Text style={styles.keyLocked}>Locked</Text>
                    </>
                  )}
                </View>
              );
            })}
          </View>

          {collected === 20 && (
            <View style={styles.completionBox}>
              <Text style={styles.completionTitle}>✦ All Keys Collected ✦</Text>
              <Text style={styles.completionText}>
                "Incredible work, Hunters. You've found all 20 Keys. Now the final puzzle awaits."
              </Text>
              <TouchableOpacity style={styles.finalButton}>
                <Text style={styles.finalButtonText}>Begin Final Puzzle</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bgDeep },
  overlay: { backgroundColor: 'rgba(6,13,26,0.9)' },
  scrollContent: { flexGrow: 1 },
  content: { padding: 20 },

  title: {
    fontSize: 26,
    color: C.gold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 1,
    textShadowColor: C.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  countIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  countText: {
    fontSize: 18,
    color: C.textSecondary,
    fontWeight: '600',
  },

  progressTrack: {
    height: 8,
    backgroundColor: C.bgSurface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: C.borderSub,
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.cyan,
    shadowColor: C.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },

  keysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  keyBox: {
    width: '48%',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  keyBoxCollected: {
    backgroundColor: C.bgCard,
    borderColor: C.gold,
    ...GoldGlow,
    shadowOpacity: 0.5,
  },
  keyBoxLocked: {
    backgroundColor: C.bgSurface,
    borderColor: C.borderSub,
  },
  keyNumber: {
    color: C.textMuted,
    fontSize: 11,
    marginBottom: 6,
  },
  keyImage: {
    width: 44,
    height: 44,
    marginBottom: 6,
  },
  keyIconLocked: {
    fontSize: 28,
    marginBottom: 6,
    opacity: 0.2,
  },
  keyName: {
    color: C.textPrimary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  keyLocked: {
    color: C.textMuted,
    fontSize: 11,
  },

  completionBox: {
    backgroundColor: C.bgCard,
    padding: 22,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: C.gold,
    ...GoldGlow,
    shadowOpacity: 0.7,
  },
  completionTitle: {
    fontSize: 20,
    color: C.gold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  completionText: {
    color: C.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  finalButton: {
    backgroundColor: C.bgDeep,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.cyan,
    alignItems: 'center',
    ...CyanGlow,
  },
  finalButtonText: {
    color: C.cyan,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default KeyCollectionScreen;
