const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۱. همگام‌سازی تضمینی newtab.html در index.html برای وب‌اپ گیت‌هاب پیجز
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html ba movafaghiat dar index.html copy shod.');
}

const titleArg = process.argv[2] || 'PWA Support and Full WebApp Synchronization';
const notesArg = process.argv[3] || 'فعال‌سازی استاندارد PWA وب‌اپ، اصلاح مانیفست و سرویس‌ورکر برای نصب روی موبایل و دسکتاپ';

// ۲. دریافت آخرین تغییرات آنلاین گیت‌هاب
try {
  execSync('git pull --rebase origin main', { stdio: 'pipe' });
} catch (e) {}

// ۳. ارتقای هوشمند نسخه
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = (manifest.version || '1.0.0').split('.').map(Number);
if (isNaN(major)) major = 1;
if (isNaN(minor)) minor = 0;
if (isNaN(patch)) patch = 0;

patch += 1;
const newVersion = `${major}.${minor}.${patch}`;
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`🚀 Version ertegha yaft be: v${newVersion}`);

const tagName = `v${newVersion}`;
const releaseTitle = `Abner Extension ${tagName} - ${titleArg}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

// ۴. فشرده‌سازی فایل‌های افزونه
console.log(`📦 Dar hal sakhte: ${zipName}...`);
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

const zipCmd = `powershell Compress-Archive -Path ${targetFiles} -DestinationPath ${zipName} -Force`;
try {
  execSync(zipCmd, { stdio: 'inherit' });
} catch (e) {}

// ۵. کامیت و پوش به گیت‌هاب
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${titleArg}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "${releaseTitle}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  try {
    fs.writeFileSync('temp_release_notes.txt', notesArg, 'utf8');
    execSync(`gh release create "${tagName}" "${zipName}" --title "${releaseTitle}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
    if (fs.existsSync('temp_release_notes.txt')) {
      fs.unlinkSync('temp_release_notes.txt');
    }
    console.log(`\n🎉 Release ${tagName} montasher shod!`);
  } catch (ghErr) {}
} catch (err) {
  console.error('Khata dar sync git:', err.message);
}