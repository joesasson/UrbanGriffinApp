import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../context/GameContext';
import tokenPrizesData from '../data/tokenPrizes.json';
import { Images } from '../utils/images';
import { C, GoldGlow, CyanGlow } from '../theme';
import { useSpeech } from '../hooks/useSpeech';
import SpeakButton from '../components/SpeakButton';

const TokenShopScreen = () => {
  const { gameState, spendTokens } = useGame();
  const { speak, stop, isSpeaking } = useSpeech();
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handlePurchase = (item: any) => {
    Alert.alert(
      'Redeem Prize',
      `Redeem ${item.name} for ${item.tokens} tokens?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: () => {
            if (spendTokens(item.tokens)) {
              Alert.alert('Prize Redeemed!', `You've redeemed: ${item.name}\n\nShow this to claim your prize!`);
            } else {
              Alert.alert('Not Enough Tokens', `You need ${item.tokens} tokens but only have ${gameState.tokens}.`);
            }
          },
        },
      ]
    );
  };

  const categories = tokenPrizesData.categories;
  const currentCategory = categories[selectedCategory];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={Images.fragmentBackground}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <View style={styles.header}>
        <Text style={styles.title}>Token Shop</Text>
        <View style={styles.tokenDisplay}>
          <Image source={Images.token} style={styles.tokenIcon} resizeMode="contain" />
          <View>
            <Text style={styles.tokenCount}>{gameState.tokens} Tokens</Text>
            <Text style={styles.tokenValue}>
              ${(gameState.tokens * tokenPrizesData.tokenValue).toFixed(2)} value
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.categoryTabs}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryTab, selectedCategory === index && styles.categoryTabActive]}
            onPress={() => setSelectedCategory(index)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.categoryTabText, selectedCategory === index && styles.categoryTabTextActive]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {currentCategory.items.map((item, index) => {
            const canAfford = gameState.tokens >= item.tokens;
            return (
              <View
                key={index}
                style={[styles.prizeBox, !canAfford && styles.prizeBoxDim]}
              >
                <View style={styles.prizeInfo}>
                  <Text style={[styles.prizeName, !canAfford && styles.prizeNameDim]}>{item.name}</Text>
                  <Text style={styles.prizeValue}>${item.value.toFixed(2)} value</Text>
                  <SpeakButton
                    text={`${item.name}, ${item.tokens} tokens`}
                    speak={speak}
                    stop={stop}
                    isSpeaking={isSpeaking}
                    style={styles.speakButton}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.redeemBtn, !canAfford && styles.redeemBtnDim]}
                  onPress={() => handlePurchase(item)}
                  disabled={!canAfford}
                  activeOpacity={0.8}
                >
                  <Image source={Images.token} style={styles.redeemIcon} resizeMode="contain" />
                  <Text style={[styles.redeemTokens, !canAfford && styles.redeemDimText]}>{item.tokens}</Text>
                  <Text style={[styles.redeemLabel, !canAfford && styles.redeemDimText]}>Redeem</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bgDeep },
  overlay: { backgroundColor: 'rgba(6,13,26,0.9)' },
  speakButton: { marginTop: 6 },

  header: {
    padding: 18,
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
  tokenDisplay: {
    backgroundColor: C.bgCard,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.gold,
    ...GoldGlow,
  },
  tokenIcon: {
    width: 44,
    height: 44,
    marginRight: 14,
  },
  tokenCount: {
    color: C.gold,
    fontSize: 22,
    fontWeight: 'bold',
  },
  tokenValue: {
    color: C.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: C.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: C.borderSub,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: C.bgCard,
    borderWidth: 1,
    borderColor: C.borderSub,
  },
  categoryTabActive: {
    borderColor: C.cyan,
    ...CyanGlow,
    shadowOpacity: 0.5,
  },
  categoryTabText: {
    color: C.textSecondary,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryTabTextActive: {
    color: C.cyan,
  },

  scrollContent: { flexGrow: 1 },
  content: { padding: 16 },

  prizeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.bgCard,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: C.goldDim,
    ...GoldGlow,
    shadowOpacity: 0.25,
  },
  prizeBoxDim: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  prizeInfo: { flex: 1 },
  prizeName: {
    color: C.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  prizeNameDim: {
    color: C.textMuted,
  },
  prizeValue: {
    color: C.textSecondary,
    fontSize: 12,
  },

  redeemBtn: {
    backgroundColor: C.bgDeep,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 72,
    borderWidth: 1.5,
    borderColor: C.gold,
    ...GoldGlow,
    shadowOpacity: 0.5,
  },
  redeemBtnDim: {
    borderColor: C.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  redeemIcon: {
    width: 22,
    height: 22,
    marginBottom: 3,
  },
  redeemTokens: {
    color: C.gold,
    fontSize: 15,
    fontWeight: 'bold',
  },
  redeemLabel: {
    color: C.gold,
    fontSize: 11,
    marginTop: 1,
  },
  redeemDimText: {
    color: C.textMuted,
  },
});

export default TokenShopScreen;
