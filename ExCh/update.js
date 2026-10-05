const fs = require('fs');

// ۱. رفع کشیدگی پاپ‌آپ تنظیمات در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const fixSettingsBox = `
/* رفع کشیدگی پنجره تنظیمات و نمایش به عنوان پاپ‌آپ متمرکز */
#view-settings.app-view.active {
  display: flex !important;
  position: fixed !important;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.45) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.settings-modal-card {
  width: 780px !important;
  max-width: 92vw !important;
  max-height: 85vh !important;
  margin: auto !important;
  border-radius: 30px !important;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35) !important;
  overflow: hidden;
}
.settings-layout-body {
  display: flex !important;
  flex-direction: row-reverse !important;
  gap: 20px !important;
  max-height: 60vh !important;
  overflow-y: auto !important;
}
.settings-sidebar-nav {
  width: 190px !important;
  flex-shrink: 0 !important;
}
.settings-content-main {
  flex: 1 !important;
}
`;

  if (!css.includes('/* رفع کشیدگی پنجره تنظیمات و نمایش به عنوان پاپ‌آپ متمرکز */')) {
    css += '\n' + fixSettingsBox;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل پاپ‌آپ تنظیمات اصلاح شد.');
  }
}

// ۲. اصلاح میانبرهای عکس ۲ در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // تعویض دم‌دستی با تلگرام
  js = js.replace(/\{\s*title:\s*['"]دم‌دستی['"],\s*url:\s*['"][^'"]+['"]\s*\}/, "{ title: 'تلگرام', url: 'https://web.telegram.org' }");

  // تعویض دیجی‌موویزها با اینستاگرام و تردز
  js = js.replace(/\{\s*title:\s*['"]دیجی‌مووی['"],\s*url:\s*['"][^'"]+['"]\s*\}/, "{ title: 'اینستاگرام', url: 'https://www.instagram.com' }");
  js = js.replace(/\{\s*title:\s*['"]دیجی‌موویز ۲['"],\s*url:\s*['"][^'"]+['"]\s*\}/, "{ title: 'تردز', url: 'https://www.threads.net' }");

  // اصلاح لینک واتساپ
  js = js.replace(/\{\s*title:\s*['"]واتساپ['"],\s*url:\s*['"][^'"]+['"]\s*\}/, "{ title: 'واتساپ', url: 'https://web.whatsapp.com' }");

  // رفع باگ بازگشت از پاپ‌آپ تنظیمات
  js = js.replace(
    /settingsCloseBtn\.onclick = \(\) => switchView\(viewDashboard, dockHomeBtn\);/,
    `settingsCloseBtn.onclick = () => {
      document.getElementById('view-settings')?.classList.remove('active');
      document.getElementById('view-dashboard')?.classList.add('active');
      document.getElementById('dock-home-btn')?.classList.add('active');
    };`
  );

  // پاک‌کردن شورتکات‌های کش‌شده قبلی
  if (!js.includes('sc_version_v11')) {
    const scReset = `
  if (localStorage.getItem('sc_ver_tag') !== 'v11') {
    localStorage.removeItem('my_shortcuts');
    localStorage.setItem('sc_ver_tag', 'v11');
  }
`;
    js = js.replace('let shortcuts = JSON.parse(localStorage.getItem(\'my_shortcuts\'))', `${scReset}\n  let shortcuts = JSON.parse(localStorage.getItem('my_shortcuts'))`);
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ میانبرها و رویداد دکمه بستن اصلاح شدند.');
}