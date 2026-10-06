const fs = require('fs');
const path = require('path');

console.log('📅 در حال اصلاح نهایی تقویم اصلی آبنر در سمت راست...');

const calendarDir = path.join(__dirname, 'modules', 'calendar');
if (!fs.existsSync(calendarDir)) {
  fs.mkdirSync(calendarDir, { recursive: true });
}

// ۱. استایل شیشه‌ای و دقیق تقویم اصلی آبنر
const calendarCss = `
/* ========================================================
   استایل شیشه‌ای تقویم اصلی آبنر
======================================================== */
#abner-calendar-container,
.calendar-section,
.calendar-card {
  width: 100% !important;
  max-width: 340px !important;
  padding: 18px !important;
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
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2) !important;
  margin: 0 auto 16px auto !important;
}

.ab-cal-head {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-bottom: 8px !important;
}

.ab-cal-title {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: #fff !important;
}

.ab-cal-arrow {
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2)) !important;
  color: #fff !important;
  width: 28px !important;
  height: 28px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  font-size: 14px !important;
  transition: all 0.15s ease !important;
}
.ab-cal-arrow:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

.ab-cal-subhead {
  font-size: 11px !important;
  color: rgba(255, 255, 255, 0.65) !important;
  text-align: center !important;
  margin-bottom: 12px !important;
}

/* روزهای هفته افقی */
.ab-cal-weekdays {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 2px !important;
  text-align: center !important;
  margin-bottom: 8px !important;
  font-size: 11.5px !important;
  font-weight: 600 !important;
  color: rgba(255, 255, 255, 0.8) !important;
}

/* شبکه روزها */
.ab-cal-grid {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 5px !important;
  justify-items: center !important;
}

.ab-cal-cell {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  width: 36px !important;
  height: 40px !important;
  border-radius: 12px !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  box-sizing: border-box !important;
}
.ab-cal-cell:hover {
  background: rgba(255, 255, 255, 0.18) !important;
}

.ab-cal-cell.is-today {
  border: 1.5px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.18) !important;
}

.ab-cal-cell.is-selected {
  background: #2563eb !important;
}

.ab-cal-num {
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #fff !important;
  line-height: 1 !important;
}

.ab-cal-sub {
  font-size: 9px !important;
  color: rgba(255, 255, 255, 0.5) !important;
  margin-top: 3px !important;
}
.ab-cal-cell.is-selected .ab-cal-sub {
  color: #fff !important;
}

/* فوتر ابزارها */
.ab-cal-foot {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-top: 14px !important;
  padding-top: 10px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.ab-cal-foot-btn {
  background: transparent !important;
  border: none !important;
  color: rgba(255, 255, 255, 0.75) !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 11.5px !important;
  transition: color 0.15s ease !important;
  padding: 4px 6px !important;
}
.ab-cal-foot-btn:hover {
  color: #fff !important;
}

/* پاپ‌آپ رفتن به تاریخ */
.ab-cal-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000000;
  direction: rtl;
}
.ab-cal-modal-box {
  width: 90%;
  max-width: 320px;
  padding: 20px;
  border-radius: 20px;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.15)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(170%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.25));
  color: #fff;
  box-sizing: border-box;
}
.ab-cal-modal-box input {
  width: 100%;
  padding: 8px 12px;
  margin: 6px 0 12px 0;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(0,0,0,0.3);
  color: #fff;
  box-sizing: border-box;
}
`;
fs.writeFileSync(path.join(calendarDir, 'calendar.css'), calendarCss, 'utf8');

// ۲. منطق جاوااسکریپت تقویم اصلی آبنر
const calendarJs = `
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
    return n.toString().replace(/\\d/g, x => f[x]);
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
    modal.innerHTML = \`
      <div class="ab-cal-modal-box">
        <h4 style="margin:0 0 10px 0;font-size:14px;">رفتن به تاریخ در آبنر</h4>
        <label style="font-size:12px;">سال:</label>
        <input type="number" id="ab-jump-y" value="\${calState.year}">
        <label style="font-size:12px;">ماه (۱ تا ۱۲):</label>
        <input type="number" id="ab-jump-m" min="1" max="12" value="\${calState.month}">
        <label style="font-size:12px;">روز (۱ تا ۳۱):</label>
        <input type="number" id="ab-jump-d" min="1" max="31" value="\${calState.selectedDay}">
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button id="ab-jump-apply" style="flex:1;padding:8px;background:#2563eb;color:#fff;border:none;border-radius:10px;cursor:pointer;">تأیید</button>
          <button id="ab-jump-close" style="flex:1;padding:8px;background:rgba(255,255,255,0.15);color:#fff;border:none;border-radius:10px;cursor:pointer;">انصراف</button>
        </div>
      </div>
    \`;
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

      cellsHtml += \`
        <div class="ab-cal-cell \${isToday ? 'is-today' : ''} \${isSelected ? 'is-selected' : ''}" data-day="\${d}">
          <span class="ab-cal-num">\${toPersianDigits(d)}</span>
          <span class="ab-cal-sub">\${sub}</span>
        </div>
      \`;
    }

    container.innerHTML = \`
      <div class="ab-cal-head">
        <button class="ab-cal-arrow" id="ab-cal-prev">‹</button>
        <span class="ab-cal-title">\${monthName} \${toPersianDigits(calState.year)}</span>
        <button class="ab-cal-arrow" id="ab-cal-next">›</button>
      </div>
      <div class="ab-cal-subhead">ربيع‌الثاني . جمادی‌الثانی . اول-مهر</div>
      
      <div class="ab-cal-weekdays">
        <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span>ج</span>
      </div>
      
      <div class="ab-cal-grid">
        \${cellsHtml}
      </div>

      <div class="ab-cal-foot">
        <button class="ab-cal-foot-btn" id="ab-cal-google">📅 تقویم گوگل</button>
        <button class="ab-cal-foot-btn" id="ab-cal-jump">🔄 رفتن به تاریخ</button>
      </div>
    \`;

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
`;
fs.writeFileSync(path.join(calendarDir, 'calendar.js'), calendarJs, 'utf8');

console.log('✅ ماژول تقویم آبنر بازنویسی شد و آماده اجراست.');