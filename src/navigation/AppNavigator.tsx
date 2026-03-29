import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import IntroductionScreen from '../screens/IntroductionScreen';
import LandmarkMapScreen from '../screens/LandmarkMapScreen';
import MapViewScreen from '../screens/MapViewScreen';
import Challenge1Screen from '../screens/Challenge1Screen';
import Challenge2Screen from '../screens/Challenge2Screen';
import Challenge3Screen from '../screens/Challenge3Screen';
import FragmentPuzzleScreen from '../screens/FragmentPuzzleScreen';
import KeyCollectionScreen from '../screens/KeyCollectionScreen';
import TokenShopScreen from '../screens/TokenShopScreen';
import BottomNavBar from '../components/BottomNavBar';

const Stack = createStackNavigator();

const getActiveRouteName = (state: NavigationState | undefined): string => {
  if (!state) return 'Home';
  const route = state.routes[state.index];
  return route.name;
};

const AppNavigator = () => {
  const [activeRoute, setActiveRoute] = useState('Home');

  return (
    <NavigationContainer onStateChange={state => setActiveRoute(getActiveRouteName(state))}>
      <View style={styles.container}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#060d1a',
            shadowColor: '#00c4e4',
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 4,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,196,228,0.25)',
          },
          headerTintColor: '#d4a827',
          headerTitleStyle: {
            fontWeight: 'bold',
            letterSpacing: 0.5,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Introduction" 
          component={IntroductionScreen}
          options={{ title: 'The Hunt Begins' }}
        />
        <Stack.Screen 
          name="LandmarkMap" 
          component={LandmarkMapScreen}
          options={{ title: 'Landmark Map' }}
        />
        <Stack.Screen 
          name="MapView" 
          component={MapViewScreen}
          options={{ title: 'NYC Map' }}
        />
        <Stack.Screen 
          name="Challenge1" 
          component={Challenge1Screen}
          options={{ title: 'Find the Landmark' }}
        />
        <Stack.Screen 
          name="Challenge2" 
          component={Challenge2Screen}
          options={{ title: 'Trivia Challenge' }}
        />
        <Stack.Screen 
          name="Challenge3" 
          component={Challenge3Screen}
          options={{ title: 'On-Location Search' }}
        />
        <Stack.Screen 
          name="FragmentPuzzle" 
          component={FragmentPuzzleScreen}
          options={{ title: 'Fragment Puzzle' }}
        />
        <Stack.Screen 
          name="KeyCollection" 
          component={KeyCollectionScreen}
          options={{ title: 'Your Keys' }}
        />
        <Stack.Screen 
          name="TokenShop" 
          component={TokenShopScreen}
          options={{ title: 'Token Shop' }}
        />
      </Stack.Navigator>
      <BottomNavBar activeRoute={activeRoute} />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigator;
