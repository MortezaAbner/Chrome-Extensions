
/**
 * منطق تاریخ سه‌جانبه (شمسی، میلادی، قمری) و ساعت زنده آبنر
 */
(function initAbnerDateTime() {
  function toPersianDigits(n) {
    return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
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

    card.innerHTML = `
      <div class="ab-datetime-card">
        <div class="ab-dt-top">
          <div class="ab-dt-time">${h}:${m}</div>
          <div class="ab-dt-day">${currentDay}</div>
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
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
  setInterval(update, 1000);
})();
