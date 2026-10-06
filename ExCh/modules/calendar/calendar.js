
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

    container.innerHTML = `
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
    `;

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
