const fs = require('fs');
const path = require('path');

console.log('🎯 در حال محاسبه و قفل مستقیم ارتفاع تسک دقیقاً هم‌تراز با لبه پایینی تقویم...');

// ۱. تزریق اسکریپت تنظیم پویای ارتفاع بر اساس مختصات زنده تقویم
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const exactHeightSyncScript = `
/* ========================================================
   محاسبه و تراز میلی‌متری ارتفاع تسک با لبه پایینی تقویم آبنر
======================================================== */
(function syncTaskExactHeight() {
  function applyExactHeight() {
    // پیدا کردن اینپوت تسک و کانتینر اصلی والد آن
    const taskInput = document.querySelector('input[placeholder*="تسک"], input[placeholder*="دست نویس"]') ||
                      Array.from(document.querySelectorAll('input')).find(i => (i.placeholder && i.placeholder.includes('تسک')));
    
    // پیدا کردن کارت تقویم در سمت راست
    const calendarCard = document.querySelector('.Calendar, .calendar-card, [class*="calendar"], .right-column > div:last-child');

    if (!taskInput || !calendarCard) return;

    // پیدا کردن کادر شیشه‌ای اصلی تسک در سمت چپ
    let taskCard = taskInput.closest('.left-column > div') || 
                   taskInput.closest('[class*="todo"]') || 
                   taskInput.closest('[class*="task"]') || 
                   taskInput.parentElement.parentElement;

    if (taskCard && calendarCard) {
      const calRect = calendarCard.getBoundingClientRect();
      const taskRect = taskCard.getBoundingClientRect();

      // محاسبه فاصله دقیق از بالای تسک تا انتهای تقویم
      const targetHeight = Math.round(calRect.bottom - taskRect.top);

      if (targetHeight > 350) {
        taskCard.style.setProperty('height', targetHeight + 'px', 'important');
        taskCard.style.setProperty('min-height', targetHeight + 'px', 'important');
        taskCard.style.setProperty('max-height', targetHeight + 'px', 'important');
        taskCard.style.setProperty('display', 'flex', 'important');
        taskCard.style.setProperty('flex-direction', 'column', 'important');
        taskCard.style.setProperty('justify-content', 'space-between', 'important');
        taskCard.style.setProperty('box-sizing', 'border-box', 'important');

        // باز کردن فضای اسکرول میانی تسک‌ها
        const listContainer = taskCard.querySelector('ul, [class*="list"], div:nth-child(2)');
        if (listContainer) {
          listContainer.style.setProperty('flex', '1 1 auto', 'important');
          listContainer.style.setProperty('overflow-y', 'auto', 'important');
        }

        // چسباندن اینپوت و فرم به پایین‌ترین نقطه کادر
        const formWrap = taskInput.closest('form') || taskInput.parentElement;
        if (formWrap) {
          formWrap.style.setProperty('margin-top', 'auto', 'important');
        }
      }
    }
  }

  // اجرا در لود، تغییر سایز پنجره و با فواصل زمانی کوتاه برای مهار رندرهای بعدی ری‌اکت
  window.addEventListener('load', applyExactHeight);
  window.addEventListener('resize', applyExactHeight);
  document.addEventListener('DOMContentLoaded', applyExactHeight);
  setInterval(applyExactHeight, 500);
})();
`;

  // پاک کردن اسکریپت‌های آزمایشی قبلی و جایگزینی با اسکریپت قطعی
  js = js.replace(/\/\* ========================================================\s*محاسبه و تراز میلی‌متری[\s\S]*?\)\(\);/, '');
  js += '\n' + exactHeightSyncScript;
  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ اسکریپت تراز زنده در script.js ثبت شد.');
}

// ۲. اعمال استایل عمومی کمکی در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');
  const cssRule = `
/* تراز تضمینی کانتینر تسک سمت چپ */
.left-column {
  align-self: stretch !important;
  display: flex !important;
  flex-direction: column !important;
}
`;
  if (!themeCss.includes('تراز تضمینی کانتینر تسک سمت چپ')) {
    themeCss += '\n' + cssRule;
    fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  }
}