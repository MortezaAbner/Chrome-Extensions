const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const commitMsg = process.argv[2] || "Align Task Bottom Border Tangent to Calendar";
const manifestPath = path.join(__dirname, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error("Khata: File manifest.json peyda nashod!");
  process.exit(1);
}

// 1. Set kardane daqiqe version be 10.1
const targetVer = "10.1";
const tagName = `v${targetVer}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

console.log(`Tanzime version rooye: ${targetVer}`);

const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifestData.version = targetVer;
fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');

// 2. Hazfe zip haye ghadimi
const files = fs.readdirSync(__dirname);
files.forEach(file => {
  if (file.endsWith('.zip')) {
    try {
      fs.unlinkSync(path.join(__dirname, file));
      console.log(`Hazfe zip ghadimi: ${file}`);
    } catch (e) {}
  }
});

// 3. Sakhte zip jadid
console.log(`Dar hale sakhte zip jadid: ${zipName}...`);
const zipCommand = `powershell -Command "Compress-Archive -Path index.html, style.css, app.js, icon.png, manifest.json, modules -DestinationPath '${zipName}' -Force"`;
execSync(zipCommand, { stdio: 'inherit' });

// 4. Sabte commit va push be Git
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${commitMsg}"`, { stdio: 'inherit' });
  execSync(`git tag -fa ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync(`git push origin main`, { stdio: 'inherit' });
  execSync(`git push origin ${tagName} --force`, { stdio: 'inherit' });
  console.log(`Tag ${tagName} ba movafaghiat be Git push shod.`);
} catch (e) {
  console.log("Ekhtar dar bakhshe Git Push.");
}

// 5. Matne Release ba Parchame Iran va America
const releaseTitle = `Abner Extension ${tagName} - ${commitMsg}`;
const releaseNotes = `### 🇮🇷 تغییرات نسخه ${tagName}:

* ${commitMsg}
* امتداد دقیق کادر تسک تا لبه زیرین تقویم با حفظ کامل ظاهر تب‌ها و چیدمان داخلی
* مات‌تر و خواناتر شدن استایل شیشه‌ای المان‌ها، پنجره‌های پیش‌بینی، اوقات شرعی و تایمر
* هماهنگی چیدمان سایدبار و تقویم با قالب شیشه‌ای آبنر
* بسته‌شدن خودکار و هوشمند منوها و کشوها

---

### 🇺🇸 Release Notes (${tagName}):

* ${commitMsg}
* Aligned task card bottom edge tangent to the calendar component
* Enhanced frosted glass blur and opacity for forecast, prayer times, and timer drawers
* Fully modular UI synchronized with Abner glass engine
* Intelligent drawer dismissals and general performance improvements`;

fs.writeFileSync('release_notes.txt', releaseNotes, 'utf8');

// 6. Sakhte Release rasmi dar GitHub
try {
  console.log("Dar hale sakhte Release rasmi dar GitHub...");
  execSync(`gh release create ${tagName} "${zipName}" --title "${releaseTitle}" --notes-file release_notes.txt`, { stdio: 'inherit' });
  console.log(`\n========================================`);
  console.log(`Noskheye ${tagName} ba movafaghiat dar GitHub Release shod!`);
  console.log(`========================================\n`);
} catch (err) {
  console.log("\nKhata dar sakhte Release ba dastoor gh.");
}

if (fs.existsSync('release_notes.txt')) {
  fs.unlinkSync('release_notes.txt');
}