const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // ۱. حذف کامل alert برای اطمینان از عدم مزاحمت کادر مرورگر
  js = js.replace(/alert\s*\(\s*['"`][^'"`]*['"`]\s*\)\s*;?/g, '');

  // ۲. اصلاح مستقیم تزریق استایل تا پاپ‌آپ تنظیم موقعیت مکانی دقیقاً با داشبورد تغییر کند
  const dashboardSelectors = '.ios-glass-card:not(.settings-modal-card), .location-modal-box, #location-modal, .location-modal-content, [id*="location-modal"]';
  
  if (!js.includes(dashboardSelectors)) {
    js = js.replace(/\.ios-glass-card:not\(\.settings-modal-card\)[^,{]*/g, dashboardSelectors);
  }

  // ۳. هندلر مستقل، تمیز و تضمینی برای تایید، انصراف و بستن آنی پنجره تنظیمات
  const cleanActionBlock = `
  // اتصال مستقیم دکمه‌های تایید و انصراف ماتی
  (function initModalButtons() {
    const btnOk = document.getElementById('blur-save-btn');
    const btnCancel = document.getElementById('blur-cancel-btn');
    const sD = document.getElementById('slider-dash-blur');
    const sP = document.getElementById('slider-popup-blur');

    let initialD = localStorage.getItem('blur_dash_val') || (sD ? sD.value : '25');
    let initialP = localStorage.getItem('blur_popup_val') || (sP ? sP.value : '65');

    function closeSettings() {
      const modal = document.getElementById('view-settings');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
      const dash = document.getElementById('view-dashboard');
      if (dash) {
        dash.classList.add('active');
        dash.style.display = '';
      }
      const dock = document.getElementById('dock-home-btn');
      if (dock) dock.classList.add('active');
    }

    if (btnOk) {
      btnOk.onclick = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const curD = sD ? sD.value : initialD;
        const curP = sP ? sP.value : initialP;
        localStorage.setItem('blur_dash_val', curD);
        localStorage.setItem('blur_popup_val', curP);
        localStorage.setItem('cfg_dash_blur', curD);
        localStorage.setItem('cfg_popup_blur', curP);
        initialD = curD;
        initialP = curP;
        closeSettings();
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
        closeSettings();
      };
    }
  })();
  `;

  // پاک‌‌سازی بایندهای قبلی و اتصال کد جدید
  js = js.replace(/\/\/ اتصال مستقیم دکمه‌های تایید و انصراف ماتی[\s\S]*?initModalButtons\(\);?\s*\}\)\(\);?/g, '');
  js = js.replace(/\(function bindModalCloseActions\(\)[\s\S]*?\}\)\(\);?/g, '');
  js += '\n' + cleanActionBlock;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ رفع مشکل عدم عملکرد تایید و انصراف و اتصال پاپ‌آپ مکان انجام شد.');
}