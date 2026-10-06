const fs = require('fs');
const path = require('path');

console.log('🔍 در حال عیب‌یابی عمیق و رفع ریشه‌ای سکشن پایین و ارتفاع تسک آبنر...');

// ۱. حذف قطعی تگ‌ها و المان‌های سکشن پایین از فایل‌های HTML
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // حذف کدهای مربوط به ویجت‌های تحلیلی/پایینی که در تصویر دیده می‌شوند
    html = html.replace(/<section[^>]*class="[^"]*(bottom|chart|analytic|drawer|history)[^"]*"[\s\S]*?<\/section>/gi, '');
    html = html.replace(/<div[^>]*class="[^"]*(bottom|chart|analytic|drawer|history)[^"]*"[\s\S]*?<\/div>/gi, '');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ فایل ${filePath} از سکشن‌های اضافی پاک‌سازی شد.`);
  }
});

// ۲. اصلاح مستقیم script.js برای مسدودسازی رفتار دکمه نوار پایین و تنظیم زنده ارتفاع تسک
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // غیرفعال کردن توابع بازکننده سکشن پایین در صورت وجود در سورس
  js = js.replace(/function\s+(openTaskDrawer|showTaskHistory|toggleTaskModal|scrollToTasks)\s*\([^)]*\)\s*\{/g, 'function $1() { return; /* غیرفعال شده توسط آبنر */');

  const fixScript = `
/* ========================================================
   عیب‌یابی قطعی و تثبیت داشبورد آبنر
======================================================== */
(function fixAbnerDashboard() {
  function applyLayoutFix() {
    // ۱. حذف درجا و قطعی هر المانی که سکشن پایین را نمایش می‌دهد
    const bottomSelectors = [
      '.bottom-view', '.tasks-full-view', '.analytics-section',
      '.tasks-bottom-sheet', '.drawer', '[class*="chart"]',
      '#task-history', '.task-chart-container'
    ];
    bottomSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });

    // ۲. هم‌تراز کردن دقیق ارتفاع تسک با ستون تقویم و ساعت
    const rightCol = document.querySelector('.right-column') || document.querySelector('.side-column');
    const taskBox = document.querySelector('.task-container') || 
                    document.querySelector('.todo-box') || 
                    document.querySelector('.left-column > div:first-child') ||
                    document.querySelector('[data-area="todo"]');

    if (taskBox) {
      // اگر ستون راست وجود دارد، ارتفاع تسک دقیقاً برابر ارتفاع آن می‌شود
      let targetHeight = 580;
      if (rightCol && rightCol.offsetHeight > 400) {
        targetHeight = rightCol.offsetHeight;
      }
      taskBox.style.setProperty('height', targetHeight + 'px', 'important');
      taskBox.style.setProperty('min-height', targetHeight + 'px', 'important');
      taskBox.style.setProperty('max-height', targetHeight + 'px', 'important');
      taskBox.style.setProperty('display', 'flex', 'important');
      taskBox.style.setProperty('flex-direction', 'column', 'important');
      taskBox.style.setProperty('box-sizing', 'border-box', 'important');

      // امتداد لیست تسک تا اینپوت به پایین بچسبد
      const listEl = taskBox.querySelector('ul, .task-list, .todo-list, [class*="list"]');
      if (listEl) {
        listEl.style.setProperty('flex', '1 1 auto', 'important');
        listEl.style.setProperty('overflow-y', 'auto', 'important');
      }

      const inputWrap = taskBox.querySelector('form, .input-group, [class*="input"]');
      if (inputWrap) {
        inputWrap.style.setProperty('margin-top', 'auto', 'important');
      }
    }

    // ۳. قطع رویداد دکمه تسک نوار پایین تا هیچ اسکرول یا صفحه‌ای باز نشود
    const dockButtons = document.querySelectorAll('.bottom-bar button, .dock button, nav button');
    dockButtons.forEach(btn => {
      btn.onclick = (e) => {
        // جلوگیری از هرگونه رفتار اسکرول و انتقال به پایین
        e.preventDefault();
        e.stopImmediatePropagation();
        window.scrollTo(0, 0);

        // در صورت کلیک فقط پنل سمت چپ هایلایت شود
        if (taskBox) {
          taskBox.style.transition = 'box-shadow 0.3s ease';
          taskBox.style.boxShadow = '0 0 24px rgba(37, 99, 235, 0.5)';
          setTimeout(() => { taskBox.style.boxShadow = ''; }, 500);
        }
      };
    });
  }

  // اجرا بلافاصله و با تأخیر برای اطمینان از لود کامل DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLayoutFix);
  } else {
    applyLayoutFix();
  }
  window.addEventListener('load', applyLayoutFix);
  setTimeout(applyLayoutFix, 200);
  setTimeout(applyLayoutFix, 800);
})();
`;

  if (!js.includes('fixAbnerDashboard')) {
    js += '\n' + fixScript;
  } else {
    js = js.replace(/\/\* ========================================================\s*عیب‌یابی قطعی و تثبیت داشبورد آبنر[\s\S]*$/, fixScript);
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ منطق جلوگیری از اسکرول و تنظیم ارتفاع زنده در script.js اعمال شد.');
}

// ۳. قفل سراسری اسکرول و استایل در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const cssHardLock = `
/* ========================================================
   قفل قطعی عدم اسکرول و تثبیت ارتفاع در آبنر
======================================================== */
html, body {
  overflow: hidden !important;
  height: 100vh !important;
  max-height: 100vh !important;
}

/* حذف کامل بخش چارت و صفحه پایینی در کل لایه‌ها */
.bottom-view, .tasks-full-view, .analytics-section, .tasks-bottom-sheet, .bottom-drawer {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  height: 0 !important;
  pointer-events: none !important;
}

/* تضمین هم‌قد بودن محفظه تسک با ستون تقویم */
.left-column > div:first-child,
.task-container,
.todo-box {
  height: 580px !important;
  min-height: 580px !important;
}
`;

  themeCss = themeCss.replace(/\/\* ========================================================\s*قفل قطعی عدم اسکرول[\s\S]*$/g, '');
  themeCss += '\n' + cssHardLock;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ استایل قفل اسکرول و ارتفاع در theme.css تثبیت شد.');
}