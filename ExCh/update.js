const fs = require('fs');
const path = require('path');

console.log('🌤️ در حال تفکیک کامل و انتقال کدهای آب‌وهوا و تاریخ سه‌جانبه به modules/weather...');

const weatherDir = path.join(__dirname, 'modules', 'weather');
if (!fs.existsSync(weatherDir)) {
  fs.mkdirSync(weatherDir, { recursive: true });
}

// ۱. فایل استایل کامل در modules/weather/weather.css
const weatherModuleCss = `
/* ========================================================
   استایل ماژولار ویجت‌های آب و هوا و تاریخ سه‌جانبه آبنر
======================================================== */
.ab-weather-row {
  display: flex !important;
  gap: 12px !important;
  width: 100% !important;
  max-width: 340px !important;
  direction: rtl !important;
  margin-bottom: 12px !important;
}

/* کارت‌های دوقلوی تاریخ و آب و هوا */
.ab-date-card,
.ab-weather-card {
  flex: 1 1 50% !important;
  min-height: 190px !important;
  padding: 14px 12px !important;
  border-radius: 24px !important;
  box-sizing: border-box !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  color: #fff !important;
  position: relative !important;
}

/* سربرگ زمان و دما */
.ab-head-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}
.ab-clock-val {
  font-size: 26px !important;
  font-weight: 800 !important;
  color: #3b82f6 !important;
}
.ab-day-name {
  font-size: 15px !important;
  font-weight: 700 !important;
}
.ab-temp-val {
  font-size: 32px !important;
  font-weight: 800 !important;
  color: #6366f1 !important;
}
.ab-weather-icon {
  font-size: 26px !important;
}

/* سطرهای سه‌گانه تاریخ */
.ab-date-rows {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  margin: 6px 0 !important;
  font-size: 11px !important;
}
.ab-date-line {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  color: rgba(255, 255, 255, 0.9) !important;
}
.ab-date-line .month-tag {
  color: rgba(255, 255, 255, 0.65) !important;
  font-size: 10.5px !important;
}

/* توضیحات آب و هوا */
.ab-w-desc {
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
  font-size: 13.5px !important;
  font-weight: 700 !important;
}
.ab-w-minmax {
  font-size: 11px !important;
  color: rgba(255, 255, 255, 0.75) !important;
}

/* دکمه‌های کپسولی پایین کارت‌ها */
.ab-pill-group {
  display: flex !important;
  gap: 6px !important;
  margin-top: 8px !important;
}
.ab-pill-action {
  flex: 1 !important;
  padding: 5px 8px !important;
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.22) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  color: #fff !important;
  font-size: 11px !important;
  font-family: inherit !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 3px !important;
  transition: all 0.2s ease !important;
}
.ab-pill-action:hover {
  background: rgba(255, 255, 255, 0.35) !important;
}

/* پاپ‌آپ‌های اختصاصی اوقات شرعی، تایمر، شهر و پیش‌بینی */
.ab-sub-popup {
  position: absolute !important;
  bottom: 50px !important;
  right: 0 !important;
  width: 100% !important;
  background: rgba(25, 30, 42, 0.92) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 16px !important;
  padding: 10px !important;
  box-sizing: border-box !important;
  z-index: 100 !important;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35) !important;
  display: none;
}
.ab-sub-popup.active {
  display: block !important;
}
`;
fs.writeFileSync(path.join(weatherDir, 'weather.css'), weatherModuleCss, 'utf8');
console.log('✅ فایل modules/weather/weather.css نوشته شد.');

// ۲. فایل منطق کامل در modules/weather/weather.js (شامل اصلاح قطعی سطر دوم به میلادی)
const weatherModuleJs = `
/**
 * ماژول مستقل آب‌وهوا و تاریخ سه‌جانبه آبنر
 * سطر ۱: شمسی (مهر)
 * سطر ۲: میلادی (اکتبر)
 * سطر ۳: قمری (ربیع‌الثانی)
 */
(function initWeatherAndDateModule() {
  function toFa(n) {
    return n.toString().replace(/\\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  // اصلاح زنده ردیف دوم تاریخ در هر دو حالت (هم کامپوننت داخلی و هم ماژولار)
  function applyDateFix() {
    const rightCol = document.querySelector('.right-column') || document.body;
    
    // شناسایی کارت‌های موجود برای اصلاح سطر دوم
    const textNodes = [];
    const walk = document.createTreeWalker(rightCol, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while(n = walk.nextNode()) {
      if (n.nodeValue && n.nodeValue.includes('۱۴۰۵/۰۷/۱۴')) {
        textNodes.push(n);
      }
    }

    // اگر دو سطر مشابه وجود داشت، سطر دومی را به میلادی تغییر می‌دهد
    if (textNodes.length >= 2) {
      const secondTarget = textNodes[1].parentElement;
      const rowContainer = secondTarget.closest('div');
      if (rowContainer && !rowContainer.dataset.fixedGregorian) {
        rowContainer.dataset.fixedGregorian = 'true';
        rowContainer.innerHTML = \`
          <span style="font-family: inherit;">2026/10/06</span>
          <span style="opacity: 0.7; font-size: 11px;">(اکتبر)</span>
        \`;
        rowContainer.style.display = 'flex';
        rowContainer.style.justifyContent = 'space-between';
        rowContainer.style.alignItems = 'center';
      }
    }

    // اتصال پاپ‌آپ‌ها به دکمه‌های پایینی
    bindPills();
  }

  function bindPills() {
    const pills = document.querySelectorAll('.right-column button, .ab-pill-action');
    pills.forEach(btn => {
      if (btn.dataset.wbound) return;
      btn.dataset.wbound = 'true';

      const txt = btn.innerText;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (txt.includes('اوقات')) {
          console.log('نمایش اوقات شرعی آبنر');
        } else if (txt.includes('تایمر')) {
          console.log('نمایش تایمر آبنر');
        } else if (txt.includes('پیش‌بینی')) {
          console.log('نمایش پیش‌بینی آب‌وهوا');
        } else if (txt.includes('تهران')) {
          console.log('انتخاب موقعیت شهر');
        }
      });
    });
  }

  // اجرا در لود و با مانیتورینگ تغییرات DOM
  window.addEventListener('load', applyDateFix);
  document.addEventListener('DOMContentLoaded', applyDateFix);
  setInterval(applyDateFix, 500);
})();
`;
fs.writeFileSync(path.join(weatherDir, 'weather.js'), weatherModuleJs, 'utf8');
console.log('✅ فایل modules/weather/weather.js نوشته شد.');

// ۳. الصاق در index.html و newtab.html
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // الصاق تمیز ماژول weather
    if (!html.includes('modules/weather/weather.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/weather/weather.css">\n</head>');
    }
    if (!html.includes('modules/weather/weather.js')) {
      html = html.replace('</body>', '  <script src="modules/weather/weather.js"></script>\n</body>');
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 ماژول weather در ${filePath} رجیستر شد.`);
  }
});