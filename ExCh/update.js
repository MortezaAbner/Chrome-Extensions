const fs = require('fs');

// ۱. تنظیم دقیق تب‌های تنظیمات و سایدبار در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  const settingsCompleteHtml = `  <!-- ۲. مودال تنظیمات -->
  <section id="view-settings" class="modal-overlay">
    <div class="settings-modal-card ios-glass-card glass-blur-menu">
      <div class="settings-card-header">
        <button class="settings-close-icon" id="settings-close-btn" title="بستن">✕</button>
        <div class="settings-header-title" id="settings-header-label">تنظیمات › عمومی</div>
      </div>

      <div class="settings-layout-body">
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

        <div class="settings-content-container">
          <!-- ۱. تب عمومی (بدون گزینه‌های تصویر زمینه) -->
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

          <!-- ۲. تب اختصاصی تصویر زمینه -->
          <div class="settings-tab-pane" id="pane-wallpaper">
            <div class="settings-form-row">
              <label class="settings-field-label">تصویر زمینه شخصی<span class="sub-tip">بارگذاری تصویر از سیستم یا ریست به حالت پیش‌فرض</span></label>
              <div class="settings-bg-actions">
                <label class="settings-btn-upload">
                  📁 انتخاب عکس
                  <input type="file" id="settings-bg-file" accept="image/*" style="display: none;">
                </label>
                <button class="settings-btn-action" id="settings-blur-toggle">✨ وضعیت بلر: <span id="settings-blur-status">مات</span></button>
                <button class="settings-btn-action danger" id="settings-reset-bg">↺ بازنشانی</button>
              </div>
            </div>
          </div>

          <!-- ۳. تب تم و رنگ -->
          <div class="settings-tab-pane" id="pane-theme">
            <!-- تم کلی -->
            <div class="settings-form-row">
              <label class="settings-field-label">تم رنگی<span class="sub-tip">انتخاب کنید که دستیارتون چه رنگی باشه!</span></label>
              <div class="theme-modes-grid">
                <div class="theme-mode-btn active" data-mode="glass">
                  <div class="mode-circle-preview" style="background: rgba(255,255,255,0.3); backdrop-filter: blur(15px); border: 2px solid var(--accent-color, #2563eb);">✓</div>
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
              <label class="settings-field-label">ماتی داشبورد اصلی<span class="sub-tip">میزان بلر کارت‌های اصلی: <strong id="val-dash-blur">۲۵٪</strong></span></label>
              <input type="range" id="slider-dash-blur" min="0" max="100" value="25" class="glass-slider">
            </div>

            <div class="settings-form-row">
              <label class="settings-field-label">ماتی و پوشانندگی پاپ‌آپ‌ها<span class="sub-tip">میزان پوشش پنجره‌های بازشونده: <strong id="val-popup-blur">۶۵٪</strong></span></label>
              <input type="range" id="slider-popup-blur" min="0" max="100" value="65" class="glass-slider">
            </div>

            <!-- رنگ اصلی دستیار بدون ستاره و با RGB -->
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

            <!-- فونت‌ها با دکمه آپلود فونت شخصی -->
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
                <label class="font-card-item font-card-upload">
                  <div class="font-card-sample">➕ آپلود فونت</div>
                  <div class="font-card-name">فایل TTF/WOFF2</div>
                  <input type="file" id="custom-font-file" accept=".woff2,.woff,.ttf,.otf" style="display: none;">
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

  html = html.replace(/<section id="view-settings"[\s\S]*?<\/section>/, settingsCompleteHtml);
  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ ساختار سایدبار و تب‌های تنظیمات در newtab.html به‌روزرسانی شد.');
}

// ۲. اتصال دقیق رویداد کلیک تب‌ها در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const tabClickLogic = `
  // مدیریت تب‌های سایدبار تنظیمات
  function initSettingsTabs() {
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
        const targetPane = document.getElementById('pane-' + tab);
        if (targetPane) targetPane.classList.add('active');

        if (headerLabel) {
          headerLabel.textContent = 'تنظیمات › ' + item.textContent.trim();
        }
      };
    });
  }
  initSettingsTabs();
`;

  // جایگزینی کدهای قبلی ناوبری تب‌ها
  if (js.includes('initSettingsTabs()')) {
    js = js.replace(/\/\/ مدیریت تب‌های سایدبار تنظیمات[\s\S]*?initSettingsTabs\(\);/, tabClickLogic);
  } else {
    js = js.replace('applyBackgroundConfig();', `applyBackgroundConfig();\n${tabClickLogic}`);
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ رویداد جابه‌جایی تب‌ها در script.js متصل شد.');
}