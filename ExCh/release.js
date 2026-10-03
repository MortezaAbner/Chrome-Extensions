const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۱. کپی خودکار و قطعی newtab.html در index.html قبل از هر کاری
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
  console.log('✅ newtab.html ba movafaghiat dar index.html copy shod.');
}

// ۲. دریافت آرگومان‌ها: اولی عنوان انگلیسی، دومی متن توضیحات فارسی
const titleArg = process.argv[2] || 'Auto Update and Improvements';
const notesArg = process.argv[3] || 'به‌روزرسانی خودکار و اعمال تغییرات جدید';

// ۳. دریافت آخرین تغییرات آنلاین گیت‌هاب جهت جلوگیری از خطای push
try {
  execSync('git pull --rebase origin main', { stdio: 'pipe' });
} catch (e) {}

// ۴. افزایش خودکار و هوشمند ورژن در manifest.json
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = (manifest.version || '1.0.0').split('.').map(Number);
if (isNaN(major)) major = 1;
if (isNaN(minor)) minor = 0;
if (isNaN(patch)) patch = 0;

const lowerTitle = titleArg.toLowerCase();
if (lowerTitle.includes('break') || lowerTitle.includes('major') || lowerTitle.includes('rebuild')) {
  major += 1;
  minor = 0;
  patch = 0;
} else if (
  lowerTitle.includes('feat') || lowerTitle.includes('add') || 
  lowerTitle.includes('pwa') || lowerTitle.includes('layout') ||
  lowerTitle.includes('dock') || lowerTitle.includes('system') ||
  lowerTitle.includes('popup')
) {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}

const newVersion = `${major}.${minor}.${patch}`;
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`🚀 Version be tor khodkar ertegha yaft be: v${newVersion}`);

const tagName = `v${newVersion}`;
const releaseTitle = `Abner Extension ${tagName} - ${titleArg}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

// ۵. ساخت فایل فشرده ZIP برای اکستنشن
console.log(`📦 Dar hal sakhte: ${zipName}...`);
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

const zipCmd = `powershell Compress-Archive -Path ${targetFiles} -DestinationPath ${zipName} -Force`;
try {
  execSync(zipCmd, { stdio: 'inherit' });
} catch (e) {}

// ۶. کامیت، ایجاد تگ و پوش نهایی به گیت‌هاب
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${titleArg}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "${releaseTitle}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  // ۷. انتشار ریلیز در گیت‌هاب همراه با فایل زیپ
  try {
    fs.writeFileSync('temp_release_notes.txt', notesArg, 'utf8');
    execSync(`gh release create "${tagName}" "${zipName}" --title "${releaseTitle}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
    if (fs.existsSync('temp_release_notes.txt')) {
      fs.unlinkSync('temp_release_notes.txt');
    }
    console.log(`\n🎉 Release ${tagName} ba movafaghiat montasher shod!`);
  } catch (ghErr) {
    console.log('\n⚠️ Release ba gh sakhte nashod (vali push be git anjam shod).');
  }

} catch (err) {
  console.error('Khata dar sync git:', err.message);
}