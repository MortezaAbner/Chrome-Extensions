const fs = require('fs');
const path = require('path');

console.log('🧹 در حال حذف تسک بالایی و بازگرداندن ابعاد و منطق تسک اصلی آبنر...');

// ۱. حذف کامل اسکریپت ماژول اضافه از HTMLها تا پنل بالایی کلاً برداشته شود
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace(/\s*<link rel="stylesheet" href="modules\/todo\/todo\.css">\s*/g, '\n');
    html = html.replace(/\s*<script src="modules\/todo\/todo\.js"><\/script>\s*/g, '\n');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 فایل ${filePath} از ماژول تسک اضافه پاک شد.`);
  }
});

// ۲. خالی کردن ماژول todo اضافی
const todoDir = path.join(__dirname, 'modules', 'todo');
if (fs.existsSync(todoDir)) {
  fs.writeFileSync(path.join(todoDir, 'todo.js'), '// ماژول تسک اصلی در اسکریپت داشبورد فعال است\n', 'utf8');
  fs.writeFileSync(path.join(todoDir, 'todo.css'), '/* استایل تسک اصلی */\n', 'utf8');
}

// ۳. بازگرداندن ابعاد و استایل شیشه‌ای کامل پنل تسک اصلی به theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const todoOriginalStyle = `
/* ========================================================
   تنظیمات ابعاد اصلی و استایل شیشه‌ای تسک اصلی آبنر
======================================================== */
/* حذف هرگونه تسک اضافه بالایی یا وسطی */
#abner-todo-container, #abner-left-todo, .ab-todo-panel, .top-todo-card {
  display: none !important;
}

/* پنل اصلی تسک در ستون سمت چپ */
.task-container, .todo-box, [data-area="todo"], .left-column > div:first-child {
  width: 100% !important;
  max-width: 310px !important;
  border-radius: 20px !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
  direction: rtl !important;
  box-sizing: border-box !important;
  padding: 12px !important;
}

/* استایل آیتم‌های تسک بر اساس سورس مادر (Todo.jsx) */
.todo-item, .task-item {
  background: #eef0f512 !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 14px !important;
  margin-bottom: 8px !important;
  padding: 8px 10px !important;
  transition: all 0.2s ease !important;
}
.todo-item:hover, .task-item:hover {
  background: rgba(255, 255, 255, 0.12) !important;
}
.todo-item.completed, .task-item.completed {
  opacity: 0.45 !important;
}
.todo-item.completed label, .task-item.completed label,
.todo-item.completed span, .task-item.completed span {
  text-decoration: line-through !important;
}

/* پنل تایید حذف برگرفته از سورس مادر */
.todo-del-confirm-box {
  display: flex !important;
  justify-content: space-around !important;
  margin-top: 8px !important;
  padding-top: 6px !important;
  border-top: 1px dashed rgba(255, 255, 255, 0.1) !important;
}
.btn-todo-cancel {
  background: #333740 !important;
  color: #A8ABBA !important;
  border: none !important;
  padding: 4px 10px !important;
  border-radius: 6px !important;
  font-size: 11px !important;
  cursor: pointer !important;
}
.btn-todo-del {
  background: #42282D !important;
  color: #DE4237 !important;
  border: none !important;
  padding: 4px 10px !important;
  border-radius: 6px !important;
  font-size: 11px !important;
  cursor: pointer !important;
}
`;

  // پاک کردن استایل‌های تکراری قبلی و اعمال استایل تمیز
  themeCss = themeCss.replace(/\/\* ========================================================\s*تنظیمات ابعاد اصلی و استایل شیشه‌ای تسک اصلی آبنر[\s\S]*$/g, '');
  themeCss += '\n' + todoOriginalStyle;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ استایل شیشه‌ای و ابعاد اصلی تسک در theme.css تثبیت شد.');
}