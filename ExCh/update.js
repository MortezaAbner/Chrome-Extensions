const fs = require('fs');
const path = require('path');

console.log('📅 در حال ساخت ماژول تقویم شیشه‌ای آبنر (modules/calendar)...');

// ۱. ساخت پوشه اختصاصی calendar
const calendarDir = path.join(__dirname, 'modules', 'calendar');
if (!fs.existsSync(calendarDir)) {
  fs.mkdirSync(calendarDir, { recursive: true });
}

// ۲. استایل شیشه‌ای کامل تقویم آبنر (modules/calendar/calendar.css)
const calendarCss = `
/* ========================================================
   استایل شیشه‌ای ماژول تقویم فارسی آبنر
======================================================== */
.ab-calendar-card {
  width: 100%;
  max-width: 320px;
  padding: 16px;
  border-radius: 24px;
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
  margin-bottom: 14px;
}

.ab-calendar-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.ab-calendar-nav-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  color: #fff;
  width: 28px;
  height: 28px;
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
  transform: scale(1.05);
}

/* روزهای هفته هدر */
.ab-calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
  margin-bottom: 8px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.65);
}

/* شبکه روزها */
.ab-calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  justify-items: center;
}

.ab-calendar-day {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #fff;
}
.ab-calendar-day:hover {
  background: rgba(255, 255, 255, 0.2);
}
.ab-calendar-day.is-today {
  border: 2px solid #3b82f6;
  background: rgba(59, 130, 246, 0.2);
}
.ab-calendar-day.is-selected {
  background: #2563eb !important;
  color: #fff !important;
}
.ab-calendar-day.is-empty {
  visibility: hidden;
  pointer-events: none;
}
`;
fs.writeFileSync(path.join(calendarDir, 'calendar.css'), calendarCss, 'utf8');

// ۳. جاوااسکریپت مستقل تقویم آبنر (modules/calendar/calendar.js)
const calendarJs = `
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
    return n.toString().replace(/\\d/g, x => f[x]);
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
      daysHtml += \`
        <div class="ab-calendar-day \${isToday ? 'is-today' : ''} \${isSelected ? 'is-selected' : ''}" data-day="\${d}">
          \${toPersianDigits(d)}
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
        <div class="ab-calendar-weekdays">
          <span>ش</span><span>ی</span><span>د</span><span>س</span><span>چ</span><span>پ</span><span>ج</span>
        </div>
        <div class="ab-calendar-days-grid">
          \${daysHtml}
        </div>
      </div>
    \`;

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
`;
fs.writeFileSync(path.join(calendarDir, 'calendar.js'), calendarJs, 'utf8');

// ۴. الصاق ماژول تقویم به فایل‌های HTML
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
    console.log(`🔗 ماژول تقویم آبنر به ${filePath} متصل شد.`);
  }
});