# Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Clean and rebuild
cd android && ./gradlew clean && cd .. && npm run android
```

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `App.tsx` | Main app entry point |
| `src/context/GameContext.tsx` | Game state management |
| `src/data/landmarks.json` | All landmark content |
| `src/data/gameIntro.json` | Game introduction |
| `src/data/tokenPrizes.json` | Shop inventory |
| `src/navigation/AppNavigator.tsx` | Screen navigation |

## 🎮 Screen Components

| Screen | File | Purpose |
|--------|------|---------|
| Home | `HomeScreen.tsx` | Main menu |
| Introduction | `IntroductionScreen.tsx` | Game backstory |
| Landmark List | `LandmarkMapScreen.tsx` | Select landmark |
| NYC Map | `MapViewScreen.tsx` | Interactive map |
| Challenge 1 | `Challenge1Screen.tsx` | Riddle puzzle |
| Challenge 2 | `Challenge2Screen.tsx` | Trivia quiz |
| Challenge 3 | `Challenge3Screen.tsx` | Location search |
| Fragment Puzzle | `FragmentPuzzleScreen.tsx` | Letter puzzle |
| Keys | `KeyCollectionScreen.tsx` | Progress tracker |
| Shop | `TokenShopScreen.tsx` | Prize redemption |

## 🎯 Game Flow

```
Home → Introduction → Landmark Selection
  ↓
Challenge 1 (Riddle + Fragment Puzzle)
  ↓
Challenge 2 (Trivia Questions)
  ↓
Challenge 3 (On-Location Search)
  ↓
Fragment Puzzle (Letter Collection)
  ↓
Key Obtained → Back to Landmark Selection
```

## 💰 Token Economics

**Earning:**
- Challenge 1: 2 tokens
- Challenge 2: 10 tokens (1 per question)
- Fragment Puzzle: 10 tokens (1 per letter)
- **Total: 22 tokens per landmark**

**Spending:**
- Hints: 1-2 tokens
- Prizes: 8-60 tokens

## 📊 Game State Structure

```typescript
{
  tokens: number,              // Current token count
  keysCollected: number[],     // Array of landmark IDs
  currentLandmarkId: number,   // Current landmark
  currentChallenge: number,    // 1, 2, or 3
  completedChallenges: {       // Per-landmark progress
    [landmarkId]: {
      challenge1: boolean,
      challenge2: boolean,
      challenge3: boolean,
      fragments: boolean[]
    }
  },
  fragmentLetters: {           // Collected letters
    [landmarkId]: string[]
  }
}
```

## 📝 Adding a New Landmark

1. **Choose location** (name, address, coordinates)
2. **Write riddle** (Measured Seuss style)
3. **Create fragment puzzle** (scrambled letters)
4. **Write 10 trivia questions** (mix of types)
5. **Write on-location clue** (rhyming couplets)
6. **Create 3 hints** (progressive difficulty)
7. **Write 10 fragment questions** (reveal letters)
8. **Write all Keeper dialogue** (warm, calm, observant)
9. **Add to landmarks.json**
10. **Test thoroughly**

## 🎤 Keeper Voice Guidelines

**DO:**
- Short sentences
- Warm, calm tone
- Light curiosity
- Slight dry humor
- Treat magic as normal

**DON'T:**
- Long speeches
- Poetic language
- Grand announcements
- Explain everything
- Act all-knowing

## 🗺️ Landmark Status Colors

| Color | Meaning |
|-------|---------|
| 🟡 Gold (#d4af37) | Current landmark |
| 🔵 Blue (#1a3a52) | Available landmark |
| 🟢 Green (#4a8a5a) | Completed (Key obtained) |

## 🔧 Common Commands

```bash
# Reset Metro cache
npm start -- --reset-cache

# Clean Android build
cd android && ./gradlew clean

# Check for linting errors
npm run lint

# View logs
npx react-native log-android
```

## 📱 Testing Tips

- Use "Skip (for testing)" in Challenge 3 to bypass GPS
- Clear app data to reset game progress
- Check console for Keeper dialogue logs
- Test token earning/spending carefully

## 🐛 Debugging

**Metro won't start:**
```bash
killall node
npm start -- --reset-cache
```

**Build fails:**
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npm run android
```

**Location not working:**
- Check Android permissions in Settings
- Use skip button for testing
- Verify coordinates in landmarks.json

## 📦 Project Structure

```
UrbanGriffinApp/
├── src/
│   ├── context/        # State management
│   ├── data/           # JSON content
│   ├── navigation/     # Screen routing
│   ├── screens/        # UI components
│   └── utils/          # Helpers
├── android/            # Native Android
├── App.tsx             # Entry point
└── package.json        # Dependencies
```

## 🎨 Color Palette

```css
--primary-gold: #d4af37
--dark-blue: #0f2537
--medium-blue: #1a3a52
--light-blue: #2a3a4a
--gray: #8c9ba5
--white: #e8e8e8
--green: #4a8a5a
--red: #8a4a4a
```

## 📞 Support

**Documentation:**
- `README.md` - Overview
- `SETUP_GUIDE.md` - Detailed setup
- `PROJECT_SUMMARY.md` - Complete status

**Code:**
- All files have inline comments
- Grand Central Terminal is reference implementation
- Context API manages all game state

---

**Keep this card handy for quick reference!** 📋



