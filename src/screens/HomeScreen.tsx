import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../utils/images';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useGame } from '../context/GameContext';
import landmarksData from '../data/landmarks.json';
import { getMaxUnlockedLandmarkId, HUNT_LANDMARK_TOTAL } from '../utils/huntProgress';
import { useSpeech } from '../hooks/useSpeech';
import SpeakButton from '../components/SpeakButton';
import { playTap } from '../utils/soundEffects';

// ─── MenuCard ────────────────────────────────────────────────────────────────

interface MenuCardProps {
  icon: string;
  label: string;
  isSelected: boolean;
  isReset?: boolean;
  onPress: () => void;
  animIndex: number;
}

const MenuCard = ({ icon, label, isSelected, isReset, onPress, animIndex }: MenuCardProps) => {
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(animIndex * 70, withTiming(0, { duration: 300 }));
    opacity.value = withDelay(animIndex * 70, withTiming(1, { duration: 300 }));
  }, [animIndex, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animStyle, styles.cardWrapper]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          isReset && !isSelected && styles.cardReset,
        ]}
      >
        <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <Text style={[styles.label, isSelected && styles.labelSelected, isReset && !isSelected && styles.labelReset]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── StatBadge ───────────────────────────────────────────────────────────────

const StatBadge = ({ label }: { label: string }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

// ─── HomeScreen ──────────────────────────────────────────────────────────────

const HomeScreen = ({ navigation }: any) => {
  const { gameState, resetGame } = useGame();
  const { speak, stop, isSpeaking } = useSpeech();
  const keys = gameState.keysCollected;
  const hasProgress = keys.length > 0;
  const primaryLabel = hasProgress ? 'Continue Hunt' : 'Begin the Hunt';
  const [selected, setSelected] = useState(primaryLabel);

  const maxUnlocked = getMaxUnlockedLandmarkId(keys);
  const hasRowForNext = landmarksData.landmarks.some(l => l.landmarkId === maxUnlocked);
  const clearedEveryShipped =
    landmarksData.landmarks.length > 0 && landmarksData.landmarks.every(l => keys.includes(l.landmarkId));

  let nextStopTitle = 'Next stop';
  let nextStopBody = '';
  if (keys.length >= HUNT_LANDMARK_TOTAL) {
    nextStopTitle = 'Hunt complete';
    nextStopBody = 'You found all twenty keys. The Griffin tips its wing to you.';
  } else if (clearedEveryShipped && !hasRowForNext) {
    nextStopTitle = 'More trails soon';
    nextStopBody = `You've finished every hunt in this version. Location #${maxUnlocked} will appear on the map when the next chapter is ready.`;
  } else if (maxUnlocked === 1 && keys.length === 0) {
    nextStopBody = 'Location #1 is unlocked. Open the map to begin your first hunt.';
  } else {
    nextStopBody = `Location #${maxUnlocked} is unlocked. Open the map to start this hunt.`;
  }

  const menuItems = [
    {
      icon: '🗺',
      label: primaryLabel,
      onPress: () => navigation.navigate(hasProgress ? 'LandmarkMap' : 'Introduction'),
    },
    {
      icon: '🗝',
      label: 'View Keys',
      onPress: () => navigation.navigate('KeyCollection'),
    },
    {
      icon: '📍',
      label: 'NYC Map',
      onPress: () => navigation.navigate('MapView'),
    },
    {
      icon: '🪙',
      label: 'Token Shop',
      onPress: () => navigation.navigate('TokenShop'),
    },
    ...(hasProgress
      ? [
          {
            icon: '↺',
            label: 'New Hunt',
            isReset: true,
            onPress: () => {
              Alert.alert(
                'Start New Hunt',
                'Are you sure you want to start a new hunt? This will reset all progress.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Yes, Reset', style: 'destructive', onPress: resetGame },
                ]
              );
            },
          },
        ]
      : []),
  ];

  return (
    <ImageBackground
      source={require('../../assets/The Sky Snatchers.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>

        {/* Title — centered top */}
        <View style={styles.titleContainer}>
          <Image source={Images.gameLogo} style={styles.logoImage} resizeMode="contain" />
          <View style={styles.titleDivider} />
        </View>

        {/* Stats badges — top right */}
        <View style={styles.statsBadgeContainer}>
          <StatBadge label={`🪙 ${gameState.tokens}`} />
          <StatBadge label={`🗝 ${gameState.keysCollected.length}/20`} />
        </View>

        <TouchableOpacity
          style={styles.nextStopCard}
          activeOpacity={0.85}
          onPress={() => {
            playTap();
            navigation.navigate('LandmarkMap');
          }}
        >
          <Text style={styles.nextStopTitle}>{nextStopTitle}</Text>
          <Text style={styles.nextStopBody}>{nextStopBody}</Text>
          <Text style={styles.nextStopCta}>Open map →</Text>
        </TouchableOpacity>

        {/* Menu cards — bottom row */}
        <View style={styles.menuRow}>
          {menuItems.map((item, index) => (
            <MenuCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              isSelected={selected === item.label}
              isReset={item.isReset}
              animIndex={index}
              onPress={() => {
                playTap();
                setSelected(item.label);
                item.onPress();
              }}
            />
          ))}
        </View>

        {/* Keeper nameplate — bottom left */}
        <View style={styles.namePlate}>
          <Text style={styles.namePlateText}>"Stay curious." — The Keeper</Text>
          <SpeakButton
            text="Stay curious. — The Keeper"
            speak={speak}
            stop={stop}
            isSpeaking={isSpeaking}
            style={styles.namePlateSpeak}
          />
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },

  // Title
  titleContainer: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoImage: {
    width: 260,
    height: 110,
  },
  titleDivider: {
    marginTop: 10,
    width: 120,
    height: 2,
    backgroundColor: 'rgba(212,175,55,0.5)',
    borderRadius: 1,
  },

  // Stats badges
  statsBadgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: 'rgba(6,13,26,0.82)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(212,168,39,0.6)',
    shadowColor: '#d4a827',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  badgeText: {
    color: '#d4a827',
    fontSize: 13,
    fontWeight: 'bold',
  },

  nextStopCard: {
    position: 'absolute',
    bottom: 252,
    left: 14,
    right: 14,
    backgroundColor: 'rgba(9,22,36,0.92)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(0,196,228,0.55)',
    shadowColor: '#00c4e4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  nextStopTitle: {
    color: '#00c4e4',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  nextStopBody: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  nextStopCta: {
    color: '#d4a827',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Menu row
  menuRow: {
    position: 'absolute',
    bottom: 90,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardWrapper: {
    flexBasis: '30%',
    flexGrow: 0,
    flexShrink: 1,
  },

  // Menu card
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(9,22,36,0.88)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(212,168,39,0.5)',
    shadowColor: '#d4a827',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  cardSelected: {
    backgroundColor: 'rgba(0,50,70,0.92)',
    borderColor: '#00c4e4',
    shadowColor: '#00c4e4',
    shadowOpacity: 0.7,
  },
  cardReset: {
    backgroundColor: 'rgba(40,10,10,0.85)',
    borderColor: 'rgba(180,60,60,0.5)',
    shadowColor: '#8b2020',
    shadowOpacity: 0.4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconCircleSelected: {
    backgroundColor: 'rgba(0,196,228,0.15)',
  },
  iconText: {
    fontSize: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d4a827',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#00c4e4',
  },
  labelReset: {
    color: '#c04040',
  },

  // Nameplate
  namePlate: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
    maxWidth: '55%',
  },
  namePlateText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  namePlateSpeak: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
});

export default HomeScreen;
