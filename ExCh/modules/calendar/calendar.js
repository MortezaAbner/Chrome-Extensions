
/**
 * ماژول تقویم فارسی آبنر با پاک‌سازی تقویم‌های تکراری
 */
(function initAbnerCalendar() {
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  const daySubLabels = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  let state = {
    year: 1405,
    month: 7,
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
    // حذف کامل تقویم‌های تکراری و اضافی در صفحه
    document.querySelectorAll('#ab-calendar-container-extra, .calendar-section:not(#abner-calendar-container)').forEach(el => el.remove());

    // یافتن یا ساخت کانتینر تقویم اصلی در سمت راست
    let container = document.getElementById('abner-calendar-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'abner-calendar-container';
      const rightCol = document.querySelector('.right-column') || document.querySelector('.calendar-area') || document.body;
      rightCol.appendChild(container);
    }

    const monthDays = getDaysInMonth(state.month);
    const monthName = persianMonths[state.month - 1];

    let cellsHtml = '';
    for (let d = 1; d <= monthDays; d++) {
      const isToday = (d === state.day && state.month === 7 && state.year === 1405);
      const isSelected = (d === state.selectedDay);
      const subText = daySubLabels[(d - 1) % 7];

      cellsHtml += `
        <div class="ab-calendar-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-day="${d}">
          <span class="ab-calendar-day-num">${toPersianDigits(d)}</span>
          <span class="ab-calendar-day-sub">${subText}</span>
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
        <div class="ab-calendar-subtitle">ربيع‌الثاني . جمادی‌الثانی . اول-مهر</div>
        
        <div class="ab-calendar-weekdays">
          <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span>ج</span>
        </div>
        
        <div class="ab-calendar-days-grid">
          ${cellsHtml}
        </div>

        <div class="ab-calendar-footer">
          <button class="ab-cal-footer-btn">📅 تقویم گوگل</button>
          <button class="ab-cal-footer-btn">🔄 تبدیل تاریخ</button>
        </div>
      </div>
    `;

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

    container.querySelectorAll('.ab-calendar-day-cell').forEach(el => {
      el.onclick = () => {
        state.selectedDay = parseInt(el.getAttribute('data-day'));
        renderCalendar();
      };
    });
  }

  window.renderAbnerCalendar = renderCalendar;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCalendar);
  } else {
    renderCalendar();
  }
})();
