const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // ۱. تنظیم پیش‌فرض ماتی داشبورد و پاپ‌آپ‌ها روی ۵۰ درصد
  js = js.replace(/(localStorage\.getItem\(['"](?:blur_dash_val\vert{}user_dash_blur_pct)['"]\)\s*\|\|\s*)['"]\d+['"]/g, "$1'50'");
  js = js.replace(/(localStorage\.getItem\(['"](?:blur_popup_val\vert{}user_popup_blur_pct)['"]\)\s*\|\|\s*)['"]\d+['"]/g, "$1'50'");
  js = js.replace(/let\s+(?:dVal|dashBlurVal|currentDashBlur)\s*=\s*\d+;/g, "let dVal = 50;");
  js = js.replace(/let\s+(?:pVal|popupBlurVal|currentPopupBlur)\s*=\s*\d+;/g, "let pVal = 50;");

  // ۲. اصلاح جابه‌جایی تب‌های منوی تنظیمات (رفع باگ نمایش تصویر زمینه در تب تم و رنگ)
  const tabFixCode = `
  // اصلاح سوییچ بین تب‌های تنظیمات (رفع گیر کردن تب تصویر زمینه)
  document.querySelectorAll('.settings-nav-item, [data-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab') || this.dataset.tab;
      if (!targetTab) return;
      
      document.querySelectorAll('.settings-tab-pane, .tab-content-pane, [data-pane]').forEach(pane => {
        pane.classList.remove('active');
        pane.style.display = 'none';
      });

      const activePane = document.getElementById('tab-' + targetTab) || document.querySelector(\`[data-pane="\${targetTab}"]\`);
      if (activePane) {
        activePane.classList.add('active');
        activePane.style.display = 'block';
      }
    }, true);
  });
  `;

  // ۳. استایل هماهنگ‌سازی میانبرها و سرچ با داشبورد + کشویی‌ها با پاپ‌آپ
  const preciseBlurInject = `
  // تزریق استایل متمرکز و هماهنگ بلر
  let dynStyle = document.getElementById('precise-live-blur-style');
  if (!dynStyle) {
    dynStyle = document.createElement('style');
    dynStyle.id = 'precise-live-blur-style';
    document.head.appendChild(dynStyle);
  }

  function updateDynamicGlassBlur(dPct, pPct) {
    const dBlur = Math.round((dPct / 100) * 40);
    const pBlur = Math.round((pPct / 100) * 50);

    dynStyle.textContent = \`
      /* هماهنگی نوار جستجو، میانبرها و کارت‌ها با ماتی داشبورد */
      .ios-glass-card,
      .search-box,
      .search-bar-container,
      .search-input-wrapper,
      .google-search-bar,
      .shortcut-item,
      .shortcut-card,
      .shortcut-btn,
      .shortcuts-grid > *,
      #shortcuts-container > *,
      .add-shortcut-btn {
        backdrop-filter: blur(\${dBlur}px) saturate(160%) !important;
        -webkit-backdrop-filter: blur(\${dBlur}px) saturate(160%) !important;
        background: rgba(255, 255, 255, 0.08) !important;
      }
      [data-theme="dark"] .search-bar-container,
      [data-theme="dark"] .shortcut-item,
      [data-theme="dark"] .shortcuts-grid > *,
      [data-theme="dark"] .add-shortcut-btn {
        background: rgba(15, 23, 42, 0.20) !important;
      }

      /* هماهنگی دراورهای کشویی پیش‌بینی، اوقات شرعی و تایمر با ماتی پاپ‌آپ */
      .forecast-drawer,
      #forecast-drawer,
      .clock-drawer,
      #clock-drawer,
      #timer-drawer,
      .timer-drawer,
      #azan-drawer,
      .azan-drawer,
      .drawer-content,
      .timer-box,
      .settings-modal-card {
        backdrop-filter: blur(\${pBlur}px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(\${pBlur}px) saturate(180%) !important;
        background: rgba(255, 255, 255, 0.12) !important;
      }
      [data-theme="dark"] .forecast-drawer,
      [data-theme="dark"] #forecast-drawer,
      [data-theme="dark"] #clock-drawer,
      [data-theme="dark"] #timer-drawer,
      [data-theme="dark"] #azan-drawer,
      [data-theme="dark"] .settings-modal-card {
        background: rgba(15, 23, 42, 0.25) !important;
      }
    \`;
  }
  `;

  // پاک کردن تعاریف تکراری قبلی و ثبت نسخه اصلاح‌شده به انتهای فایل
  js = js.replace(/\/\/ تزریق استایل متمرکز و هماهنگ بلر[\s\S]*?updateDynamicGlassBlur\(\d+,\s*\d+\);?/g, '');
  js = js.replace(/\/\/ اصلاح سوییچ بین تب‌های تنظیمات[\s\S]*?\}, true\);/g, '');
  
  js += '\n' + tabFixCode + '\n' + preciseBlurInject + '\nupdateDynamicGlassBlur(50, 50);\n';

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ باگ تب تنظیمات رفع شد، ماتی دیفالت روی ۵۰ درصد تنظیم شد و میانبرها و کشویی‌ها هماهنگ شدند.');
}