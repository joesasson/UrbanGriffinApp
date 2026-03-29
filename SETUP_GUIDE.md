# Setup and Development Guide

## Quick Start

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Android Studio**: Latest version (for Android development)
- **JDK**: Java Development Kit 17
- **Git**: For version control

### Installation Steps

1. **Navigate to the project directory**:
```bash
cd "UrbanGriffinApp"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Setup Android**:
```bash
cd android
./gradlew clean
cd ..
```

4. **Start the Metro bundler**:
```bash
npm start
```

5. **Run on Android** (in a new terminal):
```bash
npm run android
```

## Project Status

### ✅ Completed Features

All core gameplay features are implemented:

1. **Navigation System**: Complete stack navigation with 10+ screens
2. **Game State Management**: Context API with AsyncStorage persistence
3. **Challenge 1**: Riddle display and scrambled letter puzzles
4. **Challenge 2**: Interactive trivia with 10 questions per landmark
5. **Challenge 3**: Location-based verification using GPS
6. **Fragment Puzzle**: Letter collection system
7. **Token System**: Earn/spend mechanics with hint purchases
8. **Key Collection**: Visual tracker for all 20 keys
9. **Token Shop**: Prize redemption with 40+ items
10. **Landmark Map**: List view of all landmarks with progress
11. **Interactive NYC Map**: Real map view with marker pins
12. **Audio Player Utility**: Infrastructure for Keeper narration

### 🔨 Needs Content/Assets

These features are **built and ready** but need content to be added:

1. **Audio Files**: 
   - Record Keeper voice narration for all dialogue
   - Add background music
   - Add sound effects
   - Place files in `android/app/src/main/res/raw/`

2. **Images**:
   - Character images (Keeper, Griffin, Sky Snatchers)
   - Landmark photos (20 locations)
   - Architectural detail photos for clues
   - UI icons and graphics

3. **19 Additional Landmarks**:
   - Currently only Grand Central Terminal is complete
   - Follow the Grand Central template in `landmarks.json`
   - Each landmark needs:
     - Riddle and fragment puzzle
     - 5-10 trivia questions
     - On-location clue with 3 hints
     - 5-10 fragment questions
     - All Keeper dialogue

## File Structure Overview

```
UrbanGriffinApp/
├── src/
│   ├── context/
│   │   └── GameContext.tsx         # Game state (tokens, keys, progress)
│   ├── data/
│   │   ├── landmarks.json          # All landmark content
│   │   ├── gameIntro.json          # Game backstory
│   │   └── tokenPrizes.json        # Shop inventory
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Screen navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Main menu
│   │   ├── IntroductionScreen.tsx  # Game intro
│   │   ├── LandmarkMapScreen.tsx   # Landmark list
│   │   ├── MapViewScreen.tsx       # Interactive map
│   │   ├── Challenge1Screen.tsx    # Riddle puzzle
│   │   ├── Challenge2Screen.tsx    # Trivia questions
│   │   ├── Challenge3Screen.tsx    # Location search
│   │   ├── FragmentPuzzleScreen.tsx # Letter puzzle
│   │   ├── KeyCollectionScreen.tsx  # Key progress
│   │   └── TokenShopScreen.tsx      # Prize shop
│   └── utils/
│       └── audioPlayer.ts           # Audio playback
├── android/                         # Android native code
├── App.tsx                          # App entry point
└── package.json                     # Dependencies
```

## Adding New Landmarks

### Step 1: Create Content

Use Grand Central Terminal as a template. Each landmark needs:

**Challenge 1 - Find the Landmark:**
- Opening dialogue from Keeper
- Riddle (Measured Seuss style - rhyming couplets)
- Fragment puzzle (scrambled letters)
- Correct/incorrect feedback
- Transition dialogue

**Challenge 2 - Trivia & Research:**
- Opening dialogue
- 5-10 questions (mix of factual, thinking, observation-prep)
- Each question needs: question text, hint, answer, feedback
- Completion dialogue

**Challenge 3 - On-Location Search:**
- Opening dialogue
- Location clue (Measured Seuss style)
- 3 progressive hints (costs: 1, 1, 2 tokens)
- Expected answers
- Completion dialogue

**Fragment Puzzle:**
- Opening dialogue
- 5-10 fragment questions (each reveals one letter)
- Combining instructions
- Final solution
- Victory dialogue

### Step 2: Add to landmarks.json

```json
{
  "landmarkId": 2,
  "name": "Statue of Liberty",
  "location": {
    "address": "Liberty Island, New York Harbor",
    "coordinates": { "lat": 40.6892, "lng": -74.0445 }
  },
  "challenge1": { ... },
  "challenge2": { ... },
  "challenge3": { ... },
  "fragments": { ... },
  "keyLocation": "The torch viewing platform"
}
```

### Step 3: Test

The app will automatically:
- Add the landmark to the map
- Create navigation to all challenges
- Handle token rewards
- Track key collection

## Adding Audio

### Step 1: Record Audio Files

Record all Keeper dialogue following the voice guidelines:
- Warm, calm, observant tone
- Short sentences
- Light curiosity with dry humor
- Never dramatic or overly poetic

### Step 2: Name Files

Follow the naming convention in `audioPlayer.ts`:
```
keeper_intro_welcome.mp3
keeper_gc_c1_opening.mp3
keeper_gc_c2_q1_correct.mp3
...
```

### Step 3: Add to Android

Place files in: `android/app/src/main/res/raw/`

### Step 4: Use in Screens

```typescript
import { playKeeperDialogue, AudioFiles } from '../utils/audioPlayer';

// Play audio with text display
playKeeperDialogue(
  AudioFiles.gc_challenge1_opening,
  challenge.keeperOpening,
  () => {
    // Called when audio finishes
  }
);
```

## Adding Images

### For Character Images

1. Add to: `android/app/src/main/res/drawable/`
2. Use in React Native:
```typescript
<Image source={require('../assets/images/keeper.png')} />
```

### For Landmark Photos

Store in the same location and reference in landmarks.json:
```json
"images": {
  "main": "grand_central_exterior.jpg",
  "detail": "grand_central_ceiling.jpg"
}
```

## Testing

### Manual Testing Checklist

- [ ] Complete full game flow for Grand Central Terminal
- [ ] Test token earning in all challenges
- [ ] Test token spending on hints
- [ ] Test GPS location verification (or skip for testing)
- [ ] Test fragment puzzle letter collection
- [ ] Test key collection and display
- [ ] Test token shop prize redemption
- [ ] Test game state persistence (close and reopen app)
- [ ] Test new game reset

### Test Without GPS

Use the "Skip (for testing)" button in Challenge 3 to bypass location verification during development.

### Reset Game Data

To reset all progress:
1. Go to Home screen
2. Tap "New Hunt" button
3. Confirm reset

Or manually clear app data in Android settings.

## Common Issues

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Location Permission Issues
Make sure these are in `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Map View Issues
Ensure Google Maps API key is configured in `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_API_KEY_HERE"/>
```

## Next Steps

### Immediate Priorities

1. **Add Remaining 19 Landmarks**
   - Follow Grand Central template
   - Include all dialogue and puzzles
   - Test each one thoroughly

2. **Record Audio**
   - Find voice actor for Keeper
   - Record all dialogue
   - Add background music

3. **Add Images**
   - Take/obtain landmark photos
   - Create character illustrations
   - Design UI icons

### Future Enhancements

1. **Camera Integration**: Allow photo submissions in Challenge 3
2. **AR Features**: Augmented reality overlays at landmarks
3. **Multiplayer**: Compete with friends
4. **Achievements**: Additional rewards for special accomplishments
5. **Parent Dashboard**: Track progress, manage tokens

## Deployment

### Android APK Build

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Play Store Publishing

Follow the [React Native Publishing Guide](https://reactnative.dev/docs/signed-apk-android)

## Support

For questions or issues:
1. Check this guide first
2. Review the README.md
3. Check the code comments
4. Contact the development team

---

**Happy Hunting!** 🦅🗝️



