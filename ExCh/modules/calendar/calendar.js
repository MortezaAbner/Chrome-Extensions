
(function initAbnerRightCalendar() {
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  const daySubLabels = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  let calState = {
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

  function openJumpModal() {
    document.getElementById('ab-cal-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'ab-cal-modal';
    modal.className = 'ab-cal-modal';
    modal.innerHTML = `
      <div class="ab-cal-modal-box">
        <h4 style="margin:0 0 10px 0;font-size:14px;">رفتن به تاریخ در آبنر</h4>
        <label style="font-size:12px;">سال:</label>
        <input type="number" id="ab-jump-y" value="${calState.year}">
        <label style="font-size:12px;">ماه (۱ تا ۱۲):</label>
        <input type="number" id="ab-jump-m" min="1" max="12" value="${calState.month}">
        <label style="font-size:12px;">روز (۱ تا ۳۱):</label>
        <input type="number" id="ab-jump-d" min="1" max="31" value="${calState.selectedDay}">
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button id="ab-jump-apply" style="flex:1;padding:8px;background:#2563eb;color:#fff;border:none;border-radius:10px;cursor:pointer;">تأیید</button>
          <button id="ab-jump-close" style="flex:1;padding:8px;background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:10px;cursor:pointer;">انصراف</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('ab-jump-close').onclick = () => modal.remove();
    document.getElementById('ab-jump-apply').onclick = () => {
      const y = parseInt(document.getElementById('ab-jump-y').value) || calState.year;
      const m = parseInt(document.getElementById('ab-jump-m').value) || calState.month;
      const d = parseInt(document.getElementById('ab-jump-d').value) || calState.selectedDay;
      calState.year = y;
      calState.month = Math.min(12, Math.max(1, m));
      calState.selectedDay = Math.min(getDaysInMonth(calState.month), Math.max(1, d));
      modal.remove();
      render();
    };
  }

  function openGoogleCalendar() {
    window.open('https://calendar.google.com/', '_blank');
  }

  function render() {
    // ۱. حذف کامل تقویم اضافه پایین صفحه
    document.querySelectorAll('.ab-calendar-card:not(#abner-calendar-root), .bottom-calendar, .center-column .ab-calendar-card').forEach(el => el.remove());

    // ۲. پیدا کردن کانتینر در ستون سمت راست
    let container = document.getElementById('abner-calendar-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'abner-calendar-root';
      const rightCol = document.querySelector('.right-column') || document.querySelector('.side-column') || document.body;
      rightCol.appendChild(container);
    }

    const monthDays = getDaysInMonth(calState.month);
    const monthName = persianMonths[calState.month - 1];

    let cellsHtml = '';
    for (let d = 1; d <= monthDays; d++) {
      const isToday = (d === calState.day && calState.month === 7 && calState.year === 1405);
      const isSelected = (d === calState.selectedDay);
      const sub = daySubLabels[(d - 1) % 7];

      cellsHtml += `
        <div class="ab-cal-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-day="${d}">
          <span class="ab-cal-num">${toPersianDigits(d)}</span>
          <span class="ab-cal-sub">${sub}</span>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="ab-cal-head">
        <button class="ab-cal-arrow" id="ab-cal-prev">‹</button>
        <span class="ab-cal-title">${monthName} ${toPersianDigits(calState.year)}</span>
        <button class="ab-cal-arrow" id="ab-cal-next">›</button>
      </div>
      <div class="ab-cal-subhead">ربيع‌الثاني . جمادی‌الثانی . اول-مهر</div>
      
      <div class="ab-cal-weekdays">
        <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span>ج</span>
      </div>
      
      <div class="ab-cal-grid">
        ${cellsHtml}
      </div>

      <div class="ab-cal-foot">
        <button class="ab-cal-foot-btn" id="ab-cal-google">📅 تقویم گوگل</button>
        <button class="ab-cal-foot-btn" id="ab-cal-jump">🔄 رفتن به تاریخ</button>
      </div>
    `;

    // تنظیم کنترل‌ها
    document.getElementById('ab-cal-prev').onclick = () => {
      if (calState.month > 1) calState.month--;
      else { calState.month = 12; calState.year--; }
      render();
    };
    document.getElementById('ab-cal-next').onclick = () => {
      if (calState.month < 12) calState.month++;
      else { calState.month = 1; calState.year++; }
      render();
    };

    document.getElementById('ab-cal-google').onclick = openGoogleCalendar;
    document.getElementById('ab-cal-jump').onclick = openJumpModal;

    container.querySelectorAll('.ab-cal-cell').forEach(cell => {
      cell.onclick = () => {
        calState.selectedDay = parseInt(cell.getAttribute('data-day'));
        render();
      };
    });
  }

  window.renderAbnerCalendar = render;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
