const fs = require('fs');
const path = require('path');

// ۱. ساخت پوشه اختصاصی آب‌وهوا
const weatherDir = path.join(__dirname, 'modules', 'weather');
if (!fs.existsSync(weatherDir)) {
  fs.mkdirSync(weatherDir, { recursive: true });
  console.log('📁 پوشه modules/weather ساخته شد.');
}

// ۲. استایل شیشه‌ای کامل متصل به اسلایدر بلر و شفافیت (modules/weather/weather.css)
const weatherCss = `
/* ========================================================
   استایل ماژولار شیشه‌ای آب‌وهوا و ساعت متصل به اسلایدر
======================================================== */
.ds-weather-widget-container {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 14px;
  direction: rtl;
  user-select: none;
  font-family: inherit;
  margin-bottom: 20px;
}

.ds-weather-card {
  flex: 1;
  max-width: 250px;
  min-width: 210px;
  padding: 16px 14px 12px 14px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--dash-glass-bg) !important;
  backdrop-filter: blur(var(--dash-blur-px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, background 0.2s ease;
}

.ds-weather-card:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
}

/* بخش هدر و مقادیر اصلی */
.ds-card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ds-time-val, .ds-temp-val {
  font-size: 38px;
  font-weight: 800;
  color: #3b82f6;
  line-height: 1;
}

.ds-day-title {
  font-size: 19px;
  font-weight: bold;
  color: #1f2937;
}
[data-theme="dark"] .ds-day-title {
  color: #f3f4f6;
}

.ds-weather-icon-top {
  font-size: 34px;
  opacity: 0.85;
}

/* اطلاعات میانی (تاریخ‌ها و وضعیت آب‌وهوا) */
.ds-dates-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 6px 0 12px 0;
  font-size: 13px;
  color: #4b5563;
}
[data-theme="dark"] .ds-dates-list {
  color: #9ca3af;
}

.ds-date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ds-weather-status-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 6px 0 12px 0;
}

.ds-condition-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}
[data-theme="dark"] .ds-condition-row {
  color: #f3f4f6;
}

.ds-temp-range {
  font-size: 13px;
  color: #4b5563;
}
[data-theme="dark"] .ds-temp-range {
  color: #9ca3af;
}

/* دکمه‌های کپسولی پایین کارت‌ها */
.ds-card-pill-actions {
  display: flex;
  gap: 8px;
}

.ds-pill-btn {
  flex: 1;
  padding: 6px 10px;
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 600;
  border: 1px solid var(--dash-glass-border);
  background: rgba(255, 255, 255, calc(var(--dash-glass-opacity) + 0.15));
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.15s ease;
}
.ds-pill-btn:hover {
  background: rgba(255, 255, 255, calc(var(--dash-glass-opacity) + 0.28));
  transform: scale(1.02);
}
`;
fs.writeFileSync(path.join(weatherDir, 'weather.css'), weatherCss, 'utf8');
console.log('✅ استایل modules/weather/weather.css ثبت شد.');

// ۳. جاوااسکریپت ماژول مستقل آب‌وهوا و زمان (modules/weather/weather.js)
const weatherJs = `
/**
 * ماژول مستقل زمان، تقویم و وضعیت آب‌وهوا
 */
(function initWeatherModule() {
  function toPersianDigits(n) {
    const f = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return n.toString().replace(/\\d/g, x => f[x]);
  }

  // داده‌های ذخیره‌شده یا پیش‌فرض
  const weatherState = {
    city: localStorage.getItem('ds_city_name') || 'تهران',
    temp: '۱۸°',
    condition: 'تمام ابری',
    conditionIcon: '☁️',
    maxTemp: '۲۶°',
    minTemp: '۱۴°'
  };

  function updateClockAndDates() {
    const timeEl = document.getElementById('ds-time-display');
    const dayEl = document.getElementById('ds-day-display');
    if (!timeEl || !dayEl) return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = toPersianDigits(h + ':' + m);

    const days = ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    dayEl.textContent = days[now.getDay()];
  }

  function renderWeatherWidget() {
    let container = document.getElementById('weather-time-container') || document.querySelector('.weather-section');
    if (!container) return;

    container.innerHTML = \`
      <div class="ds-weather-widget-container">
        <!-- کارت زمان و تقویم -->
        <div class="ds-weather-card">
          <div class="ds-card-top-row">
            <span class="ds-time-val" id="ds-time-display">--:--</span>
            <span class="ds-day-title" id="ds-day-display">دوشنبه</span>
          </div>

          <div class="ds-dates-list">
            <div class="ds-date-item">
              <span>۱۴۰۵/۰۷/۱۳</span>
              <span>(مهر)</span>
            </div>
            <div class="ds-date-item">
              <span>۱۴۰۵/۰۷/۱۳</span>
              <span>(مهر)</span>
            </div>
            <div class="ds-date-item">
              <span>۱۴۴۸/۰۳/۱۹</span>
              <span>(ربیع‌الثانی)</span>
            </div>
          </div>

          <div class="ds-card-pill-actions">
            <button class="ds-pill-btn" id="ds-timer-btn">تایمر ⌵</button>
            <button class="ds-pill-btn" id="ds-pray-btn">اوقات شرعی ⌵</button>
          </div>
        </div>

        <!-- کارت آب و هوا -->
        <div class="ds-weather-card">
          <div class="ds-card-top-row">
            <span class="ds-weather-icon-top">\${weatherState.conditionIcon}</span>
            <span class="ds-temp-val">\${weatherState.temp}</span>
          </div>

          <div class="ds-weather-status-wrap">
            <div class="ds-condition-row">
              <span>\${weatherState.condition}</span>
              <span>☁️</span>
            </div>
            <div class="ds-temp-range">
              <span>\${weatherState.maxTemp} حداکثر . \${weatherState.minTemp} حداقل</span>
            </div>
          </div>

          <div class="ds-card-pill-actions">
            <button class="ds-pill-btn" id="ds-forecast-btn">پیش‌بینی ⌵</button>
            <button class="ds-pill-btn" id="ds-location-btn">📍 \${weatherState.city}</button>
          </div>
        </div>
      </div>
    \`;

    updateClockAndDates();
    setInterval(updateClockAndDates, 1000);

    // تغییر شهر
    document.getElementById('ds-location-btn').onclick = () => {
      const newCity = prompt('نام شهر را وارد کنید:', weatherState.city);
      if (newCity && newCity.trim()) {
        weatherState.city = newCity.trim();
        localStorage.setItem('ds_city_name', weatherState.city);
        renderWeatherWidget();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWeatherWidget);
  } else {
    renderWeatherWidget();
  }
})();
`;
fs.writeFileSync(path.join(weatherDir, 'weather.js'), weatherJs, 'utf8');
console.log('✅ اسکریپت modules/weather/weather.js ثبت شد.');

// ۴. الصاق به فایل‌های index.html و newtab.html
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    if (!html.includes('modules/weather/weather.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/weather/weather.css">\n</head>');
    }
    if (!html.includes('modules/weather/weather.js')) {
      html = html.replace('</body>', '  <script src="modules/weather/weather.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 ماژول آب‌وهوا به ${filePath} متصل شد.`);
  }
});