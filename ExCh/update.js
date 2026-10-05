const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const targetedBlurSeparation = `
      // کنترل تفکیک‌شده بلر داشبورد (شامل مکان) و پاپ‌آپ‌ها (پیش‌بینی، اوقات شرعی، تایمر)
      let styleTag = document.getElementById('live-custom-blur-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'live-custom-blur-style';
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = \`
        /* ۱. داشبورد اصلی و پاپ‌آپ/دکمه مکان */
        .ios-glass-card,
        .weather-card,
        .clock-card,
        .calendar-card,
        .task-card,
        .quick-actions-bar,
        .dock-container,
        .task-item-card,
        .stat-card,
        .location-modal-box,
        .location-chip,
        #weather-city-btn,
        #location-search-modal {
          backdrop-filter: blur(\${dPx}px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(\${dPx}px) saturate(160%) !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }
        [data-theme="dark"] .ios-glass-card,
        [data-theme="dark"] .weather-card,
        [data-theme="dark"] .clock-card,
        [data-theme="dark"] .calendar-card,
        [data-theme="dark"] .task-card,
        [data-theme="dark"] .dock-container,
        [data-theme="dark"] .task-item-card,
        [data-theme="dark"] .location-modal-box,
        [data-theme="dark"] .location-chip,
        [data-theme="dark"] #weather-city-btn,
        [data-theme="dark"] #location-search-modal {
          background: rgba(15, 23, 42, 0.15) !important;
        }

        /* ۲. پاپ‌آپ‌ها: پیش‌بینی، اوقات شرعی، تایمر و تنظیمات */
        .glass-blur-menu,
        .forecast-drawer,
        #forecast-drawer,
        .clock-drawer,
        #timer-drawer,
        #azan-drawer,
        .azan-city-dropdown,
        .month-year-picker-modal,
        .date-event-popup,
        .task-tool-popup,
        .task-modal-box,
        .task-edit-modal,
        .settings-modal-card,
        .modal-overlay .modal-card,
        .app-view.modal-overlay {
          backdrop-filter: blur(\${popupPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(\${popupPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        [data-theme="dark"] .glass-blur-menu,
        [data-theme="dark"] .forecast-drawer,
        [data-theme="dark"] #forecast-drawer,
        [data-theme="dark"] .clock-drawer,
        [data-theme="dark"] #timer-drawer,
        [data-theme="dark"] #azan-drawer,
        [data-theme="dark"] .task-modal-box,
        [data-theme="dark"] .task-edit-modal,
        [data-theme="dark"] .settings-modal-card,
        [data-theme="dark"] .modal-overlay .modal-card {
          background: rgba(15, 23, 42, 0.22) !important;
        }
      \`;
`;

  // فقط جایگزینی بلوک تزریق استایل بدون دستکاری بقیه فایل
  js = js.replace(/let styleTag = document\.getElementById\('live-custom-blur-style'\);[\s\S]*?settings-modal-card\s*\{[\s\S]*?\}\s*`;/g, targetedBlurSeparation.trim());

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ تفکیک ماتی پاپ‌آپ مکان با پیش‌بینی، اوقات شرعی و تایمر در script.js اعمال شد.');
}