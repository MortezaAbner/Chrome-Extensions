const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۱. همگام‌سازی newtab در index.html برای وب‌اپ آنلاین
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html dar index.html copy shod.');
}

// ۲. افزایش نسخه پچ
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

// ۳. پوشه مجزای dist برای زیپ
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

// ۴. یادداشت دوزبانه ریلیز
const releaseNotes = `
### 🇮🇷 تغییرات نسخه ${tagName}:
- بازگردانی کامل پایداری نسخه 1.29.0 همراه با تمام امکانات داشبورد
- اتصال کامل پاپ‌آپ‌های محلی تکرار، سررسید، ساعت، برچسب‌ها و اولویت در مودال ویرایش
- قفل دائمی چیدمان تسک با چک‌باکس در سمت راست و دکمه‌های ادیت/حذف در سمت چپ
- ساختار هماهنگ PWA وب‌اپلیکیشن برای استفاده در موبایل

---

### 🇬🇧 Release Notes (${tagName}):
- Fully restored v1.29.0 stability alongside complete dashboard feature-set
- Integrated localized contextual popups inside the task editing modal
- Permanently locked task card layout with right-aligned checkbox and left-aligned actions
- Synchronized PWA webapp architecture for mobile browsers
`;

fs.writeFileSync('temp_release_notes.txt', releaseNotes.trim(), 'utf8');

// ۵. پاک‌سازی پوشه تکراری ExCh از ریشه گیت و پوش تمیز
try {
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