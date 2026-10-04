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

// ۱. همگام‌سازی مستقیم newtab به index.html
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html dar index.html copy shod.');
}

// ۲. افزایش هوشمند شماره نسخه
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = (manifest.version || '1.32.2').split('.').map(Number);
if (isNaN(major)) major = 1;
if (isNaN(minor)) minor = 32;
if (isNaN(patch)) patch = 2;

patch += 1;
const newVersion = `${major}.${minor}.${patch}`;
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`🚀 Version khodkar afzayesh yaft be: v${newVersion}`);

const tagName = `v${newVersion}`;

// دریافت عنوان انگلیسی و متن خلاصه فارسی از پارامترهای ترمینال
const titleEn = process.argv[2] || `Release ${tagName}`;
const descFa = process.argv[3] || 'به‌روزرسانی آب‌وهوا، تایمر و استایل شیشه‌ای داشبورد';

// ۳. پاک‌سازی فایل‌های زیپ قدیمی از پوشه dist و ساخت زیپ نسخه جاری
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
} else {
  const existingFiles = fs.readdirSync(distDir);
  for (const file of existingFiles) {
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

// ۴. ایجاد یادداشت‌های ریلیز دوزبانه رسمی گیت‌هاب
const releaseNotes = `
### 🇮🇷 تغییرات نسخه ${tagName}:
- ${descFa}
- مات‌تر و خواناتر شدن استایل شیشه‌ای پنجره‌های پیش‌بینی، اوقات شرعی و تایمر
- فعال‌‌سازی کامل موقعیت‌یابی زنده دستگاه (GPS)، تشخیص آی‌پی و جستجوی شهر
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

// ۵. کامیت، همگام‌سازی امن، تگ و انتشار Release رسمی
try {
  try {
    execSync('git rm -r --cached ExCh', { stdio: 'ignore' });
  } catch (e) {}

  // کامیت کردن تغییرات جاری محلی
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${titleEn}"`, { stdio: 'inherit' });

  // همگام‌سازی تغییرات سرور پس از کامیت محلی برای جلوگیری از خطای unstaged changes
  try {
    execSync('git pull origin main --rebase', { stdio: 'inherit' });
  } catch (pullErr) {
    console.log('Sync anjam shod.');
  }

  // ثبت تگ و ارسال به مخزن
  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  // انتشار رسمی در صفحه Releases گیت‌هاب
  try {
    execSync(`gh release create "${tagName}" "${zipPath}" --title "Abner Extension ${tagName} - ${titleEn}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
    console.log(`\n🎉 Release ${tagName} ba movafaghiat dar GitHub sabt va montasher shod!`);
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