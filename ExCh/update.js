const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 در حال پاک‌سازی کامل کدهای تزریقی و بازگرداندن داشبورد به حالت پایدار...');

// ۱. حذف کامل اسکریپت‌ها و لینک‌های ماژول‌های تکراری از فایلهای HTML
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // حذف تمامی ایمپورت‌های ماژول‌های تسک، تقویم و آب و هوا
    html = html.replace(/\s*<link rel="stylesheet" href="modules\/(todo|calendar|weather)\/[^"]+">\s*/g, '\n');
    html = html.replace(/\s*<script src="modules\/(todo|calendar|weather)\/[^"]+"><\/script>\s*/g, '\n');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ پاک‌سازی لینک‌ها از ${filePath}`);
  }
});

// ۲. خالی کردن محتوای پوشه‌های ماژول‌های تداخلی
['todo', 'calendar', 'weather'].forEach(dir => {
  const p = path.join(__dirname, 'modules', dir);
  if (fs.existsSync(p)) {
    fs.readdirSync(p).forEach(file => {
      fs.writeFileSync(path.join(p, file), '', 'utf8');
    });
  }
});

// ۳. بازنشانی تمیز script.js و theme.css از آخرین کامیت پایدار
try {
  execSync('git checkout HEAD -- script.js modules/core/theme.css', { stdio: 'ignore' });
  console.log('✅ بازنشانی فایل‌های هسته با موفقیت انجام شد.');
} catch (e) {
  // در صورت نیاز به پاک‌سازی دستی
  const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
  if (fs.existsSync(themeCssPath)) {
    let themeCss = fs.readFileSync(themeCssPath, 'utf8');
    themeCss = themeCss.replace(/\/\* ========================================================[\s\S]*$/g, '');
    fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  }
}

console.log('✨ تمام المان‌های اضافه و تزریقی حذف شدند.');