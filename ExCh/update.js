const fs = require('fs');

// ۱. اصلاح و اتصال کلاس‌ها در script.js و style.css
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // استایل جامع برای شورت‌کات‌ها (عکس ۱) و کشویی‌های تایمر/اوقات‌شرعی/پیش‌بینی (عکس ۲)
  const universalStyleBlock = `
    /* استایل تزریقی هماهنگ با اسلایدرهای بلر */
    let liveStyle = document.getElementById('live-custom-blur-style');
    if (!liveStyle) {
      liveStyle = document.createElement('style');
      liveStyle.id = 'live-custom-blur-style';
      document.head.appendChild(liveStyle);
    }

    liveStyle.textContent = \`
      /* ۱. عکس ۱: میانبرها و دکمه افزودن و سرچ‌بار متصل به ماتی داشبورد */
      .shortcut-item,
      .shortcut-card,
      .shortcut-btn,
      .shortcut-icon-wrapper,
      .shortcuts-grid > *,
      #shortcuts-container > *,
      .add-shortcut-btn,
      .search-bar-container,
      .search-box,
      .google-search-bar {
        backdrop-filter: blur(\${dPx}px) saturate(160%) !important;
        -webkit-backdrop-filter: blur(\${dPx}px) saturate(160%) !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }
      [data-theme="dark"] .shortcut-item,
      [data-theme="dark"] .shortcut-card,
      [data-theme="dark"] .shortcut-btn,
      [data-theme="dark"] .shortcuts-grid > *,
      [data-theme="dark"] .add-shortcut-btn,
      [data-theme="dark"] .search-bar-container {
        background: rgba(15, 23, 42, 0.20) !important;
      }

      /* ۲. عکس ۲: کشویی تایمر، اوقات شرعی، پیش‌بینی و محتویات متصل به ماتی پاپ‌آپ */
      .forecast-drawer,
      #forecast-drawer,
      .clock-drawer,
      #clock-drawer,
      #timer-drawer,
      .timer-drawer,
      #azan-drawer,
      .azan-drawer,
      .drawer-container,
      .drawer-content,
      .timer-box,
      .timer-inputs-wrapper,
      .settings-modal-card {
        backdrop-filter: blur(\${popupPx}px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(\${popupPx}px) saturate(180%) !important;
        background: rgba(255, 255, 255, 0.12) !important;
      }
      [data-theme="dark"] .forecast-drawer,
      [data-theme="dark"] #forecast-drawer,
      [data-theme="dark"] #clock-drawer,
      [data-theme="dark"] #timer-drawer,
      [data-theme="dark"] #azan-drawer,
      [data-theme="dark"] .drawer-content,
      [data-theme="dark"] .settings-modal-card {
        background: rgba(15, 23, 42, 0.25) !important;
      }
    \`;
  `;

  // پاک کردن آلرت و بستن قطعی پنجره در تایید و انصراف
  js = js.replace(/alert\s*\(\s*['"`][^'"`]*['"`]\s*\)\s*;?/g, '');

  const closeSettingsLogic = `
  // تابع اختصاصی بستن پنجره تنظیمات
  function triggerCloseSettings() {
    // روش ۱: شبیه‌سازی کلیک روی دکمه ضربدر بستن
    const closeBtn = document.querySelector('.settings-modal-close, #close-settings-btn, .modal-close-btn, [data-close-modal]');
    if (closeBtn) {
      closeBtn.click();
      return;
    }
    // روش ۲: حذف کلاس اکتیو از مودال تنظیمات
    const sModal = document.querySelector('.settings-modal-card, #settings-modal, #view-settings, .settings-modal-overlay');
    if (sModal) {
      sModal.classList.remove('active');
      sModal.style.display = 'none';
    }
    const dView = document.getElementById('view-dashboard');
    if (dView) {
      dView.classList.add('active');
      dView.style.display = '';
    }
  }

  // رویداد تایید ماتی
  document.getElementById('blur-save-btn')?.addEventListener('click', function(e) {
    if (e) e.stopPropagation();
    triggerCloseSettings();
  }, true);

  // رویداد انصراف ماتی
  document.getElementById('blur-cancel-btn')?.addEventListener('click', function(e) {
    if (e) e.stopPropagation();
    triggerCloseSettings();
  }, true);
  `;

  // جایگزینی ساختار استایل‌دهی داخل تابع بلر
  if (js.includes('live-custom-blur-style')) {
    js = js.replace(/let liveStyle = document\.getElementById\('live-custom-blur-style'\);[\s\S]*?liveStyle\.textContent = `[\s\S]*?`;/, universalStyleBlock.trim());
  }

  // اضافه کردن رویداد بستن بدون دستکاری توابع موجود
  js = js.replace(/\/\/ تابع اختصاصی بستن پنجره تنظیمات[\s\S]*?triggerCloseSettings\(\);?\s*\}, true\);/g, '');
  js += '\n' + closeSettingsLogic;

  fs.writeFileSync('./script.js', js, 'utf8');
}

// ۲. حل مشکل پس‌زمینه ثابت در style.css در صورت وجود
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');
  // آزاد کردن backdrop-filter و background از شورت‌کات‌ها و کشویی‌ها تا از متغیرها پیروی کنند
  css += `
/* اطمینان از اعمال بلر شفاف روی شورت‌کات‌ها و کشویی‌ها */
.shortcut-item, .shortcut-card, .shortcut-btn, .add-shortcut-btn {
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.08)) !important;
}
.forecast-drawer, .clock-drawer, #timer-drawer, #azan-drawer {
  background: var(--popup-glass-bg, rgba(255, 255, 255, 0.12)) !important;
}
`;
  fs.writeFileSync('./style.css', css, 'utf8');
}

console.log('✅ میانبرها، کشویی تایمر/پیش‌بینی/اوقات شرعی و بستن پنجره تنظیمات با موفقیت اصلاح شدند.');