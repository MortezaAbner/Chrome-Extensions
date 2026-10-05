const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // ۱. تنظیم استایل کامل داشبورد شامل نوار جستجو و آیکون‌های میانبر پویا
  const searchAndShortcutsDashSelectors = `
        /* ۱. داشبورد: بار سرچ، میانبرها (حتی میانبرهای جدید یا حذفی) و کارت‌ها */
        .ios-glass-card,
        .weather-card,
        .clock-card,
        .calendar-card,
        .task-card,
        .search-bar-container,
        .search-box,
        .google-search-bar,
        .shortcuts-grid,
        .shortcut-item,
        .shortcut-btn,
        .shortcut-card,
        .add-shortcut-btn,
        .location-modal-box,
        #weather-city-btn,
        .location-chip {
          backdrop-filter: blur(\${dPx}px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(\${dPx}px) saturate(160%) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        [data-theme="dark"] .search-bar-container,
        [data-theme="dark"] .search-box,
        [data-theme="dark"] .google-search-bar,
        [data-theme="dark"] .shortcut-item,
        [data-theme="dark"] .shortcut-btn,
        [data-theme="dark"] .shortcut-card,
        [data-theme="dark"] .add-shortcut-btn {
          background: rgba(15, 23, 42, 0.20) !important;
        }
  `;

  // ۲. تنظیم استایل کشویی‌ها: پیش‌بینی، اوقات شرعی و تایمر
  const drawersPopupSelectors = `
        /* ۲. پاپ‌آپ‌ها و منوهای کشویی پیش‌بینی، اوقات شرعی، تایمر */
        .forecast-drawer,
        #forecast-drawer,
        .forecast-drawer-content,
        .clock-drawer,
        #timer-drawer,
        #azan-drawer,
        .azan-drawer-content,
        .timer-drawer-content,
        .drawer-panel,
        .glass-blur-menu,
        .azan-city-dropdown,
        .settings-modal-card,
        #forecast-btn,
        #azan-btn,
        #timer-btn {
          backdrop-filter: blur(\${popupPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(\${popupPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, 0.10) !important;
        }
        [data-theme="dark"] .forecast-drawer,
        [data-theme="dark"] #forecast-drawer,
        [data-theme="dark"] .forecast-drawer-content,
        [data-theme="dark"] .clock-drawer,
        [data-theme="dark"] #timer-drawer,
        [data-theme="dark"] #azan-drawer,
        [data-theme="dark"] .azan-drawer-content,
        [data-theme="dark"] .timer-drawer-content,
        [data-theme="dark"] .drawer-panel {
          background: rgba(15, 23, 42, 0.25) !important;
        }
  `;

  // جایگزینی تمیز داخل تگ استایل داینامیک script.js
  if (js.includes("let styleTag = document.getElementById('live-custom-blur-style');")) {
    js = js.replace(
      /styleTag\.textContent = `[\s\S]*?`;/,
      `styleTag.textContent = \`\n${searchAndShortcutsDashSelectors}\n${drawersPopupSelectors}\n      \`;`
    );
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ استایل میانبرها به داشبورد و کشویی‌های پیش‌بینی، اوقات شرعی و تایمر به پاپ‌آپ متصل شدند.');
}