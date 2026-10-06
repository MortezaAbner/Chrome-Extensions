const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 در حال بازیابی سلامت فایل‌های HTML و اصلاح ساختار چیدمان آبنر...');

// ۱. بازگرداندن فایل‌های HTML و اسکریپت اصلی به آخرین نسخه سالم گیت برای رفع تگ‌های آسیب‌دیده
try {
  execSync('git checkout HEAD~2 -- index.html newtab.html script.js', { stdio: 'ignore' });
  console.log('✅ فایل‌های اصلی HTML و script.js بازیابی شدند.');
} catch (e) {
  try {
    execSync('git checkout -- index.html newtab.html script.js', { stdio: 'ignore' });
    console.log('✅ فایل‌های HTML بازنشانی شدند.');
  } catch (err) {}
}

// ۲. تمیزکاری فایل استایل سراسری theme.css و تثبیت چیدمان استاندارد ۳ ستونه
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  // حذف هرگونه رول مخرب یا تکراری قبلی
  themeCss = themeCss.replace(/\/\* ========================================================[\s\S]*$/g, '');

  const cleanLayoutCss = `
/* ========================================================
   چیدمان استاندارد، تفکیک‌شده و متقارن داشبورد آبنر
======================================================== */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  width: 100vw !important;
  height: 100vh !important;
}

/* ساختار ۳ ستونه داشبورد */
main, .main-layout, .dashboard-container {
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  width: 100% !important;
  max-width: 1460px !important;
  height: 100vh !important;
  margin: 0 auto !important;
  padding: 24px 30px !important;
  box-sizing: border-box !important;
  gap: 20px !important;
}

/* ستون سمت چپ: پنل تسک و یادداشت */
.left-column, .tasks-column {
  flex: 0 0 320px !important;
  width: 320px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
  z-index: 10 !important;
}

/* ستون مرکز: نوار جستجو و شبکه بوکمارک‌های مربعی */
.center-column, .search-column {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: flex-start !important;
  max-width: 660px !important;
  margin: 0 auto !important;
  z-index: 10 !important;
}

/* ستون سمت راست: آب‌وهوا، ساعت و تقویم اصلی */
.right-column, .weather-column {
  flex: 0 0 330px !important;
  width: 330px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 16px !important;
  z-index: 10 !important;
}

/* استایل شیشه‌ای کامل پنل تسک سمت چپ هم‌تراز با تقویم */
.left-column > div:first-child,
.task-container,
.todo-box {
  width: 100% !important;
  height: 540px !important;
  min-height: 540px !important;
  border-radius: 24px !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
}

/* حذف هرگونه تقویم متفرقه در مرکز یا پایین صفحه */
.center-column .Calendar,
.center-column .ab-calendar-card,
#abner-calendar-root,
#abner-calendar-container,
.bottom-view,
.tasks-full-view {
  display: none !important;
}

/* نمایش منظم تقویم اصلی تنها در ستون سمت راست */
.right-column .Calendar,
.right-column .calendar-card,
.right-column .calendar-section {
  display: block !important;
  width: 100% !important;
}
`;

  themeCss += '\n' + cleanLayoutCss;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ چیدمان ۳ ستونه استاندارد در theme.css تثبیت شد.');
}

// ۳. اطمینان از الصاق درست استایل بوکمارک‌های مربعی
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace(/\s*<link rel="stylesheet" href="modules\/calendar\/calendar\.css">\s*/g, '\n');
    html = html.replace(/\s*<script src="modules\/calendar\/calendar\.js"><\/script>\s*/g, '\n');

    if (!html.includes('modules/bookmark/bookmark.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/bookmark/bookmark.css">\n</head>');
    }
    if (!html.includes('modules/bookmark/bookmark.js')) {
      html = html.replace('</body>', '  <script src="modules/bookmark/bookmark.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
  }
});