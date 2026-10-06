const fs = require('fs');
const path = require('path');

console.log('🧹 در حال حذف تقویم اضافه از وسط صفحه و پاک‌سازی ماژول calendar...');

// ۱. رفع ایمن خطای timerAlarmModal در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // جلوگیری از ارور رفرنس تایمر
  if (!js.includes('var timerAlarmModal')) {
    js = 'var timerAlarmModal = null;\n' + js;
  }
  js = js.replace(/if\s*\(\s*timerAlarmModal\s*\)\s*timerAlarmModal\.classList\.add\('active'\);/g, 
    "if (typeof timerAlarmModal !== 'undefined' && timerAlarmModal) { timerAlarmModal.classList.add('active'); }"
  );

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ خطای timerAlarmModal برطرف شد.');
}

// ۲. خالی کردن جاوااسکریپت تقویم تا دیگر هیچ تقویمی نسازد یا تزریق نکند
const calJsPath = path.join(__dirname, 'modules', 'calendar', 'calendar.js');
if (fs.existsSync(calJsPath)) {
  const cleanCalJs = `
/**
 * ماژول تقویم آبنر (modules/calendar/calendar.js)
 * پاک‌سازی تقویم‌های ساختگی اضافه و حفظ تقویم اصلی سمت راست
 */
(function cleanInjectedCalendars() {
  function removeExtra() {
    const fakeCalendar = document.getElementById('abner-native-calendar');
    if (fakeCalendar) fakeCalendar.remove();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeExtra);
  } else {
    removeExtra();
  }
  window.addEventListener('load', removeExtra);
})();
`;
  fs.writeFileSync(calJsPath, cleanCalJs, 'utf8');
  console.log('✅ تقویم اضافی از فایل modules/calendar/calendar.js حذف شد.');
}

// ۳. استایل اختصاصی تقویم اصلی ستون راست در modules/calendar/calendar.css
const calCssPath = path.join(__dirname, 'modules', 'calendar', 'calendar.css');
if (fs.existsSync(calCssPath)) {
  const cleanCalCss = `
/* ========================================================
   استایل شیشه‌ای تقویم اصلی آبنر (modules/calendar/calendar.css)
======================================================== */
/* مخفی‌سازی کامل هرگونه تقویم متفرقه تزریقی */
#abner-native-calendar {
  display: none !important;
}

/* استایل تقویم اصلی موجود در ستون راست */
.right-column > div:last-child,
.right-column .Calendar,
.right-column [class*="calendar"] {
  border-radius: 28px !important;
  background: var(--dash-glass-bg, rgba(20, 24, 35, 0.50)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
}
`;
  fs.writeFileSync(calCssPath, cleanCalCss, 'utf8');
  console.log('✅ استایل تقویم اصلی در modules/calendar/calendar.css ذخیره شد.');
}