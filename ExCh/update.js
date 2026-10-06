const fs = require('fs');
const path = require('path');

console.log('🧹 در حال حذف ویجت‌های مزاحم بالای صفحه و تفکیک کدهای خودِ داشبورد...');

// ۱. حذف تگ‌های تزریقی اضافه از فایل‌های HTML
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // حذف کامل تگ‌های ساختگی قبلی
    html = html.replace(/\s*<link rel="stylesheet" href="modules\/datetime\/datetime\.css">\s*/g, '\n');
    html = html.replace(/\s*<script src="modules\/datetime\/datetime\.js"><\/script>\s*/g, '\n');
    html = html.replace(/\s*<link rel="stylesheet" href="modules\/weather\/weather\.css">\s*/g, '\n');
    html = html.replace(/\s*<script src="modules\/weather\/weather\.js"><\/script>\s*/g, '\n');

    // اتصال استاندارد ماژول‌های تمیز
    if (!html.includes('modules/weather/weather.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/weather/weather.css">\n</head>');
    }
    if (!html.includes('modules/weather/weather.js')) {
      html = html.replace('</body>', '  <script src="modules/weather/weather.js"></script>\n</body>');
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 پیوندهای اضافی از ${filePath} پاک شدند.`);
  }
});

// ۲. حذف المان ساختگی با آی‌دی‌های متفرقه از DOM
const weatherDir = path.join(__dirname, 'modules', 'weather');
if (!fs.existsSync(weatherDir)) fs.mkdirSync(weatherDir, { recursive: true });

// خالی کردن datetime ساختگی
const dtDir = path.join(__dirname, 'modules', 'datetime');
if (fs.existsSync(dtDir)) {
  fs.writeFileSync(path.join(dtDir, 'datetime.js'), '// ماژول تاریخ یکپارچه در weather.js قرار گرفت\n', 'utf8');
  fs.writeFileSync(path.join(dtDir, 'datetime.css'), '/* استایل در weather.css یکپارچه شد */\n', 'utf8');
}

// ۳. نوشتن کدهای تفکیک‌شده خودِ داشبورد در modules/weather/weather.css
const weatherModuleCss = `
/* ========================================================
   استایل‌های تفکیک‌شده دو ویجت تاریخ سه‌جانبه و آب‌وهوای اصلی آبنر
======================================================== */

/* حذف هرگونه ویجت متفرقه که در مرکز یا بالای صفحه ایجاد شده بود */
#abner-datetime-widget,
#abner-weather-widget,
.top-weather-box {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
}

/* استایل شیشه‌ای دو کارت تاریخ سه‌جانبه و آب‌وهوا در بالای تقویم */
.right-column > div:first-child,
.right-column > div:nth-child(2),
.weather-section,
.datetime-section {
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  background: var(--dash-glass-bg, rgba(20, 24, 35, 0.50)) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  border-radius: 24px !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
  transition: all 0.2s ease !important;
}

/* استایل دکمه‌های کپسولی پایین این دو کارت (اوقات شرعی، تایمر، پیش‌بینی، شهر) */
.right-column button,
.weather-section button,
.datetime-section button {
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.16) !important;
  border: 1px solid rgba(255, 255, 255, 0.22) !important;
  color: #fff !important;
  font-family: inherit !important;
  backdrop-filter: blur(8px) !important;
  transition: background 0.2s ease !important;
}

.right-column button:hover,
.weather-section button:hover,
.datetime-section button:hover {
  background: rgba(255, 255, 255, 0.28) !important;
}
`;
fs.writeFileSync(path.join(weatherDir, 'weather.css'), weatherModuleCss, 'utf8');

// ۴. اسکریپت تمیزکاری و مدیریت این دو ویجت در modules/weather/weather.js
const weatherModuleJs = `
/**
 * مدیریت کدهای تفکیک‌شده ویجت‌های آب‌وهوا و تاریخ سه‌جانبه آبنر
 */
(function cleanupAndManageWidgets() {
  function cleanup() {
    // حذف قطعی هرگونه المان تزریقی که در وسط بالای صفحه ساخته شده بود
    document.querySelectorAll('#abner-datetime-widget, #abner-weather-widget').forEach(el => el.remove());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup);
  } else {
    cleanup();
  }
  window.addEventListener('load', cleanup);
})();
`;
fs.writeFileSync(path.join(weatherDir, 'weather.js'), weatherModuleJs, 'utf8');

console.log('✅ کدهای اضافه پاک شدند و استایل‌ها منحصراً در پوشه modules/weather قرار گرفتند.');