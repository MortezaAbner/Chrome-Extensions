const fs = require('fs');

// ۱. تنظیم اسلایدرها و برچسب‌های درصد در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  const blurControlSection = `            <!-- اسلایدرهای زنده ماتی ۰ تا ۱۰۰ درصد -->
            <div class="settings-form-row">
              <label class="settings-field-label">ماتی داشبورد اصلی<span class="sub-tip">میزان بلر کارت‌های اصلی: <strong id="val-dash-blur">۲۵٪</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">ماتی و پوشانندگی پاپ‌آپ‌ها<span class="sub-tip">میزان پوشش پنجره‌های بازشونده: <strong id="val-popup-blur">۶۵٪</strong></span></label>
              <input type="range" id="slider-popup-blur" min="0" max="100" value="65" class="glass-slider">
            </div>

            <div class="blur-actions-bar" style="display: flex; gap: 10px; margin-top: 8px;">
              <button type="button" id="blur-save-btn" class="location-chip" style="background: var(--accent-color, #2563eb); color: #fff; padding: 8px 18px; font-weight: bold; cursor: pointer;">تأیید ماتی ✓</button>
              <button type="button" id="blur-cancel-btn" class="location-chip" style="padding: 8px 18px; cursor: pointer;">انصراف ✕</button>
            </div>`;

  // جایگزینی تمیز بخش اسلایدرها
  html = html.replace(/<div class="settings-form-row">\s*<label class="settings-field-label">ماتی داشبورد اصلی[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, blurControlSection + '\n            </div>');

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ ساختار اسلایدرهای ماتی در newtab.html به‌روزرسانی شد.');
}

// ۲. موتور بلر زنده، محاسبه پیکسل و دکمه‌های تایید و انصراف در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const liveBlurEngineScript = `
  // ========================================================
  // موتور بلر زنده ۰ تا ۱۰۰ با پیش‌نمایش آنی، تایید و انصراف
  // ========================================================
  (function initLiveBlurSystem() {
    const sliderDash = document.getElementById('slider-dash-blur');
    const sliderPopup = document.getElementById('slider-popup-blur');
    const labelDash = document.getElementById('val-dash-blur');
    const labelPopup = document.getElementById('val-popup-blur');
    const btnSave = document.getElementById('blur-save-btn');
    const btnCancel = document.getElementById('blur-cancel-btn');
    const settingsModal = document.getElementById('view-settings');

    // مقادیر ذخیره‌شده قبلی
    let committedDash = localStorage.getItem('blur_dash_val') || '25';
    let committedPopup = localStorage.getItem('blur_popup_val') || '65';

    function applyBlurStyles(dashPct, popupPct) {
      const d = parseInt(dashPct, 10);
      const p = parseInt(popupPct, 10);

      if (labelDash) labelDash.textContent = toFa(d) + '٪';
      if (labelPopup) labelPopup.textContent = toFa(p) + '٪';

      // ۰٪ دقیقاً 0px بدون تاری و ۱۰۰٪ نهایت ماتی
      const dashPx = (d * 0.70).toFixed(1);
      const popupPx = (p * 0.95).toFixed(1);

      // در ۰٪ زمینه کاملاً شفاف و بدون رنگ است، با افزایش درصد شیشه غلیظ‌تر می‌شود
      const dashAlpha = (d / 100 * 0.40).toFixed(2);
      const popupAlpha = (0.15 + (p / 100 * 0.60)).toFixed(2);

      let styleTag = document.getElementById('live-custom-blur-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'live-custom-blur-style';
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = \`
        /* کارت‌های داشبورد اصلی */
        .ios-glass-card:not(.settings-modal-card) {
          backdrop-filter: blur(\${dashPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(\${dashPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, \${dashAlpha}) !important;
        }
        [data-theme="dark"] .ios-glass-card:not(.settings-modal-card) {
          background: rgba(15, 23, 42, \${dashAlpha}) !important;
        }

        /* پاپ‌آپ‌ها، پنجره‌ها و دراورها */
        .glass-blur-menu,
        .forecast-drawer,
        .clock-drawer,
        .azan-city-dropdown,
        .month-year-picker-modal,
        .date-event-popup,
        .task-tool-popup,
        .location-modal-box,
        .settings-modal-card {
          backdrop-filter: blur(\${popupPx}px) saturate(220%) !important;
          -webkit-backdrop-filter: blur(\${popupPx}px) saturate(220%) !important;
          background: rgba(255, 255, 255, \${popupAlpha}) !important;
        }
        [data-theme="dark"] .glass-blur-menu,
        [data-theme="dark"] .forecast-drawer,
        [data-theme="dark"] .clock-drawer,
        [data-theme="dark"] .settings-modal-card {
          background: rgba(15, 21, 37, \${popupAlpha}) !important;
        }
      \`;
    }

    function onDrag() {
      const d = sliderDash ? sliderDash.value : committedDash;
      const p = sliderPopup ? sliderPopup.value : committedPopup;
      applyBlurStyles(d, p);
    }

    if (sliderDash) {
      sliderDash.value = committedDash;
      sliderDash.oninput = onDrag;
    }
    if (sliderPopup) {
      sliderPopup.value = committedPopup;
      sliderPopup.oninput = onDrag;
    }

    // اعمال مقدار ذخیره‌شده اولیه
    applyBlurStyles(committedDash, committedPopup);

    // زدن تأیید: ذخیره دائم و بستن پاپ‌آپ
    if (btnSave) {
      btnSave.onclick = (e) => {
        e.stopPropagation();
        committedDash = sliderDash ? sliderDash.value : committedDash;
        committedPopup = sliderPopup ? sliderPopup.value : committedPopup;
        localStorage.setItem('blur_dash_val', committedDash);
        localStorage.setItem('blur_popup_val', committedPopup);
        applyBlurStyles(committedDash, committedPopup);

        if (settingsModal) settingsModal.classList.remove('active');
        document.getElementById('view-dashboard')?.classList.add('active');
        document.getElementById('dock-home-btn')?.classList.add('active');
      };
    }

    // زدن انصراف: بازگشت به حالت قبلی و بستن پاپ‌آپ
    if (btnCancel) {
      btnCancel.onclick = (e) => {
        e.stopPropagation();
        if (sliderDash) sliderDash.value = committedDash;
        if (sliderPopup) sliderPopup.value = committedPopup;
        applyBlurStyles(committedDash, committedPopup);

        if (settingsModal) settingsModal.classList.remove('active');
        document.getElementById('view-dashboard')?.classList.add('active');
        document.getElementById('dock-home-btn')?.classList.add('active');
      };
    }
  })();
`;

  // پاک کردن اسکریپت‌های آزمایشی قبلی بلر و قرار دادن موتور جدید
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور سه‌‌گانه[\s\S]*?btnDismissBlur[\s\S]*?\};?\s*\}\s*/g, '');
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور بلور خالص[\s\S]*?btnDismissBlur[\s\S]*?\};?\s*\}\s*/g, '');
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور بلر زنده[\s\S]*?\}\)\(\);/g, '');

  js += '\n' + liveBlurEngineScript;
  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ موتور بلر زنده با بستن پنجره و ریست در script.js اعمال شد.');
}