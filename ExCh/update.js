const fs = require('fs');

// ۱. اصلاح ساختار تگ‌های تب تم و قرار گرفتن قطعی فونت داخل تب pane-theme
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  // استخراج بخش کامل فونت در صورت خروج تصادفی از تب
  const fontRowTemplate = `            <!-- بخش فونت‌ها فقط داخل تب تم و رنگ -->
            <div class="settings-form-row">
              <label class="settings-field-label">فونت<span class="sub-tip">فونت مورد نظرتو انتخاب کن یا فونت دلخواهتو اضافه کن.</span></label>
              <div class="font-cards-grid" id="font-options-container">
                <div class="font-card-item active" data-font="Vazirmatn">
                  <div class="font-card-sample">من اینطوریم ✓</div>
                  <div class="font-card-name">وزیر</div>
                </div>
                <div class="font-card-item" data-font="Estedad">
                  <div class="font-card-sample">من اینطوریم</div>
                  <div class="font-card-name">استعداد</div>
                </div>
                <div class="font-card-item" data-font="Azarmehr">
                  <div class="font-card-sample">من اینطوریم</div>
                  <div class="font-card-name">آذرمهر</div>
                </div>
                <div class="font-card-item" data-font="IRANSans">
                  <div class="font-card-sample">من اینطوریم</div>
                  <div class="font-card-name">ایران‌سنس</div>
                </div>
                <div class="font-card-item" data-font="Pelak">
                  <div class="font-card-sample">من اینطوریم</div>
                  <div class="font-card-name">پلاک</div>
                </div>
                <div class="font-card-item" data-font="YekanBakh">
                  <div class="font-card-sample">من اینطوریم</div>
                  <div class="font-card-name">یکان‌‌بخ</div>
                </div>
                <div class="font-card-item" data-font="Peyda">
                  <div class="font-card-sample">من اینطوریم</div>
                  <div class="font-card-name">پیدا</div>
                </div>
                <label class="font-card-item font-card-upload" id="upload-font-card" style="cursor: pointer;">
                  <div class="font-card-sample" id="upload-font-sample">➕ آپلود فونت</div>
                  <div class="font-card-name" id="upload-font-status">فایل TTF/WOFF2</div>
                  <input type="file" id="custom-font-file" accept=".woff2,.woff,.ttf,.otf" style="display: none;">
                </label>
              </div>
            </div>`;

  // حذف فونت از هر جایی که خارج از تب افتاده باشد
  html = html.replace(/<!-- بخش فونت‌ها[\s\S]*?<\/label>\s*<\/div>\s*<\/div>/g, '');
  html = html.replace(/<div class="settings-form-row">\s*<label class="settings-field-label">فونت[\s\S]*?<\/label>\s*<\/div>\s*<\/div>/g, '');

  // افزودن مجدد بخش فونت دقیقاً به انتهای تب pane-theme (قبل از بسته شدن آن)
  const themePaneTarget = `<div class="settings-tab-pane" id="pane-theme">`;
  if (html.includes(themePaneTarget)) {
    // بازنویسی دقیق تب pane-theme
    const fullThemePane = `          <!-- تب تم و رنگ با اسلایدر بلور خالص و فونت -->
          <div class="settings-tab-pane" id="pane-theme">
            <div class="settings-form-row">
              <label class="settings-field-label">تم رنگی<span class="sub-tip">انتخاب حالت نمایشی دستیار</span></label>
              <div class="theme-modes-grid">
                <div class="theme-mode-btn" data-mode="auto" id="theme-btn-auto">
                  <div class="mode-circle-preview mode-circle-auto"><span class="auto-mode-icon">🌓</span></div>
                  <span>خودکار</span>
                </div>
                <div class="theme-mode-btn" data-mode="dark" id="theme-btn-dark">
                  <div class="mode-circle-preview" style="background: #0f172a; border: 1.5px solid #334155; color: #f8fafc;">🌙</div>
                  <span>دارک</span>
                </div>
                <div class="theme-mode-btn active" data-mode="light" id="theme-btn-light">
                  <div class="mode-circle-preview" style="background: #ffffff; border: 1.5px solid #cbd5e1; color: #eab308;">☀️</div>
                  <span>لایت</span>
                </div>
              </div>
            </div>

            <!-- تنظیم بلور خالص (بدون تغییر رنگ و تیرگی) -->
            <div class="settings-form-row">
              <label class="settings-field-label">بلور داشبورد اصلی<span class="sub-tip">میزان تاری پشت کارت‌های اصلی: <strong id="val-dash-blur">۲۵٪</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">بلور پاپ‌آپ‌ها و دراورها<span class="sub-tip">میزان تاری پنجره‌های بازشونده: <strong id="val-popup-blur">۶۵٪</strong></span></label>
              <input type="range" id="slider-popup-blur" min="0" max="100" value="65" class="glass-slider">
            </div>

            <div class="blur-actions-bar" style="display: flex; gap: 10px; margin-top: 6px;">
              <button type="button" id="blur-save-btn" class="location-chip" style="background: var(--accent-color, #2563eb); color: #fff; padding: 8px 18px; font-weight: bold; cursor: pointer;">تأیید ماتی ✓</button>
              <button type="button" id="blur-cancel-btn" class="location-chip" style="padding: 8px 18px; cursor: pointer;">انصراف ✕</button>
            </div>

            <!-- انتخاب رنگ اصلی -->
            <div class="settings-form-row">
              <label class="settings-field-label">رنگ اصلی دستیار<span class="sub-tip">رنگ دکمه‌ها، متن‌های مهم و تقویم را عوض کنید.</span></label>
              <div class="theme-colors-grid">
                <div class="color-palette-circle active" data-color="#2563eb" style="background: #2563eb;" title="آبی">✓</div>
                <div class="color-palette-circle" data-color="#ef4444" style="background: #ef4444;" title="قرمز"></div>
                <div class="color-palette-circle" data-color="#10b981" style="background: #10b981;" title="سبز"></div>
                <div class="color-palette-circle" data-color="#39ff14" style="background: #39ff14;" title="سبز فسفری"></div>
                <div class="rgb-picker-box" style="display: flex; align-items: center; gap: 6px;">
                  <div class="color-picker-wrapper" title="انتخاب رنگ دلخواه">
                    <span>🎨</span>
                    <input type="color" id="rgb-color-picker" value="#2563eb">
                  </div>
                  <button type="button" id="rgb-confirm-btn" class="location-chip" style="font-size: 0.78rem; padding: 6px 12px; font-weight: bold;">تأیید ✓</button>
                </div>
              </div>
            </div>

${fontRowTemplate}
          </div>`;

    html = html.replace(/<div class="settings-tab-pane" id="pane-theme">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, fullThemePane + '\n        </div>\n      </div>');
  }

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ بخش فونت‌ها مقید به تب تم شد و از سایر تب‌ها حذف گردید.');
}

// ۲. اعمال موتور بلور خالص (Pure Blur Filter Engine) در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const pureBlurScript = `
  // ========================================================
  // موتور بلور خالص CSS (بدون لایه‌های رنگی تیره یا کدر)
  // ========================================================
  const sDashBlur = document.getElementById('slider-dash-blur');
  const sPopupBlur = document.getElementById('slider-popup-blur');
  const lblDashBlur = document.getElementById('val-dash-blur');
  const lblPopupBlur = document.getElementById('val-popup-blur');
  const btnConfirmBlur = document.getElementById('blur-save-btn');
  const btnDismissBlur = document.getElementById('blur-cancel-btn');
  const settingsModalRoot = document.getElementById('view-settings');

  const DEFAULT_D_BLUR = '25';
  const DEFAULT_P_BLUR = '65';

  function applyPureBlur(dPercent, pPercent) {
    const dP = Math.max(0, Math.min(100, parseInt(dPercent, 10)));
    const pP = Math.max(0, Math.min(100, parseInt(pPercent, 10)));

    if (lblDashBlur) lblDashBlur.textContent = toFa(dP) + '٪';
    if (lblPopupBlur) lblPopupBlur.textContent = toFa(pP) + '٪';

    // تبدیل مستقیم ۰٪ تا ۱۰۰٪ به بلور خالص ۰px تا ۶۰px داشبورد و تا ۸۵px پاپ‌آپ‌ها
    const dPx = (dP * 0.6).toFixed(1);
    const pPx = (pP * 0.85).toFixed(1);

    let styleTag = document.getElementById('pure-blur-dynamic-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'pure-blur-dynamic-style';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = \`
      .ios-glass-card:not(.settings-modal-card) {
        backdrop-filter: blur(\${dPx}px) !important;
        -webkit-backdrop-filter: blur(\${dPx}px) !important;
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
        backdrop-filter: blur(\${pPx}px) !important;
        -webkit-backdrop-filter: blur(\${pPx}px) !important;
      }
    \`;
  }

  function previewPureBlur() {
    const d = sDashBlur ? sDashBlur.value : (localStorage.getItem('saved_pure_d_blur') || DEFAULT_D_BLUR);
    const p = sPopupBlur ? sPopupBlur.value : (localStorage.getItem('saved_pure_p_blur') || DEFAULT_P_BLUR);
    applyPureBlur(d, p);
  }

  if (sDashBlur) sDashBlur.oninput = previewPureBlur;
  if (sPopupBlur) sPopupBlur.oninput = previewPureBlur;

  const initPureD = localStorage.getItem('saved_pure_d_blur') || DEFAULT_D_BLUR;
  const initPureP = localStorage.getItem('saved_pure_p_blur') || DEFAULT_P_BLUR;
  if (sDashBlur) sDashBlur.value = initPureD;
  if (sPopupBlur) sPopupBlur.value = initPureP;
  applyPureBlur(initPureD, initPureP);

  if (btnConfirmBlur) {
    btnConfirmBlur.onclick = (e) => {
      e.stopPropagation();
      localStorage.setItem('saved_pure_d_blur', sDashBlur ? sDashBlur.value : DEFAULT_D_BLUR);
      localStorage.setItem('saved_pure_p_blur', sPopupBlur ? sPopupBlur.value : DEFAULT_P_BLUR);
      previewPureBlur();

      if (settingsModalRoot) settingsModalRoot.classList.remove('active');
      document.getElementById('view-dashboard')?.classList.add('active');
      document.getElementById('dock-home-btn')?.classList.add('active');
    };
  }

  if (btnDismissBlur) {
    btnDismissBlur.onclick = (e) => {
      e.stopPropagation();
      localStorage.setItem('saved_pure_d_blur', DEFAULT_D_BLUR);
      localStorage.setItem('saved_pure_p_blur', DEFAULT_P_BLUR);

      if (sDashBlur) sDashBlur.value = DEFAULT_D_BLUR;
      if (sPopupBlur) sPopupBlur.value = DEFAULT_P_BLUR;
      applyPureBlur(DEFAULT_D_BLUR, DEFAULT_P_BLUR);

      if (settingsModalRoot) settingsModalRoot.classList.remove('active');
      document.getElementById('view-dashboard')?.classList.add('active');
      document.getElementById('dock-home-btn')?.classList.add('active');
    };
  }
`;

  // پاک کردن موتور قبلی و جایگزینی با سیستم بلور خالص
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور سه‌‌گانه ماتی[\s\S]*?btnDismissBlur\.onclick[\s\S]*?\};?\s*\}\s*/g, '');
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور بلور خالص CSS[\s\S]*?btnDismissBlur\.onclick[\s\S]*?\};?\s*\}\s*/g, '');
  js += '\n' + pureBlurScript;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ موتور بلور خالص CSS بدون لایه رنگی در script.js فعال شد.');
}