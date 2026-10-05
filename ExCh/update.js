const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // ۱. حذف پیام آلرت مزاحم مرورگر
  js = js.replace(/alert\s*\(\s*['"`][^'"`]*['"`]\s*\)\s*;?/g, '');

  // ۲. متصل کردن استایل پاپ‌آپ مکان به داشبورد داخل استایل داینامیک بلر
  const locationDashboardSync = `
        /* کارت‌های داشبورد اصلی و پنجره موقعیت مکانی آب‌وهوا */
        .ios-glass-card:not(.settings-modal-card),
        .location-modal-box,
        #location-modal,
        #location-search-modal,
        .location-modal-content,
        .location-method-card {
          backdrop-filter: blur(\${dPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(\${dPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        [data-theme="dark"] .ios-glass-card:not(.settings-modal-card),
        [data-theme="dark"] .location-modal-box,
        [data-theme="dark"] #location-modal,
        [data-theme="dark"] #location-search-modal,
        [data-theme="dark"] .location-method-card {
          background: rgba(15, 23, 42, 0.18) !important;
        }
`;

  js = js.replace(/\/\*\s*کارت‌های داشبورد اصلی[\s\S]*?\[data-theme="dark"\]\s*\.ios-glass-card:not\(\.settings-modal-card\)\s*\{[\s\S]*?\}\s*/g, locationDashboardSync.trim() + '\n');

  // ۳. هندلر قطعی و مستقیم تایید، انصراف و بستن پاپ‌آپ تنظیمات
  const settingsButtonsAction = `
  // اتصال مستقیم دکمه‌های تایید و انصراف ماتی با بستن فوری
  (function initModalButtonsClean() {
    const btnOk = document.getElementById('blur-save-btn');
    const btnCancel = document.getElementById('blur-cancel-btn');
    const sD = document.getElementById('slider-dash-blur');
    const sP = document.getElementById('slider-popup-blur');

    let initialD = localStorage.getItem('blur_dash_val') || (sD ? sD.value : '25');
    let initialP = localStorage.getItem('blur_popup_val') || (sP ? sP.value : '65');

    function closeSettingsPopup() {
      // بستن کامل منوی تنظیمات
      const settingsView = document.getElementById('view-settings');
      if (settingsView) {
        settingsView.classList.remove('active');
        settingsView.style.display = 'none';
      }
      // بازگشت به نمای اصلی داشبورد
      const dashboardView = document.getElementById('view-dashboard');
      if (dashboardView) {
        dashboardView.classList.add('active');
        dashboardView.style.display = '';
      }
      const dockHome = document.getElementById('dock-home-btn');
      if (dockHome) dockHome.classList.add('active');
    }

    if (btnOk) {
      btnOk.onclick = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const curD = sD ? sD.value : initialD;
        const curP = sP ? sP.value : initialP;
        localStorage.setItem('blur_dash_val', curD);
        localStorage.setItem('blur_popup_val', curP);
        initialD = curD;
        initialP = curP;
        closeSettingsPopup();
      };
    }

    if (btnCancel) {
      btnCancel.onclick = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (sD) sD.value = initialD;
        if (sP) sP.value = initialP;
        if (typeof setLiveBlur === 'function') setLiveBlur(initialD, initialP);
        if (typeof applyBlurStyles === 'function') applyBlurStyles(initialD, initialP);
        if (typeof window.handleDashBlurLive === 'function') window.handleDashBlurLive(initialD);
        if (typeof window.handlePopupBlurLive === 'function') window.handlePopupBlurLive(initialP);
        closeSettingsPopup();
      };
    }
  })();
`;

  // پاک کردن بایندرهای قبلی برای جلوگیری از اجرای تکراری یا بلاک شدن
  js = js.replace(/\/\/ اتصال مستقیم دکمه‌های تایید و انصراف[\s\S]*?initModalButtonsClean\(\);?\s*\}\)\(\);?/g, '');
  js = js.replace(/\/\/ اتصال مستقیم دکمه‌های تایید و انصراف[\s\S]*?initModalButtons\(\);?\s*\}\)\(\);?/g, '');
  js += '\n' + settingsButtonsAction;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ پاپ‌آپ مکان به استایل داشبورد متصل شد و دکمه‌های تایید و انصراف اصلاح شدند.');
}