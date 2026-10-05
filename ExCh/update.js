const fs = require('fs');

// ۱. اصلاح دکمه‌های تصویر زمینه در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  // رفع بیرون‌زدگی دکمه بازنشانی در تب تصویر زمینه (عکس ۱)
  const fixedWallpaperActions = `              <div class="settings-bg-actions" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; max-width: 100%;">
                <label class="settings-btn-upload location-chip" style="cursor: pointer; padding: 9px 14px; font-size: 0.85rem; white-space: nowrap;">
                  📁 انتخاب عکس
                  <input type="file" id="settings-bg-file" accept="image/*" style="display: none;">
                </label>
                <button class="settings-btn-action location-chip" id="settings-blur-toggle" type="button" style="padding: 9px 14px; font-size: 0.85rem; white-space: nowrap;">✨ وضعیت بلر: <span id="settings-blur-status">شفاف</span></button>
                <button class="settings-btn-action location-chip" id="settings-reset-bg" type="button" style="color: #ef4444; padding: 9px 14px; font-size: 0.85rem; white-space: nowrap;">↺ بازنشانی</button>
              </div>`;

  html = html.replace(/<div class="settings-bg-actions"[\s\S]*?<\/div>/, fixedWallpaperActions);

  // پاک کردن آیکون اضافی داخل پیش‌نمایش حالت خودکار (عکس ۲)
  html = html.replace(
    /<div class="mode-circle-preview mode-circle-auto">[\s\S]*?<\/div>/,
    '<div class="mode-circle-preview mode-circle-auto"></div>'
  );

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ چیدمان دکمه‌های تصویر زمینه در newtab.html اصلاح شد.');
}

// ۲. حل قطعی اولویت بلر و استایل تیک تم در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const blurAndThemePatch = `
/* ========================================================
   تیک اختصاصی تم‌ها و اعمال متغیرهای ماتی
   ======================================================== */
.theme-mode-btn {
  position: relative !important;
}

.theme-mode-btn .mode-circle-preview {
  position: relative !important;
  font-size: 1.1rem !important;
  font-weight: bold !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* تیک خوردن حالت انتخابی (عکس ۲) */
.theme-mode-btn.active .mode-circle-preview::after {
  content: '✓';
  position: absolute;
  font-size: 1.2rem;
  font-weight: 900;
  color: #2563eb;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
.theme-mode-btn.active .mode-circle-preview {
  border: 2.5px solid #2563eb !important;
  transform: scale(1.1) !important;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.4) !important;
}

/* آیکون گرد و مدرن خودکار */
.mode-circle-auto {
  background: linear-gradient(135deg, #0f172a 50%, #ffffff 50%) !important;
  border: 1.5px solid #64748b !important;
}

/* اصلاح کانتینر محتوای تنظیمات */
.settings-content-container {
  overflow-x: hidden !important;
}
`;

  if (!css.includes('/* تیک اختصاصی تم‌ها و اعمال متغیرهای ماتی */')) {
    css += '\n' + blurAndThemePatch;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل‌های تیک تم در style.css افزوده شدند.');
  }
}

// ۳. اتصال مستقیم موتور ماتی و تیک تم در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const directBlurEngine = `
  // موتور مستقیم اعمال ماتی به کل عناصر داشبورد و پاپ‌آپ‌ها
  function injectDynamicBlurStyles(dashBlurPx, popupBlurPx) {
    let styleTag = document.getElementById('live-custom-blur-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'live-custom-blur-style';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = \`
      .ios-glass-card:not(.settings-modal-card) {
        backdrop-filter: blur(\${dashBlurPx}px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(\${dashBlurPx}px) saturate(200%) !important;
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
        backdrop-filter: blur(\${popupBlurPx}px) saturate(240%) !important;
        -webkit-backdrop-filter: blur(\${popupBlurPx}px) saturate(240%) !important;
      }
    \`;
  }

  // رویداد اسلایدرهای ماتی (۰ شفاف و ۱۰۰ کاملاً مات)
  const sliderD = document.getElementById('slider-dash-blur');
  const sliderP = document.getElementById('slider-popup-blur');
  const labelD = document.getElementById('val-dash-blur');
  const labelP = document.getElementById('val-popup-blur');

  function updateBlurFromInputs() {
    const dVal = sliderD ? parseInt(sliderD.value, 10) : 25;
    const pVal = sliderP ? parseInt(sliderP.value, 10) : 65;

    if (labelD) labelD.textContent = toFa(dVal) + '٪';
    if (labelP) labelP.textContent = toFa(pVal) + '٪';

    // تبدیل ۰ تا ۱۰۰ درصد به بازه ۰ تا ۸۰ پیکسل برای بلر واقعی
    const dPx = (dVal * 0.7).toFixed(1);
    const pPx = (pVal * 0.9).toFixed(1);

    injectDynamicBlurStyles(dPx, pPx);
  }

  if (sliderD) sliderD.oninput = updateBlurFromInputs;
  if (sliderP) sliderP.oninput = updateBlurFromInputs;

  const btnSaveBlur = document.getElementById('blur-save-btn');
  const btnCancelBlur = document.getElementById('blur-cancel-btn');

  let savedDashVal = localStorage.getItem('blur_d_saved') || '25';
  let savedPopupVal = localStorage.getItem('blur_p_saved') || '65';

  if (sliderD) sliderD.value = savedDashVal;
  if (sliderP) sliderP.value = savedPopupVal;
  updateBlurFromInputs();

  if (btnSaveBlur) {
    btnSaveBlur.onclick = () => {
      savedDashVal = sliderD.value;
      savedPopupVal = sliderP.value;
      localStorage.setItem('blur_d_saved', savedDashVal);
      localStorage.setItem('blur_p_saved', savedPopupVal);
      updateBlurFromInputs();
      alert('میزان ماتی با موفقیت ذخیره شد ✓');
    };
  }

  if (btnCancelBlur) {
    btnCancelBlur.onclick = () => {
      if (sliderD) sliderD.value = savedDashVal;
      if (sliderP) sliderP.value = savedPopupVal;
      updateBlurFromInputs();
    };
  }

  // رویداد انتخاب تم و تیک خوردن (عکس ۲)
  function setupThemeModeTicks() {
    const modeBtns = document.querySelectorAll('.theme-mode-btn');
    const savedMode = localStorage.getItem('theme_mode_choice') || 'auto';

    function setMode(mode) {
      modeBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.mode === mode);
      });

      if (mode === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', mode);
      }
      localStorage.setItem('theme_mode_choice', mode);
    }

    modeBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        setMode(btn.dataset.mode);
      };
    });

    setMode(savedMode);
  }
  setupThemeModeTicks();
`;

  // پاک کردن و اتصال نسخه نهایی موتور بلر
  js = js.replace(/\/\/ موتور مستقیم اعمال ماتی[\s\S]*?setupThemeModeTicks\(\);/g, '');
  js += '\n' + directBlurEngine;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ موتور زنده ماتی و تیک حالت‌های تم در script.js اعمال شد.');
}