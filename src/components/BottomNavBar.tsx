import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import { Images } from '../utils/images';
import { C } from '../theme';

const HIDDEN_ON = ['Home', 'Introduction'];

interface BottomNavBarProps {
  activeRoute: string;
}

const BottomNavBar = ({ activeRoute }: BottomNavBarProps) => {
  const navigation = useNavigation<any>();
  const { gameState } = useGame();

  if (HIDDEN_ON.includes(activeRoute)) return null;

  const tabs = [
    { key: 'Home',         label: 'Home',    icon: '🏠',   route: 'Home' },
    { key: 'LandmarkMap',  label: 'Map',     icon: null,   route: 'LandmarkMap' },
    { key: 'TokenShop',    label: 'Shop',    icon: null,   route: 'TokenShop' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeRoute === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.route)}
            activeOpacity={0.7}
          >
            {tab.key === 'LandmarkMap' ? (
              <Image source={Images.mapMarker} style={styles.tabImage} resizeMode="contain" />
            ) : tab.key === 'TokenShop' ? (
              <View style={styles.tokenTabIcon}>
                <Image source={Images.token} style={styles.tabImage} resizeMode="contain" />
                <View style={styles.tokenCountBadge}>
                  <Text style={styles.tokenCountText}>{gameState.tokens}</Text>
                </View>
              </View>
            ) : (
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>{tab.icon}</Text>
            )}
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeBar} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: C.bgSurface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,168,39,0.35)',
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: '#d4a827',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 3,
  },
  tabIconActive: {
    // emoji glow achieved via label color change
  },
  tabImage: {
    width: 26,
    height: 26,
    marginBottom: 3,
  },
  tokenTabIcon: {
    position: 'relative',
    marginBottom: 3,
  },
  tokenCountBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: C.bgDeep,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: C.goldDim,
    minWidth: 18,
    alignItems: 'center',
  },
  tokenCountText: {
    color: C.gold,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tabLabel: {
    color: C.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: C.gold,
    textShadowColor: C.goldGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  activeBar: {
    position: 'absolute',
    top: -10,
    width: 28,
    height: 2,
    backgroundColor: C.gold,
    borderRadius: 1,
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
});

export default BottomNavBar;
