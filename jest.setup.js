/* eslint-env jest */

// Mock AsyncStorage for Jest tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({ coords: { latitude: 40.7527, longitude: -73.9772 } })
  ),
  Accuracy: { High: 4 },
}));

// Mock react-native-gesture-handler (requires native modules)
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    Swipeable: ({ children }) => React.createElement('View', null, children),
    DrawerLayout: ({ children }) => React.createElement('View', null, children),
    State: {},
    ScrollView: ({ children }) => React.createElement('ScrollView', null, children),
    Slider: ({ children }) => React.createElement('View', null, children),
    Switch: ({ children }) => React.createElement('View', null, children),
    TextInput: ({ children }) => React.createElement('TextInput', null, children),
    ToolbarAndroid: ({ children }) => React.createElement('View', null, children),
    ViewPagerAndroid: ({ children }) => React.createElement('View', null, children),
    DrawerLayoutAndroid: ({ children }) => React.createElement('View', null, children),
    WebView: ({ children }) => React.createElement('View', null, children),
    NativeViewGestureHandler: ({ children }) => React.createElement('View', null, children),
    TapGestureHandler: ({ children }) => React.createElement('View', null, children),
    FlingGestureHandler: ({ children }) => React.createElement('View', null, children),
    ForceTouchGestureHandler: ({ children }) => React.createElement('View', null, children),
    LongPressGestureHandler: ({ children }) => React.createElement('View', null, children),
    PanGestureHandler: ({ children }) => React.createElement('View', null, children),
    PinchGestureHandler: ({ children }) => React.createElement('View', null, children),
    RotationGestureHandler: ({ children }) => React.createElement('View', null, children),
    RawButton: ({ children }) => React.createElement('View', null, children),
    BaseButton: ({ children }) => React.createElement('View', null, children),
    RectButton: ({ children }) => React.createElement('View', null, children),
    BorderlessButton: ({ children }) => React.createElement('View', null, children),
    FlatList: ({ children }) => React.createElement('FlatList', null, children),
    gestureHandlerRootHOC: (Component) => Component,
    GestureHandlerRootView: ({ children }) => React.createElement('View', null, children),
    Directions: {},
  };
});

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const MockMapView = (props) => React.createElement('MapView', props);
  const MockMarker = (props) => React.createElement('Marker', props);
  MockMapView.Marker = MockMarker;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});
