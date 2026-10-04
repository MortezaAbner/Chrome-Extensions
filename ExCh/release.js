const fs = require('fs');
const { execSync } = require('child_process');

// تنظیم پشتیبانی ترمینال از فونت فارسی و یونیکد
try {
  execSync('chcp 65001', { stdio: 'ignore' });
} catch (e) {}

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۱. دریافت آخرین تغییرات سرور برای جلوگیری از خطای rejected
console.log('🔄 Dar hal daryaft akharin taghirat az GitHub...');
try {
  execSync('git pull origin main --rebase', { stdio: 'inherit' });
} catch (e) {
  console.log('Rebase skip shod ya niaz nabood.');
}

// ۲. همگام‌سازی newtab در index.html برای وب‌‌اپ آنلاین
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html dar index.html copy shod.');
}

// ۳. ارتقای خودکار نسخه پچ
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = (manifest.version || '1.0.0').split('.').map(Number);
if (isNaN(major)) major = 1;
if (isNaN(minor)) minor = 0;
if (isNaN(patch)) patch = 0;

patch += 1;
const newVersion = `${major}.${minor}.${patch}`;
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`🚀 Version khodkar afzayesh yaft: v${newVersion}`);

const tagName = `v${newVersion}`;
const customTitle = process.argv[2] || `Release ${tagName}`;

// ۴. ایجاد پوشه dist برای ذخیره فایل‌های فشرده
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const zipPath = `${distDir}/Chrome-Extension-${tagName}.zip`;
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

console.log(`📦 Sakhte archive dar dist: ${zipPath}...`);
try {
  execSync(`powershell Compress-Archive -Path ${targetFiles} -DestinationPath "${zipPath}" -Force`, { stdio: 'inherit' });
} catch (e) {}

// ۵. ساخت فایل یادداشت دوزبانه
const releaseNotes = `
### 🇮🇷 توضیحات و تغییرات نسخه ${tagName}:
- هماهنگ‌سازی کپسول‌های آب‌وهوا و ساعت در تم روز و شب با پس‌زمینه شیشه‌ای مات
- فعال‌سازی دریافت موقعیت زنده دستگاه، آی‌پی و جستجوی شهر با کلید اینتر
- شفاف‌سازی پیش‌زمینه پیش‌بینی ۵ روزه، اوقات شرعی و تایمر
- افزودن قابلیت اسکرول چرخ ماوس برای تغییر مقادیر ثانیه، دقیقه و ساعت تایمر
- حل مشکل بسته نشدن خودکار دراورها هنگام اسکرول یا کلیک در فضای خالی

---

### 🇬🇧 English Release Notes (${tagName}):
- Synchronized weather and clock footer pill buttons with unified glass aesthetics
- Enabled device GPS, IP geolocation, and Enter-key triggered city search
- Translucent frosted glass redesign for 5-day forecast, prayer times, and timer drawers
- Added mouse-wheel increment and decrement support for timer units
- Implemented backdrop dismissal and mutual drawer closure on click or scroll
`;

fs.writeFileSync('temp_release_notes.txt', releaseNotes.trim(), 'utf8');

// ۶. اضافه کردن فایل‌ها، کامیت و پوش بدون ایجاد خطای رد شدن
try {
  // خارج کردن پوشه تو در تو در صورت وجود
  try {
    execSync('git rm -r --cached ExCh', { stdio: 'pipe' });
  } catch (e) {}

  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${customTitle}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  try {
    execSync(`gh release create "${tagName}" "${zipPath}" --title "Abner Extension ${tagName} - ${customTitle}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
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