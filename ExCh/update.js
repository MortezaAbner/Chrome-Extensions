const fs = require('fs');
const path = require('path');

console.log('🎨 در حال تنظیم پیش‌فرض ماتی ۵۰٪ برای داشبورد، پاپ‌آپ‌ها و اسلایدرهای تم...');

// ۱. تنظیم مقادیر پیش‌فرض متغیرهای شیشه‌ای روی ۵۰٪ در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const defaultGlass50Css = `
/* ========================================================
   تنظیمات پیش‌فرض ماتی و شفافیت ۵۰٪ در داشبورد و پاپ‌آپ‌ها
======================================================== */
:root {
  /* ۵۰٪ ماتی (بلر ۲۰ پیکسل) */
  --dash-blur-px: 20px !important;
  --dash-glass-blur: 20px !important;
  
  /* ۵۰٪ پوشانندگی و شفافیت پس‌زمینه کارت‌ها */
  --dash-glass-bg: rgba(20, 24, 35, 0.50) !important;
  --dash-card-opacity: 0.50 !important;
  
  /* ۵۰٪ پوشانندگی پس‌زمینه پاپ‌آپ‌ها و مودال‌ها */
  --dash-popup-bg: rgba(25, 30, 45, 0.50) !important;
  --dash-popup-blur: 20px !important;
  
  --dash-glass-border: rgba(255, 255, 255, 0.18) !important;
}

/* اعمال پیش‌فرض به تمام کارت‌ها، ویجت‌ها و منوها */
.ab-todo-container,
.ab-calendar-card,
.ab-weather-card,
.task-container,
.todo-box,
.left-column > div,
.right-column > div,
.center-column > div,
[class*="glass"] {
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  background: var(--dash-glass-bg, rgba(20, 24, 35, 0.50)) !important;
}

/* اعمال پیش‌فرض به تمام پنجره‌های پاپ‌آپ و مدال تنظیمات */
.modal,
.popup,
.settings-modal,
div[role="dialog"],
[class*="modal-content"],
[class*="settings-window"] {
  backdrop-filter: blur(var(--dash-popup-blur, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-popup-blur, 20px)) saturate(160%) !important;
  background: var(--dash-popup-bg, rgba(25, 30, 45, 0.50)) !important;
}
`;

  themeCss = themeCss.replace(/\/\* ========================================================\s*تنظیمات پیش‌‌فرض ماتی[\s\S]*$/g, '');
  themeCss += '\n' + defaultGlass50Css;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log('✅ استایل ماتی پیش‌فرض ۵۰٪ در theme.css ثبت شد.');
}

// ۲. اعمال مقدار ۵۰٪ روی اسلایدرها و هماهنگی با localStorage در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const defaultSliderSync = `
/* تنظیم پیش‌فرض اسلایدرها و متغیرهای ماتی روی ۵۰٪ */
(function setupGlass50Default() {
  const DASH_BLUR_KEY = 'abner_dashboard_blur';
  const POPUP_BLUR_KEY = 'abner_popup_blur';

  // اگر قبلاً مقداری ذخیره نشده باشد یا برای اولین بار لود شود، روی ۵۰ درصد قرار می‌گیرد
  let dashBlur = localStorage.getItem(DASH_BLUR_KEY);
  if (dashBlur === null) {
    dashBlur = '50';
    localStorage.setItem(DASH_BLUR_KEY, '50');
  }

  let popupBlur = localStorage.getItem(POPUP_BLUR_KEY);
  if (popupBlur === null) {
    popupBlur = '50';
    localStorage.setItem(POPUP_BLUR_KEY, '50');
  }

  function applyGlassVariables(dashVal, popupVal) {
    const root = document.documentElement;
    // تبدیل ۰ تا ۱۰۰ به بلر مناسب (مثلا ۰ تا ۴۰ پیکسل)
    const blurPx = Math.round((dashVal / 100) * 40);
    const bgOpacity = (dashVal / 100) * 0.85;

    const pBlurPx = Math.round((popupVal / 100) * 40);
    const pBgOpacity = (popupVal / 100) * 0.85;

    root.style.setProperty('--dash-blur-px', blurPx + 'px');
    root.style.setProperty('--dash-glass-blur', blurPx + 'px');
    root.style.setProperty('--dash-glass-bg', 'rgba(20, 24, 35, ' + bgOpacity.toFixed(2) + ')');

    root.style.setProperty('--dash-popup-blur', pBlurPx + 'px');
    root.style.setProperty('--dash-popup-bg', 'rgba(25, 30, 45, ' + pBgOpacity.toFixed(2) + ')');
  }

  function syncSlidersUI() {
    // یافتن اسلایدرهای تنظیمات تم و رنگ
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
      const parentText = slider.parentElement ? slider.parentElement.innerText : '';

      if (parentText.includes('داشبورد') || parentText.includes('کارت')) {
        slider.value = localStorage.getItem(DASH_BLUR_KEY) || '50';
        const label = slider.parentElement.querySelector('span, p, div');
        if (label && label.innerText.includes('%')) {
          label.innerText = label.innerText.replace(/\\d+%/, slider.value + '%');
        }
        slider.oninput = (e) => {
          const val = e.target.value;
          localStorage.setItem(DASH_BLUR_KEY, val);
          if (label && label.innerText.includes('%')) {
            label.innerText = label.innerText.replace(/\\d+%/, val + '%');
          }
          applyGlassVariables(val, localStorage.getItem(POPUP_BLUR_KEY) || '50');
        };
      }

      if (parentText.includes('پاپ‌آپ') || parentText.includes('پوشانندگی')) {
        slider.value = localStorage.getItem(POPUP_BLUR_KEY) || '50';
        const label = slider.parentElement.querySelector('span, p, div');
        if (label && label.innerText.includes('%')) {
          label.innerText = label.innerText.replace(/\\d+%/, slider.value + '%');
        }
        slider.oninput = (e) => {
          const val = e.target.value;
          localStorage.setItem(POPUP_BLUR_KEY, val);
          if (label && label.innerText.includes('%')) {
            label.innerText = label.innerText.replace(/\\d+%/, val + '%');
          }
          applyGlassVariables(localStorage.getItem(DASH_BLUR_KEY) || '50', val);
        };
      }
    });
  }

  applyGlassVariables(dashBlur, popupBlur);
  window.addEventListener('load', syncSlidersUI);
  document.addEventListener('DOMContentLoaded', syncSlidersUI);
  setInterval(syncSlidersUI, 1000);
})();
`;

  if (!js.includes('setupGlass50Default')) {
    js += '\n' + defaultSliderSync;
  } else {
    js = js.replace(/\/\* تنظیم پیش‌فرض اسلایدرها و متغیرهای ماتی[\s\S]*?\)\(\);/, defaultSliderSync.trim());
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ همگام‌سازی اسلایدرها و متغیرها در script.js انجام شد.');
}