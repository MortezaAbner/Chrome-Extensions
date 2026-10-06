const fs = require('fs');
const path = require('path');

console.log('🚀 در حال تراز دقیق ارتفاع تسک با تقویم و غیرفعال‌سازی اسکرول نوار پایین آبنر...');

// ۱. تنظیم CSS به صورت قطعی و همه‌جانبه برای ارتفاع و بستن اسکرول
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const absoluteLayoutFix = `
/* ========================================================
   اصلاح نهایی ارتفاع تسک و قفل اسکرول داشبورد آبنر
======================================================== */
/* ۱. قفل کامل اسکرول بدنه و داشبورد برای ممانعت از باز شدن سکشن پایین */
html, body, #root, .app-container, .dashboard, main {
  overflow: hidden !important;
  height: 100vh !important;
  max-height: 100vh !important;
}

/* مخفی‌سازی کامل سکشن کشویی پایینی که روی دکمه تسک باز می‌شد */
.tasks-drawer,
.tasks-bottom-sheet,
.bottom-sheet,
.bottom-section,
.analytics-section,
[class*="bottom-view"],
[class*="drawer"],
[class*="sheet"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
}

/* ۲. تراز دقیق ارتفاع تسک سمت چپ هم‌قد با مجموع آب‌وهوا و تقویم راست */
.left-column {
  display: flex !important;
  flex-direction: column !important;
  height: auto !important;
}

/* تمام کانتینرهای والد و اصلی کارت تسک سمت چپ */
.left-column > div,
.task-wrapper,
.todo-wrapper,
.task-card,
.todo-card,
.task-container,
.todo-box,
[data-area="todo"] {
  height: 520px !important;
  min-height: 520px !important;
  max-height: 520px !important;
  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box !important;
}

/* کشیده شدن محتوای وسط تسک‌ها تا اینپوت پایینی به انتهای کادر بچسبد */
.left-column .list-container,
.left-column ul,
.left-column .tasks-list,
.left-column .todo-list,
.left-column [class*="list"] {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  max-height: none !important;
}

/* چسبیدن همیشگی فیلد نوشتن تسک جدید به کف پنل */
.left-column form,
.left-column .input-group,
.left-column .add-task-box,
.left-column [class*="input"],
.left-column [class*="form"] {
  margin-top: auto !important;
}
`;

  // پاک کردن تعاریف قبلی و افزودن کد تمیز
  themeCss = themeCss.replace(/\/\* ========================================================\s*اصلاح نهایی ارتفاع تسک[\s\S]*$/g, '');
  themeCss += '\n' + absoluteLayoutFix;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ استایل تراز ارتفاع و قفل اسکرول به theme.css تزریق شد.');
}

// ۲. مهار رویداد کلیک دکمه نوار پایین در اسکریپت آبنر
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const navLockScript = `
/* مسدودسازی اسکرول دکمه تسک نوار پایین آبنر و همگام‌سازی با پنل چپ */
(function lockBottomTaskScroll() {
  function handleNavClicks() {
    // دکمه آیکون تسک/دفترچه در نوار پایین
    const dockButtons = document.querySelectorAll('.bottom-bar button, .dock button, nav button, [class*="dock"] button');
    dockButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // جلوگیری از اسکرول خوردن صفحه به پایین یا باز شدن پاپ‌آپ زیرین
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // بستن هر کشویی ساخته‌شده
        document.querySelectorAll('.tasks-drawer, .bottom-sheet, [class*="sheet"]').forEach(el => el.remove());
      }, true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleNavClicks);
  } else {
    handleNavClicks();
  }
})();
`;

  if (!js.includes('lockBottomTaskScroll')) {
    js += '\n' + navLockScript;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ رویداد دکمه‌های نوار ناوبری مهار و در script.js ثبت شد.');
  }
}