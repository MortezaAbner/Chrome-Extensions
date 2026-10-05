const fs = require('fs');

// ۱. قرار دادن مستقیم توابع oninput روی خود اینپوت‌ها در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  const rockSolidSliders = `            <!-- اسلایدرهای زنده ماتی با اجرای مستقیم inline -->
            <div class="settings-form-row">
              <label class="settings-field-label">ماتی داشبورد اصلی<span class="sub-tip">میزان بلر کارت‌های اصلی: <strong id="val-dash-blur">٪۲۵</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider" oninput="window.handleDashBlurLive(this.value)">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">ماتی و پوشانندگی پاپ‌آپ‌ها<span class="sub-tip">میزان پوشش پنجره‌های بازشونده: <strong id="val-popup-blur">٪۶۵</strong></span></label>
              <input type="range" id="slider-popup-blur" min="0" max="100" value="65" class="glass-slider" oninput="window.handlePopupBlurLive(this.value)">
            </div>

            <div class="blur-actions-bar" style="display: flex; gap: 10px; margin-top: 8px;">
              <button type="button" id="blur-save-btn" onclick="window.saveBlurSettings()" class="location-chip" style="background: var(--accent-color, #2563eb); color: #fff; padding: 8px 18px; font-weight: bold; cursor: pointer;">تأیید ماتی ✓</button>
              <button type="button" id="blur-cancel-btn" onclick="window.cancelBlurSettings()" class="location-chip" style="padding: 8px 18px; cursor: pointer;">انصراف ✕</button>
            </div>`;

  html = html.replace(/<div class="settings-form-row">\s*<label class="settings-field-label">ماتی داشبورد اصلی[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, rockSolidSliders + '\n            </div>');
  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ رویدادهای مستقیم اسلایدر در newtab.html ست شدند.');
}

// ۲. اعمال متغیرهای CSS ماتی در style.css با بالاترین اولویت
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const rootBlurCss = `
/* اتصال قطعی بلر شیشه‌ای به متغیرهای سراسری */
:root {
  --dash-blur-px: 18px;
  --dash-alpha-val: 0.15;
  --popup-blur-px: 55px;
  --popup-alpha-val: 0.45;
}

.ios-glass-card:not(.settings-modal-card) {
  backdrop-filter: blur(var(--dash-blur-px)) saturate(190%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px)) saturate(190%) !important;
  background: rgba(255, 255, 255, var(--dash-alpha-val)) !important;
}

[data-theme="dark"] .ios-glass-card:not(.settings-modal-card) {
  background: rgba(15, 23, 42, var(--dash-alpha-val)) !important;
}

.glass-blur-menu,
.forecast-drawer,
.clock-drawer,
.azan-city-dropdown,
.month-year-picker-modal,
.date-event-popup,
.task-tool-popup,
.location-modal-box,
.settings-modal-card {
  backdrop-filter: blur(var(--popup-blur-px)) saturate(220%) !important;
  -webkit-backdrop-filter: blur(var(--popup-blur-px)) saturate(220%) !important;
  background: rgba(255, 255, 255, var(--popup-alpha-val)) !important;
}

[data-theme="dark"] .glass-blur-menu,
[data-theme="dark"] .forecast-drawer,
[data-theme="dark"] .clock-drawer,
[data-theme="dark"] .settings-modal-card {
  background: rgba(15, 21, 37, var(--popup-alpha-val)) !important;
}
`;

  if (!css.includes('--dash-blur-px:')) {
    css += '\n' + rootBlurCss;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ متغیرهای سراسری ماتی در style.css ثبت شدند.');
  }
}

// ۳. توابع گلوبال window برای لایو بودن بدون واسطه در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const globalBlurScript = `
// ========================================================
// کنترلر مستقیم و سراسری بلر و درصدها (Window Global Engine)
// ========================================================
(function() {
  function toPersianDigits(n) {
    return '٪' + String(n).replace(/\\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  let savedDash = localStorage.getItem('cfg_dash_blur') || '25';
  let savedPopup = localStorage.getItem('cfg_popup_blur') || '65';

  window.handleDashBlurLive = function(val) {
    const lbl = document.getElementById('val-dash-blur');
    if (lbl) lbl.textContent = toPersianDigits(val);

    const px = (val * 0.65).toFixed(1) + 'px';
    const alpha = (val / 100 * 0.35).toFixed(2);
    document.documentElement.style.setProperty('--dash-blur-px', px);
    document.documentElement.style.setProperty('--dash-alpha-val', alpha);
  };

  window.handlePopupBlurLive = function(val) {
    const lbl = document.getElementById('val-popup-blur');
    if (lbl) lbl.textContent = toPersianDigits(val);

    const px = (val * 0.90).toFixed(1) + 'px';
    const alpha = (0.15 + (val / 100 * 0.55)).toFixed(2);
    document.documentElement.style.setProperty('--popup-blur-px', px);
    document.documentElement.style.setProperty('--popup-alpha-val', alpha);
  };

  window.saveBlurSettings = function() {
    const sD = document.getElementById('slider-dash-blur');
    const sP = document.getElementById('slider-popup-blur');
    if (sD) savedDash = sD.value;
    if (sP) savedPopup = sP.value;

    localStorage.setItem('cfg_dash_blur', savedDash);
    localStorage.setItem('cfg_popup_blur', savedPopup);

    const modal = document.getElementById('view-settings');
    if (modal) modal.classList.remove('active');
    document.getElementById('view-dashboard')?.classList.add('active');
    document.getElementById('dock-home-btn')?.classList.add('active');
  };

  window.cancelBlurSettings = function() {
    const sD = document.getElementById('slider-dash-blur');
    const sP = document.getElementById('slider-popup-blur');
    if (sD) sD.value = savedDash;
    if (sP) sP.value = savedPopup;

    window.handleDashBlurLive(savedDash);
    window.handlePopupBlurLive(savedPopup);

    const modal = document.getElementById('view-settings');
    if (modal) modal.classList.remove('active');
    document.getElementById('view-dashboard')?.classList.add('active');
    document.getElementById('dock-home-btn')?.classList.add('active');
  };

  // اعمال مقادیر در بارگذاری اولیه
  setTimeout(() => {
    const sD = document.getElementById('slider-dash-blur');
    const sP = document.getElementById('slider-popup-blur');
    if (sD) sD.value = savedDash;
    if (sP) sP.value = savedPopup;
    window.handleDashBlurLive(savedDash);
    window.handlePopupBlurLive(savedPopup);
  }, 100);
})();
`;

  // پاک کردن کدهای بلر قبلی و قرار دادن توابع مستقیم
  js = js.replace(/\/\/ ========================================================\s*\/\/ کنترلر مستقیم[\s\S]*?\}\)\(\);/g, '');
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور پایدار ماتی[\s\S]*?\}\)\(\);/g, '');
  js += '\n' + globalBlurScript;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ توابع مستقیم بلر به script.js متصل شدند.');
}