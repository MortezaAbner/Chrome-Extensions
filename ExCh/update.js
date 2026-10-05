const fs = require('fs');

// ۱. اصلاح استایل‌ها، اسکرول‌بارها، تم رنگی و اسلایدرها در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const customThemeCss = `
/* ==========================================
   ۱. اسکرول‌بار اختصاصی و شیک مطابق عکس ۲
   ========================================== */
* {
  scrollbar-width: none; /* پنهان‌سازی اسکرول در تمام صفحه */
}
*::-webkit-scrollbar {
  display: none;
}

/* اسکرول‌بار فقط در پنجره تنظیمات و بخش‌های داخلی */
.settings-content-container,
.settings-layout-body,
.settings-tab-pane {
  scrollbar-width: thin !important;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent !important;
}
.settings-content-container::-webkit-scrollbar,
.settings-layout-body::-webkit-scrollbar,
.settings-tab-pane::-webkit-scrollbar {
  display: block !important;
  width: 5px !important;
}
.settings-content-container::-webkit-scrollbar-track,
.settings-layout-body::-webkit-scrollbar-track,
.settings-tab-pane::-webkit-scrollbar-track {
  background: transparent !important;
}
.settings-content-container::-webkit-scrollbar-thumb,
.settings-layout-body::-webkit-scrollbar-thumb,
.settings-tab-pane::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25) !important;
  border-radius: 10px !important;
}
[data-theme="dark"] .settings-content-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15) !important;
}

/* ==========================================
   ۲. پالت تم، رنگ اصلی و اسلایدرهای ماتی
   ========================================== */
.theme-modes-grid, .theme-colors-grid {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 10px;
}
.theme-mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text-main);
  font-size: 0.82rem;
  font-weight: 750;
}
.mode-circle-preview {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, border-color 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}
.theme-mode-btn.active .mode-circle-preview {
  border-color: var(--accent-color);
  transform: scale(1.08);
}

.color-palette-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  border: 2.5px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  transition: transform 0.2s, border-color 0.2s;
}
.color-palette-circle.active {
  border-color: #fff;
  transform: scale(1.12);
  box-shadow: 0 0 12px rgba(255,255,255,0.4);
}
.color-picker-wrapper {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px dashed rgba(255,255,255,0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.color-picker-wrapper input[type="color"] {
  position: absolute;
  top: -10px; left: -10px;
  width: 60px; height: 60px;
  opacity: 0;
  cursor: pointer;
}

/* فونت‌های انتخابی و دکمه آپلود فونت شخصی */
.font-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
}
.font-card-item {
  background: rgba(255, 255, 255, 0.3);
  border: 1.5px solid var(--glass-border);
  border-radius: 14px;
  padding: 12px 6px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.2s;
}
.font-card-item:hover, .font-card-item.active {
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.45);
}
.font-card-sample { font-size: 0.95rem; font-weight: 800; color: var(--text-main); }
.font-card-name { font-size: 0.72rem; color: var(--text-muted); }

.font-card-upload {
  background: rgba(37, 99, 235, 0.12);
  border: 1.5px dashed var(--accent-color);
  color: var(--accent-color);
}
.font-card-upload:hover {
  background: rgba(37, 99, 235, 0.22);
}

/* اعمال رنگ داینامیک اکسنت روی المان‌های شاخص */
.today-circle,
.task-mode-btn.active,
.picker-confirm-btn,
.modal-btn.save,
.quick-task-btn {
  background: var(--accent-color) !important;
  box-shadow: 0 4px 14px var(--accent-color) !important;
}
`;

  if (!css.includes('/* ۱. اسکرول‌بار اختصاصی و شیک مطابق عکس ۲ */')) {
    css += '\n' + customThemeCss;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل‌های اسکرول، پالت رنگ و فونت در style.css اعمال شد.');
  }
}

// ۲. به‌‌روزرسانی ساختار تب «تم و رنگ» در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  const themeTabPane = `
          <!-- تب تم و رنگ مطابق عکس ۳ -->
          <div class="settings-tab-pane" id="pane-theme">
            <!-- تم رنگی کلی -->
            <div class="settings-form-row">
              <label class="settings-field-label">تم رنگی<span class="sub-tip">انتخاب کنید که دستیارتون چه رنگی باشه!</span></label>
              <div class="theme-modes-grid">
                <div class="theme-mode-btn active" data-mode="glass">
                  <div class="mode-circle-preview" style="background: rgba(255,255,255,0.3); backdrop-filter: blur(15px); border: 2px solid #38bdf8;">✓</div>
                  <span>شیشه‌ای</span>
                </div>
                <div class="theme-mode-btn" data-mode="auto">
                  <div class="mode-circle-preview" style="background: linear-gradient(135deg, #1e293b 50%, #f8fafc 50%);">🌓</div>
                  <span>خودکار</span>
                </div>
                <div class="theme-mode-btn" data-mode="dark">
                  <div class="mode-circle-preview" style="background: #0f172a; border: 1px solid #334155;">🌙</div>
                  <span>دارک</span>
                </div>
                <div class="theme-mode-btn" data-mode="light">
                  <div class="mode-circle-preview" style="background: #ffffff; border: 1px solid #e2e8f0;">☀️</div>
                  <span>لایت</span>
                </div>
              </div>
            </div>

            <!-- میزان ماتی شیشه به صورت صفر تا صد -->
            <div class="settings-form-row">
              <label class="settings-field-label">ماتی داشبورد اصلی<span class="sub-tip">میزان بلر و ماتی کارت‌های اصلی: <strong id="val-dash-blur">۲۵٪</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">ماتی و پوشانندگی پاپ‌آپ‌ها<span class="sub-tip">میزان پوشش و ماتی پنجره‌های بازشونده: <strong id="val-popup-blur">۶۵٪</strong></span></label>
              <input type="range" id="slider-popup-blur" min="0" max="100" value="65" class="glass-slider">
            </div>

            <!-- رنگ اصلی دستیار بدون ستاره و با RGB داینامیک -->
            <div class="settings-form-row">
              <label class="settings-field-label">رنگ اصلی دستیار<span class="sub-tip">رنگ دکمه‌ها، متن‌های مهم و تقویم را عوض کنید.</span></label>
              <div class="theme-colors-grid">
                <div class="color-palette-circle active" data-color="#2563eb" style="background: #2563eb;">✓</div>
                <div class="color-palette-circle" data-color="#ef4444" style="background: #ef4444;"></div>
                <div class="color-palette-circle" data-color="#10b981" style="background: #10b981;"></div>
                <div class="color-palette-circle" data-color="#39ff14" style="background: #39ff14;"></div>
                <div class="color-picker-wrapper" title="انتخاب رنگ RGB دلخواه">
                  <span>🎨</span>
                  <input type="color" id="rgb-color-picker" value="#2563eb">
                </div>
              </div>
            </div>

            <!-- بخش فونت‌ها با دکمه آپلود فونت شخصی در پایین سمت چپ -->
            <div class="settings-form-row">
              <label class="settings-field-label">فونت<span class="sub-tip">فونت مورد نظرتو انتخاب کن یا فونت دلخواهتو اضافه کن.</span></label>
              <div class="font-cards-grid" id="font-options-container">
                <div class="font-card-item active" data-font="Vazirmatn">
                  <div class="font-card-sample" style="font-family: Vazirmatn, sans-serif;">من اینطوریم</div>
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
                  <div class="font-card-name">یکان‌بخ</div>
                </div>
                <div class="font-card-item" data-font="Peyda">
                  <div class="font-card-sample">من اینطوریم</div>
                  <div class="font-card-name">پیدا</div>
                </div>
                <!-- دکمه آپلود فونت به جای گزینه آخر سمت چپ -->
                <label class="font-card-item font-card-upload">
                  <div class="font-card-sample">➕ آپلود فونت</div>
                  <div class="font-card-name">فایل TTF/WOFF2</div>
                  <input type="file" id="custom-font-file" accept=".woff2,.woff,.ttf,.otf" style="display: none;">
                </label>
              </div>
            </div>
          </div>
`;

  if (html.includes('<div class="settings-tab-pane" id="pane-theme">')) {
    html = html.replace(/<div class="settings-tab-pane" id="pane-theme">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, themeTabPane + '\n        </div>\n      </div>');
  }

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ فرم و فیلدهای تب تم و رنگ در newtab.html جایگزین شدند.');
}

// ۳. لاجیک رنگ داینامیک، ماتی صفر تا صد، فونت و آپلود در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const advancedThemeLogic = `
  // ==========================================
  // سیستم پیشرفته تم و رنگ، ماتی، رنگ اصلی و فونت
  // ==========================================

  // ۱. کنترل رنگ اصلی و پالت RGB
  function setDashboardAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('dash_accent_color', color);

    document.querySelectorAll('.color-palette-circle').forEach(c => {
      if (c.dataset.color === color) {
        c.classList.add('active');
        c.textContent = '✓';
      } else {
        c.classList.remove('active');
        c.textContent = '';
      }
    });
  }

  document.querySelectorAll('.color-palette-circle').forEach(btn => {
    btn.onclick = () => setDashboardAccentColor(btn.dataset.color);
  });

  const rgbPicker = document.getElementById('rgb-color-picker');
  if (rgbPicker) {
    rgbPicker.oninput = (e) => setDashboardAccentColor(e.target.value);
  }

  const savedColor = localStorage.getItem('dash_accent_color') || '#2563eb';
  setDashboardAccentColor(savedColor);

  // ۲. کنترل ماتی ۰ تا ۱۰۰ درصد
  const sDashBlur = document.getElementById('slider-dash-blur');
  const sPopupBlur = document.getElementById('slider-popup-blur');
  const txtDashBlur = document.getElementById('val-dash-blur');
  const txtPopupBlur = document.getElementById('val-popup-blur');

  function applyFrostedSettings(dPct, pPct) {
    if (txtDashBlur) txtDashBlur.textContent = toFa(dPct) + '٪';
    if (txtPopupBlur) txtPopupBlur.textContent = toFa(pPct) + '٪';

    const dPx = (dPct * 0.6).toFixed(1); // 0 to 60px
    const pPx = (pPct * 0.9).toFixed(1); // 0 to 90px

    document.querySelectorAll('.ios-glass-card:not(.settings-modal-card)').forEach(el => {
      el.style.setProperty('backdrop-filter', 'blur(' + dPx + 'px) saturate(200%)', 'important');
      el.style.setProperty('-webkit-backdrop-filter', 'blur(' + dPx + 'px) saturate(200%)', 'important');
    });

    const popups = '.glass-blur-menu, .forecast-drawer, .clock-drawer, .azan-city-dropdown, .month-year-picker-modal, .date-event-popup, .task-tool-popup, .location-modal-box, .settings-modal-card';
    document.querySelectorAll(popups).forEach(el => {
      el.style.setProperty('backdrop-filter', 'blur(' + pPx + 'px) saturate(250%)', 'important');
      el.style.setProperty('-webkit-backdrop-filter', 'blur(' + pPx + 'px) saturate(250%)', 'important');
    });
  }

  if (sDashBlur) {
    sDashBlur.oninput = (e) => {
      localStorage.setItem('blur_dash_pct', e.target.value);
      applyFrostedSettings(e.target.value, sPopupBlur ? sPopupBlur.value : 65);
    };
  }

  if (sPopupBlur) {
    sPopupBlur.oninput = (e) => {
      localStorage.setItem('blur_popup_pct', e.target.value);
      applyFrostedSettings(sDashBlur ? sDashBlur.value : 25, e.target.value);
    };
  }

  const initDPct = localStorage.getItem('blur_dash_pct') || '25';
  const initPPct = localStorage.getItem('blur_popup_pct') || '65';
  if (sDashBlur) sDashBlur.value = initDPct;
  if (sPopupBlur) sPopupBlur.value = initPPct;
  applyFrostedSettings(initDPct, initPPct);

  // ۳. مدیریت فونت‌ها و آپلود فونت سفارشی
  function setDashboardFont(fontName) {
    document.body.style.fontFamily = fontName + ', system-ui, -apple-system, sans-serif';
    localStorage.setItem('dash_active_font', fontName);
    document.querySelectorAll('.font-card-item').forEach(c => {
      c.classList.toggle('active', c.dataset.font === fontName);
    });
  }

  document.querySelectorAll('.font-card-item:not(.font-card-upload)').forEach(card => {
    card.onclick = () => setDashboardFont(card.dataset.font);
  });

  const fontFileInput = document.getElementById('custom-font-file');
  if (fontFileInput) {
    fontFileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const fontData = evt.target.result;
        const fontName = 'UserCustomFont';
        const newStyle = document.createElement('style');
        newStyle.textContent = '@font-face { font-family: "' + fontName + '"; src: url(' + fontData + '); }';
        document.head.appendChild(newStyle);

        localStorage.setItem('custom_font_base64', fontData);
        setDashboardFont(fontName);
        alert('فونت دلخواه با موفقیت اعمال شد!');
      };
      reader.readAsDataURL(file);
    };
  }

  // بارگذاری فونت شخصی ذخیره‌شده از قبل
  const savedCustomFont = localStorage.getItem('custom_font_base64');
  if (savedCustomFont) {
    const s = document.createElement('style');
    s.textContent = '@font-face { font-family: "UserCustomFont"; src: url(' + savedCustomFont + '); }';
    document.head.appendChild(s);
  }
  const savedActiveFont = localStorage.getItem('dash_active_font');
  if (savedActiveFont) setDashboardFont(savedActiveFont);
`;

  if (!js.includes('setDashboardAccentColor')) {
    js = js.replace('updateDynamicBlur();', `updateDynamicBlur();\n${advancedThemeLogic}`);
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ منطق تم و رنگ، فونت و آپلود در script.js متصل شد.');
  }
}