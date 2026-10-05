const fs = require('fs');

// ۱. بازسازی دقیق تب pane-theme در newtab.html تا هیچ تگی بیرون نزند
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  // حذف هرگونه بلوک فونت که احیاناً بیرون افتاده باشد
  html = html.replace(/<div class="settings-form-row">\s*<label class="settings-field-label">فونت[\s\S]*?<\/label>\s*<\/div>\s*<\/div>/g, '');

  const completeThemePane = `          <!-- تب تم و رنگ (شامل ماتی زنده و فونت به صورت محصور شده) -->
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

            <!-- اسلایدرهای ماتی با برچسب‌های درصد مجزا -->
            <div class="settings-form-row">
              <label class="settings-field-label">ماتی داشبورد اصلی<span class="sub-tip">میزان بلر کارت‌های اصلی: <strong id="val-dash-blur">٪۲۵</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">ماتی و پوشانندگی پاپ‌آپ‌ها<span class="sub-tip">میزان پوشش پنجره‌های بازشونده: <strong id="val-popup-blur">٪۶۵</strong></span></label>
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

            <!-- بخش فونت‌ها کاملاً درون تب تم و رنگ -->
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
            </div>
          </div>`;

  // جایگزینی کل ساختار تب تم
  html = html.replace(/<div class="settings-tab-pane" id="pane-theme">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/, completeThemePane + '\n        </div>\n      </div>\n    </div>\n  </section>');

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ ساختار تب تم در newtab.html کاملاً کپسوله‌سازی و اصلاح شد.');
}

// ۲. حل مشکل عدم تغییر درصد و اعمال در لحظه بلر در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const solidLiveBlurFix = `
  // ========================================================
  // موتور پایدار ماتی زنده، درصد فارسی و بستن پاپ‌آپ
  // ========================================================
  (function initBulletproofBlur() {
    const sDash = document.getElementById('slider-dash-blur');
    const sPopup = document.getElementById('slider-popup-blur');
    const lDash = document.getElementById('val-dash-blur');
    const lPopup = document.getElementById('val-popup-blur');
    const btnSave = document.getElementById('blur-save-btn');
    const btnCancel = document.getElementById('blur-cancel-btn');
    const modalSettings = document.getElementById('view-settings');

    // تابع مستقل تبدیل عدد به فارسی بدون وابستگی
    function formatFaPercent(num) {
      const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return '٪' + String(num).replace(/\\d/g, d => farsiDigits[d]);
    }

    let savedD = localStorage.getItem('blur_dash_val') || '25';
    let savedP = localStorage.getItem('blur_popup_val') || '65';

    function setLiveBlur(dVal, pVal) {
      const d = parseInt(dVal, 10);
      const p = parseInt(pVal, 10);

      // آپدیت متن درصد در همان لحظه حرکت اسلایدر
      if (lDash) lDash.textContent = formatFaPercent(d);
      if (lPopup) lPopup.textContent = formatFaPercent(p);

      const dPx = (d * 0.7).toFixed(1);
      const pPx = (p * 0.95).toFixed(1);

      // کنترل شفافیت و بلر بدون تداخل
      const dAlpha = (d / 100 * 0.35).toFixed(2);
      const pAlpha = (0.20 + (p / 100 * 0.55)).toFixed(2);

      let styleTag = document.getElementById('live-custom-blur-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'live-custom-blur-style';
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = \`
        .ios-glass-card:not(.settings-modal-card) {
          backdrop-filter: blur(\${dPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(\${dPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, \${dAlpha}) !important;
        }
        [data-theme="dark"] .ios-glass-card:not(.settings-modal-card) {
          background: rgba(15, 23, 42, \${dAlpha}) !important;
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
          backdrop-filter: blur(\${pPx}px) saturate(220%) !important;
          -webkit-backdrop-filter: blur(\${pPx}px) saturate(220%) !important;
          background: rgba(255, 255, 255, \${pAlpha}) !important;
        }
        [data-theme="dark"] .glass-blur-menu,
        [data-theme="dark"] .forecast-drawer,
        [data-theme="dark"] .clock-drawer,
        [data-theme="dark"] .settings-modal-card {
          background: rgba(15, 21, 37, \${pAlpha}) !important;
        }
      \`;
    }

    // متصل کردن رویداد مستقیم کشیدن اسلایدر (input)
    if (sDash) {
      sDash.value = savedD;
      sDash.addEventListener('input', () => {
        setLiveBlur(sDash.value, sPopup ? sPopup.value : savedP);
      });
    }

    if (sPopup) {
      sPopup.value = savedP;
      sPopup.addEventListener('input', () => {
        setLiveBlur(sDash ? sDash.value : savedD, sPopup.value);
      });
    }

    // اعمال مقدار ذخیره شده در شروع
    setLiveBlur(savedD, savedP);

    // دکمه تأیید ماتی: ذخیره دائمی و بستن پاپ‌آپ
    if (btnSave) {
      btnSave.onclick = (e) => {
        e.stopPropagation();
        savedD = sDash ? sDash.value : savedD;
        savedP = sPopup ? sPopup.value : savedP;
        localStorage.setItem('blur_dash_val', savedD);
        localStorage.setItem('blur_popup_val', savedP);
        setLiveBlur(savedD, savedP);

        if (modalSettings) modalSettings.classList.remove('active');
        document.getElementById('view-dashboard')?.classList.add('active');
        document.getElementById('dock-home-btn')?.classList.add('active');
      };
    }

    // دکمه انصراف: برگرداندن درصدها و ماتی به مقدار قبلی و بستن پاپ‌آپ
    if (btnCancel) {
      btnCancel.onclick = (e) => {
        e.stopPropagation();
        if (sDash) sDash.value = savedD;
        if (sPopup) sPopup.value = savedP;
        setLiveBlur(savedD, savedP);

        if (modalSettings) modalSettings.classList.remove('active');
        document.getElementById('view-dashboard')?.classList.add('active');
        document.getElementById('dock-home-btn')?.classList.add('active');
      };
    }
  })();
`;

  // جایگزینی تمیز کدهای بلر
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور بلر زنده[\s\S]*?\}\)\(\);/g, '');
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور پایدار ماتی[\s\S]*?\}\)\(\);/g, '');
  js += '\n' + solidLiveBlurFix;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ رفع مشکل درصد و ماتی زنده در script.js اعمال شد.');
}