const fs = require('fs');

// ۱. ساختار شیشه‌ای مودال تنظیمات در newtab.html
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
        <div class="settings-sidebar-nav">
          <div class="nav-item-glass active" data-tab="general"><span class="nav-ico">⚙️</span> عمومی</div>
          <div class="nav-item-glass" data-tab="theme"><span class="nav-ico">🎨</span> تم و رنگ</div>
          <div class="nav-item-glass" data-tab="calendar"><span class="nav-ico">📅</span> تقویم و زمان</div>
          <div class="nav-item-glass" data-tab="privacy"><span class="nav-ico">🔒</span> حریم شخصی</div>
          <div class="nav-divider"></div>
          <div class="nav-item-glass" data-tab="changes"><span class="nav-ico">📣</span> تغییرات اخیر</div>
          <div class="nav-item-glass" data-tab="feedback"><span class="nav-ico">💬</span> فیدبک به ما</div>
        </div>

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
                <option value="zarebin">ذره‌بین</option>
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

          <!-- تب تم و رنگ -->
          <div class="settings-tab-pane" id="pane-theme">
            <div class="settings-form-row">
              <label class="settings-field-label">تصویر زمینه شخصی<span class="sub-tip">بارگذاری تصویر از سیستم یا ریست</span></label>
              <div class="settings-bg-actions">
                <label class="settings-btn-upload">
                  📁 انتخاب عکس
                  <input type="file" id="settings-bg-file" accept="image/*" style="display: none;">
                </label>
                <button class="settings-btn-action" id="settings-blur-toggle">✨ وضعیت بلر: <span id="settings-blur-status">مات</span></button>
                <button class="settings-btn-action danger" id="settings-reset-bg">↺ بازنشانی</button>
              </div>
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">
                میزان مات‌شدگی داشبورد
                <span class="sub-tip">تنظیم تاری کارت‌های ساعت، تقویم و تسک: <strong id="val-dash-blur">۲۵px</strong></span>
              </label>
              <input type="range" id="slider-dash-blur" min="0" max="60" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">
                میزان مات‌شدگی پاپ‌آپ‌ها
                <span class="sub-tip">تنظیم تاری دراور پیش‌بینی، اوقات شرعی و مودال‌ها: <strong id="val-popup-blur">۶۵px</strong></span>
              </label>
              <input type="range" id="slider-popup-blur" min="10" max="90" value="65" class="glass-slider">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

  html = html.replace(/<section id="view-settings"[\s\S]*?<\/section>/, settingsSection);
  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ ساختار مودال تنظیمات در newtab.html به‌روز شد.');
}

// ۲. استایل‌های پاپ‌آپ تنظیمات در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const settingsCss = `
/* رفع به هم ریختگی و استایل مودال شیشه‌ای تنظیمات */
#view-settings.modal-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.45) !important;
  backdrop-filter: blur(35px) saturate(200%) !important;
  -webkit-backdrop-filter: blur(35px) saturate(200%) !important;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
#view-settings.modal-overlay.active {
  display: flex !important;
}

.settings-modal-card {
  width: 760px;
  max-width: 92vw;
  max-height: 85vh;
  border-radius: 32px !important;
  display: flex;
  flex-direction: column;
  padding: 24px !important;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35) !important;
  overflow: hidden;
}

.settings-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--glass-border);
}

.settings-layout-body {
  display: flex;
  flex-direction: row-reverse;
  gap: 20px;
  margin-top: 16px;
  min-height: 380px;
  overflow-y: auto;
}

.settings-sidebar-nav {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-left: 1px solid var(--glass-border);
  padding-left: 12px;
}

.nav-item-glass {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.88rem;
  font-weight: 750;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s ease;
}
.nav-item-glass:hover, .nav-item-glass.active {
  background: rgba(255, 255, 255, 0.35);
  color: var(--text-main);
}
[data-theme="dark"] .nav-item-glass:hover, [data-theme="dark"] .nav-item-glass.active {
  background: rgba(255, 255, 255, 0.12);
}

.settings-content-container {
  flex: 1;
  overflow-y: auto;
  padding-left: 6px;
}

.settings-tab-pane {
  display: none;
  flex-direction: column;
  gap: 16px;
}
.settings-tab-pane.active {
  display: flex;
}
`;

  if (!css.includes('/* رفع به هم ریختگی و استایل مودال شیشه‌ای تنظیمات */')) {
    css += '\n' + settingsCss;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل پاپ‌آپ تنظیمات در style.css اعمال شد.');
  }
}

// ۳. لاجیک تب‌ها، تنظیم ماتی و میانبرهای عکس ۲ در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // به‌روزرسانی لیست پیش‌فرض میانبرها به تلگرام، اینستاگرام، تردز و واتساپ
  const updatedShortcutsCode = `  const defaultShortcuts = [
    { title: 'تلگرام', url: 'https://web.telegram.org' },
    { title: 'تلفنچی', url: 'https://telephonchi.com' },
    { title: 'X', url: 'https://x.com' },
    { title: 'پینترست', url: 'https://www.pinterest.com' },
    { title: 'یوتیوب', url: 'https://www.youtube.com' },
    { title: 'App', url: 'https://cafebazaar.ir' },
    { title: 'آپ‌تی‌وی', url: 'https://uptvs.com' },
    { title: 'اینستاگرام', url: 'https://www.instagram.com' },
    { title: 'تردز', url: 'https://www.threads.net' },
    { title: 'دیجی‌کالا', url: 'https://www.digikala.com' },
    { title: 'دیوار', url: 'https://divar.ir' },
    { title: 'واتساپ', url: 'https://web.whatsapp.com' }
  ];`;

  js = js.replace(/const defaultShortcuts = \[[\s\S]*?\];/, updatedShortcutsCode);

  // پاک کردن میانبرهای قدیمی از لوکال استوریج در صورت وجود لینک‌های قبلی
  const resetOldShortcuts = `
  let storedShortcuts = JSON.parse(localStorage.getItem('my_shortcuts'));
  if (storedShortcuts && storedShortcuts.some(s => s.title === 'دم‌دستی' || s.title === 'دیجی‌موویز ۲')) {
    localStorage.removeItem('my_shortcuts');
  }
`;

  // اتصال کنترل تب‌های پاپ‌آپ تنظیمات و اسلایدرها
  const settingsModalLogic = `
  // مدیریت تب‌های پاپ‌آپ تنظیمات
  const navItems = document.querySelectorAll('.settings-sidebar-nav .nav-item-glass');
  const tabPanes = document.querySelectorAll('.settings-tab-pane');
  const headerLabel = document.getElementById('settings-header-label');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      tabPanes.forEach(p => p.classList.remove('active'));
      const activePane = document.getElementById('pane-' + tab);
      if (activePane) activePane.classList.add('active');

      if (headerLabel) {
        headerLabel.textContent = 'تنظیمات › ' + item.textContent.trim();
      }
    });
  });

  // کنترل اسلایدرهای مات‌شدگی دستی
  const sliderDashBlur = document.getElementById('slider-dash-blur');
  const sliderPopupBlur = document.getElementById('slider-popup-blur');
  const valDashBlur = document.getElementById('val-dash-blur');
  const valPopupBlur = document.getElementById('val-popup-blur');

  function updateDynamicBlur() {
    const dashVal = localStorage.getItem('dash_blur_val') || '25';
    const popupVal = localStorage.getItem('popup_blur_val') || '65';

    if (sliderDashBlur) sliderDashBlur.value = dashVal;
    if (sliderPopupBlur) sliderPopupBlur.value = popupVal;
    if (valDashBlur) valDashBlur.textContent = toFa(dashVal) + 'px';
    if (valPopupBlur) valPopupBlur.textContent = toFa(popupVal) + 'px';

    document.querySelectorAll('.ios-glass-card:not(.settings-modal-card)').forEach(card => {
      card.style.setProperty('backdrop-filter', 'blur(' + dashVal + 'px) saturate(200%)', 'important');
      card.style.setProperty('-webkit-backdrop-filter', 'blur(' + dashVal + 'px) saturate(200%)', 'important');
    });

    const popups = '.glass-blur-menu, .forecast-drawer, .clock-drawer, .azan-city-dropdown, .month-year-picker-modal, .date-event-popup, .task-tool-popup, .location-modal-box, .settings-modal-card';
    document.querySelectorAll(popups).forEach(pop => {
      pop.style.setProperty('backdrop-filter', 'blur(' + popupVal + 'px) saturate(240%)', 'important');
      pop.style.setProperty('-webkit-backdrop-filter', 'blur(' + popupVal + 'px) saturate(240%)', 'important');
    });
  }

  if (sliderDashBlur) {
    sliderDashBlur.oninput = (e) => {
      localStorage.setItem('dash_blur_val', e.target.value);
      updateDynamicBlur();
    };
  }

  if (sliderPopupBlur) {
    sliderPopupBlur.oninput = (e) => {
      localStorage.setItem('popup_blur_val', e.target.value);
      updateDynamicBlur();
    };
  }

  updateDynamicBlur();
`;

  // باز شدن تنظیمات به شکل پاپ‌‌آپ شیشه‌ای
  js = js.replace(
    /dockSettingsBtn\.onclick = \(\) => switchView\(viewSettings, dockSettingsBtn\);/,
    `dockSettingsBtn.onclick = (e) => {
      e.stopPropagation();
      closeAllDrawersAndPopups();
      viewSettings.classList.add('active');
    };`
  );
  js = js.replace(
    /settingsCloseBtn\.onclick = \(\) => switchView\(viewDashboard, dockHomeBtn\);/,
    `settingsCloseBtn.onclick = () => viewSettings.classList.remove('active');`
  );

  if (!js.includes('updateDynamicBlur()')) {
    js = js.replace('applyBackgroundConfig();', `applyBackgroundConfig();\n${resetOldShortcuts}\n${settingsModalLogic}`);
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ منطق پاپ‌آپ تنظیمات و میانبرها در script.js به‌روز شد.');
  }
}