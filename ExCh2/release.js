const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const commitMsg = process.argv[2] || "Align Task Bottom Border Tangent to Calendar";
const manifestPath = path.join(__dirname, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error("Khata: File manifest.json peyda nashod!");
  process.exit(1);
}

// 1. Khandan va afzayesh version
const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const currentVer = manifestData.version || "1.0.0";
const parts = currentVer.split('.');
parts[parts.length - 1] = parseInt(parts[parts.length - 1], 10) + 1;
const newVer = parts.join('.');
const tagName = `v${newVer}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

console.log(`Erteghaye version az ${currentVer} be ${newVer}`);

manifestData.version = newVer;
fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');

// 2. Hazfe zip haye ghadimi
const files = fs.readdirSync(__dirname);
files.forEach(file => {
  if (file.startsWith('Chrome-Extension-') && file.endsWith('.zip')) {
    fs.unlinkSync(path.join(__dirname, file));
    console.log(`Hazfe zip ghadimi: ${file}`);
  }
});

// 3. Sakhte zip jadid
console.log(`Dar hale sakhte zip jadid: ${zipName}...`);
const zipCommand = `powershell -Command "Compress-Archive -Path (Get-ChildItem -Exclude '*.git*', '*.zip', 'release.js', 'release.sh', 'release.ps1') -DestinationPath '${zipName}' -Force"`;
execSync(zipCommand, { stdio: 'inherit' });

// 4. Sabte commit va tag dar Git
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${commitMsg}"`, { stdio: 'inherit' });
  execSync(`git tag -fa ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync('git push origin main --tags', { stdio: 'inherit' });
  console.log(`Tag ${tagName} ba movafaghiat be Git push shod.`);
} catch (e) {
  console.log("Ekhtar dar bakhshe Git (Momken ast tag az ghabl bashad).");
}

// 5. Matne Release ba Parchame Iran va America
const releaseTitle = `Abner Extension ${tagName} - ${commitMsg}`;
const releaseNotes = `### 🇮🇷 Taghirate Noskhe ${tagName}:

* ${commitMsg}
* Emtedade daghighe kadre task ta labeye zirine taghvim
* Mat-tar va khanatar shodane style shishei
* Baste shodane khodkar va hooshmande drawer-ha

---

### 🇺🇸 Release Notes (${tagName}):

* ${commitMsg}
* Aligned task card bottom edge tangent to calendar
* Enhanced frosted glass blur and opacity
* Intelligent drawer dismissals and UI optimizations`;

fs.writeFileSync('release_notes.txt', releaseNotes, 'utf8');

// 6. Ijade Release rasmi dar GitHub
try {
  console.log("Dar hale sakhte Release dar GitHub...");
  execSync(`gh release create ${tagName} "${zipName}" --title "${releaseTitle}" --notes-file release_notes.txt`, { stdio: 'inherit' });
  console.log(`\n========================================`);
  console.log(`Noskheye ${tagName} ba movafaghiat dar GitHub Release shod!`);
  console.log(`========================================\n`);
} catch (err) {
  console.log("\nEkhtar: Dastoore 'gh' ejra nashod ya Login nistid.");
  console.log("Lotfan yekbar dastoore zir ra bezanid ta ba GitHub connect shavid:");
  console.log("gh auth login\n");
}

if (fs.existsSync('release_notes.txt')) {
  fs.unlinkSync('release_notes.txt');
}