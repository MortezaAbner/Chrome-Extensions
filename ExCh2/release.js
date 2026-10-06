const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// دریافت متن پیام از ترمینال یا استفاده از متن پیش‌فرض
const commitMsg = process.argv[2] || "Align Task Bottom Border Tangent to Calendar";
const manifestPath = path.join(__dirname, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error("❌ خطا: فایل manifest.json یافت نشد!");
  process.exit(1);
}

// ۱. خواندن و افزایش خودکار شماره نسخه (Semantic Versioning)
const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const currentVer = manifestData.version || "1.0.0";
const parts = currentVer.split('.');
parts[parts.length - 1] = parseInt(parts[parts.length - 1], 10) + 1;
const newVer = parts.join('.');
const tagName = `v${newVer}`;
const zipName = `Chrome-Extension-${tagName}.zip`;

console.log(`🚀 ارتقای خودکار نسخه: از ${currentVer} به ${newVer}`);

// ثبت نسخه جدید در manifest.json
manifestData.version = newVer;
fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');

// ۲. پاکسازی فایل‌های زیپ قبلی
const files = fs.readdirSync(__dirname);
files.forEach(file => {
  if (file.startsWith('Chrome-Extension-') && file.endsWith('.zip')) {
    fs.unlinkSync(path.join(__dirname, file));
    console.log(`🗑️ حذف زیپ قدیمی: ${file}`);
  }
});

// ۳. ساخت فایل زیپ جدید با پاورشل داخلی ویندوز
console.log(`📦 در حال ساخت پکیج جدید: ${zipName}...`);
const zipCommand = `powershell -Command "Compress-Archive -Path (Get-ChildItem -Exclude '*.git*', '*.zip', 'release.js', 'release.sh', 'release.ps1') -DestinationPath '${zipName}' -Force"`;
execSync(zipCommand, { stdio: 'inherit' });

// ۴. ثبت کامیت و اعمال تگ در گیت
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): ${tagName} - ${commitMsg}"`, { stdio: 'inherit' });
  execSync(`git tag -fa ${tagName} -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync('git push origin main --tags', { stdio: 'inherit' });
} catch (e) {
  console.log("⚠️ اخطار در گیت (ممکن است تغییری برای کامیت نباشد یا تگ از قبل وجود داشته باشد).");
}

// ۵. متن انتشار ریلیز با پرچم ایران و پرچم آمریکا
const releaseTitle = `Abner Extension ${tagName} - ${commitMsg}`;
const releaseNotes = `### 🇮🇷 تغییرات نسخه ${tagName}:

* ${commitMsg}
* امتداد دقیق کادر تسک تا لبه زیرین تقویم با حفظ کامل ظاهر تب‌ها و چیدمان داخلی
* مات‌تر و خواناتر شدن استایل شیشه‌ای المان‌ها، پنجره‌های پیش‌بینی، اوقات شرعی و تایمر
* هماهنگی چیدمان سایدبار و تقویم با قالب شیشه‌ای آبنر
* بسته‌شدن خودکار و هوشمند منوها و کشوها

---

### 🇺🇸 Release Notes (${tagName}):

* ${commitMsg}
* Aligned task card bottom edge tangent to the calendar component
* Enhanced frosted glass blur and opacity for forecast, prayer times, and timer drawers
* Fully modular UI synchronized with Abner glass engine
* Intelligent drawer dismissals and general performance improvements`;

fs.writeFileSync('release_notes.txt', releaseNotes, 'utf8');

// ۶. انتشار مستقیم در گیت‌هاب با ابزار gh
try {
  execSync(`gh release create ${tagName} "${zipName}" --title "${releaseTitle}" --notes-file release_notes.txt`, { stdio: 'inherit' });
  console.log(`✅ نسخه ${tagName} با موفقیت در گیت‌هاب منتشر شد!`);
} catch (err) {
  console.log(`⚠️ پکیج ${zipName} ساخته شد و تگ گیت ثبت گردید (برای انتشار آنلاین، ابزار gh باید لاگین باشد).`);
}

// پاکسازی فایل یادداشت موقت
if (fs.existsSync('release_notes.txt')) {
  fs.unlinkSync('release_notes.txt');
}