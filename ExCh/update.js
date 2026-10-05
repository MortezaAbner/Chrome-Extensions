const fs = require('fs');

// ۱. به‌روزرسانی ساختار HTML در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  // حذف بخش تصویر زمینه از تب عمومی
  html = html.replace(/<div class="settings-form-row">\s*<label class="settings-field-label">تصویر زمینه شخصی[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '</div></div>');

  // آماده‌سازی پنل تب‌ها برای نمایش تب اختصاصی تم و رنگ
  const themeAndColorView = `
        <div class="settings-content-main" id="settings-tab-general">
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

        <!-- تب اختصاصی تم و رنگ و تنظیم مات‌شدگی شیشه‌ای -->
        <div class="settings-content-main" id="settings-tab-theme" style="display: none;">
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
              مات‌شدگی داشبورد اصلی
              <span class="sub-tip">تنظیم میزان تاری کارت‌های ساعت، تقویم و تسک: <strong id="val-dash-blur">۲۵px</strong></span>
            </label>
            <input type="range" id="slider-dash-blur" min="0" max="60" value="25" class="glass-slider">
          </div>

          <div class="settings-form-row">
            <label class="settings-field-label">
              مات‌شدگی و پوشانندگی پاپ‌آپ‌ها
              <span class="sub-tip">تنظیم تاری و پوشش پیش‌بینی، اوقات شرعی و تایمر: <strong id="val-popup-blur">۶۵px</strong></span>
            </label>
            <input type="range" id="slider-popup-blur" min="10" max="90" value="65" class="glass-slider">
          </div>
        </div>
`;

  if (!html.includes('id="settings-tab-theme"')) {
    html = html.replace(/<div class="settings-content-main">[\s\S]*?<\/div>/, themeAndColorView);
  }

  // اضافه کردن آی‌دی به دکمه‌های ناوبری سایدبار تنظیمات
  html = html.replace('<div class="nav-item-glass"><span class="nav-ico">🎨</span> تم و رنگ</div>', '<div class="nav-item-glass" id="nav-btn-theme"><span class="nav-ico">🎨</span> تم و رنگ</div>');
  html = html.replace('<div class="nav-item-glass active"><span class="nav-ico">⚙️</span> عمومی</div>', '<div class="nav-item-glass active" id="nav-btn-general"><span class="nav-ico">⚙️</span> عمومی</div>');

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ تب تم و رنگ و اسلایدرهای مات‌شدگی در newtab.html ایجاد شدند.');
}

// ۲. افزودن استایل اسلایدرهای شیشه‌ای در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const sliderStyles = `
/* استایل اسلایدرهای شیشه‌ای تنظیمات */
.glass-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.4);
  outline: none;
  backdrop-filter: blur(10px);
  margin-top: 6px;
  transition: background 0.2s;
}
[data-theme="dark"] .glass-slider {
  background: rgba(255, 255, 255, 0.15);
}
.glass-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.5);
  border: 2px solid #ffffff;
  transition: transform 0.15s;
}
.glass-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
`;

  if (!css.includes('.glass-slider')) {
    css += '\n' + sliderStyles;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل اسلایدرها در style.css اعمال شد.');
  }
}

// ۳. به‌روزرسانی منطق سوییچ تب و اسلایدرها در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const themeTabLogic = `
  // مدیریت تب تم و رنگ و اسلایدرهای کنترل مات‌‌شدگی شیشه
  const navBtnGeneral = document.getElementById('nav-btn-general');
  const navBtnTheme = document.getElementById('nav-btn-theme');
  const tabGeneral = document.getElementById('settings-tab-general');
  const tabTheme = document.getElementById('settings-tab-theme');

  if (navBtnGeneral && navBtnTheme) {
    navBtnGeneral.onclick = () => {
      navBtnGeneral.classList.add('active');
      navBtnTheme.classList.remove('active');
      if (tabGeneral) tabGeneral.style.display = 'flex';
      if (tabTheme) tabTheme.style.display = 'none';
    };

    navBtnTheme.onclick = () => {
      navBtnTheme.classList.add('active');
      navBtnGeneral.classList.remove('active');
      if (tabGeneral) tabGeneral.style.display = 'none';
      if (tabTheme) tabTheme.style.display = 'flex';
    };
  }

  // اسلایدرهای مات‌شدگی شیشه‌ای داشبورد و پاپ‌آپ‌ها
  const sliderDashBlur = document.getElementById('slider-dash-blur');
  const sliderPopupBlur = document.getElementById('slider-popup-blur');
  const valDashBlur = document.getElementById('val-dash-blur');
  const valPopupBlur = document.getElementById('val-popup-blur');

  function applyCustomBlurSettings() {
    const dashBlur = localStorage.getItem('dash_blur_val') || '25';
    const popupBlur = localStorage.getItem('popup_blur_val') || '65';

    if (sliderDashBlur) sliderDashBlur.value = dashBlur;
    if (sliderPopupBlur) sliderPopupBlur.value = popupBlur;
    if (valDashBlur) valDashBlur.textContent = toFa(dashBlur) + 'px';
    if (valPopupBlur) valPopupBlur.textContent = toFa(popupBlur) + 'px';

    document.querySelectorAll('.ios-glass-card').forEach(el => {
      el.style.setProperty('backdrop-filter', 'blur(' + dashBlur + 'px) saturate(200%)', 'important');
      el.style.setProperty('-webkit-backdrop-filter', 'blur(' + dashBlur + 'px) saturate(200%)', 'important');
    });

    const popupSelectors = '.glass-blur-menu, .forecast-drawer, .clock-drawer, .azan-city-dropdown, .month-year-picker-modal, .date-event-popup, .task-tool-popup, .location-modal-box';
    document.querySelectorAll(popupSelectors).forEach(el => {
      el.style.setProperty('backdrop-filter', 'blur(' + popupBlur + 'px) saturate(250%)', 'important');
      el.style.setProperty('-webkit-backdrop-filter', 'blur(' + popupBlur + 'px) saturate(250%)', 'important');
    });
  }

  if (sliderDashBlur) {
    sliderDashBlur.oninput = (e) => {
      const v = e.target.value;
      localStorage.setItem('dash_blur_val', v);
      applyCustomBlurSettings();
    };
  }

  if (sliderPopupBlur) {
    sliderPopupBlur.oninput = (e) => {
      const v = e.target.value;
      localStorage.setItem('popup_blur_val', v);
      applyCustomBlurSettings();
    };
  }

  applyCustomBlurSettings();
`;

  if (!js.includes('applyCustomBlurSettings')) {
    js = js.replace('applyBackgroundConfig();', `applyBackgroundConfig();\n${themeTabLogic}`);
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ منطق تب تم و رنگ و تنظیمات زنده اسلایدرها به script.js اضافه شد.');
  }
}