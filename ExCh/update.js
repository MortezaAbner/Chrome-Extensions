const fs = require('fs');
const path = require('path');

console.log('📐 در حال تنظیم ارتفاع تسک هم‌تراز با تقویم و رفع رفتار کلیک نوار پایین آبنر...');

// ۱. تنظیم استایل در theme.css (هم‌تراز کردن ارتفاع تسک با انتهای تقویم و حذف سکشن اسکرولی پایین)
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const heightAndBottomBarFix = `
/* ========================================================
   تراز ارتفاع تسک با تقویم و غیرفعال‌سازی بخش اسکرول پایین
======================================================== */
/* ۱. تنظیم ارتفاع پنل تسک سمت چپ هم‌تراز با لبه پایینی تقویم */
.task-container, 
.todo-box, 
[data-area="todo"], 
.left-column > div:first-child,
.left-column {
  min-height: 590px !important;
  height: 590px !important;
  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box !important;
}

/* اسکرول داخلی لیست تسک برای پر کردن فضای عمودی تا اینپوت پایین */
.task-container .task-list,
.todo-box .todo-list,
[data-area="todo"] .list-content,
.left-column .tasks-list {
  flex: 1 1 auto !important;
  max-height: none !important;
  overflow-y: auto !important;
}

/* اینپوت نوشتن تسک جدید همیشه در انتهای پنل تسک */
.task-container .input-group,
.todo-box .add-task-box,
[data-area="todo"] .bottom-input,
.left-column .add-todo-form {
  margin-top: auto !important;
}

/* ۲. مسدودسازی کامل هرگونه سکشن اسکرولی پایین صفحه و پنجره‌های مزاحم زیرین */
.bottom-drawer,
.tasks-bottom-sheet,
.bottom-todo-section,
.scroll-section,
div[class*="bottom-view"],
div[class*="tasks-full-view"] {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
}

/* جلوگیری از اسکرول خوردن کل صفحه به پایین */
html, body {
  overflow: hidden !important;
  height: 100vh !important;
  max-height: 100vh !important;
}
`;

  // جایگزینی کدهای قبلی با اصلاحیه جدید
  themeCss = themeCss.replace(/\/\* ========================================================\s*تراز ارتفاع تسک با تقویم[\s\S]*$/g, '');
  themeCss += '\n' + heightAndBottomBarFix;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ ارتفاع تسک و مهار اسکرول در theme.css ذخیره شد.');
}

// ۲. اصلاح رویداد کلیک دکمه نوار پایین در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const bottomNavHook = `
// اصلاح رویداد دکمه تسک در نوار ابزار پایین آبنر
document.addEventListener('DOMContentLoaded', () => {
  // یافتن دکمه تسک در نوار ناوبری پایین
  const taskNavBtn = document.querySelector('button[data-tab="tasks"], .dock-item[data-target="tasks"], .bottom-bar button:nth-child(4), #nav-task-btn');
  if (taskNavBtn) {
    taskNavBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // بستن هرگونه اسکرول یا پنجره کشویی پایینی
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelectorAll('.bottom-drawer, .tasks-bottom-sheet, .bottom-todo-section').forEach(el => el.remove());

      // برجسته‌سازی و هایلایت پنل اصلی تسک سمت چپ
      const leftTask = document.querySelector('.task-container, .todo-box, [data-area="todo"], .left-column');
      if (leftTask) {
        leftTask.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        leftTask.style.transition = 'box-shadow 0.3s ease, transform 0.2s ease';
        leftTask.style.boxShadow = '0 0 25px rgba(37, 99, 235, 0.6)';
        leftTask.style.transform = 'scale(1.01)';
        setTimeout(() => {
          leftTask.style.boxShadow = '';
          leftTask.style.transform = '';
        }, 600);
      }
    };
  }
});
`;

  if (!js.includes('اصلاح رویداد دکمه تسک در نوار ابزار پایین آبنر')) {
    js += '\n' + bottomNavHook;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ هندلر نوار ابزار پایین به script.js اضافه شد.');
  }
}