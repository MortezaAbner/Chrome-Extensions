
/**
 * ماژول جاوااسکریپت تقویم شمسی آبنر
 */
(function() {
  const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const weekDays = ['ش','ی','د','س','چ','پ','ج'];
  let state = { year: 1405, month: 7, day: 13, sel: 13 };

  function toFa(n) { return n.toString().replace(/\d/g, x => '۰۱۲۳۴۵۶۷۸۹'[x]); }

  function render() {
    const rightCol = document.querySelector('.right-column') || document.body;
    let root = document.getElementById('abner-modular-calendar');
    if (!root) {
      root = document.createElement('div');
      root.id = 'abner-modular-calendar';
      rightCol.appendChild(root);
    }

    let cells = '';
    for (let d = 1; d <= 30; d++) {
      const isToday = d === state.day;
      const isSel = d === state.sel;
      cells += `
        <div class="ab-cal-cell ${isToday ? 'is-today' : ''} ${isSel ? 'is-selected' : ''}" data-day="${d}">
          <span style="font-size:12.5px;font-weight:600;">${toFa(d)}</span>
          <span style="font-size:8.5px;opacity:0.5;">${weekDays[(d - 1) % 7]}</span>
        </div>
      `;
    }

    root.innerHTML = `
      <div class="ab-calendar-card">
        <div class="ab-cal-head">
          <button class="ab-cal-arrow" id="ab-m-prev">‹</button>
          <span style="font-weight:700;">${months[state.month - 1]} ${toFa(state.year)}</span>
          <button class="ab-cal-arrow" id="ab-m-next">›</button>
        </div>
        <div class="ab-cal-grid" style="font-size:11px;opacity:0.8;margin-bottom:6px;">
          ${weekDays.map(w => '<span>' + w + '</span>').join('')}
        </div>
        <div class="ab-cal-grid">${cells}</div>
        <div class="ab-cal-foot">
          <button id="btn-gcal">📅 تقویم گوگل</button>
          <button id="btn-jump">🔄 رفتن به تاریخ</button>
        </div>
      </div>
    `;

    document.getElementById('ab-m-prev').onclick = () => { if (state.month > 1) state.month--; render(); };
    document.getElementById('ab-m-next').onclick = () => { if (state.month < 12) state.month++; render(); };
    document.getElementById('btn-gcal').onclick = () => window.open('https://calendar.google.com/', '_blank');
    root.querySelectorAll('.ab-cal-cell').forEach(c => {
      c.onclick = () => { state.sel = parseInt(c.dataset.day); render(); };
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
