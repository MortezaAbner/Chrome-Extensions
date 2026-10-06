const fs = require('fs');
const path = require('path');

console.log('📏 در حال اتصال دقیق ارتفاع تسک به لبه پایینی تقویم...');

// ۱. تنظیم استایل با ارتفاع ۷۲۰ پیکسل و شناسه قوی در modules/todo/todo.css
const todoCssPath = path.join(__dirname, 'modules', 'todo', 'todo.css');
const stretchCss = `
/* ========================================================
   کشیدگی کامل کادر تسک تا زیر تقویم
======================================================== */
/* ۱. کادر اصلی شیشه‌ای تسک */
.left-column,
.left-column > div,
.left-column form,
.left-column form > div,
div[class*="todo"],
div[class*="task"] {
  min-height: 720px !important;
  height: 720px !important;
  max-height: 720px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
}

/* ۲. فضای داخلی لیست تسک‌ها کل ارتفاع خالی را پر کند */
.left-column [class*="list"],
.left-column ul,
.left-column form > div > div:nth-child(3),
.left-column form > div > div:nth-child(4) {
  flex: 1 1 auto !important;
  min-height: 480px !important;
  overflow-y: auto !important;
}

/* ۳. نوار ثبت تسک جدید دقیقاً در کف و با ارتفاع استاندارد */
.left-column form [class*="InputGroup"],
.left-column input[placeholder*="تسک"],
.left-column [class*="add-box"] {
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  margin-top: auto !important;
  box-sizing: border-box !important;
}
`;
fs.writeFileSync(todoCssPath, stretchCss, 'utf8');
console.log('✅ استایل ارتفاع ۷۲۰px در modules/todo/todo.css نوشته شد.');

// ۲. اسکریپت هماهنگ‌سازی پویا در modules/todo/todo.js
const todoJsPath = path.join(__dirname, 'modules', 'todo', 'todo.js');
const dynamicSyncJs = `
/**
 * هماهنگ‌سازی دقیق و زنده لبه پایینی کادر تسک با لبه پایینی تقویم
 */
(function matchTaskWithCalendarBottom() {
  function sync() {
    // یافتن ستون راست یا المان تقویم
    const rightCol = document.querySelector('.right-column') || 
                     document.querySelector('.Calendar')?.closest('div') ||
                     document.querySelector('[class*="calendar"]')?.parentElement;

    const leftCol = document.querySelector('.left-column');
    if (!leftCol) return;

    let targetHeight = 720;
    if (rightCol && rightCol.offsetHeight > 400) {
      targetHeight = rightCol.offsetHeight;
    }

    // اعمال ارتفاع به کادر تسک و تگ‌های والد آن
    const taskCard = leftCol.firstElementChild || leftCol;
    taskCard.style.setProperty('height', targetHeight + 'px', 'important');
    taskCard.style.setProperty('min-height', targetHeight + 'px', 'important');
    taskCard.style.setProperty('max-height', targetHeight + 'px', 'important');

    const formFlex = leftCol.querySelector('form > div');
    if (formFlex) {
      formFlex.style.setProperty('height', targetHeight + 'px', 'important');
      formFlex.style.setProperty('min-height', targetHeight + 'px', 'important');
      formFlex.style.setProperty('max-height', targetHeight + 'px', 'important');
    }
  }

  window.addEventListener('load', sync);
  window.addEventListener('resize', sync);
  document.addEventListener('DOMContentLoaded', sync);
  setInterval(sync, 400);
})();
`;
fs.writeFileSync(todoJsPath, dynamicSyncJs, 'utf8');
console.log('✅ اسکریپت محاسبه ارتفاع زنده در modules/todo/todo.js ذخیره شد.');