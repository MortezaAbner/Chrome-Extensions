const fs = require('fs');
const path = require('path');

console.log('🔄 در حال بازگرداندن نوار تسک به حالت تک‌خطی و جمع‌وجور اولیه...');

// ۱. اصلاح دقیق استایل‌ها در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  // حذف رول‌های آسیب‌رسان قبلی
  themeCss = themeCss.replace(/\/\* ========================================================\s*تثبیت ارتفاع تسک[\s\S]*$/g, '');
  themeCss = themeCss.replace(/\/\* ========================================================\s*تراز قطعی ارتفاع تسک[\s\S]*$/g, '');

  const compactInputFix = `
/* ========================================================
   تثبیت نوار تک‌خطی تسک جدید و جلوگیری از باز شدن فرم
======================================================== */
/* ۱. کادر اصلی پنل تسک سمت چپ */
.left-column > div:first-child,
.task-container,
.todo-box,
[data-area="todo"] {
  height: 540px !important;
  min-height: 540px !important;
  max-height: 540px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
}

/* ۲. فضای لیست تسک‌ها گسترش پیدا کند، نه فرم ورودی */
.left-column ul,
.left-column .tasks-list,
.left-column .todo-list,
.left-column [class*="list"],
.left-column [class*="items"] {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  max-height: none !important;
}

/* ۳. مهار و کوچک‌سازی فرم ورودی به اندازه یک نوار باریک اولیه */
.left-column form,
.left-column .input-group,
.left-column .add-task-box,
.left-column [class*="input-wrap"],
.left-column [class*="add-box"] {
  flex: 0 0 44px !important;
  height: 44px !important;
  min-height: 44px !important;
  max-height: 44px !important;
  margin-top: auto !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box !important;
}

/* پنهان‌سازی بخش توضیحات و ردیف آیکون‌های اضافه داخل فرم تا تک‌خطی بماند */
.left-column form textarea,
.left-column form [placeholder*="توضیحات"],
.left-column form .form-details,
.left-column form [class*="detail"],
.left-column form [class*="extra"] {
  display: none !important;
}

/* استایل اینپوت تک‌خطی */
.left-column form input,
.left-column .input-group input {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 12.5px !important;
  border-radius: 12px !important;
}
`;

  themeCss += '\n' + compactInputFix;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ نوار تسک در theme.css به ابعاد جمع‌وجور سابق بازگشت.');
}

// ۲. تمیزکاری فایل script.js از استایل‌های اجباری روی فرم
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // حذف اسکریپت‌هایی که استایل form را دستکاری می‌کردند
  js = js.replace(/\/\* ========================================================\s*محاسبه و تراز میلی‌متری[\s\S]*?\)\(\);/g, '');
  js = js.replace(/\/\* تنظیم مستقیم ارتفاع کارت تسک[\s\S]*?\)\(\);/g, '');

  const compactScript = `
/* تنظیم ارتفاع کادر کلی بدون دستکاری ارتفاع نوار ورودی */
(function keepTaskInputCompact() {
  function applyCompact() {
    const leftCol = document.querySelector('.left-column');
    if (!leftCol) return;

    // بستن بخش توضیحات در صورت باز ماندن
    const descArea = leftCol.querySelector('textarea, [placeholder*="توضیحات"]');
    if (descArea && descArea.parentElement) {
      descArea.style.display = 'none';
    }

    const form = leftCol.querySelector('form');
    if (form) {
      form.style.setProperty('height', '44px', 'important');
      form.style.setProperty('min-height', '44px', 'important');
      form.style.setProperty('max-height', '44px', 'important');
      form.style.setProperty('flex', '0 0 44px', 'important');
    }
  }

  window.addEventListener('load', applyCompact);
  document.addEventListener('DOMContentLoaded', applyCompact);
  setTimeout(applyCompact, 200);
})();
`;

  if (!js.includes('keepTaskInputCompact')) {
    js += '\n' + compactScript;
    fs.writeFileSync('./script.js', js, 'utf8');
  }
}