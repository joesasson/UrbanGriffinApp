# Common Expo Errors & Solutions

## ❌ "Unable to resolve 'react-native-worklets'"

**Error Message:**
```
Unable to resolve "react-native-worklets" from "node_modules/react-native-reanimated/src/ConfigHelper.ts"
```

**Solution:**
```bash
# Install the missing dependency
npm install react-native-worklets-core --legacy-peer-deps

# Clear Metro cache and restart
npm start -- --clear
```

**Why this happens:** 
React Native Reanimated requires `react-native-worklets-core` as a peer dependency, but it's not always installed automatically.

---

## ❌ Babel Config Error

**Error Message:**
```
Reanimated 2 failed to create a worklet, maybe you forgot to add Reanimated's babel plugin?
```

**Solution:**
Make sure your `babel.config.js` includes the Reanimated plugin:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',  // Must be last!
  ],
};
```

Then restart with cleared cache:
```bash
npm start -- --clear
```

---

## ❌ "Port 8081 already in use"

**Error Message:**
```
› Port 8081 is running this app in another window
```

**Solution 1: Kill the process**
```bash
# On Mac/Linux
pkill -f "expo start"
pkill -f "metro"

# Then restart
npm start
```

**Solution 2: Use a different port**
When Expo asks "Use port 8083 instead?" → Press `y`

---

## ❌ Version Warnings

**Warning Message:**
```
The following packages should be updated for best compatibility...
  react@19.2.3 - expected version: 19.1.0
```

**Solution:**
These warnings are **harmless**. The app will work fine. If you want to fix them:

```bash
npm install react@19.1.0 react-native@0.81.5 --legacy-peer-deps
npm start -- --clear
```

---

## ❌ "Bundler cache is empty"

**Message:**
```
warning: Bundler cache is empty, rebuilding (this may take a minute)
```

**Solution:**
This is **normal** after running `npm start -- --clear`. Just wait 1-2 minutes for it to rebuild. This only happens once.

---

## ❌ "Cannot find module"

**Error Message:**
```
Error: Cannot find module 'expo-location'
```

**Solution:**
```bash
# Reinstall dependencies
npm install --legacy-peer-deps

# Clear and restart
npm start -- --clear
```

---

## ❌ App crashes immediately on device

**Check:**
1. Open Expo Go dev menu (shake device)
2. Check terminal for red error messages
3. Look for missing imports or syntax errors

**Common causes:**
- Typo in an import statement
- Missing package
- Babel configuration issue

**Quick fix:**
```bash
# Reinstall everything fresh
rm -rf node_modules
npm install --legacy-peer-deps
npm start -- --clear
```

---

## ❌ Android SDK not found / "spawn adb ENOENT"

**Error Message:**
```
Failed to resolve the Android SDK path. Default install location not found: .../Library/Android/sdk. Use ANDROID_HOME to set the Android SDK location.
Error: spawn adb ENOENT
```

**Cause:** The Android SDK (and `adb`) is not installed or not on your PATH.

**Option A – Use iOS or Expo Go (no Android SDK needed)**  
- Run `npm start` and open the app in **Expo Go** on your phone (scan QR code), or  
- Run `npm run ios` if you have Xcode and an iOS simulator/device.

**Option B – Install Android SDK for `npm run android`**  
1. Install [Android Studio](https://developer.android.com/studio).  
2. In Android Studio: **Settings → Appearance & Behavior → System Settings → Android SDK**. Note the **Android SDK Location** (e.g. `~/Library/Android/sdk`).  
3. Set environment variables (e.g. in `~/.zshrc`):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
   ```
4. Restart the terminal, then run `npm run android`.

---

## 💡 Quick Troubleshooting Checklist

When something goes wrong, try these in order:

1. **Reload the app:** Shake device → "Reload"
2. **Clear Metro cache:** `npm start -- --clear`
3. **Check terminal:** Look for red error messages
4. **Reinstall deps:** `npm install --legacy-peer-deps`
5. **Nuclear option:** Delete `node_modules` and reinstall

---

## 📝 Helpful Commands

```bash
# Full clean restart
rm -rf node_modules
npm install --legacy-peer-deps
npm start -- --clear

# Kill all Expo/Metro processes
pkill -f "expo start"
pkill -f "metro"

# Check what's running on port 8081
lsof -i :8081

# Force kill a specific process
kill -9 [PID]
```

---

Keep this file handy for quick reference! 🛠️



