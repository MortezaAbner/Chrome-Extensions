const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// تنظیم پشتیبانی ترمینال از انکودینگ UTF-8
try {
  execSync('chcp 65001', { stdio: 'ignore' });
} catch (e) {}

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۱. همگام‌سازی تضمینی newtab.html با index.html
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html ba movafaghiat dar index.html copy shod.');
}

// ۲. افزایش خودکار شماره نسخه پچ
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = (manifest.version || '1.0.0').split('.').map(Number);
if (isNaN(major)) major = 1;
if (isNaN(minor)) minor = 0;
if (isNaN(patch)) patch = 0;

patch += 1;
const newVersion = `${major}.${minor}.${patch}`;
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`🚀 Version khodkar afzayesh yaft be: v${newVersion}`);

const tagName = `v${newVersion}`;

// دریافت توضیحات ورودی انگلیسی و فارسی از دستور ترمینال
const titleEn = process.argv[2] || `Release ${tagName}`;
const descFa = process.argv[3] || 'به‌روزرسانی استایل‌ها و ابزارهای داشبورد';

// ۳. مدیریت پوشه dist: پاک‌سازی تمام زیپ‌های قدیمی و نگه‌داری تنها فایل نسخه جدید
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

console.log(`📦 Sakhte archive jadid: ${zipPath}...`);
try {
  execSync(`powershell Compress-Archive -Path ${targetFiles} -DestinationPath "${zipPath}" -Force`, { stdio: 'inherit' });
} catch (e) {}

// ۴. ایجاد یادداشت دوزبانه استاندارد مطابق قالب گیت‌هاب
const releaseNotes = `
### 🇮🇷 تغییرات نسخه ${tagName}:
- ${descFa}
- اصلاح استایل شیشه‌ای کپسول‌ها و پس‌زمینه شفاف پیش‌‌بینی ۵ روزه
- اتصال کامل موقعیت‌یابی زنده GPS، آی‌پی و جستجوی Open-Meteo
- افزودن قابلیت اسکرول چرخ ماوس به فیلدهای ساعت، دقیقه و ثانیه تایمر
- بسته شدن خودکار دراورها هنگام اسکرول یا کلیک بیرونی

---

### 🇬🇧 Release Notes (${tagName}):
- ${titleEn}
- Unified frosted glass aesthetic across light/dark modes for footer pills
- Live GPS geocoding, IP lookup, and Enter-key triggered city search enabled
- Added mouse-wheel increment/decrement for timer hours, minutes, and seconds
- Implemented backdrop dismissal and mutual drawer closure on click or scroll
`;

fs.writeFileSync('temp_release_notes.txt', releaseNotes.trim(), 'utf8');

// ۵. کامیت تغییرات، همگام‌سازی امن و ارسال به گیت‌هاب
try {
  // اگر پوشه اضافه در گیت وجود داشته باشد از کش خارج می‌شود
  try {
    execSync('git rm -r --cached ExCh', { stdio: 'ignore' });
  } catch (e) {}

  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${titleEn}"`, { stdio: 'inherit' });

  // همگام‌سازی شاخه پس از کامیت فایل‌ها جهت جلوگیری از ارور unstaged changes
  try {
    execSync('git pull origin main --rebase', { stdio: 'inherit' });
  } catch (e) {
    console.log('Sync anjam shod.');
  }

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