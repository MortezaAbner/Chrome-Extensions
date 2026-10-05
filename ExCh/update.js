const fs = require('fs');

// ۱. تنظیم چیدمان راست‌‌چین و ساختار تب‌ها در newtab.html
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

          <!-- تب تصویر زمینه (عکس ۲) -->
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

          <!-- تب تم و رنگ (عکس ۳، ۴ و ۵) -->
          <div class="settings-tab-pane" id="pane-theme">
            <!-- تم رنگی -->
            <div class="settings-form-row">
              <label class="settings-field-label">تم رنگی<span class="sub-tip">انتخاب کنید که دستیارتون چه رنگی باشه!</span></label>
              <div class="theme-modes-grid">
                <div class="theme-mode-btn active" data-mode="glass">
                  <div class="mode-circle-preview" style="background: rgba(255,255,255,0.25); border: 2px solid var(--accent-color);">✓</div>
                  <span>شیشه‌ای</span>
                </div>
                <div class="theme-mode-btn" data-mode="auto">
                  <div class="mode-circle-preview" style="background: linear-gradient(135deg, #0f172a 50%, #ffffff 50%);">🌓</div>
                  <span>خودکار</span>
                </div>
                <div class="theme-mode-btn" data-mode="dark">
                  <div class="mode-circle-preview" style="background: #0f172a; border: 1px solid #334155;">🌙</div>
                  <span>دارک</span>
                </div>
                <div class="theme-mode-btn" data-mode="light">
                  <div class="mode-circle-preview" style="background: #ffffff; border: 1px solid #cbd5e1;">☀️</div>
                  <span>لایت</span>
                </div>
              </div>
            </div>

            <!-- میزان ماتی شیشه به صورت صفر تا صد -->
            <div class="settings-form-row">
              <label class="settings-field-label">ماتی داشبورد اصلی<span class="sub-tip">میزان بلر کارت‌های اصلی: <strong id="val-dash-blur">۲۵٪</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">ماتی و پوشانندگی پاپ‌آپ‌ها<span class="sub-tip">میزان پوشش پنجره‌های بازشونده: <strong id="val-popup-blur">۶۵٪</strong></span></label>
              <input type="range" id="slider-popup-blur" min="0" max="100" value="65" class="glass-slider">
            </div>

            <!-- انتخاب رنگ اصلی با پالت RGB و دکمه تایید -->
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
                  <button type="button" id="rgb-confirm-btn" class="location-chip" style="font-size: 0.75rem; padding: 6px 10px;">تأیید ✓</button>
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

// ۲. تنظیم استایل‌ها (راست‌چین سایدبار، اسکرول، اسلایدرها و رنگ‌ها) در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const detailedSettingsCss = `
/* ========================================================
   چیدمان راست‌چین و استایل‌های تنظیمات، اسکرول، فونت و تم
   ======================================================== */
.settings-modal-card {
  width: 780px !important;
  max-width: 94vw !important;
  max-height: 86vh !important;
  border-radius: 30px !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 24px !important;
  overflow: hidden !important;
  direction: rtl !important;
}

.settings-card-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding-bottom: 14px !important;
  border-bottom: 1px solid var(--glass-border) !important;
  direction: rtl !important;
}

.settings-layout-body {
  display: flex !important;
  flex-direction: row !important; /* سایدبار در سمت راست در حالت RTL */
  gap: 20px !important;
  margin-top: 14px !important;
  min-height: 380px !important;
  max-height: 62vh !important;
  overflow: hidden !important;
  direction: rtl !important;
}

.settings-sidebar-nav {
  width: 200px !important;
  flex-shrink: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  border-left: 1px solid var(--glass-border) !important;
  border-right: none !important;
  padding-left: 14px !important;
  padding-right: 0 !important;
}

.nav-item-glass {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 10px 14px !important;
  border-radius: 14px !important;
  font-size: 0.88rem !important;
  font-weight: 750 !important;
  cursor: pointer !important;
  color: var(--text-muted) !important;
  transition: all 0.2s ease !important;
  text-align: right !important;
}
.nav-item-glass:hover, .nav-item-glass.active {
  background: rgba(255, 255, 255, 0.35) !important;
  color: var(--accent-color, #2563eb) !important;
}
[data-theme="dark"] .nav-item-glass:hover, [data-theme="dark"] .nav-item-glass.active {
  background: rgba(255, 255, 255, 0.12) !important;
}

.settings-content-container {
  flex: 1 !important;
  overflow-y: auto !important;
  padding-left: 10px !important;
  padding-right: 4px !important;
}

.settings-tab-pane {
  display: none !important;
  flex-direction: column !important;
  gap: 18px !important;
}
.settings-tab-pane.active {
  display: flex !important;
}

/* اسکرول‌بار باریک فقط در محتوای تنظیمات */
.settings-content-container {
  scrollbar-width: thin !important;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent !important;
}
.settings-content-container::-webkit-scrollbar {
  width: 5px !important;
  display: block !important;
}
.settings-content-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3) !important;
  border-radius: 10px !important;
}

/* پالت رنگ و تم */
.theme-modes-grid, .theme-colors-grid {
  display: flex !important;
  gap: 14px !important;
  align-items: center !important;
  margin-top: 10px !important;
  flex-wrap: wrap !important;
}

.theme-mode-btn {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 6px !important;
  cursor: pointer !important;
  background: none !important;
  border: none !important;
  color: var(--text-main) !important;
  font-size: 0.82rem !important;
  font-weight: 750 !important;
}
.mode-circle-preview {
  width: 46px !important;
  height: 46px !important;
  border-radius: 50% !important;
  border: 2px solid transparent !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: transform 0.2s, border-color 0.2s !important;
}
.theme-mode-btn.active .mode-circle-preview {
  border-color: var(--accent-color, #2563eb) !important;
  transform: scale(1.08) !important;
}

.color-palette-circle {
  width: 38px !important;
  height: 38px !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  border: 2.5px solid transparent !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #fff !important;
  font-weight: bold !important;
  font-size: 15px !important;
  transition: transform 0.2s, border-color 0.2s !important;
}
.color-palette-circle.active {
  border-color: #ffffff !important;
  transform: scale(1.12) !important;
  box-shadow: 0 0 12px rgba(255,255,255,0.45) !important;
}

.color-picker-wrapper {
  position: relative !important;
  width: 38px !important;
  height: 38px !important;
  border-radius: 50% !important;
  border: 2px dashed rgba(255,255,255,0.7) !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.color-picker-wrapper input[type="color"] {
  position: absolute !important;
  top: -10px; left: -10px;
  width: 60px; height: 60px;
  opacity: 0 !important;
  cursor: pointer !important;
}

/* اسلایدرهای شیشه‌ای ماتی */
.glass-slider {
  -webkit-appearance: none !important;
  appearance: none !important;
  width: 100% !important;
  height: 8px !important;
  border-radius: 6px !important;
  background: rgba(255, 255, 255, 0.35) !important;
  outline: none !important;
  margin-top: 8px !important;
}
.glass-slider::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  width: 22px !important;
  height: 22px !important;
  border-radius: 50% !important;
  background: var(--accent-color, #2563eb) !important;
  cursor: pointer !important;
  border: 2.5px solid #ffffff !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
}

/* کارت‌های فونت */
.font-cards-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 10px !important;
  margin-top: 10px !important;
}
.font-card-item {
  background: rgba(255, 255, 255, 0.28) !important;
  border: 1.5px solid var(--glass-border) !important;
  border-radius: 14px !important;
  padding: 12px 6px !important;
  text-align: center !important;
  cursor: pointer !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  transition: all 0.2s !important;
}
.font-card-item.active {
  border-color: var(--accent-color, #2563eb) !important;
  background: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.25) !important;
}
.font-card-sample { font-size: 0.92rem !important; font-weight: 800 !important; color: var(--text-main) !important; }
.font-card-name { font-size: 0.72rem !important; color: var(--text-muted) !important; }

.font-card-upload {
  border-style: dashed !important;
  border-color: var(--accent-color, #2563eb) !important;
}

/* اعمال رنگ اکسنت روی تمام بخش‌های آبی عکس ۴ و ۵ */
.today-circle,
.task-mode-btn.active,
.picker-confirm-btn,
.modal-btn.save,
.quick-task-btn,
.search-btn {
  background: var(--accent-color, #2563eb) !important;
  box-shadow: 0 4px 14px var(--accent-color, #2563eb) !important;
}
`;

  if (!css.includes('/* چیدمان راست‌چین و استایل‌های تنظیمات، اسکرول، فونت و تم */')) {
    css += '\n' + detailedSettingsCss;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل‌های جدید در style.css ثبت شدند.');
  }
}

// ۳. لاجیک تب‌ها، ماتی زنده، رنگ RGB و فونت در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const comprehensiveSettingsLogic = `
  // ========================================================
  // لاجیک تب‌های تنظیمات، پس‌زمینه، ماتی، رنگ و فونت
  // ========================================================

  // ۱. جابه‌جایی تب‌های سایدبار
  function setupSettingsTabsNav() {
    const navItems = document.querySelectorAll('.settings-sidebar-nav .nav-item-glass');
    const tabPanes = document.querySelectorAll('.settings-tab-pane');
    const headerLabel = document.getElementById('settings-header-label');

    navItems.forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const tab = item.dataset.tab;
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        tabPanes.forEach(p => p.classList.remove('active'));
        const pane = document.getElementById('pane-' + tab);
        if (pane) pane.classList.add('active');

        if (headerLabel) {
          headerLabel.textContent = 'تنظیمات › ' + item.textContent.trim();
        }
      };
    });
  }
  setupSettingsTabsNav();

  // ۲. کنترل پس‌زمینه (عکس ۲)
  const bgFileInput = document.getElementById('settings-bg-file');
  const bgBlurToggleBtn = document.getElementById('settings-blur-toggle');
  const bgBlurStatusText = document.getElementById('settings-blur-status');
  const bgResetBtn = document.getElementById('settings-reset-bg');

  if (bgFileInput) {
    bgFileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bgUrl = evt.target.result;
        document.body.style.backgroundImage = 'url(' + bgUrl + ')';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        localStorage.setItem('custom_bg_data', bgUrl);
      };
      reader.readAsDataURL(file);
    };
  }

  if (bgBlurToggleBtn) {
    bgBlurToggleBtn.onclick = () => {
      const isCurrentlyBlurred = document.body.classList.toggle('bg-blurred');
      localStorage.setItem('bg_blur_enabled', isCurrentlyBlurred ? '1' : '0');
      if (bgBlurStatusText) bgBlurStatusText.textContent = isCurrentlyBlurred ? 'مات' : 'شفاف';
    };
  }

  if (bgResetBtn) {
    bgResetBtn.onclick = () => {
      localStorage.removeItem('custom_bg_data');
      localStorage.removeItem('bg_blur_enabled');
      document.body.style.backgroundImage = '';
      document.body.classList.remove('bg-blurred');
      if (bgBlurStatusText) bgBlurStatusText.textContent = 'شفاف';
      alert('تصویر پس‌زمینه به حالت اولیه بازنشانی شد.');
    };
  }

  // بارگذاری تنظیمات پس‌زمینه در شروع
  const savedBg = localStorage.getItem('custom_bg_data');
  if (savedBg) {
    document.body.style.backgroundImage = 'url(' + savedBg + ')';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
  }
  if (localStorage.getItem('bg_blur_enabled') === '1') {
    document.body.classList.add('bg-blurred');
    if (bgBlurStatusText) bgBlurStatusText.textContent = 'مات';
  }

  // ۳. کنترل ماتی داشبورد و پاپ‌آپ‌ها (عکس ۳)
  const slDash = document.getElementById('slider-dash-blur');
  const slPopup = document.getElementById('slider-popup-blur');
  const txDash = document.getElementById('val-dash-blur');
  const txPopup = document.getElementById('val-popup-blur');

  function renderBlurLevels(dPct, pPct) {
    if (txDash) txDash.textContent = toFa(dPct) + '٪';
    if (txPopup) txPopup.textContent = toFa(pPct) + '٪';

    const dPx = (dPct * 0.6).toFixed(1);
    const pPx = (pPct * 0.9).toFixed(1);

    document.querySelectorAll('.ios-glass-card:not(.settings-modal-card)').forEach(card => {
      card.style.setProperty('backdrop-filter', 'blur(' + dPx + 'px) saturate(200%)', 'important');
      card.style.setProperty('-webkit-backdrop-filter', 'blur(' + dPx + 'px) saturate(200%)', 'important');
    });

    const popups = '.glass-blur-menu, .forecast-drawer, .clock-drawer, .azan-city-dropdown, .month-year-picker-modal, .date-event-popup, .task-tool-popup, .location-modal-box, .settings-modal-card';
    document.querySelectorAll(popups).forEach(pop => {
      pop.style.setProperty('backdrop-filter', 'blur(' + pPx + 'px) saturate(240%)', 'important');
      pop.style.setProperty('-webkit-backdrop-filter', 'blur(' + pPx + 'px) saturate(240%)', 'important');
    });
  }

  if (slDash) {
    slDash.oninput = (e) => {
      localStorage.setItem('val_d_blur', e.target.value);
      renderBlurLevels(e.target.value, slPopup ? slPopup.value : 65);
    };
  }
  if (slPopup) {
    slPopup.oninput = (e) => {
      localStorage.setItem('val_p_blur', e.target.value);
      renderBlurLevels(slDash ? slDash.value : 25, e.target.value);
    };
  }

  const initD = localStorage.getItem('val_d_blur') || '25';
  const initP = localStorage.getItem('val_p_blur') || '65';
  if (slDash) slDash.value = initD;
  if (slPopup) slPopup.value = initP;
  renderBlurLevels(initD, initP);

  // ۴. مدیریت رنگ اصلی و دکمه تایید RGB (عکس ۴)
  function applyColorTheme(hex) {
    document.documentElement.style.setProperty('--accent-color', hex);
    localStorage.setItem('active_accent_color', hex);

    document.querySelectorAll('.color-palette-circle').forEach(btn => {
      if (btn.dataset.color.toLowerCase() === hex.toLowerCase()) {
        btn.classList.add('active');
        btn.textContent = '✓';
      } else {
        btn.classList.remove('active');
        btn.textContent = '';
      }
    });
  }

  document.querySelectorAll('.color-palette-circle').forEach(circle => {
    circle.onclick = () => applyColorTheme(circle.dataset.color);
  });

  const rgbInput = document.getElementById('rgb-color-picker');
  const rgbConfirmBtn = document.getElementById('rgb-confirm-btn');

  if (rgbConfirmBtn && rgbInput) {
    rgbConfirmBtn.onclick = () => {
      applyColorTheme(rgbInput.value);
      alert('رنگ اختصاصی با موفقیت اعمال شد ✓');
    };
  }

  const savedAccent = localStorage.getItem('active_accent_color') || '#2563eb';
  applyColorTheme(savedAccent);
  if (rgbInput) rgbInput.value = savedAccent;

  // ۵. مدیریت فونت‌ها و آپلود فونت (عکس ۵)
  function applyAppFont(fontName) {
    document.body.style.fontFamily = fontName + ', system-ui, -apple-system, sans-serif';
    localStorage.setItem('selected_app_font', fontName);

    document.querySelectorAll('.font-card-item:not(.font-card-upload)').forEach(card => {
      const isCurrent = card.dataset.font === fontName;
      card.classList.toggle('active', isCurrent);
      const sample = card.querySelector('.font-card-sample');
      if (sample) {
        sample.textContent = isCurrent ? 'من اینطوریم ✓' : 'من اینطوریم';
      }
    });
  }

  document.querySelectorAll('.font-card-item:not(.font-card-upload)').forEach(card => {
    card.onclick = () => applyAppFont(card.dataset.font);
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
        const fontName = 'CustomUploadedFont';

        let fontStyleTag = document.getElementById('custom-uploaded-font-style');
        if (!fontStyleTag) {
          fontStyleTag = document.createElement('style');
          fontStyleTag.id = 'custom-uploaded-font-style';
          document.head.appendChild(fontStyleTag);
        }
        fontStyleTag.textContent = '@font-face { font-family: "' + fontName + '"; src: url(' + fontData + '); }';

        localStorage.setItem('custom_uploaded_font_data', fontData);
        applyAppFont(fontName);

        if (uploadCard) uploadCard.classList.add('active');
        if (fontUploadSample) fontUploadSample.textContent = 'فونت شخصی ✓';
        if (fontUploadStatus) fontUploadStatus.textContent = file.name.slice(0, 14);
        alert('فونت دلخواه شما بارگذاری و بر روی کل صفحه اعمال شد!');
      };
      reader.readAsDataURL(file);
    };
  }

  // لود فونت شخصی ثبت‌شده در استوریج
  const cachedCustomFont = localStorage.getItem('custom_uploaded_font_data');
  if (cachedCustomFont) {
    let fontStyleTag = document.createElement('style');
    fontStyleTag.id = 'custom-uploaded-font-style';
    fontStyleTag.textContent = '@font-face { font-family: "CustomUploadedFont"; src: url(' + cachedCustomFont + '); }';
    document.head.appendChild(fontStyleTag);
  }

  const savedFont = localStorage.getItem('selected_app_font') || 'Vazirmatn';
  applyAppFont(savedFont);
`;

  if (!js.includes('setupSettingsTabsNav()')) {
    js = js.replace('updateDynamicBlur();', `updateDynamicBlur();\n${comprehensiveSettingsLogic}`);
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ منطق ناوبری، رنگ، فونت و پس‌زمینه در script.js متصل شد.');
  }
}