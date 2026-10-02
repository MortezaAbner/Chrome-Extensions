const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۰. دریافت آرگومان‌ها: اولی تایتل انگلیسی، دومی توضیحات فارسی
const titleArg = process.argv[2] || 'Improvements and Fixes';
const notesArg = process.argv[3] || 'بهبود عملکرد و رفع ایرادات جزئی';

// ۱. همگام‌سازی سریع با گیت‌هاب جهت جلوگیری از خطای push
try {
  execSync('git pull --rebase origin main', { stdio: 'pipe' });
} catch (e) {}

// ۲. خواندن و ارتقای هوشمند نسخه بر اساس عنوان انگلیسی
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = manifest.version.split('.').map(Number);
if (isNaN(patch)) patch = 0;

const lowerTitle = titleArg.toLowerCase();
if (lowerTitle.includes('break') || lowerTitle.includes('major') || lowerTitle.includes('rebuild')) {
  major += 1; minor = 0; patch = 0;
} else if (
  lowerTitle.includes('feat') || lowerTitle.includes('add') || 
  lowerTitle.includes('pwa') || lowerTitle.includes('responsive')
) {
  minor += 1; patch = 0;
} else {
  patch += 1;
}

manifest.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const tagName = `v${manifest.version}`;
// تایتل کاملاً تمیز و استاندارد مانند عکس دوم
const releaseTitle = `Abner Extension ${tagName} - ${titleArg}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

// ۳. کپی خودکار index.html برای وب‌اپ و رفع خطای ۴۰۴
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
}

// ۴. ساخت فایل فشرده ZIP
console.log(`📦 Dar hal sakhte: ${zipName}...`);
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

const zipCmd = `powershell Compress-Archive -Path ${targetFiles} -DestinationPath ${zipName} -Force`;
execSync(zipCmd, { stdio: 'inherit' });

// ۵. کامیت، ایجاد تگ و پوش مستقیم به گیت‌هاب
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${titleArg}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "${releaseTitle}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  // ۶. ساخت تمیز Release در گیت‌هاب (متن فارسی در بدنه و تایتل کوتاه در بالا)
  try {
    const fullNotes = `${notesArg}\n\nEnglish: ${titleArg}`;
    // نوشتن متن در فایل موقت برای جلوگیری از به هم ریختگی کاراکترهای فارسی در شل ویندوز
    fs.writeFileSync('temp_release_notes.txt', fullNotes, 'utf8');
    
    execSync(`gh release create "${tagName}" "${zipName}" --title "${releaseTitle}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
    
    if (fs.existsSync('temp_release_notes.txt')) {
      fs.unlinkSync('temp_release_notes.txt');
    }
    console.log(`\n🎉 Release ${tagName} ba movafaghiat va zaher moratab montasher shod!`);
  } catch (ghErr) {
    console.log('\n⚠️ Release ba gh sakhte nashod. (Check konid gh auth login bashe).');
  }

} catch (err) {
  console.error('Khata:', err.message);
}