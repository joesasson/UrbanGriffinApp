ç# 🎉 Expo Conversion Complete!

Your app is now running with **Expo**, making it super easy to preview on your device!

## ✅ What Changed

- **Expo SDK integrated** - Easy QR code scanning to preview
- **Location services** - Now using `expo-location` (works great!)
- **Audio player** - Now using `expo-av` (ready for voice files)
- **Maps** - Compatible with Expo's React Native Maps
- **No Android Studio needed** - Just scan QR code!

## 🚀 How to Preview on Your Device

### Step 1: Install Expo Go on Your Phone

**Android:**
- Open Google Play Store
- Search for "Expo Go"
- Install it
- Download: https://play.google.com/store/apps/details?id=host.exp.exponent

**iPhone:**
- Open App Store
- Search for "Expo Go"
- Install it
- Download: https://apps.apple.com/app/expo-go/id982107779

### Step 2: Start the Expo Development Server

Open a terminal and run these commands:

```bash
# Navigate to the app directory
cd "/Users/joesasson/Documents/Obsidian Vault/The Hunt of the Urban Griffin/UrbanGriffinApp"

# Start the Expo dev server
npm start
```

**What you'll see:**
- Metro bundler starting up
- A QR code appears in the terminal
- A URL like: `exp://192.168.x.x:8081`
- Options to press: `a` for Android, `i` for iOS, `w` for web

**Wait until you see:** "Metro waiting on exp://..." - this means it's ready!

### Step 3: Connect Your Phone & Scan QR Code

**Make sure:**
- ✅ Your phone and computer are on the **same WiFi network**
- ✅ Expo Go app is installed on your phone
- ✅ The terminal shows a QR code

**On Android:**
1. Open the **Expo Go** app
2. Tap **"Scan QR code"**
3. Point your camera at the QR code in the terminal
4. Wait for the app to load (first time takes 30-60 seconds)

**On iPhone:**
1. Open your regular **Camera** app (not Expo Go)
2. Point your camera at the QR code in the terminal
3. A notification will pop up - tap it
4. Expo Go will automatically open and load the app
5. Wait for the app to load (first time takes 30-60 seconds)

**Alternative - Manual URL Entry:**

If the QR code doesn't work:
1. Open Expo Go app
2. Tap **"Enter URL manually"**
3. Type the URL from your terminal (looks like `exp://192.168.x.x:8081`)
4. Tap **"Connect"**

### Step 4: Start Playing!

Once loaded, you'll see the home screen with:
- "Begin the Hunt" button (for first time)
- "Continue Hunt" button (if you've started)
- Token and Key counters
- Menu options

**Try these to test:**
1. Tap **"Begin the Hunt"** → See the Keeper's introduction
2. Tap through the story (8 sections)
3. Select **"Grand Central Terminal"** from the landmark list
4. Try **Challenge 1** (solve the riddle and fragment puzzle)
5. Use **"Skip (for testing)"** in Challenge 3 (you won't be at the real location)

## 🔄 Making Changes & Live Reload

**The magic of Expo:** Edit any code and it automatically updates on your device!

1. Open any file in `src/screens/` or `src/` folders
2. Make a change (e.g., change text, colors)
3. Save the file
4. Watch your phone - the app reloads automatically in 1-2 seconds!

**No need to:**
- ❌ Restart the server
- ❌ Rescan the QR code
- ❌ Rebuild the app

Just save and watch it update! ✨

## 🛠️ Terminal Commands Reference

### Starting the Server

```bash
# First time or after closing terminal
cd "/Users/joesasson/Documents/Obsidian Vault/The Hunt of the Urban Griffin/UrbanGriffinApp"
npm start
```

### Useful Keyboard Shortcuts (while server is running)

- Press `a` → Open on Android device/emulator
- Press `i` → Open on iOS simulator (Mac only)
- Press `w` → Open in web browser
- Press `r` → Reload app
- Press `m` → Toggle menu
- Press `c` → Clear Metro bundler cache (use if something breaks)
- Press `?` → Show all commands

### Stopping the Server

- Press `Ctrl + C` in the terminal
- Or just close the terminal window

### Restarting with Clean Cache

If something goes wrong:
```bash
npm start -- --clear
```

Or completely clean:
```bash
# Stop the server (Ctrl+C)
# Then clear everything and restart
npm start -- --reset-cache
```

## ⚠️ Troubleshooting

### "Unable to connect to Metro" or QR code won't scan

**Solution 1: Check WiFi**
- Make sure your phone and computer are on the **same WiFi network**
- Public/corporate WiFi sometimes blocks connections - try a home network

**Solution 2: Use Tunnel Mode**
```bash
# Stop the server (Ctrl+C)
# Start with tunnel (slower but works everywhere)
npm start -- --tunnel
```

**Solution 3: Manual URL**
1. Check the terminal for the URL (like `exp://192.168.1.5:8081`)
2. Open Expo Go on your phone
3. Tap "Enter URL manually"
4. Type the full URL
5. Tap "Connect"

### "App won't load" or "Something went wrong"

**Solution 1: Reload the app**
- Shake your device
- Tap "Reload"

**Solution 2: Restart Metro**
```bash
# In terminal, press Ctrl+C to stop
# Then restart
npm start -- --clear
```

**Solution 3: Check for errors**
- Look at the terminal output for red error messages
- Fix any syntax errors in your code

### "Location permission error"

**On Device:**
1. Go to phone Settings
2. Find "Expo Go" app
3. Grant Location permission
4. Restart the app

**Or just use the testing skip button** in Challenge 3!

### First load is very slow (30+ seconds)

This is normal! The first time you load:
- Metro bundler compiles all JavaScript
- Downloads assets
- Sets up dependencies

**After the first load, updates are instant (1-2 seconds)!**

### "Duplicate module name" error

```bash
# Stop server (Ctrl+C)
# Clear watchman cache
watchman watch-del-all

# Clear Metro cache
npm start -- --reset-cache
```

### App crashes or freezes

1. **Shake device** → Dev Menu → **"Reload"**
2. Check terminal for error messages
3. Fix any code errors
4. Save the file - app will reload

### "Can't find variable: __DEV__" or other build errors

```bash
# Reinstall dependencies
npm install --legacy-peer-deps

# Clear and restart
npm start -- --clear
```

## 🎮 What You Can Test Right Now

### ✅ Fully Functional Features

**Navigation & UI:**
- ✅ Home screen with menu
- ✅ Game introduction (8 story sections from The Keeper)
- ✅ Landmark selection screen
- ✅ Interactive NYC map with pins
- ✅ All 10 screens working

**Challenge 1 - Find the Landmark:**
- ✅ Riddle display
- ✅ Scrambled letter puzzle
- ✅ Answer validation
- ✅ Token rewards (2 tokens)

**Challenge 2 - Trivia & Research:**
- ✅ 10 trivia questions
- ✅ Hint system (costs 1 token per hint)
- ✅ Multiple answer types (factual, thinking)
- ✅ Progress bar
- ✅ Token rewards (1 token per correct answer)

**Challenge 3 - On-Location Search:**
- ✅ GPS location detection
- ✅ Distance calculation
- ✅ 3 progressive hints (1, 1, 2 tokens)
- ✅ "Skip (for testing)" button - use this!
- ✅ Answer validation

**Fragment Puzzle:**
- ✅ 10 letter collection questions
- ✅ Visual letter display
- ✅ Final word rearrangement
- ✅ Token rewards (1 per letter)

**Token System:**
- ✅ Earning tokens from challenges
- ✅ Spending tokens on hints
- ✅ Token counter always visible
- ✅ Token shop with 40+ prizes

**Key Collection:**
- ✅ Visual grid showing all 20 keys
- ✅ Progress tracking (X/20)
- ✅ Locked/unlocked states
- ✅ Completion detection

**Game State:**
- ✅ Auto-save after every action
- ✅ Close app and reopen - progress saved!
- ✅ Reset game option

## 📝 What Still Needs Content

⏳ Audio files (Keeper voice narration)
⏳ Landmark photos
⏳ 19 more landmarks (only Grand Central is complete)

## 💡 Pro Tips

- **Shake your device** to open the Expo dev menu
- Use **"Reload"** in dev menu if something looks off
- Check terminal for any error messages
- The game state auto-saves, so you can close and reopen anytime
- **Use "Skip (for testing)"** in Challenge 3 - you won't be at the actual landmark!

---

**Ready to start? Open your terminal and run:**
```bash
cd "/Users/joesasson/Documents/Obsidian Vault/The Hunt of the Urban Griffin/UrbanGriffinApp"
npm start
```

**Then scan the QR code with Expo Go to start playing! 🦅🗝️📱**

