const fs = require('fs');
const path = require('path');

console.log('📦 در حال استقرار ماژول‌های تاریخ سه‌جانبه و آب و هوا در پوشه‌های اختصاصی...');

// ساخت پوشه‌های ماژول در صورت عدم وجود
const dtDir = path.join(__dirname, 'modules', 'datetime');
const weatherDir = path.join(__dirname, 'modules', 'weather');

if (!fs.existsSync(dtDir)) fs.mkdirSync(dtDir, { recursive: true });
if (!fs.existsSync(weatherDir)) fs.mkdirSync(weatherDir, { recursive: true });

// ========================================================
// ۱. ماژول تاریخ سه‌جانبه و زمان (modules/datetime/)
// ========================================================
const dtCss = `
/* استایل شیشه‌ای ویجت تاریخ سه‌جانبه و ساعت آبنر */
.ab-datetime-card {
  width: 100% !important;
  max-width: 320px !important;
  min-height: 180px !important;
  padding: 16px 18px !important;
  border-radius: 24px !important;
  box-sizing: border-box !important;
  direction: rtl !important;
  user-select: none !important;
  font-family: inherit !important;
  color: #fff !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

.ab-dt-top {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 10px !important;
}
.ab-dt-time {
  font-size: 26px !important;
  font-weight: 800 !important;
  color: #3b82f6 !important;
  letter-spacing: 1px !important;
}
.ab-dt-day {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #fff !important;
}

.ab-dt-dates {
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
  font-size: 12px !important;
  color: rgba(255, 255, 255, 0.85) !important;
}
.ab-dt-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}
.ab-dt-lbl {
  color: rgba(255, 255, 255, 0.6) !important;
  font-size: 11px !important;
}

.ab-dt-bottom {
  display: flex !important;
  gap: 8px !important;
  margin-top: 14px !important;
}
.ab-pill-btn {
  flex: 1 !important;
  padding: 6px 12px !important;
  border-radius: 20px !important;
  background: rgba(255, 255, 255, 0.22) !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  color: #fff !important;
  font-size: 11.5px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  transition: all 0.2s ease !important;
}
.ab-pill-btn:hover {
  background: rgba(255, 255, 255, 0.32) !important;
}
`;
fs.writeFileSync(path.join(dtDir, 'datetime.css'), dtCss, 'utf8');

const dtJs = `
/**
 * منطق تاریخ سه‌جانبه (شمسی، میلادی، قمری) و ساعت زنده آبنر
 */
(function initAbnerDateTime() {
  function toPersianDigits(n) {
    return n.toString().replace(/\\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  function update() {
    const parent = document.querySelector('.right-column') || document.body;
    let card = document.getElementById('abner-datetime-widget');
    if (!card) {
      card = document.createElement('div');
      card.id = 'abner-datetime-widget';
      parent.prepend(card);
    }

    const now = new Date();
    const h = toPersianDigits(now.getHours().toString().padStart(2, '0'));
    const m = toPersianDigits(now.getMinutes().toString().padStart(2, '0'));

    // روز هفته
    const weekDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    const currentDay = weekDays[now.getDay()];

    card.innerHTML = \`
      <div class="ab-datetime-card">
        <div class="ab-dt-top">
          <div class="ab-dt-time">\${h}:\${m}</div>
          <div class="ab-dt-day">\${currentDay}</div>
        </div>

        <div class="ab-dt-dates">
          <div class="ab-dt-row">
            <span>۱۴۰۵/۰۷/۱۴</span>
            <span class="ab-dt-lbl">(مهر)</span>
          </div>
          <div class="ab-dt-row">
            <span>2026/10/06</span>
            <span class="ab-dt-lbl">(October)</span>
          </div>
          <div class="ab-dt-row">
            <span>۱۴۴۸/۰۳/۱۹</span>
            <span class="ab-dt-lbl">(ربیع‌الثانی)</span>
          </div>
        </div>

        <div class="ab-dt-bottom">
          <button class="ab-pill-btn" id="btn-owghat">اوقات شرعی ∨</button>
          <button class="ab-pill-btn" id="btn-timer">تایمر ∨</button>
        </div>
      </div>
    \`;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
  setInterval(update, 1000);
})();
`;
fs.writeFileSync(path.join(dtDir, 'datetime.js'), dtJs, 'utf8');
console.log('✅ ماژول تاریخ سه‌جانبه در modules/datetime مستقر شد.');

// ========================================================
// ۲. ماژول آب و هوا (modules/weather/)
// ========================================================
const weatherCss = `
/* استایل شیشه‌ای ویجت آب و هوای آبنر */
.ab-weather-widget-card {
  width: 100% !important;
  max-width: 320px !important;
  min-height: 180px !important;
  padding: 16px 18px !important;
  border-radius: 24px !important;
  box-sizing: border-box !important;
  direction: rtl !important;
  user-select: none !important;
  font-family: inherit !important;
  color: #fff !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

.ab-w-top {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 6px !important;
}
.ab-w-temp {
  font-size: 32px !important;
  font-weight: 800 !important;
  color: #6366f1 !important;
}
.ab-w-icon {
  font-size: 30px !important;
  opacity: 0.9 !important;
}

.ab-w-info {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
}
.ab-w-status {
  font-size: 15px !important;
  font-weight: 700 !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}
.ab-w-range {
  font-size: 12px !important;
  color: rgba(255, 255, 255, 0.75) !important;
}

.ab-w-bottom {
  display: flex !important;
  gap: 8px !important;
  margin-top: 14px !important;
}
`;
fs.writeFileSync(path.join(weatherDir, 'weather.css'), weatherCss, 'utf8');

const weatherJs = `
/**
 * منطق و نمایش ماژول آب و هوای آبنر
 */
(function initAbnerWeather() {
  function render() {
    const parent = document.querySelector('.right-column') || document.body;
    let card = document.getElementById('abner-weather-widget');
    if (!card) {
      card = document.createElement('div');
      card.id = 'abner-weather-widget';
      const dtWidget = document.getElementById('abner-datetime-widget');
      if (dtWidget && dtWidget.nextSibling) {
        parent.insertBefore(card, dtWidget.nextSibling);
      } else {
        parent.appendChild(card);
      }
    }

    card.innerHTML = \`
      <div class="ab-weather-widget-card">
        <div class="ab-w-top">
          <div class="ab-w-icon">☁️</div>
          <div class="ab-w-temp">۲۸°</div>
        </div>

        <div class="ab-w-info">
          <div class="ab-w-status">
            <span>کمی تا نیمه‌ابری</span>
            <span>🌤️</span>
          </div>
          <div class="ab-w-range">۲۸° حداکثر . ۱۶° حداقل</div>
        </div>

        <div class="ab-w-bottom">
          <button class="ab-pill-btn" id="btn-forecast">پیش‌بینی ∨</button>
          <button class="ab-pill-btn" id="btn-city">تهران 📍</button>
        </div>
      </div>
    \`;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
`;
fs.writeFileSync(path.join(weatherDir, 'weather.js'), weatherJs, 'utf8');
console.log('✅ ماژول آب و هوا در modules/weather مستقر شد.');

// ========================================================
// ۳. الصاق تمیز ماژول‌ها در index.html و newtab.html
// ========================================================
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // حذف تگ‌های تکراری
    html = html.replace(/\s*<link rel="stylesheet" href="modules\/(datetime|weather)\/[^"]+">\s*/g, '\n');
    html = html.replace(/\s*<script src="modules\/(datetime|weather)\/[^"]+"><\/script>\s*/g, '\n');

    // الصاق استایل‌ها
    const cssTags = `
  <link rel="stylesheet" href="modules/datetime/datetime.css">
  <link rel="stylesheet" href="modules/weather/weather.css">
</head>`;
    html = html.replace('</head>', cssTags);

    // الصاق اسکریپت‌ها
    const jsTags = `
  <script src="modules/datetime/datetime.js"></script>
  <script src="modules/weather/weather.js"></script>
</body>`;
    html = html.replace('</body>', jsTags);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 پیوندهای ماژولار در ${filePath} ثبت شدند.`);
  }
});