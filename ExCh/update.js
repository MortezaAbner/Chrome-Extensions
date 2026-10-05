const fs = require('fs');

// ۱. افزودن ۳ اسلایدر ماتی و کدری در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  const trioSliderBlock = `            <!-- کنترل سه‌گانه ماتی و کدری رنگ شیشه -->
            <div class="settings-form-row">
              <label class="settings-field-label">ماتی بلر داشبورد اصلی<span class="sub-tip">میزان تاری پشت کارت‌های اصلی: <strong id="val-dash-blur">۲۵٪</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">ماتی بلر پاپ‌آپ‌ها و دراورها<span class="sub-tip">میزان تاری پنجره‌های بازشونده: <strong id="val-popup-blur">۶۵٪</strong></span></label>
              <input type="range" id="slider-popup-blur" min="0" max="100" value="65" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">کدری و غلظت رنگ شیشه‌ای<span class="sub-tip">میزان شفافیت (۰٪ شیشه خالص، ۱۰۰٪ رنگ پوشاننده): <strong id="val-glass-opacity">۴۰٪</strong></span></label>
              <input type="range" id="slider-glass-opacity" min="0" max="100" value="40" class="glass-slider">
            </div>

            <div class="blur-actions-bar" style="display: flex; gap: 10px; margin-top: 6px;">
              <button type="button" id="blur-save-btn" class="location-chip" style="background: var(--accent-color, #2563eb); color: #fff; padding: 8px 18px; font-weight: bold; cursor: pointer;">تأیید ماتی ✓</button>
              <button type="button" id="blur-cancel-btn" class="location-chip" style="padding: 8px 18px; cursor: pointer;">انصراف ✕</button>
            </div>`;

  // جایگزینی بخش اسلایدرهای قبلی
  html = html.replace(/<!-- میزان ماتی شیشه[\s\S]*?<\/div>\s*<\/div>/, trioSliderBlock);

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ اسلایدر سه‌گانه ماتی و کدری در newtab.html جایگزین شد.');
}

// ۲. اعمال منطق زنده ۳ اسلایدر، بستن پاپ‌آپ و انصراف به پیش‌فرض در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const trioSliderEngine = `
  // ========================================================
  // موتور سه‌گانه ماتی زنده، کدری رنگ شیشه و بستن پاپ‌آپ
  // ========================================================
  const sDashBlur = document.getElementById('slider-dash-blur');
  const sPopupBlur = document.getElementById('slider-popup-blur');
  const sGlassOpacity = document.getElementById('slider-glass-opacity');

  const lblDashBlur = document.getElementById('val-dash-blur');
  const lblPopupBlur = document.getElementById('val-popup-blur');
  const lblGlassOpacity = document.getElementById('val-glass-opacity');

  const btnConfirmBlur = document.getElementById('blur-save-btn');
  const btnDismissBlur = document.getElementById('blur-cancel-btn');
  const settingsModalRoot = document.getElementById('view-settings');

  // مقادیر پیش‌فرض
  const DEFAULT_D_BLUR = '25';
  const DEFAULT_P_BLUR = '65';
  const DEFAULT_OPACITY = '40';

  function renderTripleGlassEngine(dPercent, pPercent, opPercent) {
    const dP = Math.max(0, Math.min(100, parseInt(dPercent, 10)));
    const pP = Math.max(0, Math.min(100, parseInt(pPercent, 10)));
    const op = Math.max(0, Math.min(100, parseInt(opPercent, 10)));

    if (lblDashBlur) lblDashBlur.textContent = toFa(dP) + '٪';
    if (lblPopupBlur) lblPopupBlur.textContent = toFa(pP) + '٪';
    if (lblGlassOpacity) lblGlassOpacity.textContent = toFa(op) + '٪';

    // تبدیل درصد به پیکسل بلر (۰ تا ۶۰ پیکسل برای داشبورد و ۰ تا ۹۰ پیکسل برای پاپ‌آپ)
    const dPx = (dP * 0.6).toFixed(1);
    const pPx = (pP * 0.9).toFixed(1);

    // محاسبه آلفای رنگ بر اساس اسلایدر کدری (از ۰ تا ۰.۹۵)
    const cardAlphaLight = (op / 100 * 0.85).toFixed(2);
    const cardAlphaDark = (op / 100 * 0.88).toFixed(2);
    const popupAlphaLight = Math.min(0.98, (op / 100 * 0.92) + 0.1).toFixed(2);
    const popupAlphaDark = Math.min(0.98, (op / 100 * 0.90) + 0.15).toFixed(2);

    let styleTag = document.getElementById('triple-glass-dynamic-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'triple-glass-dynamic-style';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = \`
      /* داشبورد اصلی */
      .ios-glass-card:not(.settings-modal-card) {
        backdrop-filter: blur(\${dPx}px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(\${dPx}px) saturate(200%) !important;
        background: rgba(255, 255, 255, \${cardAlphaLight}) !important;
      }
      [data-theme="dark"] .ios-glass-card:not(.settings-modal-card) {
        background: rgba(15, 23, 42, \${cardAlphaDark}) !important;
      }

      /* پاپ‌آپ‌ها، دراورها و پنجره تنظیمات */
      .glass-blur-menu,
      .forecast-drawer,
      .clock-drawer,
      .azan-city-dropdown,
      .month-year-picker-modal,
      .date-event-popup,
      .task-tool-popup,
      .location-modal-box,
      .settings-modal-card {
        backdrop-filter: blur(\${pPx}px) saturate(240%) !important;
        -webkit-backdrop-filter: blur(\${pPx}px) saturate(240%) !important;
        background: rgba(255, 255, 255, \${popupAlphaLight}) !important;
      }
      [data-theme="dark"] .glass-blur-menu,
      [data-theme="dark"] .forecast-drawer,
      [data-theme="dark"] .clock-drawer,
      [data-theme="dark"] .settings-modal-card {
        background: rgba(15, 21, 37, \${popupAlphaDark}) !important;
      }
    \`;
  }

  function readAndPreviewSliders() {
    const curD = sDashBlur ? sDashBlur.value : (localStorage.getItem('saved_d_blur') || DEFAULT_D_BLUR);
    const curP = sPopupBlur ? sPopupBlur.value : (localStorage.getItem('saved_p_blur') || DEFAULT_P_BLUR);
    const curO = sGlassOpacity ? sGlassOpacity.value : (localStorage.getItem('saved_glass_op') || DEFAULT_OPACITY);
    renderTripleGlassEngine(curD, curP, curO);
  }

  if (sDashBlur) sDashBlur.oninput = readAndPreviewSliders;
  if (sPopupBlur) sPopupBlur.oninput = readAndPreviewSliders;
  if (sGlassOpacity) sGlassOpacity.oninput = readAndPreviewSliders;

  // بارگذاری مقادیر اولیه
  const initialD = localStorage.getItem('saved_d_blur') || DEFAULT_D_BLUR;
  const initialP = localStorage.getItem('saved_p_blur') || DEFAULT_P_BLUR;
  const initialO = localStorage.getItem('saved_glass_op') || DEFAULT_OPACITY;

  if (sDashBlur) sDashBlur.value = initialD;
  if (sPopupBlur) sPopupBlur.value = initialP;
  if (sGlassOpacity) sGlassOpacity.value = initialO;
  renderTripleGlassEngine(initialD, initialP, initialO);

  // بستن پاپ‌آپ و ذخیره دائم با کلیک تایید
  if (btnConfirmBlur) {
    btnConfirmBlur.onclick = (e) => {
      e.stopPropagation();
      localStorage.setItem('saved_d_blur', sDashBlur ? sDashBlur.value : DEFAULT_D_BLUR);
      localStorage.setItem('saved_p_blur', sPopupBlur ? sPopupBlur.value : DEFAULT_P_BLUR);
      localStorage.setItem('saved_glass_op', sGlassOpacity ? sGlassOpacity.value : DEFAULT_OPACITY);
      readAndPreviewSliders();

      // بستن پاپ‌آپ تنظیمات و بازگشت به داشبورد
      if (settingsModalRoot) settingsModalRoot.classList.remove('active');
      document.getElementById('view-dashboard')?.classList.add('active');
      document.getElementById('dock-home-btn')?.classList.add('active');
    };
  }

  // بازگشت به پیش‌فرض و بستن پاپ‌آپ با کلیک انصراف
  if (btnDismissBlur) {
    btnDismissBlur.onclick = (e) => {
      e.stopPropagation();
      localStorage.setItem('saved_d_blur', DEFAULT_D_BLUR);
      localStorage.setItem('saved_p_blur', DEFAULT_P_BLUR);
      localStorage.setItem('saved_glass_op', DEFAULT_OPACITY);

      if (sDashBlur) sDashBlur.value = DEFAULT_D_BLUR;
      if (sPopupBlur) sPopupBlur.value = DEFAULT_P_BLUR;
      if (sGlassOpacity) sGlassOpacity.value = DEFAULT_OPACITY;

      renderTripleGlassEngine(DEFAULT_D_BLUR, DEFAULT_P_BLUR, DEFAULT_OPACITY);

      // بستن پاپ‌آپ تنظیمات
      if (settingsModalRoot) settingsModalRoot.classList.remove('active');
      document.getElementById('view-dashboard')?.classList.add('active');
      document.getElementById('dock-home-btn')?.classList.add('active');
    };
  }
`;

  // پاک کردن موتور قبلی و جایگزینی با موتور سه‌گانه
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور جامع تنظیمات زنده[\s\S]*?btnCancelBlur\.onclick[\s\S]*?\};?\s*\}\s*/g, '');
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور سه‌گانه ماتی[\s\S]*?btnDismissBlur\.onclick[\s\S]*?\};?\s*\}\s*/g, '');
  js += '\n' + trioSliderEngine;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ موتور سه‌گانه ماتی و بستن خودکار پاپ‌آپ در script.js اعمال شد.');
}