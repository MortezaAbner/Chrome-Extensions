const fs = require('fs');
const path = require('path');

console.log('📏 در حال تنظیم دقیق ارتفاع کادر تسک مماس با لبه زیرین تقویم...');

// ۱. تنظیم استایل در modules/todo/todo.css بدون تغییر ساختار تب‌ها
const todoCssPath = path.join(__dirname, 'modules', 'todo', 'todo.css');

const alignWithCalendarCss = `
/* ========================================================
   امتداد دقیق ارتفاع کادر تسک مماس با خط زیرین تقویم
======================================================== */
/* ۱. کادر اصلی تسک و فرم چاکرا */
.left-column > div:first-child,
.left-column form,
.left-column form > div {
  height: 690px !important;
  min-height: 690px !important;
  max-height: 690px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
}

/* ۲. حفظ اندازه طبیعی دکمه‌ها و تب‌های بالا */
.left-column form > div > div:first-child,
.left-column [role="tablist"],
.left-column button {
  flex-shrink: 0 !important;
}

/* ۳. کشیده شدن فضای لیست تسک‌ها در میانه کادر */
.left-column form > div > div[style*="overflow"],
.left-column form > div > div:nth-child(3),
.left-column form > div > div:nth-child(4) {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  min-height: 380px !important;
}

/* ۴. چسبیدن نوار ورودی تسک جدید به کف کادر بدون تغییر سایز */
.left-column form > div > div:last-child {
  margin-top: auto !important;
  flex-shrink: 0 !important;
  height: 48px !important;
  min-height: 48px !important;
}
`;

fs.writeFileSync(todoCssPath, alignWithCalendarCss, 'utf8');
console.log('✅ استایل ارتفاع ۶۹۰px در modules/todo/todo.css اعمال شد.');

// ۲. اسکریپت محاسبه دقیق فاصله مماس در modules/todo/todo.js
const todoJsPath = path.join(__dirname, 'modules', 'todo', 'todo.js');

const alignScriptJs = `
/**
 * هم‌ترازسازی زنده لبه پایینی کادر تسک با لبه پایینی تقویم
 */
(function matchBottomWithCalendar() {
  function applyExactBottom() {
    const rightCol = document.querySelector('.right-column');
    const leftCol = document.querySelector('.left-column');
    if (!rightCol || !leftCol) return;

    // پیدا کردن آخرین المان در ستون راست (تقویم)
    const calEl = rightCol.querySelector('.Calendar') || 
                  rightCol.querySelector('[class*="calendar"]') || 
                  rightCol.lastElementChild;

    if (!calEl) return;

    const calBottom = calEl.getBoundingClientRect().bottom;
    const taskTop = leftCol.getBoundingClientRect().top;
    const targetH = Math.round(calBottom - taskTop);

    if (targetH > 400) {
      const taskContainer = leftCol.firstElementChild;
      const taskForm = leftCol.querySelector('form');
      const formFlex = leftCol.querySelector('form > div');

      [taskContainer, taskForm, formFlex].forEach(el => {
        if (el) {
          el.style.setProperty('height', targetH + 'px', 'important');
          el.style.setProperty('min-height', targetH + 'px', 'important');
          el.style.setProperty('max-height', targetH + 'px', 'important');
        }
      });
    }
  }

  window.addEventListener('load', applyExactBottom);
  window.addEventListener('resize', applyExactBottom);
  document.addEventListener('DOMContentLoaded', applyExactBottom);
  setInterval(applyExactBottom, 500);
})();
`;

fs.writeFileSync(todoJsPath, alignScriptJs, 'utf8');
console.log('✅ اسکریپت تطبیق مماس در modules/todo/todo.js ثبت شد.');