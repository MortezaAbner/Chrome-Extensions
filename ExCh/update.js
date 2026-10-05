const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // جایگزینی تمیز و قطعی تابع تزریق بلر خالص شیشه‌ای
  const cleanFrostedGlassScript = `
      // کنترل شفافیت شیشه کریستالی (حفظ بافت شیشه بدون کدر شدن رنگ)
      const dAlpha = (0.05 + (d / 100 * 0.10)).toFixed(2);
      const pAlpha = (0.08 + (p / 100 * 0.12)).toFixed(2);

      let styleTag = document.getElementById('live-custom-blur-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'live-custom-blur-style';
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = \`
        .ios-glass-card:not(.settings-modal-card) {
          backdrop-filter: blur(\${dPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(\${dPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, \${dAlpha}) !important;
        }
        [data-theme="dark"] .ios-glass-card:not(.settings-modal-card) {
          background: rgba(15, 23, 42, \${dAlpha}) !important;
        }

        .glass-blur-menu,
        .forecast-drawer,
        .clock-drawer,
        .azan-city-dropdown,
        .month-year-picker-modal,
        .date-event-popup,
        .task-tool-popup,
        .location-modal-box,
        .settings-modal-card {
          backdrop-filter: blur(\${popupPx}px) saturate(190%) !important;
          -webkit-backdrop-filter: blur(\${popupPx}px) saturate(190%) !important;
          background: rgba(255, 255, 255, \${pAlpha}) !important;
        }
        [data-theme="dark"] .glass-blur-menu,
        [data-theme="dark"] .forecast-drawer,
        [data-theme="dark"] .clock-drawer,
        [data-theme="dark"] .settings-modal-card {
          background: rgba(15, 23, 42, \${pAlpha}) !important;
        }
      \`;
`;

  // بازنویسی دقیق بلوک استایل داینامیک
  js = js.replace(/const dAlpha\s*=\s*[\s\S]*?settings-modal-card\s*\{[\s\S]*?\}\s*`;/g, cleanFrostedGlassScript.trim());

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ استایل شیشه مات کریستالی بدون کدر شدن در ۱۰۰٪ اعمال شد.');
}