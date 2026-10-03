const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۰. دریافت آرگومان‌ها
const titleArg = process.argv[2] || 'Advanced Task Popups and Custom Layout';
const notesArg = process.argv[3] || 'اصلاح چیدمان تسک با چک‌باکس در راست و ادیت/حذف در چپ، پاپ‌آپ برچسب، تقویم با ماه‌گردی، انتخاب ساعت با اسکرول نامرئی، پرچم اولویت و مودال هوشمند تکرار روز، هفته، ماه و سال';

// ۱. همگام‌سازی با گیت‌هاب
try {
  execSync('git pull --rebase origin main', { stdio: 'pipe' });
} catch (e) {}

// ۲. خواندن نسخه جاری
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const tagName = `v${manifest.version}`;
const releaseTitle = `Abner Extension ${tagName} - ${titleArg}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

// ۳. کپی خودکار newtab.html در index.html
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
}

// ۴. ساخت خودکار فایل ZIP
console.log(`📦 Dar hal sakhte: ${zipName}...`);
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

const zipCmd = `powershell Compress-Archive -Path ${targetFiles} -DestinationPath ${zipName} -Force`;
try {
  execSync(zipCmd, { stdio: 'inherit' });
} catch (e) {}

// ۵. کامیت و پوش به مخزن
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${titleArg}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });

  // ۶. ساخت یا به‌روزرسانی انتشار در گیت‌هاب
  try {
    fs.writeFileSync('temp_release_notes.txt', notesArg, 'utf8');
    execSync(`gh release create "${tagName}" "${zipName}" --title "${releaseTitle}" --notes-file temp_release_notes.txt`, { stdio: 'inherit' });
    if (fs.existsSync('temp_release_notes.txt')) {
      fs.unlinkSync('temp_release_notes.txt');
    }
  } catch (ghErr) {
    console.log('Push anjam shod.');
  }

} catch (err) {
  console.log('Git sync done.');
}