const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  execSync('chcp 65001', { stdio: 'ignore' });
} catch (e) {}

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۱. همگام‌سازی newtab.html در index.html
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html dar index.html copy shod.');
}

// ۲. بررسی تگ‌های محلی و سرور برای جلوگیری از خطای tag already exists
let existingTags = [];
try {
  existingTags = execSync('git tag', { encoding: 'utf8' }).split('\n').map(t => t.trim()).filter(Boolean);
} catch (e) {}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = (manifest.version || '1.32.4').split('.').map(Number);
if (isNaN(major)) major = 1;
if (isNaN(minor)) minor = 32;
if (isNaN(patch)) patch = 4;

// افزایش هوشمند تا رسیدن به تگی که تکراری نباشد
let newVersion = '';
let tagName = '';
do {
  patch += 1;
  newVersion = `${major}.${minor}.${patch}`;
  tagName = `v${newVersion}`;
} while (existingTags.includes(tagName));

manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`🚀 Version khodkar afzayesh yaft be: v${newVersion}`);

// پارامترهای ورودی ترمینال
const titleEn = process.argv[2] || `Release ${tagName}`;
const descFa = process.argv[3] || 'به‌روزرسانی استایل‌های شیشه‌ای و ابزارهای داشبورد';

// ۳. پاک‌سازی پوشه dist و ساخت زیپ نسخه جدید
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
} else {
  const files = fs.readdirSync(distDir);
  for (const file of files) {
    if (file.endsWith('.zip')) {
      fs.unlinkSync(path.join(distDir, file));
    }
  }
}

const zipPath = `${distDir}/Chrome-Extension-${tagName}.zip`;
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

console.log(`📦 Sakhte archive jadid dar dist: ${zipPath}...`);
try {
  execSync(`powershell Compress-Archive -Path ${targetFiles} -DestinationPath "${zipPath}" -Force`, { stdio: 'inherit' });
} catch (e) {}

// ۴. ایجاد یادداشت دوزبانه
const releaseNotes = `
### 🇮🇷 تغییرات نسخه ${tagName}:
- ${descFa}
- مات‌تر و خواناتر شدن استایل شیشه‌ای پنجره‌های پیش‌بینی، اوقات شرعی و تایمر
- فعال‌سازی کامل موقعیت‌یابی زنده دستگاه (GPS)، تشخیص آی‌پی و جستجوی شهر
- افزودن قابلیت تغییر مقادیر تایمر با چرخ ماوس
- بسته‌شدن خودکار و هوشمند دراورها هنگام کلیک یا اسکرول

---

### 🇬🇧 Release Notes (${tagName}):
- ${titleEn}
- Enhanced frosted glass blur and opacity for forecast, prayer times, and timer drawers
- Enabled native device GPS geocoding, IP lookup, and interactive city search
- Added mouse-wheel increment and decrement support for timer fields
- Intelligent backdrop dismissal for drawers on backdrop click or window scroll
`;

fs.writeFileSync('temp_release_notes.txt', releaseNotes.trim(), 'utf8');

// ۵. کامیت، تگ و ارسال به گیت‌هاب
try {
  try {
    execSync('git rm -r --cached ExCh', { stdio: 'ignore' });
  } catch (e) {}

  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${titleEn}"`, { stdio: 'inherit' });

  try {
    execSync('git pull origin main --rebase', { stdio: 'inherit' });
  } catch (e) {}

  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  try {
    execSync(`gh release create "${tagName}" "${zipPath}" --title "Abner Extension ${tagName} - ${titleEn}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
    console.log(`\n🎉 Release ${tagName} ba movafaghiat dar GitHub sabt shod!`);
  } catch (ghErr) {
    console.log('GitHub CLI release skip shod.');
  }
} catch (err) {
  console.error('Khata dar Git:', err.message);
} finally {
  if (fs.existsSync('temp_release_notes.txt')) {
    fs.unlinkSync('temp_release_notes.txt');
  }
}