const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // جایگزینی دقیق تابع تزریق استایل برای حذف سفیدی و پوشش سراسری تمام بخش‌های شیشه‌ای
  const cleanUniversalGlassEngine = `
      // کنترل بلر خالص و شیشه کریستالی بدون هیچ‌گونه لایه سفید یا کدر
      let styleTag = document.getElementById('live-custom-blur-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'live-custom-blur-style';
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = \`
        /* ۱. اعمال بلر بر تمامی کارت‌های اصلی داشبورد، آب‌وهوا، ساعت، تقویم و تسک‌ها */
        .ios-glass-card,
        .weather-card,
        .clock-card,
        .calendar-card,
        .task-card,
        .quick-actions-bar,
        .dock-container,
        .task-item-card,
        .stat-card {
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
        [data-theme="dark"] .task-item-card {
          background: rgba(15, 23, 42, 0.15) !important;
        }

        /* ۲. اعمال بلر بر تمامی پاپ‌آپ‌ها، دراورها، ویرایش تسک و پنجره‌های تنظیمات */
        .glass-blur-menu,
        .forecast-drawer,
        .clock-drawer,
        .azan-city-dropdown,
        .month-year-picker-modal,
        .date-event-popup,
        .task-tool-popup,
        .task-modal-box,
        .task-edit-modal,
        .location-modal-box,
        .settings-modal-card,
        .modal-overlay .modal-card,
        .app-view.modal-overlay {
          backdrop-filter: blur(\${popupPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(\${popupPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        [data-theme="dark"] .glass-blur-menu,
        [data-theme="dark"] .forecast-drawer,
        [data-theme="dark"] .clock-drawer,
        [data-theme="dark"] .task-modal-box,
        [data-theme="dark"] .task-edit-modal,
        [data-theme="dark"] .settings-modal-card,
        [data-theme="dark"] .modal-overlay .modal-card {
          background: rgba(15, 23, 42, 0.22) !important;
        }
      \`;
`;

  // جایگزینی دقیق بلوک استایل در فایل
  js = js.replace(/let styleTag = document\.getElementById\('live-custom-blur-style'\);[\s\S]*?settings-modal-card\s*\{[\s\S]*?\}\s*`;/g, cleanUniversalGlassEngine.trim());

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ بلر سراسری شیشه‌ای کریستالی روی تمام پاپ‌آپ‌ها و کارت‌ها اعمال شد.');
}