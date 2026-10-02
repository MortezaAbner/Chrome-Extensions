const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// متن پیامی که در ترمینال وارد می‌کنید
const customMessage = process.argv.slice(2).join(' ') || 'Update and improvements';
const lowerMsg = customMessage.toLowerCase();

// ۱. خواندن نسخه فعلی
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = manifest.version.split('.').map(Number);
if (isNaN(patch)) patch = 0;

// ۲. افزایش هوشمندانه نسخه بر اساس کلمات کلیدی پیام (Semantic Versioning)
if (lowerMsg.includes('break') || lowerMsg.includes('major') || lowerMsg.includes('rebuild')) {
  major += 1;
  minor = 0;
  patch = 0;
  console.log('🚀 نوع تغییر: MAJOR (تغییرات اساسی و بزرگ)');
} else if (
  lowerMsg.includes('feat') || 
  lowerMsg.includes('add') || 
  lowerMsg.includes('ezafe') || 
  lowerMsg.includes('جدید') || 
  lowerMsg.includes('ویجت') || 
  lowerMsg.includes('pwa')
) {
  minor += 1;
  patch = 0;
  console.log('✨ نوع تغییر: MINOR (افزودن قابلیت یا بخش جدید)');
} else {
  patch += 1;
  console.log('🛠 نوع تغییر: PATCH (اصلاح باگ، استایل یا بهبودهای جزئی)');
}

manifest.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const tagName = `v${manifest.version}`;
const releaseTitle = `Abner Extension ${tagName} - ${customMessage}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

// ۳. ایجاد خودکار index.html برای GitHub Pages جهت رفع خطای 404
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
}

// ۴. ساخت فایل ZIP فشرده
console.log(`📦 در حال ساخت فایل فشرده: ${zipName}...`);
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

const zipCmd = `powershell Compress-Archive -Path ${targetFiles} -DestinationPath ${zipName} -Force`;
execSync(zipCmd, { stdio: 'inherit' });

// ۵. گیت کامیت، ایجاد تگ و پوش کردن
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${customMessage}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "${releaseTitle}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });
  console.log(`\n📌 تگ ${tagName} روی گیت‌هاب ثبت شد.`);

  // ۶. ساخت خودکار Release و پیوست کردن مستقیم فایل ZIP
  try {
    const ghCheck = execSync('gh --version', { stdio: 'pipe' });
    console.log('🚀 در حال انتشار خودکار Release در صفحه گیت‌هاب...');
    const releaseNotes = `### تغییرات نسخه ${tagName}\n- ${customMessage}\n\n*منتشر شده به صورت خودکار توسط اسکریپت انتشار.*`;
    
    execSync(`gh release create "${tagName}" "${zipName}" --title "${releaseTitle}" --notes "${releaseNotes}"`, { stdio: 'inherit' });
    console.log(`\n🎉 تبریک! نسخه ${tagName} به همراه فایل ZIP با موفقیت روی صفحه Releases گیت‌هاب منتشر شد.`);
  } catch (ghErr) {
    console.log('\n⚠️ ابزار gh لاگین نبود یا نصب نیست؛ فایل زیپ محلی آماده است و تگ در گیت‌هاب ثبت شد.');
  }

} catch (err) {
  console.error('خطا در اجرای فرآیند:', err.message);
}