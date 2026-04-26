/**
 * Expo sets android/settings.gradle rootProject.name from expo.name.
 * Gradle project names must not contain spaces — EAS/Gradle can fail.
 */
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, '..', 'android', 'settings.gradle');
if (!fs.existsSync(settingsPath)) {
  process.exit(0);
}

let s = fs.readFileSync(settingsPath, 'utf8');
const next = "rootProject.name = 'UrbanGriffinApp'";
if (s.includes(next)) {
  process.exit(0);
}

const replaced = s.replace(/rootProject\.name = '[^']*'/, next);
if (replaced !== s) {
  fs.writeFileSync(settingsPath, replaced);
  console.log('scripts/fix-android-root-name: set rootProject.name to UrbanGriffinApp');
}
