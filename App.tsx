/**
 * The Hunt of the Urban Griffin
 * Mobile App for Android
 */

import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, CinzelDecorative_400Regular, CinzelDecorative_700Bold } from '@expo-google-fonts/cinzel-decorative';
import { GameProvider } from './src/context/GameContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useBackgroundMusic } from './src/hooks/useBackgroundMusic';
import 'react-native-gesture-handler';

function App() {
  useBackgroundMusic();

  const [fontsLoaded] = useFonts({
    CinzelDecorative_400Regular,
    CinzelDecorative_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={styles.loading} />;
  }

  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0f2537" />
        <AppNavigator />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0f2537',
  },
});

export default App;
