module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|react-native-gesture-handler|react-native-reanimated|react-native-screens|react-native-safe-area-context|react-native-maps|react-native-permissions|react-native-sound|@react-native-async-storage)/)',
  ],
};
