const fs = require('fs');

if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const unifiedGlassStyles = `
/* =========================================================
   یکپارچه‌سازی قطعی استایل شیشه‌ای مات داشبورد در تمام نقاط
   ========================================================= */

/* کلاس پایه برای تمام پاپ‌آپ‌ها، دراورها و پنجره‌ها */
.glass-blur-menu,
.forecast-drawer,
.clock-drawer,
.azan-city-dropdown,
.month-year-picker-modal,
.date-event-popup,
.task-tool-popup,
.board-dropdown-menu,
.location-modal-box,
.convert-modal-box,
.settings-modal-card,
#add-modal .modal-content,
#timer-alarm-modal .modal-content {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(50px) saturate(220%) !important;
  -webkit-backdrop-filter: blur(50px) saturate(220%) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: 28px !important;
  box-shadow: var(--glass-shadow), var(--glass-specular) !important;
}

/* آیتم‌ها و باکس‌های داخلی پاپ‌آپ‌ها (کارت‌های روزانه، اینپوت‌ها و دکمه‌ها) */
.forecast-day-box,
.picker-scroll-list,
.manual-input-wrapper input,
.timer-input,
.azan-city-dropdown input,
.tag-input-row input,
.custom-select-glass,
.counter-box-glass,
.edit-task-title-row,
.edit-task-desc-area {
  background: rgba(255, 255, 255, 0.22) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2) !important;
  color: var(--text-main) !important;
}

[data-theme="dark"] .forecast-day-box,
[data-theme="dark"] .picker-scroll-list,
[data-theme="dark"] .manual-input-wrapper input,
[data-theme="dark"] .timer-input,
[data-theme="dark"] .azan-city-dropdown input,
[data-theme="dark"] .tag-input-row input,
[data-theme="dark"] .custom-select-glass,
[data-theme="dark"] .counter-box-glass,
[data-theme="dark"] .edit-task-title-row,
[data-theme="dark"] .edit-task-desc-area {
  background: rgba(0, 0, 0, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
}

/* پس‌زمینه محو شیشه‌ای لایه اورلی مودال‌ها */
.modal-overlay {
  background: rgba(15, 23, 42, 0.3) !important;
  backdrop-filter: blur(25px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(25px) saturate(180%) !important;
}
`;

  // پاک‌سازی تعاریف قبلی شیشه اختصاصی و جایگزینی با سیستم یکپارچه
  css = css.replace(/\/\* =========================================================[\s\S]*?\/\* پس‌زمینه محو شیشه‌ای لایه اورلی مودال‌ها \*\/[\s\S]*?\}/g, '');
  css += '\n' + unifiedGlassStyles;

  fs.writeFileSync('./style.css', css, 'utf8');
  console.log('✅ استایل شیشه‌ای مات داشبورد با موفقیت بر روی تمام بخش‌ها اعمال شد.');
}