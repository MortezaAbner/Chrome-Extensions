const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';
if (!fs.existsSync(manifestPath)) {
  console.error('File manifest.json peyda nashod!');
  process.exit(1);
}

// ۰. همگام‌سازی سریع با گیت‌هاب
try {
  execSync('git pull --rebase origin main', { stdio: 'pipe' });
} catch (e) {}

const customMessage = process.argv.slice(2).join(' ') || 'Update and improvements';
const lowerMsg = customMessage.toLowerCase();

// ۱. خواندن و ارتقای هوشمندانه نسخه
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let [major, minor, patch] = manifest.version.split('.').map(Number);
if (isNaN(patch)) patch = 0;

if (lowerMsg.includes('break') || lowerMsg.includes('major') || lowerMsg.includes('rebuild')) {
  major += 1; minor = 0; patch = 0;
} else if (
  lowerMsg.includes('feat') || lowerMsg.includes('add') || 
  lowerMsg.includes('ezafe') || lowerMsg.includes('جدید') || 
  lowerMsg.includes('ویجت') || lowerMsg.includes('pwa')
) {
  minor += 1; patch = 0;
} else {
  patch += 1;
}

manifest.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const tagName = `v${manifest.version}`;
const releaseTitle = `Abner Extension ${tagName} - ${customMessage}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

// ۲. ساخت index.html برای وب‌اپ
if (fs.existsSync('./newtab.html')) {
  fs.copyFileSync('./newtab.html', './index.html');
}

// ۳. ساخت فایل فشرده ZIP
console.log(`📦 Dar hal sakhte file ZIP: ${zipName}...`);
const targetFiles = ['manifest.json', 'newtab.html', 'index.html', 'style.css', 'script.js', 'app.webmanifest', 'sw.js']
  .filter(f => fs.existsSync(f))
  .join(', ');

const zipCmd = `powershell Compress-Archive -Path ${targetFiles} -DestinationPath ${zipName} -Force`;
execSync(zipCmd, { stdio: 'inherit' });

// ۴. ثبت در گیت و ارسال
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${customMessage}"`, { stdio: 'inherit' });
  execSync(`git tag -a ${tagName} -m "${releaseTitle}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });
  console.log(`\n📌 Tag ${tagName} sabt shod.`);

  // ۵. انتشار رسمی در Releases گیت‌هاب
  try {
    console.log('🚀 Dar hal enteshare Release dar GitHub...');
    const notes = `تغییرات این نسخه:\n- ${customMessage}\n\nنصب آسان به عنوان افزونه یا اجرای تحت وب (PWA).`;
    execSync(`gh release create "${tagName}" "${zipName}" --title "${releaseTitle}" --notes "${notes}"`, { stdio: 'inherit' });
    console.log(`\n🎉 Release ${tagName} be hamrahe file ZIP montasher shod!`);
  } catch (ghErr) {
    console.log('\n⚠️ Dastoor gh release ejra nashod (Lotfan gh auth login ra check konid).');
  }

} catch (err) {
  console.error('Khata:', err.message);
}