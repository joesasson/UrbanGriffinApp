import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameState {
  tokens: number;
  keysCollected: number[];
  currentLandmarkId: number;
  currentChallenge: number;
  completedChallenges: {
    [landmarkId: number]: {
      challenge1: boolean;
      challenge2: boolean;
      challenge3: boolean;
      fragments: boolean[];
    };
  };
  fragmentLetters: { [landmarkId: number]: string[] };
}

interface GameContextType {
  gameState: GameState;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
  addKey: (landmarkId: number) => void;
  setCurrentLandmark: (landmarkId: number) => void;
  completeChallenge: (landmarkId: number, challengeNum: number) => void;
  addFragmentLetter: (landmarkId: number, letter: string) => void;
  resetGame: () => void;
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;
}

const initialState: GameState = {
  tokens: 0,
  keysCollected: [],
  currentLandmarkId: 1,
  currentChallenge: 1,
  completedChallenges: {},
  fragmentLetters: {},
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const addTokens = (amount: number) => {
    setGameState(prev => ({
      ...prev,
      tokens: prev.tokens + amount,
    }));
  };

  const spendTokens = (amount: number): boolean => {
    if (gameState.tokens >= amount) {
      setGameState(prev => ({
        ...prev,
        tokens: prev.tokens - amount,
      }));
      return true;
    }
    return false;
  };

  const addKey = (landmarkId: number) => {
    setGameState(prev => ({
      ...prev,
      keysCollected: [...prev.keysCollected, landmarkId],
    }));
  };

  const setCurrentLandmark = (landmarkId: number) => {
    setGameState(prev => ({
      ...prev,
      currentLandmarkId: landmarkId,
      currentChallenge: 1,
    }));
  };

  const completeChallenge = (landmarkId: number, challengeNum: number) => {
    setGameState(prev => {
      const landmarkProgress = prev.completedChallenges[landmarkId] || {
        challenge1: false,
        challenge2: false,
        challenge3: false,
        fragments: [],
      };

      return {
        ...prev,
        completedChallenges: {
          ...prev.completedChallenges,
          [landmarkId]: {
            ...landmarkProgress,
            [`challenge${challengeNum}`]: true,
          },
        },
        currentChallenge: challengeNum + 1,
      };
    });
  };

  const addFragmentLetter = (landmarkId: number, letter: string) => {
    setGameState(prev => {
      const letters = prev.fragmentLetters[landmarkId] || [];
      return {
        ...prev,
        fragmentLetters: {
          ...prev.fragmentLetters,
          [landmarkId]: [...letters, letter],
        },
      };
    });
  };

  const resetGame = () => {
    AsyncStorage.setItem('gameState', JSON.stringify(initialState));
    setGameState(initialState);
  };

  const saveGame = useCallback(async () => {
    try {
      await AsyncStorage.setItem('gameState', JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }, [gameState]);

  const loadGame = useCallback(async () => {
    try {
      const savedState = await AsyncStorage.getItem('gameState');
      if (savedState) {
        setGameState(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveGame();
  }, [gameState, isLoaded, saveGame]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        addTokens,
        spendTokens,
        addKey,
        setCurrentLandmark,
        completeChallenge,
        addFragmentLetter,
        resetGame,
        saveGame,
        loadGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
