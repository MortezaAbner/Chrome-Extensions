const fs = require('fs');
const { execSync } = require('child_process');

const manifestPath = './manifest.json';

if (!fs.existsSync(manifestPath)) {
  console.error('❌ فایل manifest.json پیدا نشد!');
  process.exit(1);
}

// ۱. افزایش شماره ورژن
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const versionParts = manifest.version.split('.').map(Number);
versionParts[versionParts.length - 1] += 1;
manifest.version = versionParts.join('.');

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
const tagName = `v${manifest.version}`;
console.log(`🚀 شماره نسخه به ${manifest.version} تغییر یافت.`);

// ۲. تعیین متن کامیت و توضیحات نسخه
const customMessage = process.argv.slice(2).join(' ');
const releaseNotes = customMessage || `انتشار خودکار نسخه ${tagName}`;

try {
  // مرحله گیت: افزودن فایل‌ها و کامیت
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${releaseNotes}"`, { stdio: 'inherit' });

  // ساخت برچسب رسمی نسخه (Git Tag)
  console.log(`🏷️ در حال ثبت تگ نسخه: ${tagName}`);
  execSync(`git tag -a ${tagName} -m "${releaseNotes}"`, { stdio: 'inherit' });

  // ارسال کدها و تگ به گیت‌هاب
  console.log('🚀 در حال ارسال به گیت‌هاب...');
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  console.log(`\n🎉 نسخه رسمی ${tagName} با موفقیت در گیت‌هاب ثبت و تگ شد!`);
} catch (error) {
  console.error('❌ خطا در عملیات گیت:', error.message);
}