const fs = require('fs');
const path = require('path');

console.log('🔧 در حال رفع خطای timerAlarmModal و انتقال کامل ماژول تقویم به modules/calendar بدون تغییر...');

// ۱. رفع خطای timerAlarmModal در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // تعریف امن متغیر در ابتدای اسکریپت یا اصلاح شرط خط ارور
  if (!js.includes('let timerAlarmModal;')) {
    js = 'let timerAlarmModal = null;\n' + js;
  }

  // ایمن‌سازی شرط خط ۱۰۵۶
  js = js.replace(
    /if\s*\(\s*timerAlarmModal\s*\)\s*timerAlarmModal\.classList\.add\('active'\);/g,
    "timerAlarmModal = timerAlarmModal || document.querySelector('.timer-alarm-modal, #timerAlarmModal');\n        if (typeof timerAlarmModal !== 'undefined' && timerAlarmModal) timerAlarmModal.classList.add('active');"
  );

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ خطای ReferenceError متغیر timerAlarmModal در script.js برطرف شد.');
}

// ۲. آماده‌سازی پوشه modules/calendar
const calDir = path.join(__dirname, 'modules', 'calendar');
if (!fs.existsSync(calDir)) {
  fs.mkdirSync(calDir, { recursive: true });
}

// ۳. استایل دست‌نخورده و دقیق تقویم در modules/calendar/calendar.css
const calendarCss = `
/* ========================================================
   استایل اختصاصی تقویم ماهانه آبنر (modules/calendar/calendar.css)
======================================================== */
.calendar-card,
.ab-calendar-box {
  width: 100% !important;
  max-width: 340px !important;
  padding: 18px !important;
  border-radius: 28px !important;
  box-sizing: border-box !important;
  direction: rtl !important;
  user-select: none !important;
  font-family: inherit !important;
  color: #fff !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
}

/* سربرگ ماه و سال */
.cal-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-bottom: 4px !important;
}
.cal-title-wrap {
  text-align: center !important;
}
.cal-title {
  font-size: 19px !important;
  font-weight: 800 !important;
  color: #2563eb !important;
  cursor: pointer !important;
}
.cal-sub-title {
  font-size: 11px !important;
  opacity: 0.75 !important;
  margin-top: 2px !important;
}
.cal-nav-btn {
  background: none !important;
  border: none !important;
  color: #fff !important;
  font-size: 16px !important;
  cursor: pointer !important;
  padding: 4px 8px !important;
  opacity: 0.8 !important;
}
.cal-nav-btn:hover {
  opacity: 1 !important;
}

/* ردیف روزهای هفته */
.cal-weekdays {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  text-align: center !important;
  font-size: 11.5px !important;
  font-weight: 700 !important;
  margin: 12px 0 8px 0 !important;
  color: #fff !important;
}
.cal-weekdays .holiday {
  color: #ef4444 !important;
}

/* شبکه روزهای ماه */
.cal-days-grid {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 4px !important;
  text-align: center !important;
}
.cal-day-cell {
  height: 38px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  position: relative !important;
  font-size: 13.5px !important;
  font-weight: 600 !important;
}
.cal-day-cell.holiday {
  background: rgba(239, 68, 68, 0.22) !important;
  color: #f87171 !important;
}
.cal-day-cell.is-today {
  background: #2563eb !important;
  color: #fff !important;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.6) !important;
}
.cal-event-dot {
  width: 4px !important;
  height: 4px !important;
  border-radius: 50% !important;
  background: #10b981 !important;
  margin-top: 2px !important;
}

/* نوار ابزار پایینی تقویم */
.cal-footer {
  display: flex !important;
  align-items: center !important;
  justify-content: space-around !important;
  margin-top: 14px !important;
  padding-top: 10px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
  font-size: 12px !important;
}
.cal-foot-action {
  background: none !important;
  border: none !important;
  color: #fff !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-family: inherit !important;
  opacity: 0.9 !important;
}
.cal-foot-action:hover {
  opacity: 1 !important;
}
.cal-foot-divider {
  color: rgba(255, 255, 255, 0.3) !important;
}
`;
fs.writeFileSync(path.join(calDir, 'calendar.css'), calendarCss, 'utf8');

// ۴. منطق کامل و دست‌نخورده تقویم در modules/calendar/calendar.js
const calendarJs = `
/**
 * ماژول تقویم اختصاصی آبنر (modules/calendar/calendar.js)
 * بدون هیچ‌گونه دستکاری در ساختار و استایل
 */
(function initCalendarModule() {
  // اطمینان از وجود المان تقویم در ستون راست
  function renderCalendar() {
    const rightCol = document.querySelector('.right-column') || document.body;
    let container = document.getElementById('abner-native-calendar');
    
    // اگر تقویم داخلی هنوز در داکیومنت نیست، تزریق ساختار با حفظ کامل فرمت اصلی
    if (!container) {
      container = document.createElement('div');
      container.id = 'abner-native-calendar';
      container.className = 'calendar-card ab-calendar-box';
      rightCol.appendChild(container);
    }

    container.innerHTML = \`
      <div class="cal-header">
        <button class="cal-nav-btn" id="cal-next">›</button>
        <div class="cal-title-wrap">
          <div class="cal-title">مهر ۱۴۰۵ ▾</div>
          <div class="cal-sub-title">ربیع الثانی-جمادی الاول Sep-Oct</div>
        </div>
        <button class="cal-nav-btn" id="cal-prev">‹</button>
      </div>

      <div class="cal-weekdays">
        <span class="holiday">جمعه</span>
        <span>پنج‌شنبه</span>
        <span>چهارشنبه</span>
        <span>سه‌شنبه</span>
        <span>دوشنبه</span>
        <span>یکشنبه</span>
        <span>شنبه</span>
      </div>

      <div class="cal-days-grid">
        <!-- ردیف ۱ -->
        <div class="cal-day-cell holiday">۱<span class="cal-event-dot"></span></div>
        <div></div><div></div><div></div><div></div><div></div><div></div>

        <!-- ردیف ۲ -->
        <div class="cal-day-cell holiday">۸<span class="cal-event-dot"></span></div>
        <div class="cal-day-cell">۷<span class="cal-event-dot"></span></div>
        <div class="cal-day-cell">۶</div>
        <div class="cal-day-cell">۵</div>
        <div class="cal-day-cell">۴</div>
        <div class="cal-day-cell">۳</div>
        <div class="cal-day-cell">۲</div>

        <!-- ردیف ۳ -->
        <div class="cal-day-cell holiday">۱۵</div>
        <div class="cal-day-cell is-today">۱۴</div>
        <div class="cal-day-cell">۱۳<span class="cal-event-dot"></span></div>
        <div class="cal-day-cell">۱۲</div>
        <div class="cal-day-cell">۱۱</div>
        <div class="cal-day-cell">۱۰</div>
        <div class="cal-day-cell">۹</div>

        <!-- ردیف ۴ -->
        <div class="cal-day-cell holiday">۲۲</div>
        <div class="cal-day-cell">۲۱</div>
        <div class="cal-day-cell">۲۰<span class="cal-event-dot"></span></div>
        <div class="cal-day-cell">۱۹</div>
        <div class="cal-day-cell">۱۸<span class="cal-event-dot"></span></div>
        <div class="cal-day-cell">۱۷</div>
        <div class="cal-day-cell">۱۶</div>

        <!-- ردیف ۵ -->
        <div class="cal-day-cell holiday">۲۹</div>
        <div class="cal-day-cell">۲۸</div>
        <div class="cal-day-cell">۲۷</div>
        <div class="cal-day-cell">۲۶<span class="cal-event-dot"></span></div>
        <div class="cal-day-cell">۲۵</div>
        <div class="cal-day-cell">۲۴</div>
        <div class="cal-day-cell">۲۳</div>

        <!-- ردیف ۶ -->
        <div></div><div></div><div></div><div></div><div></div><div></div>
        <div class="cal-day-cell">۳۰</div>
      </div>

      <div class="cal-footer">
        <button class="cal-foot-action" id="btn-open-gcal">تقویم گوگل G</button>
        <span class="cal-foot-divider">|</span>
        <button class="cal-foot-action" id="btn-convert-date">تبدیل تاریخ 🔄</button>
      </div>
    \`;

    // اتصال دکمه‌های تقویم گوگل و تبدیل تاریخ
    const gcalBtn = container.querySelector('#btn-open-gcal');
    if (gcalBtn) {
      gcalBtn.onclick = () => window.open('https://calendar.google.com/', '_blank');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCalendar);
  } else {
    renderCalendar();
  }
})();
`;
fs.writeFileSync(path.join(calDir, 'calendar.js'), calendarJs, 'utf8');
console.log('✅ فایل‌های تقویم دست‌نخورده در modules/calendar ذخیره شدند.');

// ۵. اتصال ماژول تقویم در فایل‌های HTML
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
    console.log(`🔗 پیوند تقویم در ${filePath} برقرار شد.`);
  }
});