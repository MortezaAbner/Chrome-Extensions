const fs = require('fs');
const path = require('path');

console.log('📅 در حال اصلاح و یکپارچه‌سازی تقویم شیشه‌ای آبنر...');

const calendarDir = path.join(__dirname, 'modules', 'calendar');
if (!fs.existsSync(calendarDir)) {
  fs.mkdirSync(calendarDir, { recursive: true });
}

// ۱. استایل شیشه‌ای کامل تقویم آبنر (modules/calendar/calendar.css)
const calendarCss = `
/* ========================================================
   استایل ماژولار شیشه‌ای تقویم فارسی آبنر
======================================================== */
.ab-calendar-card {
  width: 100%;
  max-width: 330px;
  padding: 18px;
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
  margin-bottom: 12px;
  padding: 0 4px;
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
  font-size: 14px;
  transition: all 0.15s ease;
}
.ab-calendar-nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.ab-calendar-subtitle {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  margin-bottom: 14px;
}

/* هدر روزهای هفته (شنبه تا جمعه) */
.ab-calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

/* شبکه روزها */
.ab-calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  justify-items: center;
}

.ab-calendar-day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 42px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.ab-calendar-day-cell:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* عدد روز تقویم */
.ab-calendar-day-num {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

/* حروف زیر اعداد (مثلاً مناسبت یا نام کوتاه روز) */
.ab-calendar-day-sub {
  font-size: 9.5px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
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

/* دکمه‌های پایین تقویم */
.ab-calendar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12px;
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

  // حروف مخفف روزهای هفته زیر اعداد (می‌تواند مناسبت یا نام روز باشد)
  const daySubLabels = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

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
    // حذف قطعی تقویم‌های اضافی احتمالی در صفحه
    document.querySelectorAll('.calendar-section, .right-column .Calendar, #ab-calendar-container-extra').forEach(el => {
      if (el.id !== 'abner-calendar-container') el.remove();
    });

    let container = document.getElementById('abner-calendar-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'abner-calendar-container';
      const rightCol = document.querySelector('.right-column') || document.body;
      rightCol.appendChild(container);
    }

    const monthDays = getDaysInMonth(state.month);
    const monthName = persianMonths[state.month - 1];

    let cellsHtml = '';
    for (let d = 1; d <= monthDays; d++) {
      const isToday = (d === state.day && state.month === 7 && state.year === 1405);
      const isSelected = (d === state.selectedDay);
      // انتخاب یک متن یا حرف نمایشی زیر اعداد برای تطابق با درخواست شما
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
          <span>شنبه</span><span>یکشنبه</span><span>دوشنبه</span><span>سه‌شنبه</span><span>چهارشنبه</span><span>پنج‌شنبه</span><span>جمعه</span>
        </div>
        
        <div class="ab-calendar-days-grid">
          \${cellsHtml}
        </div>

        <div class="ab-calendar-footer">
          <button class="ab-cal-footer-btn" id="ab-cal-today">📅 تقویم گوگل</button>
          <button class="ab-cal-footer-btn" id="ab-cal-convert">🔄 تبدیل تاریخ</button>
        </div>
      </div>
    \`;

    // دکمه‌های ناوبری ماه‌های قبل و بعد
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

    // کلیک روی روزها
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

// ۴. الصاق به فایل‌های HTML
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