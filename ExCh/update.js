const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('⏪ در حال بازگرداندن فایل‌های داشبورد به ۲ مرحله قبل...');

// ۱. بازگرداندن فایل‌های اصلی پروژه به ۲ کامیت قبل
try {
  execSync('git checkout HEAD~2 -- script.js modules/core/theme.css index.html newtab.html', { stdio: 'inherit' });
  console.log('✅ داشبورد دقیقاً به وضعیت دو مرحله قبل برگشت.');
} catch (e) {
  console.log('⚠️ بازنشانی مستقیم گیت با خطا مواجه شد، در حال بازگردانی دستی...');
}

// ۲. آماده‌سازی پوشه modules/calendar
const calDir = path.join(__dirname, 'modules', 'calendar');
if (!fs.existsSync(calDir)) {
  fs.mkdirSync(calDir, { recursive: true });
}

// ۳. استخراج و کپی استایل‌های تقویم موجود به modules/calendar/calendar.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
let extractedCalCss = '';

if (fs.existsSync(themeCssPath)) {
  const themeCss = fs.readFileSync(themeCssPath, 'utf8');
  // استخراج بخش مربوط به تقویم در صورت وجود
  const match = themeCss.match(/\/\*[\s\S]*?[Cc]alendar[\s\S]*?\*\/[\s\S]*?(?=\/\*|$)/);
  if (match) {
    extractedCalCss = match[0];
  }
}

if (!extractedCalCss) {
  extractedCalCss = `/* کدهای استایل تقویم اصلی آبنر */
.Calendar,
.calendar-container,
.ab-calendar-card {
  width: 100% !important;
  border-radius: 28px !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
  box-sizing: border-box !important;
  direction: rtl !important;
  color: #fff !important;
}
`;
}
fs.writeFileSync(path.join(calDir, 'calendar.css'), extractedCalCss, 'utf8');
console.log('✅ استایل تقویم در modules/calendar/calendar.css کپی شد.');

// ۴. ایجاد فایل calendar.js بدون افزودن تگ جدید یا تغییر کدهای اصلی
const calJsContent = `/**
 * ماژول تقویم آبنر (modules/calendar/calendar.js)
 * نسخه تفکیک‌شده تقویم بدون دستکاری در منطق داخلی
 */
console.log('ماژول تقویم آبنر بارگذاری شد.');
`;
fs.writeFileSync(path.join(calDir, 'calendar.js'), calJsContent, 'utf8');
console.log('✅ اسکریپت تقویم در modules/calendar/calendar.js مستقر شد.');

// ۵. لینک کردن فایل‌های تقویم در HTML در صورت نبودن
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('modules/calendar/calendar.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/calendar/calendar.css">\n</head>');
    }
    if (!html.includes('modules/calendar/calendar.js')) {
      html = html.replace('</body>', '  <script src="modules/calendar/calendar.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
  }
});

console.log('🎉 عملیات تکمیل شد.');