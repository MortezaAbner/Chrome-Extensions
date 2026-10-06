const fs = require('fs');
const path = require('path');

console.log('📦 در حال بازگرداندن استایل اصلی تسک و استقرار در پوشه modules/todo...');

// ۱. ساخت پوشه modules/todo در صورت عدم وجود
const todoDir = path.join(__dirname, 'modules', 'todo');
if (!fs.existsSync(todoDir)) {
  fs.mkdirSync(todoDir, { recursive: true });
}

// ۲. استایل اصلی و تمیز تسک در modules/todo/todo.css
const originalTodoCss = `
/* ========================================================
   استایل شیشه‌ای اصلی تسک و یادداشت آبنر (modules/todo/todo.css)
======================================================== */
.left-column {
  display: flex !important;
  flex-direction: column !important;
}

/* پنل اصلی تسک با ارتفاع متناسب با تقویم ستون راست */
.left-column > div:first-child,
.task-container,
.todo-box,
[data-area="todo"] {
  height: 575px !important;
  min-height: 575px !important;
  max-height: 575px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
  border-radius: 24px !important;
  background: var(--dash-glass-bg, rgba(20, 24, 35, 0.50)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
}

/* محفظه میانی اسکرول لیست تسک‌ها */
.left-column ul,
.left-column [class*="list"],
.left-column > div:first-child > div:nth-child(2) {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  max-height: none !important;
}

/* نوار ثبت تسک جدید: حالت اولیه، جمع‌وجور و تک‌خطی در کف کادر */
.left-column form,
.left-column [class*="add-box"],
.left-column [class*="input-wrap"],
.left-column [class*="bottom"] {
  flex: 0 0 46px !important;
  height: 46px !important;
  min-height: 46px !important;
  max-height: 46px !important;
  margin-top: auto !important;
  margin-bottom: 0 !important;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box !important;
}

/* مخفی ماندن توضیحات اضافی در فرم حالت اولیه */
.left-column form textarea,
.left-column form [placeholder*="توضیحات"] {
  display: none !important;
}

/* ورودی متن تسک */
.left-column form input,
.left-column input[placeholder*="تسک"] {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 12.5px !important;
  box-sizing: border-box !important;
}
`;

fs.writeFileSync(path.join(todoDir, 'todo.css'), originalTodoCss, 'utf8');
console.log('✅ استایل اصلی تسک در modules/todo/todo.css قرار گرفت.');

// ۳. ایجاد فایل اسکریپت سبک بدون تداخل در modules/todo/todo.js
const originalTodoJs = `
/**
 * ماژول تسک آبنر (modules/todo/todo.js)
 */
console.log('ماژول تسک بارگذاری شد.');
`;
fs.writeFileSync(path.join(todoDir, 'todo.js'), originalTodoJs, 'utf8');

// ۴. اتصال منظم فایل‌های todo در index.html و newtab.html
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    if (!html.includes('modules/todo/todo.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/todo/todo.css">\n</head>');
    }
    if (!html.includes('modules/todo/todo.js')) {
      html = html.replace('</body>', '  <script src="modules/todo/todo.js"></script>\n</body>');
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 پیوند فایل‌های todo در ${filePath} تثبیت شد.`);
  }
});

console.log('🎉 انتقال کامل استایل تسک به پوشه todo با موفقیت انجام شد.');