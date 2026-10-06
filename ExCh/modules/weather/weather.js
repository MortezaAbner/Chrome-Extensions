
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

    card.innerHTML = `
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
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
