const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۰. دریافت آرگومان‌ها: اولی عنوان کوتاه انگلیسی، دومی توضیحات فارسی بدنه
const titleArg = process.argv[2] || 'Improvements and Fixes';
const notesArg = process.argv[3] || 'بهبود عملکرد و به‌‌روزرسانی بخش‌ها';

// ۱. دریافت آخرین تغییرات آنلاین گیت‌هاب جهت جلوگیری از خطای push
try {
  execSync('git pull --rebase origin main', { stdio: 'pipe' });
} catch (e) {}

// ۲. ارتقای هوشمند نسخه بر اساس کلیدواژه‌های پیام انگلیسی
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = manifest.version.split('.').map(Number);
if (isNaN(patch)) patch = 0;

const lowerTitle = titleArg.toLowerCase();
if (lowerTitle.includes('break') || lowerTitle.includes('major') || lowerTitle.includes('rebuild')) {
  major += 1; minor = 0; patch = 0;
} else if (
  lowerTitle.includes('feat') || lowerTitle.includes('add') || 
  lowerTitle.includes('pwa') || lowerTitle.includes('layout') ||
  lowerTitle.includes('dock') || lowerTitle.includes('system')
) {
  minor += 1; patch = 0;
} else {
  patch += 1;
}

manifest.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const tagName = `v${manifest.version}`;
const releaseTitle = `Abner Extension ${tagName} - ${titleArg}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

// ۳. کپی خودکار newtab.html درون index.html برای وب‌اپ گیت‌هاب پیجز
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
}

// ۴. ساخت خودکار فایل فشرده ZIP
console.log(`📦 Dar hal sakhte: ${zipName}...`);
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

const zipCmd = `powershell Compress-Archive -Path ${targetFiles} -DestinationPath ${zipName} -Force`;
try {
  execSync(zipCmd, { stdio: 'inherit' });
} catch (e) {}

// ۵. کامیت، ایجاد تگ و پوش به مخزن
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${titleArg}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "${releaseTitle}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  // ۶. ثبت ریلیز رسمی در گیت‌هاب همراه با فایل زیپ
  try {
    fs.writeFileSync('temp_release_notes.txt', notesArg, 'utf8');
    execSync(`gh release create "${tagName}" "${zipName}" --title "${releaseTitle}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
    if (fs.existsSync('temp_release_notes.txt')) {
      fs.unlinkSync('temp_release_notes.txt');
    }
    console.log(`\n🎉 Release ${tagName} ba movafaghiat montasher shod!`);
  } catch (ghErr) {
    console.log('\n⚠️ Release ba gh sakhte nashod (push be git anjam shod).');
  }

} catch (err) {
  console.error('Khata dar sync git:', err.message);
}