const fs = require('fs');
const path = require('path');

console.log('📐 در حال افزایش قطعی ارتفاع پنل تسک و تراز با تقویم آبنر...');

// ۱. تزریق استایل قطعی در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const forceHeightCss = `
/* ========================================================
   تثبیت ارتفاع تسک هم‌تراز با لبه پایینی تقویم آبنر
======================================================== */
.left-column {
  height: auto !important;
  min-height: 540px !important;
  display: flex !important;
  flex-direction: column !important;
}

/* پنل بیرونی تسک و یادداشت */
.left-column > div,
.left-column .task-container,
.left-column .todo-box,
.left-column [data-area="todo"] {
  height: 540px !important;
  min-height: 540px !important;
  max-height: 540px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
}

/* باز شدن کامل بدنه میانی تسک */
.left-column > div > div:nth-child(2),
.left-column ul,
.left-column .tasks-list,
.left-column .todo-list,
.left-column [class*="list"] {
  flex: 1 1 auto !important;
  height: 100% !important;
  max-height: 380px !important;
  overflow-y: auto !important;
}

/* چسبیدن اینپوت و دکمه نوشتن به کف پنل */
.left-column form,
.left-column .input-group,
.left-column .add-task-box,
.left-column [class*="input"],
.left-column [class*="footer"] {
  margin-top: auto !important;
}
`;

  themeCss = themeCss.replace(/\/\* ========================================================\s*تثبیت ارتفاع تسک[\s\S]*$/g, '');
  themeCss += '\n' + forceHeightCss;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ استایل ارتفاع به theme.css اضافه شد.');
}

// ۲. اعمال مستقیم روی DOM از طریق script.js در لحظه بارگذاری
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const domHeightFix = `
/* تنظیم مستقیم ارتفاع کارت تسک در لحظه رندر */
(function forceSetTaskHeight() {
  function applyHeight() {
    const leftCol = document.querySelector('.left-column');
    if (!leftCol) return;
    
    // هدف‌گیری تمام المان‌های والد و کارت اول ستون چپ
    const taskElements = leftCol.querySelectorAll('& > div, .task-container, .todo-box, [data-area="todo"]');
    taskElements.forEach(el => {
      el.style.setProperty('height', '540px', 'important');
      el.style.setProperty('min-height', '540px', 'important');
      el.style.setProperty('display', 'flex', 'important');
      el.style.setProperty('flex-direction', 'column', 'important');
    });

    const innerList = leftCol.querySelector('ul, .tasks-list, .todo-list, [class*="list"]');
    if (innerList) {
      innerList.style.setProperty('flex', '1 1 auto', 'important');
      innerList.style.setProperty('overflow-y', 'auto', 'important');
    }
  }

  window.addEventListener('DOMContentLoaded', applyHeight);
  window.addEventListener('load', applyHeight);
  setTimeout(applyHeight, 100);
  setTimeout(applyHeight, 500);
  setTimeout(applyHeight, 1200);
})();
`;

  if (!js.includes('forceSetTaskHeight')) {
    js += '\n' + domHeightFix;
  } else {
    js = js.replace(/\/\* تنظیم مستقیم ارتفاع کارت تسک در لحظه رندر[\s\S]*?\)\(\);/, domHeightFix.trim());
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ منطق تنظیم مستقیم ارتفاع در script.js به‌روزرسانی شد.');
}