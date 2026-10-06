const fs = require('fs');
const path = require('path');

console.log('📏 در حال افزایش ارتفاع کادر تسک و هماهنگ‌سازی با تقویم...');

// ۱. تنظیم استایل در modules/todo/todo.css
const todoCssPath = path.join(__dirname, 'modules', 'todo', 'todo.css');
const targetHeight = '610px';

const todoHeightCss = `
/* ========================================================
   تنظیم قطعی ارتفاع بلند کادر تسک و نوار باریک پایین
======================================================== */
:root {
  --task-card-height: ${targetHeight};
}

/* ۱. بدنه و ستون چپ */
.left-column {
  height: var(--task-card-height) !important;
  min-height: var(--task-card-height) !important;
  max-height: var(--task-card-height) !important;
}

/* ۲. کادر والد و کارت شیشه‌ای اصلی */
.left-column > div,
.left-column form > div,
.task-container,
.todo-box,
[data-area="todo"] {
  height: var(--task-card-height) !important;
  min-height: var(--task-card-height) !important;
  max-height: var(--task-card-height) !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
}

/* ۳. لیست تسک‌ها کل فضای میانی را پوشش دهد */
.left-column ul,
.left-column [class*="list"],
.left-column form > div > div:nth-child(3),
.left-column form > div > div:nth-child(4) {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  max-height: none !important;
}

/* ۴. ثابت ماندن نوار نوشتن تسک جدید در پایین کادر با اندازه استاندارد */
.left-column form input,
.left-column form [class*="InputGroup"],
.left-column [class*="add-box"] {
  height: 42px !important;
  min-height: 42px !important;
  max-height: 42px !important;
  box-sizing: border-box !important;
}
`;

fs.writeFileSync(todoCssPath, todoHeightCss, 'utf8');
console.log(`✅ ارتفاع ${targetHeight} در modules/todo/todo.css اعمال شد.`);

// ۲. اعمال مستقیم از طریق جاوااسکریپت برای غلبه بر استایل‌های داخلی ری‌اکت
const todoJsPath = path.join(__dirname, 'modules', 'todo', 'todo.js');
const todoJsCode = `
/**
 * تثبیت ارتفاع کادر تسک متناسب با تقویم ستون راست
 */
(function lockTaskHeight() {
  function applyHeight() {
    const leftCol = document.querySelector('.left-column');
    if (!leftCol) return;

    // اعمال ارتفاع به کانتینر اصلی ستون چپ
    leftCol.style.setProperty('height', '${targetHeight}', 'important');
    leftCol.style.setProperty('min-height', '${targetHeight}', 'important');
    leftCol.style.setProperty('max-height', '${targetHeight}', 'important');

    // اعمال به فرم و کادرهای داخلی ری‌اکت
    const innerContainers = leftCol.querySelectorAll('div, form');
    innerContainers.forEach(el => {
      if (el.offsetHeight > 300 || el.tagName.toLowerCase() === 'form') {
        el.style.setProperty('height', '${targetHeight}', 'important');
        el.style.setProperty('min-height', '${targetHeight}', 'important');
      }
    });
  }

  window.addEventListener('load', applyHeight);
  document.addEventListener('DOMContentLoaded', applyHeight);
  setInterval(applyHeight, 1000);
})();
`;

fs.writeFileSync(todoJsPath, todoJsCode, 'utf8');
console.log('✅ اسکریپت تثبیت ارتفاع در modules/todo/todo.js قرار گرفت.');