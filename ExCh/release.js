const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۱. همگام‌سازی مستقیم newtab به index برای خوانش آنلاین
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html dar index.html copy shod.');
}

// ۲. افزایش خودکار شماره نسخه
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

// ۳. ایجاد پوشه مجزای dist برای آرشیوها
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const zipPath = `${distDir}/Chrome-Extension-${tagName}.zip`;
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

console.log(`📦 Sakhte archive dar dist: ${zipPath}...`);
try {
  execSync(`powershell Compress-Archive -Path ${targetFiles} -DestinationPath "${zipPath}" -Force`, { stdio: 'inherit' });
} catch (e) {}

// ۴. ایجاد یادداشت‌های دوزبانه ریلیز
const releaseNotes = `
### 🇮🇷 تغییرات نسخه ${tagName}:
- پاک‌سازی پوشه اضافه ExCh و انتقال فایل‌های نهایی به ریشه مخزن
- همگام‌سازی کامل index.html با طراحی جدید نیوتب
- نگهداری منظم فایل‌های فشرده درون پوشه dist
- تثبیت چیدمان تسک‌ها و پنجره‌های محلی ابزارها

---

### 🇬🇧 Release Notes (${tagName}):
- Cleaned up redundant ExCh directory and synced latest assets directly to repository root
- Synchronized index.html with latest dashboard layout
- Isolated build zip archives into dedicated dist directory
- Stabilized task card layout and local tool popups
`;

fs.writeFileSync('temp_release_notes.txt', releaseNotes.trim(), 'utf8');

// ۵. کامیت، حذف پوشه تکراری از گیت و پوش تغییرات
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