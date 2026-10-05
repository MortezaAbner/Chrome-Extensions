
/**
 * ماژول مستقل زمان، تقویم و وضعیت آب‌وهوا
 */
(function initWeatherModule() {
  function toPersianDigits(n) {
    const f = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return n.toString().replace(/\d/g, x => f[x]);
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

    container.innerHTML = `
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
            <span class="ds-weather-icon-top">${weatherState.conditionIcon}</span>
            <span class="ds-temp-val">${weatherState.temp}</span>
          </div>

          <div class="ds-weather-status-wrap">
            <div class="ds-condition-row">
              <span>${weatherState.condition}</span>
              <span>☁️</span>
            </div>
            <div class="ds-temp-range">
              <span>${weatherState.maxTemp} حداکثر . ${weatherState.minTemp} حداقل</span>
            </div>
          </div>

          <div class="ds-card-pill-actions">
            <button class="ds-pill-btn" id="ds-forecast-btn">پیش‌بینی ⌵</button>
            <button class="ds-pill-btn" id="ds-location-btn">📍 ${weatherState.city}</button>
          </div>
        </div>
      </div>
    `;

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
