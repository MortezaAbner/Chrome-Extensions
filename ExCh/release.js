const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۱. همگام‌سازی خودکار newtab با index.html برای نمایش آنلاین
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html dar index.html copy shod.');
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
console.log(`🚀 Version khodkar afzayesh yaft: v${newVersion}`);

const tagName = `v${newVersion}`;

// دریافت متن توضیحات ورودی از ترمینال (یا استفاده از مقدار پیش‌فرض)
const customMessage = process.argv[2] || `Update to ${tagName}`;

// ۳. ساخت پوشه dist برای ذخیره تمیز فایل‌های زیپ
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const zipPath = `${distDir}/Chrome-Extension-${tagName}.zip`;
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

console.log(`📦 Dar hal sakhte archive: ${zipPath}...`);
try {
  execSync(`powershell Compress-Archive -Path ${targetFiles} -DestinationPath "${zipPath}" -Force`, { stdio: 'inherit' });
} catch (e) {}

// ۴. ساختار یادداشت‌های دوزبانه (فارسی و انگلیسی) برای گیت‌هاب ریلیز
const releaseNotes = `
### 🇮🇷 توضیحات فارسی:
- ${customMessage}
- تثبیت کامل ساختار افزونه دسکتاپ و پاپ‌آپ‌های محلی
- همگام‌سازی ریشه مخزن با جدیدترین تغییرات داشبورد شیشه‌ای

---

### 🇬🇧 English Release Notes:
- ${customMessage}
- Fully stabilized desktop extension architecture and local context popups
- Synchronized repository root with the latest glassmorphic dashboard build
`;

fs.writeFileSync('temp_release_notes.txt', releaseNotes.trim(), 'utf8');

// ۵. کامیت، تگ، پوش و انتشار خودکار در گیت‌هاب
try {
  try {
    execSync('git rm -r --cached ExCh', { stdio: 'pipe' });
  } catch (e) {}

  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${customMessage}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  try {
    execSync(`gh release create "${tagName}" "${zipPath}" --title "Abner Extension ${tagName}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
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