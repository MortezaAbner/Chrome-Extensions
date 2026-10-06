const fs = require('fs');
const path = require('path');

console.log('📐 در حال امتداد کادر تسک تا پایین تقویم و تثبیت نوار ورودی تک‌خطی...');

// ۱. تنظیم استایل در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  // حذف رول‌های قبلی
  themeCss = themeCss.replace(/\/\* ========================================================\s*تثبیت نوار تک‌خطی تسک جدید[\s\S]*$/g, '');

  const correctLayoutCss = `
/* ========================================================
   کادر بزرگ تسک تا پایین تقویم + نوار ورودی تک‌خطی در کف
======================================================== */
/* ۱. کادر اصلی شیشه‌ای تسک: ارتفاع بلند و کشیده */
.left-column > div:first-child,
.left-column [class*="container"],
.left-column [class*="box"],
.left-column [class*="wrapper"] {
  height: 580px !important;
  min-height: 580px !important;
  max-height: 580px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  box-sizing: border-box !important;
}

/* ۲. فضای بین آیتم‌ها و فرم ورودی کش بیاید تا فرم به کف کادر بچسبد */
.left-column [class*="list"],
.left-column ul,
.left-column > div:first-child > div:nth-child(2),
.left-column > div:first-child > div:nth-child(3) {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  min-height: 200px !important;
}

/* ۳. نوار نوشتن تسک جدید: دقیقاً یک خط باریک و جمع‌‌وجور در انتهای کادر */
.left-column form,
.left-column [class*="add"],
.left-column [class*="input-wrap"],
.left-column [class*="bottom"] {
  flex: 0 0 46px !important;
  height: 46px !important;
  min-height: 46px !important;
  max-height: 46px !important;
  margin-top: auto !important;
  margin-bottom: 0 !important;
}

.left-column form input,
.left-column input[placeholder*="تسک"] {
  height: 42px !important;
  line-height: 42px !important;
  box-sizing: border-box !important;
}
`;

  themeCss += '\n' + correctLayoutCss;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ استایل کادر بلند و اینپوت باریک در theme.css ذخیره شد.');
}

// ۲. اعمال مستقیم روی DOM برای غلبه بر محدودیت‌های احتمالی جاوااسکریپت
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  js = js.replace(/\/\* تنظیم ارتفاع کادر کلی بدون دستکاری[\s\S]*?\)\(\);/g, '');

  const domScript = `
/* تنظیم مستقیم ارتفاع بلند کادر تسک */
(function forceFullHeightTaskCard() {
  function apply() {
    const leftCol = document.querySelector('.left-column');
    if (!leftCol) return;

    // پیدا کردن کادر اصلی اول ستون چپ
    const mainBox = leftCol.querySelector('& > div:first-child') || leftCol.firstElementChild;
    if (mainBox) {
      mainBox.style.setProperty('height', '580px', 'important');
      mainBox.style.setProperty('min-height', '580px', 'important');
      mainBox.style.setProperty('display', 'flex', 'important');
      mainBox.style.setProperty('flex-direction', 'column', 'important');
    }
  }

  window.addEventListener('load', apply);
  document.addEventListener('DOMContentLoaded', apply);
  setTimeout(apply, 150);
  setTimeout(apply, 600);
})();
`;

  if (!js.includes('forceFullHeightTaskCard')) {
    js += '\n' + domScript;
    fs.writeFileSync('./script.js', js, 'utf8');
  }
}