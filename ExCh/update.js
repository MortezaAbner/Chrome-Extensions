const fs = require('fs');
const path = require('path');

console.log('🧹 در حال حذف تقویم اضافه و بازگرداندن چیدمان داشبورد آبنر...');

// ۱. خالی کردن ماژول تقویم جدید تا دیگر تقویم دومی رندر نشود
const calendarDir = path.join(__dirname, 'modules', 'calendar');
if (fs.existsSync(calendarDir)) {
  fs.writeFileSync(path.join(calendarDir, 'calendar.js'), '// تقویم اصلی در سورس داشبورد فعال است\n', 'utf8');
  fs.writeFileSync(path.join(calendarDir, 'calendar.css'), '/* استایل تقویم اصلی */\n', 'utf8');
  console.log('✅ تقویم اضافی پایینی غیرفعال و پاک شد.');
}

// ۲. تمیزکاری فایل‌های HTML و حذف تگ‌های تقویم دوم
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace(/\s*<link rel="stylesheet" href="modules\/calendar\/calendar\.css">\s*/g, '\n');
    html = html.replace(/\s*<script src="modules\/calendar\/calendar\.js"><\/script>\s*/g, '\n');
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 فایل ${filePath} تمیز شد.`);
  }
});

// ۳. بازگرداندن استایل چیدمان استاندارد ۳ ستونه داشبورد در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');
  const layoutFix = `
/* چیدمان متقارن و استاندارد داشبورد آبنر */
.dashboard-container, .main-layout, main {
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  width: 100% !important;
  max-width: 1440px !important;
  margin: 0 auto !important;
  padding: 20px !important;
  box-sizing: border-box !important;
}

/* ستون چپ: تسک‌ها */
.left-column, .tasks-column {
  flex: 0 0 320px !important;
  width: 320px !important;
}

/* ستون وسط: نوار جستجو و بوکمارک‌های مربعی */
.center-column, .search-column {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: flex-start !important;
  max-width: 680px !important;
  margin: 0 auto !important;
}

/* ستون راست: وضعیت هوا و تقویم اصلی */
.right-column, .weather-column {
  flex: 0 0 340px !important;
  width: 340px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
}

/* پنهان‌سازی هرگونه تقویم متفرقه خارج از ستون راست */
#abner-calendar-root, #abner-calendar-container, .ab-calendar-card {
  display: none !important;
}
`;
  if (!themeCss.includes('چیدمان متقارن و استاندارد داشبورد آبنر')) {
    themeCss += layoutFix;
    fs.writeFileSync(themeCssPath, themeCss, 'utf8');
    console.log('✅ چیدمان ستون‌های داشبورد در theme.css منظم شد.');
  }
}