const fs = require('fs');

// ۱. تنظیم ساختار HTML در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  const settingsSection = `  <!-- ۲. مودال تنظیمات -->
  <section id="view-settings" class="modal-overlay">
    <div class="settings-modal-card ios-glass-card glass-blur-menu">
      <div class="settings-card-header">
        <button class="settings-close-icon" id="settings-close-btn" title="بستن">✕</button>
        <div class="settings-header-title" id="settings-header-label">تنظیمات › عمومی</div>
      </div>

      <div class="settings-layout-body">
        <!-- ستون سایدبار منوها در سمت راست پنجره (عکس ۱) -->
        <div class="settings-sidebar-nav">
          <div class="nav-item-glass active" data-tab="general"><span class="nav-ico">⚙️</span> عمومی</div>
          <div class="nav-item-glass" data-tab="wallpaper"><span class="nav-ico">🖼️</span> تصویر زمینه</div>
          <div class="nav-item-glass" data-tab="theme"><span class="nav-ico">🎨</span> تم و رنگ</div>
          <div class="nav-item-glass" data-tab="calendar"><span class="nav-ico">📅</span> تقویم و زمان</div>
          <div class="nav-item-glass" data-tab="privacy"><span class="nav-ico">🔒</span> حریم شخصی</div>
          <div class="nav-divider"></div>
          <div class="nav-item-glass" data-tab="changes"><span class="nav-ico">📣</span> تغییرات اخیر</div>
          <div class="nav-item-glass" data-tab="feedback"><span class="nav-ico">💬</span> فیدبک به ما</div>
        </div>

        <!-- محتوای تنظیمات در سمت چپ سایدبار -->
        <div class="settings-content-container">
          <!-- تب عمومی -->
          <div class="settings-tab-pane active" id="pane-general">
            <div class="settings-form-row">
              <label class="settings-field-label">زبان<span class="sub-tip">انتخاب زبان پیش‌فرض</span></label>
              <select class="settings-select-glass">
                <option value="fa" selected>فارسی IR</option>
                <option value="en">English US</option>
              </select>
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">موتور جستجو<span class="sub-tip">انتخاب موتور جستجوی پیش‌فرض</span></label>
              <select class="settings-select-glass" id="settings-engine-select">
                <option value="google" selected>گوگل G</option>
                <option value="zarebin">ذره‌‌بین</option>
              </select>
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">شهر<span class="sub-tip">برای تنظیم آب و هوا</span></label>
              <select class="settings-select-glass" id="settings-city-select">
                <option value="تهران" selected>ایران، تهران</option>
                <option value="مشهد">ایران، مشهد</option>
                <option value="اصفهان">ایران، اصفهان</option>
                <option value="شیراز">ایران، شیراز</option>
                <option value="تبریز">ایران، تبریز</option>
              </select>
            </div>
          </div>

          <!-- تب تصویر زمینه -->
          <div class="settings-tab-pane" id="pane-wallpaper">
            <div class="settings-form-row">
              <label class="settings-field-label">تصویر زمینه شخصی<span class="sub-tip">بارگذاری تصویر از سیستم یا ریست به حالت پیش‌فرض</span></label>
              <div class="settings-bg-actions" style="display: flex; gap: 10px; margin-top: 10px;">
                <label class="settings-btn-upload location-chip" style="cursor: pointer; padding: 10px 16px;">
                  📁 انتخاب عکس
                  <input type="file" id="settings-bg-file" accept="image/*" style="display: none;">
                </label>
                <button class="settings-btn-action location-chip" id="settings-blur-toggle" type="button" style="padding: 10px 16px;">✨ وضعیت بلر: <span id="settings-blur-status">شفاف</span></button>
                <button class="settings-btn-action location-chip" id="settings-reset-bg" type="button" style="color: #ef4444; padding: 10px 16px;">↺ بازنشانی</button>
              </div>
            </div>
          </div>

          <!-- تب تم و رنگ (عکس ۲، ۳، ۴ و ۵) -->
          <div class="settings-tab-pane" id="pane-theme">
            <!-- تم رنگی ۳ حالته (عکس ۲) -->
            <div class="settings-form-row">
              <label class="settings-field-label">تم رنگی<span class="sub-tip">انتخاب حالت نمایشی دستیار</span></label>
              <div class="theme-modes-grid">
                <div class="theme-mode-btn" data-mode="auto" id="theme-btn-auto">
                  <div class="mode-circle-preview mode-circle-auto">🌓</div>
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

            <!-- میزان ماتی شیشه به صورت صفر تا صد همراه با دکمه تایید و انصراف (عکس ۳) -->
            <div class="settings-form-row">
              <label class="settings-field-label">ماتی داشبورد اصلی<span class="sub-tip">میزان بلر کارت‌های اصلی: <strong id="val-dash-blur">۲۵٪</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">ماتی و پوشانندگی پاپ‌آپ‌ها<span class="sub-tip">میزان پوشش پنجره‌های بازشونده: <strong id="val-popup-blur">۶۵٪</strong></span></label>
              <input type="range" id="slider-popup-blur" min="0" max="100" value="65" class="glass-slider">
            </div>

            <div class="blur-actions-bar" style="display: flex; gap: 10px; margin-top: 4px;">
              <button type="button" id="blur-save-btn" class="location-chip" style="background: var(--accent-color, #2563eb); color: #fff; padding: 6px 14px; font-weight: 700;">تأیید ماتی ✓</button>
              <button type="button" id="blur-cancel-btn" class="location-chip" style="padding: 6px 14px;">انصراف ✕</button>
            </div>

            <!-- انتخاب رنگ اصلی با پالت RGB و دکمه تایید (عکس ۴) -->
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

            <!-- بخش فونت‌ها با انتخاب آنی و تیک، به همراه آپلود فونت دلخواه (عکس ۵) -->
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
          </div>
        </div>
      </div>
    </div>
  </section>`;

  html = html.replace(/<section id="view-settings"[\s\S]*?<\/section>/, settingsSection);
  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ ساختار منوی تنظیمات در newtab.html به‌روزرسانی شد.');
}

// ۲. اصلاح استایل‌ها، حذف اسکرول افقی و متغیرهای سراسری بلر در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const advancedThemeStyle = `
/* ========================================================
   متغیرهای سراسری تم، بلر و تنظیمات بدون اسکرول افقی
   ======================================================== */
:root {
  --dash-blur: 25px;
  --popup-blur: 65px;
  --accent-color: #2563eb;
  --app-font: 'Vazirmatn', system-ui, -apple-system, sans-serif;
}

body {
  font-family: var(--app-font) !important;
}

/* اعمال مستقیم بلر روی داشبورد */
.ios-glass-card:not(.settings-modal-card) {
  backdrop-filter: blur(var(--dash-blur)) saturate(200%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur)) saturate(200%) !important;
}

/* اعمال مستقیم بلر روی پاپ‌آپ‌ها */
.glass-blur-menu,
.forecast-drawer,
.clock-drawer,
.azan-city-dropdown,
.month-year-picker-modal,
.date-event-popup,
.task-tool-popup,
.location-modal-box,
.settings-modal-card {
  backdrop-filter: blur(var(--popup-blur)) saturate(240%) !important;
  -webkit-backdrop-filter: blur(var(--popup-blur)) saturate(240%) !important;
}

/* جلوگیری کامل از اسکرول افقی و تنظیم ابعاد مودال (عکس ۱) */
.settings-modal-card {
  width: 860px !important;
  max-width: 95vw !important;
  max-height: 88vh !important;
  border-radius: 30px !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 24px !important;
  overflow: hidden !important;
  direction: rtl !important;
}

.settings-layout-body {
  display: flex !important;
  flex-direction: row !important;
  gap: 20px !important;
  margin-top: 14px !important;
  min-height: 400px !important;
  max-height: 65vh !important;
  overflow-x: hidden !important;
  overflow-y: hidden !important;
  direction: rtl !important;
}

.settings-content-container {
  flex: 1 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  padding-left: 10px !important;
  padding-right: 4px !important;
}

/* آیکون مدرن تم خودکار (عکس ۲) */
.mode-circle-auto {
  background: linear-gradient(135deg, #0f172a 50%, #ffffff 50%) !important;
  border: 1.5px solid #64748b !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
  font-size: 1.1rem !important;
}

/* المان‌های متأثر از رنگ اصلی دستیار (عکس ۴) */
.today-circle,
.task-mode-btn.active,
.picker-confirm-btn,
.modal-btn.save,
.quick-task-btn,
.search-btn,
.location-modal-box .loc-method-btn.active {
  background: var(--accent-color, #2563eb) !important;
  box-shadow: 0 4px 14px var(--accent-color, #2563eb) !important;
}
`;

  if (!css.includes('/* متغیرهای سراسری تم، بلر و تنظیمات بدون اسکرول افقی */')) {
    css += '\n' + advancedThemeStyle;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل‌های تم و متغیرهای سراسری در style.css اعمال شد.');
  }
}

// ۳. اتصال رویدادهای زنده تم، ماتی، رنگ و فونت در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const fullThemeEngineLogic = `
  // ========================================================
  // موتور جامع تنظیمات زنده تم، ماتی، رنگ و فونت
  // ========================================================

  // ۱. کنترل تم (دارک، لایت، خودکار) - عکس ۲
  function applyThemeMode(mode) {
    document.querySelectorAll('.theme-mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', mode);
    }
    localStorage.setItem('user_theme_mode', mode);
  }

  document.querySelectorAll('.theme-mode-btn').forEach(btn => {
    btn.onclick = () => applyThemeMode(btn.dataset.mode);
  });

  const savedThemeMode = localStorage.getItem('user_theme_mode') || 'auto';
  applyThemeMode(savedThemeMode);

  // ۲. کنترل ماتی زنده با تایید و انصراف - عکس ۳
  const sDash = document.getElementById('slider-dash-blur');
  const sPopup = document.getElementById('slider-popup-blur');
  const tDash = document.getElementById('val-dash-blur');
  const tPopup = document.getElementById('val-popup-blur');
  const btnBlurSave = document.getElementById('blur-save-btn');
  const btnBlurCancel = document.getElementById('blur-cancel-btn');

  let currentDashBlur = localStorage.getItem('val_d_blur') || '25';
  let currentPopupBlur = localStorage.getItem('val_p_blur') || '65';

  function setLiveBlur(dPct, pPct) {
    if (tDash) tDash.textContent = toFa(dPct) + '٪';
    if (tPopup) tPopup.textContent = toFa(pPct) + '٪';

    const dPx = (dPct * 0.6).toFixed(1) + 'px';
    const pPx = (pPct * 0.9).toFixed(1) + 'px';

    document.documentElement.style.setProperty('--dash-blur', dPx);
    document.documentElement.style.setProperty('--popup-blur', pPx);
  }

  if (sDash) {
    sDash.value = currentDashBlur;
    sDash.oninput = (e) => setLiveBlur(e.target.value, sPopup ? sPopup.value : currentPopupBlur);
  }
  if (sPopup) {
    sPopup.value = currentPopupBlur;
    sPopup.oninput = (e) => setLiveBlur(sDash ? sDash.value : currentDashBlur, e.target.value);
  }

  if (btnBlurSave) {
    btnBlurSave.onclick = () => {
      currentDashBlur = sDash.value;
      currentPopupBlur = sPopup.value;
      localStorage.setItem('val_d_blur', currentDashBlur);
      localStorage.setItem('val_p_blur', currentPopupBlur);
      setLiveBlur(currentDashBlur, currentPopupBlur);
      alert('میزان ماتی با موفقیت ذخیره شد ✓');
    };
  }

  if (btnBlurCancel) {
    btnBlurCancel.onclick = () => {
      if (sDash) sDash.value = currentDashBlur;
      if (sPopup) sPopup.value = currentPopupBlur;
      setLiveBlur(currentDashBlur, currentPopupBlur);
    };
  }
  setLiveBlur(currentDashBlur, currentPopupBlur);

  // ۳. کنترل رنگ اصلی و تایید پالت RGB - عکس ۴
  function setDashboardAccent(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('dash_accent_color', color);

    document.querySelectorAll('.color-palette-circle').forEach(btn => {
      const match = btn.dataset.color.toLowerCase() === color.toLowerCase();
      btn.classList.toggle('active', match);
      btn.textContent = match ? '✓' : '';
    });
  }

  document.querySelectorAll('.color-palette-circle').forEach(circle => {
    circle.onclick = () => {
      setDashboardAccent(circle.dataset.color);
    };
  });

  const rgbColorInput = document.getElementById('rgb-color-picker');
  const rgbConfirmBtn = document.getElementById('rgb-confirm-btn');

  if (rgbConfirmBtn && rgbColorInput) {
    rgbConfirmBtn.onclick = () => {
      const chosenColor = rgbColorInput.value;
      setDashboardAccent(chosenColor);
      alert('رنگ اختصاصی اعمال شد ✓');
    };
  }

  const initialAccent = localStorage.getItem('dash_accent_color') || '#2563eb';
  setDashboardAccent(initialAccent);
  if (rgbColorInput) rgbColorInput.value = initialAccent;

  // ۴. مدیریت فونت‌ها و آپلود فونت دلخواه - عکس ۵
  function applyActiveFont(fontName) {
    document.documentElement.style.setProperty('--app-font', "'" + fontName + "', system-ui, -apple-system, sans-serif");
    document.body.style.fontFamily = "'" + fontName + "', system-ui, -apple-system, sans-serif";
    localStorage.setItem('dash_active_font', fontName);

    document.querySelectorAll('.font-card-item:not(.font-card-upload)').forEach(card => {
      const isSelected = card.dataset.font === fontName;
      card.classList.toggle('active', isSelected);
      const sample = card.querySelector('.font-card-sample');
      if (sample) {
        sample.textContent = isSelected ? 'من اینطوریم ✓' : 'من اینطوریم';
      }
    });
  }

  document.querySelectorAll('.font-card-item:not(.font-card-upload)').forEach(card => {
    card.onclick = () => applyActiveFont(card.dataset.font);
  });

  const fontUploadInput = document.getElementById('custom-font-file');
  const fontUploadStatus = document.getElementById('upload-font-status');
  const fontUploadSample = document.getElementById('upload-font-sample');
  const uploadCard = document.getElementById('upload-font-card');

  if (fontUploadInput) {
    fontUploadInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const fontData = evt.target.result;
        const fontName = 'CustomUserFont';

        let fontStyleTag = document.getElementById('custom-user-font-tag');
        if (!fontStyleTag) {
          fontStyleTag = document.createElement('style');
          fontStyleTag.id = 'custom-user-font-tag';
          document.head.appendChild(fontStyleTag);
        }
        fontStyleTag.textContent = '@font-face { font-family: "' + fontName + '"; src: url(' + fontData + '); }';

        localStorage.setItem('custom_font_base64', fontData);
        applyActiveFont(fontName);

        if (uploadCard) uploadCard.classList.add('active');
        if (fontUploadSample) fontUploadSample.textContent = 'فونت شخصی ✓';
        if (fontUploadStatus) fontUploadStatus.textContent = file.name.slice(0, 14);
        alert('فونت با موفقیت آپلود و در کل سایت فعال شد!');
      };
      reader.readAsDataURL(file);
    };
  }

  const storedCustomFont = localStorage.getItem('custom_font_base64');
  if (storedCustomFont) {
    let fontStyleTag = document.createElement('style');
    fontStyleTag.id = 'custom-user-font-tag';
    fontStyleTag.textContent = '@font-face { font-family: "CustomUserFont"; src: url(' + storedCustomFont + '); }';
    document.head.appendChild(fontStyleTag);
  }

  const initialFont = localStorage.getItem('dash_active_font') || 'Vazirmatn';
  applyActiveFont(initialFont);
`;

  if (!js.includes('fullThemeEngineLogic')) {
    js += '\n' + fullThemeEngineLogic;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ موتور کامل تم، ماتی، رنگ و فونت به script.js متصل شد.');
  }
}