const fs = require('fs');
const path = require('path');

console.log('📐 در حال تراز دقیق و نهایی ارتفاع پنل تسک با لبه پایینی تقویم...');

// ۱. تنظیم استایل در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const matchTaskHeightCss = `
/* ========================================================
   تراز قطعی ارتفاع تسک با لبه پایینی تقویم در آبنر
======================================================== */
/* ستون سمت چپ به صورت تمام‌قد */
.left-column, .tasks-column {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
}

/* کارت اصلی تسک و یادداشت */
.left-column > div:first-child,
.task-container,
.todo-box,
[data-area="todo"] {
  height: 575px !important;
  min-height: 575px !important;
  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box !important;
  transition: height 0.2s ease !important;
}

/* امتداد لیست تسک‌ها در فضای میانی برای هل دادن دکمه ثبت به کف کارت */
.left-column ul,
.left-column .task-list,
.left-column .todo-list,
.left-column [class*="list"],
.left-column [class*="content"] {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  max-height: none !important;
}

/* چسبیدن اینپوت نوشتن تسک جدید به لبه پایینی کارت */
.left-column form,
.left-column .input-group,
.left-column .add-task-box,
.left-column [class*="input-wrap"],
.left-column [class*="form"] {
  margin-top: auto !important;
}
`;

  themeCss = themeCss.replace(/\/\* ========================================================\s*تراز قطعی ارتفاع تسک[\s\S]*$/g, '');
  themeCss += '\n' + matchTaskHeightCss;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ استایل تراز ارتفاع در theme.css تثبیت شد.');
}

// ۲. تنظیم خودکار ارتفاع بر اساس المان ستون راست در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const dynamicHeightScript = `
/* هماهنگ‌سازی پویا و بلادرنگ ارتفاع تسک با لبه پایینی تقویم آبنر */
(function syncTaskHeightWithCalendar() {
  function matchHeight() {
    const rightCol = document.querySelector('.right-column') || document.querySelector('.weather-column');
    const taskCard = document.querySelector('.left-column > div:first-child') || 
                     document.querySelector('.task-container') || 
                     document.querySelector('.todo-box') ||
                     document.querySelector('[data-area="todo"]');

    if (rightCol && taskCard) {
      const rightHeight = rightCol.offsetHeight;
      if (rightHeight > 300) {
        taskCard.style.setProperty('height', rightHeight + 'px', 'important');
        taskCard.style.setProperty('min-height', rightHeight + 'px', 'important');
      }
    }
  }

  window.addEventListener('load', matchHeight);
  window.addEventListener('resize', matchHeight);
  setTimeout(matchHeight, 150);
  setTimeout(matchHeight, 600);
})();
`;

  if (!js.includes('syncTaskHeightWithCalendar')) {
    js += '\n' + dynamicHeightScript;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ منطق سنجش خودکار ارتفاع به script.js متصل شد.');
  }
}