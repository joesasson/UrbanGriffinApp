# The Hunt of the Urban Griffin - Mobile App (Expo)

An interactive, location-based adventure game that guides players through New York City landmarks as they solve puzzles, answer trivia, and search for 20 magical Keys hidden by the Urban Griffin.

## 🚀 Quick Start with Expo

### Prerequisites
- Node.js 18+ 
- **Expo Go app** on your Android/iOS device ([Download from App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

1. **Install dependencies**:
```bash
cd UrbanGriffinApp
npm install
```

2. **Start Expo dev server**:
```bash
npm start
```

3. **Run on your device**:
   - **Android**: Scan the QR code with the Expo Go app
   - **iOS**: Scan the QR code with your iPhone camera, then open in Expo Go

That's it! No Android Studio or Xcode required for development! 🎉

### Development Commands

```bash
npm start              # Start Expo dev server
npm run android        # Open directly on Android device
npm run ios            # Open directly on iOS device  
npm run web            # Run in web browser
```

## Features

### Implemented ✅

- **Game Introduction**: Full backstory with The Keeper narration
- **Challenge 1**: Riddle display and fragment puzzles
- **Challenge 2**: Interactive trivia system with hints (costs tokens)
- **Challenge 3**: Location-based on-location search with GPS verification
- **Fragment Puzzle System**: Collect letters and solve final location puzzle
- **Token System**: Earn and spend tokens throughout the game
- **Key Collection**: Track all 20 Keys (visual progress)
- **Token Shop**: Redeem prizes with earned tokens
- **Landmark Map**: Visual map of all 20 landmarks
- **Interactive NYC Map**: Google Maps with landmark markers
- **Game State Persistence**: Auto-save progress locally
- **Location Services**: GPS verification using Expo Location

### To Be Enhanced 🔨

- **Audio Integration**: Keeper voice narration (infrastructure ready with Expo AV)
- **Images**: Character images, landmark photos, UI graphics
- **Additional Landmarks**: Currently only Grand Central Terminal is complete (19 more to add)

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack Navigator)
- **State Management**: React Context API
- **Storage**: AsyncStorage (local persistence)
- **Maps**: React Native Maps
- **Location**: Expo Location
- **Audio**: Expo AV
- **Build**: Expo Application Services (EAS)

## Project Structure

```
UrbanGriffinApp/
├── src/
│   ├── context/          # Game state management
│   ├── data/             # JSON game content
│   ├── navigation/       # Navigation setup
│   ├── screens/          # All screen components (10 screens)
│   └── utils/            # Utilities (audio player)
├── assets/               # Images, icons, splash screens
├── App.tsx               # App entry point
├── app.json              # Expo configuration
├── index.js              # Expo entry point
└── package.json          # Dependencies
```

## Game Flow

1. **Introduction**: Player sees the backstory from The Keeper
2. **Landmark Selection**: Choose from available landmarks
3. **Challenge 1**: Solve riddle and fragment puzzle to identify landmark
4. **Challenge 2**: Answer trivia questions while traveling (earn tokens)
5. **Challenge 3**: Arrive at location and find specific detail
6. **Fragment Puzzle**: Collect letters and solve final location puzzle
7. **Key Collection**: Claim the Key and move to next landmark
8. **Repeat** for all 20 landmarks
9. **Final Puzzle**: Unlock when all 20 Keys are collected

## Token System

### Per Landmark Earning Potential
- Challenge 1: 2 tokens
- Challenge 2: 10 tokens (if all correct)
- Fragment Puzzle: 10 tokens
- **Total: 22 tokens per landmark**
- **All 20 landmarks: 440 tokens**

### Token Value
- 1 token = $0.25
- 440 tokens = $110 total prize value
- Average prize cost: 8-48 tokens ($2-$12)

## Testing on Your Device

### Location Testing
- The app requires location permissions for Challenge 3
- Use "Skip (for testing)" button to bypass GPS verification during development
- GPS tolerance is set to 100 meters

### Game State
- Game state auto-saves after every change
- Clear app data to reset game (delete and reinstall in Expo Go)

## Building for Production

### Create Production Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

The build will be created in the cloud and you'll get a download link for the APK/IPA file.

## Adding New Landmarks

To add a new landmark:

1. Create content following the Grand Central Terminal template in `src/data/landmarks.json`
2. Include all required fields:
   - Riddle and fragment puzzle
   - 5-10 trivia questions
   - On-location clue with hints
   - 5-10 fragment questions
   - All Keeper dialogue
   - GPS coordinates

## The Keeper Voice Guidelines

The Keeper character follows specific voice guidelines:

- **Style**: Warm, calm, observant. Short sentences. Light curiosity. Slight dry humor.
- **Tone**: Speaks like a real person, not a fantasy character
- **Approach**: Lets kids figure things out instead of telling them
- **Avoids**: Long speeches, overly poetic lines, grand mystical announcements

## Next Steps

### High Priority
1. Add audio files for Keeper narration
2. Add landmark photos and character images
3. Create remaining 19 landmarks (following Grand Central template)

### Medium Priority
1. Add animations for key collection
2. Add background music and sound effects
3. Implement camera for photo submissions

### Low Priority
1. Add AR features for landmark discovery
2. Implement multiplayer features
3. Add social sharing
4. Create parent dashboard

## Troubleshooting

### Expo Dev Server Won't Start
```bash
npm start -- --clear
```

### App Won't Load on Device
- Make sure your device and computer are on the same network
- Try using tunnel mode: `npm start -- --tunnel`

### Location Permission Issues
- Ensure location permissions are granted in device settings
- Use the skip button for testing without actual GPS

## License

© 2026 The Hunt of the Urban Griffin. All rights reserved.

## Contact

For questions or support, please contact the development team.

---

**Built with Expo for easy development and testing! 📱✨**
