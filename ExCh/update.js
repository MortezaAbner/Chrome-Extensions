const fs = require('fs');
const path = require('path');

console.log('🛠 در حال رفع مشکل تقویم تکراری و اصلاح شبکه روزهای تقویم آبنر...');

const calendarDir = path.join(__dirname, 'modules', 'calendar');
if (!fs.existsSync(calendarDir)) {
  fs.mkdirSync(calendarDir, { recursive: true });
}

// ۱. اصلاح CSS تقویم برای استایل شیشه‌ای و چیدمان دقیق روزهای هفته
const calendarCss = `
/* ========================================================
   استایل شیشه‌ای ماژول تقویم آبنر (اصلاح‌شده)
======================================================== */
.ab-calendar-card {
  width: 100%;
  max-width: 320px;
  padding: 16px;
  border-radius: 22px;
  box-sizing: border-box;
  direction: rtl;
  user-select: none;
  font-family: inherit;
  color: #fff;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  margin: 0 auto;
}

.ab-calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 4px;
}

.ab-calendar-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #fff;
}

.ab-calendar-nav-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  color: #fff;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
}
.ab-calendar-nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.ab-calendar-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  margin-bottom: 10px;
}

/* هدر روزهای هفته به صورت سطر افقی منظم */
.ab-calendar-weekdays {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 2px !important;
  text-align: center !important;
  margin-bottom: 6px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: rgba(255, 255, 255, 0.8) !important;
  direction: rtl !important;
}
.ab-calendar-weekdays span {
  display: block;
  text-align: center;
}

/* شبکه روزها به صورت جدول ۷ ستونه */
.ab-calendar-days-grid {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 4px !important;
  justify-items: center !important;
  direction: rtl !important;
}

.ab-calendar-day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 38px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.ab-calendar-day-cell:hover {
  background: rgba(255, 255, 255, 0.15);
}

.ab-calendar-day-num {
  font-size: 12.5px;
  font-weight: 600;
  color: #fff;
}

.ab-calendar-day-sub {
  font-size: 8.5px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 1px;
}

.ab-calendar-day-cell.is-today {
  border: 1.5px solid #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}
.ab-calendar-day-cell.is-selected {
  background: #2563eb !important;
}
.ab-calendar-day-cell.is-selected .ab-calendar-day-num,
.ab-calendar-day-cell.is-selected .ab-calendar-day-sub {
  color: #fff !important;
}

.ab-calendar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 11.5px;
}
.ab-cal-footer-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s ease;
}
.ab-cal-footer-btn:hover { color: #fff; }
`;
fs.writeFileSync(path.join(calendarDir, 'calendar.css'), calendarCss, 'utf8');

// ۲. جاوااسکریپت جایگزینی هوشمند و هدایت تقویم آبنر به موقعیت اصلی سمت راست
const calendarJs = `
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
    return n.toString().replace(/\\d/g, x => f[x]);
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

      cellsHtml += \`
        <div class="ab-calendar-day-cell \${isToday ? 'is-today' : ''} \${isSelected ? 'is-selected' : ''}" data-day="\${d}">
          <span class="ab-calendar-day-num">\${toPersianDigits(d)}</span>
          <span class="ab-calendar-day-sub">\${subText}</span>
        </div>
      \`;
    }

    container.innerHTML = \`
      <div class="ab-calendar-card">
        <div class="ab-calendar-header">
          <button class="ab-calendar-nav-btn" id="ab-cal-prev">‹</button>
          <span class="ab-calendar-title">\${monthName} \${toPersianDigits(state.year)}</span>
          <button class="ab-calendar-nav-btn" id="ab-cal-next">›</button>
        </div>
        <div class="ab-calendar-subtitle">ربيع‌الثاني . جمادی‌الثانی . اول-مهر</div>
        
        <div class="ab-calendar-weekdays">
          <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span>ج</span>
        </div>
        
        <div class="ab-calendar-days-grid">
          \${cellsHtml}
        </div>

        <div class="ab-calendar-footer">
          <button class="ab-cal-footer-btn">📅 تقویم گوگل</button>
          <button class="ab-cal-footer-btn">🔄 تبدیل تاریخ</button>
        </div>
      </div>
    \`;

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
`;
fs.writeFileSync(path.join(calendarDir, 'calendar.js'), calendarJs, 'utf8');

// ۳. اتصال به فایل‌های HTML
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('modules/calendar/calendar.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/calendar/calendar.css">\n</head>');
    }
    if (!html.includes('modules/calendar/calendar.js')) {
      html = html.replace('</body>', '  <script src="modules/calendar/calendar.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 اتصال تقویم آبنر به ${filePath} به‌روز شد.`);
  }
});