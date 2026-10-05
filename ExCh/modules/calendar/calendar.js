
/**
 * ماژول مستقل تقویم فارسی آبنر
 */
(function initAbnerCalendar() {
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  // مقادیر پیش‌فرض تاریخ جاری شمسی
  let state = {
    year: 1405,
    month: 7, // مهر
    day: 13,
    selectedDay: 13
  };

  function toPersianDigits(n) {
    const f = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return n.toString().replace(/\d/g, x => f[x]);
  }

  function getDaysInMonth(m) {
    if (m <= 6) return 31;
    if (m <= 11) return 30;
    return 29;
  }

  function renderCalendar() {
    let container = document.getElementById('abner-calendar-container') || document.querySelector('.calendar-section');
    if (!container) {
      // ایجاد در ستون راست در صورت نبودن کانتینر
      container = document.createElement('div');
      container.id = 'abner-calendar-container';
      const rightCol = document.querySelector('.right-column') || document.body;
      rightCol.appendChild(container);
    }

    const monthDays = getDaysInMonth(state.month);
    const monthName = persianMonths[state.month - 1];

    let daysHtml = '';
    for (let d = 1; d <= monthDays; d++) {
      const isToday = (d === state.day && state.month === 7 && state.year === 1405);
      const isSelected = (d === state.selectedDay);
      daysHtml += `
        <div class="ab-calendar-day ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-day="${d}">
          ${toPersianDigits(d)}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="ab-calendar-card">
        <div class="ab-calendar-header">
          <button class="ab-calendar-nav-btn" id="ab-cal-prev">‹</button>
          <span class="ab-calendar-title">${monthName} ${toPersianDigits(state.year)}</span>
          <button class="ab-calendar-nav-btn" id="ab-cal-next">›</button>
        </div>
        <div class="ab-calendar-weekdays">
          <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span>ج</span>
        </div>
        <div class="ab-calendar-days-grid">
          ${daysHtml}
        </div>
      </div>
    `;

    // تعویض ماه
    document.getElementById('ab-cal-prev').onclick = () => {
      if (state.month > 1) state.month--;
      else { state.month = 12; state.year--; }
      renderCalendar();
    };
    document.getElementById('ab-cal-next').onclick = () => {
      if (state.month < 12) state.month++;
      else { state.month = 1; state.year++; }
      renderCalendar();
    };

    // انتخاب روز
    container.querySelectorAll('.ab-calendar-day').forEach(el => {
      el.onclick = () => {
        state.selectedDay = parseInt(el.getAttribute('data-day'));
        renderCalendar();
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCalendar);
  } else {
    renderCalendar();
  }
})();
