const fs = require('fs');

// ۱. بازگرداندن آیکون داخل دایره خودکار در newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  // آیکون دوگانه ماه/خورشید داخل دایره خودکار (عکس ۱)
  html = html.replace(
    /<div class="mode-circle-preview mode-circle-auto">[\s\S]*?<\/div>/,
    '<div class="mode-circle-preview mode-circle-auto"><span class="auto-mode-icon">🌓</span></div>'
  );

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ آیکون حالت خودکار در newtab.html اضافه شد.');
}

// ۲. اصلاح استایل آیکون و تیک در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const themeIconCss = `
/* آیکون و چیدمان حالت خودکار و تیک فعال */
.mode-circle-auto {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1.25rem !important;
  background: linear-gradient(135deg, #0f172a 50%, #ffffff 50%) !important;
  border: 1.5px solid #64748b !important;
  position: relative !important;
}

.auto-mode-icon {
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

/* تیک در گوشه بالا برای جلوگیری از پوشاندن آیکون */
.theme-mode-btn.active .mode-circle-preview::after {
  content: '✓';
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: var(--accent-color, #2563eb);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 900;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}
`;

  if (!css.includes('.auto-mode-icon')) {
    css += '\n' + themeIconCss;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل تیک و آیکون خودکار در style.css اعمال شد.');
  }
}

// ۳. موتور قدرتمند و مستقیم ماتی (Blur + Opacity) در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const masterBlurScript = `
  // ========================================================
  // موتور قطعی ماتی صفر تا صد (کنترل همزمان بلر و غلظت رنگ)
  // ========================================================
  function applyAbsoluteBlurEngine(dPercent, pPercent) {
    let styleElem = document.getElementById('engine-absolute-blur');
    if (!styleElem) {
      styleElem = document.createElement('style');
      styleElem.id = 'engine-absolute-blur';
      document.head.appendChild(styleElem);
    }

    const dP = Math.max(0, Math.min(100, parseInt(dPercent, 10)));
    const pP = Math.max(0, Math.min(100, parseInt(pPercent, 10)));

    // محاسبه پیکسل بلر (از ۰px تا ۵۰px برای داشبورد و تا ۸۰px برای پاپ‌آپ)
    const dBlurPx = (dP * 0.5).toFixed(1);
    const pBlurPx = (pP * 0.8).toFixed(1);

    // محاسبه غلظت رنگ شیشه بر اساس درصد (از شفاف ۰.۰۵ تا غلیظ ۰.۹۲)
    const dAlphaLight = (0.05 + (dP / 100) * 0.55).toFixed(2);
    const dAlphaDark = (0.10 + (dP / 100) * 0.65).toFixed(2);

    const pAlphaLight = (0.25 + (pP / 100) * 0.65).toFixed(2);
    const pAlphaDark = (0.35 + (pP / 100) * 0.60).toFixed(2);

    styleElem.textContent = \`
      /* داشبورد اصلی */
      .ios-glass-card:not(.settings-modal-card) {
        backdrop-filter: blur(\${dBlurPx}px) saturate(190%) !important;
        -webkit-backdrop-filter: blur(\${dBlurPx}px) saturate(190%) !important;
        background: rgba(255, 255, 255, \${dAlphaLight}) !important;
      }
      [data-theme="dark"] .ios-glass-card:not(.settings-modal-card) {
        background: rgba(15, 23, 42, \${dAlphaDark}) !important;
      }

      /* پاپ‌آپ‌ها، دراورها و مودال تنظیمات */
      .glass-blur-menu,
      .forecast-drawer,
      .clock-drawer,
      .azan-city-dropdown,
      .month-year-picker-modal,
      .date-event-popup,
      .task-tool-popup,
      .location-modal-box,
      .settings-modal-card {
        backdrop-filter: blur(\${pBlurPx}px) saturate(220%) !important;
        -webkit-backdrop-filter: blur(\${pBlurPx}px) saturate(220%) !important;
        background: rgba(255, 255, 255, \${pAlphaLight}) !important;
      }
      [data-theme="dark"] .glass-blur-menu,
      [data-theme="dark"] .forecast-drawer,
      [data-theme="dark"] .clock-drawer,
      [data-theme="dark"] .settings-modal-card {
        background: rgba(15, 21, 37, \${pAlphaDark}) !important;
      }
    \`;
  }

  // متصل کردن اسلایدرهای صفحه
  const slD = document.getElementById('slider-dash-blur');
  const slP = document.getElementById('slider-popup-blur');
  const lblD = document.getElementById('val-dash-blur');
  const lblP = document.getElementById('val-popup-blur');
  const btnSave = document.getElementById('blur-save-btn');
  const btnCancel = document.getElementById('blur-cancel-btn');

  let persistentDash = localStorage.getItem('user_dash_blur_pct') || '25';
  let persistentPopup = localStorage.getItem('user_popup_blur_pct') || '65';

  function onSliderDrag() {
    const dVal = slD ? slD.value : persistentDash;
    const pVal = slP ? slP.value : persistentPopup;

    if (lblD) lblD.textContent = toFa(dVal) + '٪';
    if (lblP) lblP.textContent = toFa(pVal) + '٪';

    // اعمال آنی در همان لحظه کشیدن اسلایدر حتی روی خود کادر تنظیمات
    applyAbsoluteBlurEngine(dVal, pVal);
  }

  if (slD) {
    slD.value = persistentDash;
    slD.oninput = onSliderDrag;
  }
  if (slP) {
    slP.value = persistentPopup;
    slP.oninput = onSliderDrag;
  }

  // اعمال مقدار اولیه
  onSliderDrag();

  if (btnSave) {
    btnSave.onclick = () => {
      persistentDash = slD.value;
      persistentPopup = slP.value;
      localStorage.setItem('user_dash_blur_pct', persistentDash);
      localStorage.setItem('user_popup_blur_pct', persistentPopup);
      onSliderDrag();
      alert('میزان ماتی با موفقیت در سیستم ثبت شد ✓');
    };
  }

  if (btnCancel) {
    btnCancel.onclick = () => {
      if (slD) slD.value = persistentDash;
      if (slP) slP.value = persistentPopup;
      onSliderDrag();
    };
  }
`;

  // پاک کردن کدهای ناقص قبلی بلر و افزودن موتور کامل
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور قطعی ماتی[\s\S]*?btnCancel\.onclick[\s\S]*?\};?\s*\}\s*/g, '');
  js += '\n' + masterBlurScript;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ موتور جامع ماتی شیشه به script.js تزریق شد.');
}const fs = require('fs');

// ۱. فقط اصلاح ابعاد پاپ‌آپ تنظیمات و اسکرول‌‌بار در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const targetedFixesCss = `
/* رفع کشیدگی پاپ‌آپ تنظیمات */
#view-settings.app-view.active {
  display: flex !important;
  position: fixed !important;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(15, 23, 42, 0.45) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.settings-modal-card {
  width: 800px !important;
  max-width: 94vw !important;
  max-height: 86vh !important;
  margin: auto !important;
  border-radius: 28px !important;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35) !important;
  overflow: hidden !important;
  direction: rtl !important;
}
.settings-layout-body {
  display: flex !important;
  flex-direction: row !important;
  gap: 20px !important;
  max-height: 60vh !important;
  overflow: hidden !important;
  direction: rtl !important;
}
.settings-sidebar-nav {
  width: 190px !important;
  flex-shrink: 0 !important;
}
.settings-content-main,
.settings-content-container {
  flex: 1 !important;
  overflow-y: auto !important;
  scrollbar-width: thin !important;
}

/* اسکرول‌بار مینیمال و شیک */
* { scrollbar-width: none; }
*::-webkit-scrollbar { display: none; }
.settings-content-main::-webkit-scrollbar,
.settings-content-container::-webkit-scrollbar {
  display: block !important;
  width: 5px !important;
}
.settings-content-main::-webkit-scrollbar-thumb,
.settings-content-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25) !important;
  border-radius: 10px !important;
}
`;

  if (!css.includes('/* رفع کشیدگی پاپ‌آپ تنظیمات */')) {
    css += '\n' + targetedFixesCss;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل پاپ‌آپ و اسکرول‌بار در style.css اصلاح شد.');
  }
}

// ۲. فقط جایگزینی لینک‌های میانبر در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // تعویض دم‌دستی با تلگرام
  js = js.replace(/\{\s*title:\s*['"]دم‌دستی['"],\s*url:\s*['"][^'"]+['"]\s*\}/, "{ title: 'تلگرام', url: 'https://web.telegram.org' }");

  // تعویض دیجی‌موویز با اینستاگرام و تردز
  js = js.replace(/\{\s*title:\s*['"]دیجی‌مووی['"],\s*url:\s*['"][^'"]+['"]\s*\}/, "{ title: 'اینستاگرام', url: 'https://www.instagram.com' }");
  js = js.replace(/\{\s*title:\s*['"]دیجی‌موویز ۲['"],\s*url:\s*['"][^'"]+['"]\s*\}/, "{ title: 'تردز', url: 'https://www.threads.net' }");

  // اصلاح لینک واتساپ
  js = js.replace(/\{\s*title:\s*['"]واتساپ['"],\s*url:\s*['"][^'"]+['"]\s*\}/, "{ title: 'واتساپ', url: 'https://web.whatsapp.com' }");

  // بستن پاپ‌آپ تنظیمات با ضربدر و با کلیک روی بیرون
  js = js.replace(
    /settingsCloseBtn\.onclick = \(\) => switchView\(viewDashboard, dockHomeBtn\);/,
    `settingsCloseBtn.onclick = () => {
      document.getElementById('view-settings')?.classList.remove('active');
      document.getElementById('view-dashboard')?.classList.add('active');
      document.getElementById('dock-home-btn')?.classList.add('active');
    };
    const modalSettingsOverlay = document.getElementById('view-settings');
    if (modalSettingsOverlay) {
      modalSettingsOverlay.onclick = (e) => {
        if (e.target === modalSettingsOverlay) {
          modalSettingsOverlay.classList.remove('active');
          document.getElementById('view-dashboard')?.classList.add('active');
          document.getElementById('dock-home-btn')?.classList.add('active');
        }
      };
    }`
  );

  // پاک کردن کش شورتکات‌ها برای اعمال سریع
  if (!js.includes('sc_reset_flag_v12')) {
    const scReset = `
  if (localStorage.getItem('sc_flag') !== 'v12') {
    localStorage.removeItem('my_shortcuts');
    localStorage.setItem('sc_flag', 'v12');
  }
`;
    js = js.replace('let shortcuts = JSON.parse(localStorage.getItem(\'my_shortcuts\'))', `${scReset}\n  let shortcuts = JSON.parse(localStorage.getItem('my_shortcuts'))`);
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ میانبرها و رویدادهای بستن پاپ‌آپ اصلاح شدند.');
}