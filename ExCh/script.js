
function toFa(num) {
  if (num === null || num === undefined) return '';
  return String(num).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}


  // محاسبه دقیق تاریخ امروز سیستم در تقویم خورشیدی
  function getLivePersianDate() {
    const now = new Date();
    try {
      const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).formatToParts(now);

      let y = 1405, m = 7, d = 1;
      parts.forEach(p => {
        if (p.type === 'year') y = parseInt(p.value, 10);
        if (p.type === 'month') m = parseInt(p.value, 10);
        if (p.type === 'day') d = parseInt(p.value, 10);
      });
      return { year: y, monthIndex: m - 1, day: d };
    } catch (e) {
      return { year: 1405, monthIndex: 6, day: 9 };
    }
  }

document.addEventListener('DOMContentLoaded', () => {

  const toFa = n => String(n).replace(/\d/g, d => ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'][d]);
  const toEn = n => String(n).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

  // سیستم صوتی آلارم تایمر
  let alarmAudioCtx = null;
  let alarmInterval = null;

  function playAlarmBeep() {
    try {
      if (!alarmAudioCtx) alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = alarmAudioCtx.createOscillator();
      const gain = alarmAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, alarmAudioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, alarmAudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, alarmAudioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(alarmAudioCtx.destination);
      osc.start();
      osc.stop(alarmAudioCtx.currentTime + 0.4);
    } catch (e) {}
  }

  function startAlarmSound() {
    playAlarmBeep();
    alarmInterval = setInterval(playAlarmBeep, 900);
  }

  function stopAlarmSound() {
    if (alarmInterval) { clearInterval(alarmInterval); alarmInterval = null; }
  }

  function closeAllDrawersAndPopups() {
    document.getElementById('forecast-drawer')?.classList.remove('active');
    document.getElementById('azan-drawer')?.classList.remove('active');
    document.getElementById('timer-drawer')?.classList.remove('active');
    document.getElementById('azan-city-dropdown')?.classList.remove('active');
    document.querySelectorAll('.task-tool-popup').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
    document.getElementById('month-year-picker')?.classList.remove('active');
    document.getElementById('date-event-popup')?.setAttribute('style', 'display: none;');
    const bm = document.getElementById('board-dropdown-menu');
    if (bm) bm.style.display = 'none';
  }

  window.addEventListener('click', (e) => {
    if (!e.target.closest('#weather-card') && 
        !e.target.closest('#clock-card') && 
        !e.target.closest('#main-calendar-card') && 
        !e.target.closest('#inline-task-box') && 
        !e.target.closest('#edit-task-modal') &&
        !e.target.closest('#city-modal') &&
        !e.target.closest('#timer-alarm-modal') &&
        !e.target.closest('.context-menu') &&
        !e.target.closest('.shortcut-box')) {
      closeAllDrawersAndPopups();
    }
  });

  window.addEventListener('scroll', () => closeAllDrawersAndPopups(), { passive: true });


  // تابع سراسری برای بستن تمام پنجره‌ها و دراورهای باز
  function closeAllDrawersAndPopups() {
    document.getElementById('forecast-drawer')?.classList.remove('active');
    document.getElementById('azan-drawer')?.classList.remove('active');
    document.getElementById('timer-drawer')?.classList.remove('active');
    document.getElementById('azan-city-dropdown')?.classList.remove('active');
    document.querySelectorAll('.task-tool-popup').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
    document.getElementById('month-year-picker')?.classList.remove('active');
    const boardMenu = document.getElementById('board-dropdown-menu');
    if (boardMenu) boardMenu.style.display = 'none';
  }

  // بستن پنجره‌ها با کلیک روی پس‌زمینه یا اسکرول صفحه
  window.addEventListener('click', (e) => {
    if (!e.target.closest('#weather-card') && 
        !e.target.closest('#clock-card') && 
        !e.target.closest('#main-calendar-card') && 
        !e.target.closest('#inline-task-box') && 
        !e.target.closest('#edit-task-modal') &&
        !e.target.closest('.context-menu') &&
        !e.target.closest('.shortcut-box')) {
      closeAllDrawersAndPopups();
    }
  });

  window.addEventListener('scroll', () => {
    closeAllDrawersAndPopups();
  }, { passive: true });

  // ۱. کنترل ناوبری داخلی SPA
  const viewDashboard = document.getElementById('view-dashboard');
  const viewSettings = document.getElementById('view-settings');
  const viewTasks = document.getElementById('view-tasks');

  const dockHomeBtn = document.getElementById('dock-home-btn');
  const dockSettingsBtn = document.getElementById('dock-settings-btn');
  const dockTasksBtn = document.getElementById('dock-tasks-btn');
  const settingsCloseBtn = document.getElementById('settings-close-btn');

  function switchView(activeView, activeBtn) {
    closeAllDrawersAndPopups();
    [viewDashboard, viewSettings, viewTasks].forEach(v => v.classList.remove('active'));
    activeView.classList.add('active');
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
  }

  if (dockHomeBtn) dockHomeBtn.onclick = () => switchView(viewDashboard, dockHomeBtn);
  if (dockSettingsBtn) dockSettingsBtn.onclick = () => switchView(viewSettings, dockSettingsBtn);
  if (settingsCloseBtn) settingsCloseBtn.onclick = () => {
      document.getElementById('view-settings')?.classList.remove('active');
      document.getElementById('view-dashboard')?.classList.add('active');
      document.getElementById('dock-home-btn')?.classList.add('active');
    };

  if (dockTasksBtn) {
    dockTasksBtn.onclick = () => {
      switchView(viewTasks, dockTasksBtn);
      document.getElementById('full-tab-tasks')?.click();
    };
  }

  // ۲. مدیریت پس‌زمینه
  const bgOverlay = document.getElementById('custom-bg-overlay');
  const settingsBgFile = document.getElementById('settings-bg-file');
  const settingsBlurToggle = document.getElementById('settings-blur-toggle');
  const settingsBlurStatus = document.getElementById('settings-blur-status');
  const settingsResetBg = document.getElementById('settings-reset-bg');

  function applyBackgroundConfig() {
    const savedBg = localStorage.getItem('custom_bg');
    const isBlurred = localStorage.getItem('bg_blur') !== 'false';
    if (savedBg) {
      bgOverlay.style.backgroundImage = `url(${savedBg})`;
      bgOverlay.className = `bg-overlay ${isBlurred ? 'blurred' : 'clear'}`;
      if (settingsBlurStatus) settingsBlurStatus.textContent = isBlurred ? 'مات' : 'شفاف';
    } else {
      bgOverlay.style.backgroundImage = 'none';
      bgOverlay.className = 'bg-overlay';
    }
  }

  if (settingsBgFile) {
    settingsBgFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            localStorage.setItem('custom_bg', event.target.result);
            applyBackgroundConfig();

  // مدیریت تب‌های سایدبار تنظیمات
  function initSettingsTabs() {
    const navItems = document.querySelectorAll('.settings-sidebar-nav .nav-item-glass');
    const tabPanes = document.querySelectorAll('.settings-tab-pane');
    const headerLabel = document.getElementById('settings-header-label');

    navItems.forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const tab = item.dataset.tab;
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        tabPanes.forEach(p => p.classList.remove('active'));
        const targetPane = document.getElementById('pane-' + tab);
        if (targetPane) targetPane.classList.add('active');

        if (headerLabel) {
          headerLabel.textContent = 'تنظیمات › ' + item.textContent.trim();
        }
      };
    });
  }
  initSettingsTabs();

          } catch (err) {
            
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (settingsBlurToggle) {
    settingsBlurToggle.addEventListener('click', () => {
      const current = localStorage.getItem('bg_blur') !== 'false';
      localStorage.setItem('bg_blur', (!current).toString());
      applyBackgroundConfig();
    });
  }

  if (settingsResetBg) {
    settingsResetBg.addEventListener('click', () => {
      localStorage.removeItem('custom_bg');
      applyBackgroundConfig();
    });
  }
  applyBackgroundConfig();

  // ۳. حالت شب و روز
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
  applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  // ۴. تقویم شمسی
  const persianMonthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const monthSubTitles = [
    'رمضان-شوال Mar-Apr', 'شوال-ذی القعده Apr-May', 'ذی القعده-ذی الحجه May-Jun',
    'ذی الحجه-محرم Jun-Jul', 'محرم-صفر Jul-Aug', 'صفر-ربیع الاول Aug-Sep',
    'ربیع الثانی-جمادی الاول Sep-Oct', 'جمادی الاول-جمادی الثانی Oct-Nov',
    'جمادی الثانی-رجب Nov-Dec', 'رجب-شعبان Dec-Jan', 'شعبان-رمضان Jan-Feb', 'رمضان-شوال Feb-Mar'
  ];

  
  const specialEventsData = {
    '1405-7-1': { title: 'آغاز سال تحصیلی و بازگشایی مدارس (ایران)', gDate: '23 Sep 2026', hDate: '۱۱ ربیع‌الثانی ۱۴۴۸', major: true },
    '1405-7-5': { title: 'روز جهانی گردشگری (توریسم)', gDate: '27 Sep 2026', hDate: '۱۵ ربیع‌الثانی ۱۴۴۸', major: false },
    '1405-7-7': { title: 'روز آتش‌نشانی و ایمنی / بزرگداشت شمس تبریزی', gDate: '29 Sep 2026', hDate: '۱۷ ربیع‌الثانی ۱۴۴۸', major: true },
    '1405-7-8': { title: 'روز بزرگداشت مولوی', gDate: '30 Sep 2026', hDate: '۱۸ ربیع‌الثانی ۱۴۴۸', major: true },
    '1405-7-9': { title: 'روز جهانی ترجمه و مترجم', gDate: '1 Oct 2026', hDate: '۱۹ ربیع‌الثانی ۱۴۴۸', major: false },
    '1405-7-10': { title: 'روز جهانی سالمندان', gDate: '2 Oct 2026', hDate: '۲۰ ربیع‌الثانی ۱۴۴۸', major: false },
    '1405-7-12': { title: 'روز همبستگی با کودکان فلسطینی', gDate: '4 Oct 2026', hDate: '۲۲ ربیع‌الثانی ۱۴۴۸', major: false },
    '1405-7-13': { title: 'روز نیروی انتظامی جمهوری اسلامی ایران', gDate: '5 Oct 2026', hDate: '۲۳ ربیع‌الثانی ۱۴۴۸', major: true },
    '1405-7-14': { title: 'روز جهانی معلم / روز دامپزشکی', gDate: '6 Oct 2026', hDate: '۲۴ ربیع‌الثانی ۱۴۴۸', major: false },
    '1405-7-16': { title: 'روز جهانی کودک / ولادت امام حسن عسکری (ع)', gDate: '8 Oct 2026', hDate: '۲۶ ربیع‌الثانی ۱۴۴۸', major: true },
    '1405-7-18': { title: 'وفات حضرت معصومه (س)', gDate: '10 Oct 2026', hDate: '۲۸ ربیع‌الثانی ۱۴۴۸', major: true },
    '1405-7-20': { title: 'روز بزرگداشت حافظ شیرازی / روز جهانی دختر', gDate: '12 Oct 2026', hDate: '۳۰ ربیع‌الثانی ۱۴۴۸', major: true },
    '1405-7-23': { title: 'روز جهانی استاندارد / روز عصای سفید', gDate: '15 Oct 2026', hDate: '۳ جمادی‌الاول ۱۴۴۸', major: false },
    '1405-7-26': { title: 'روز تربیت بدنی و ورزش', gDate: '18 Oct 2026', hDate: '۶ جمادی‌الاول ۱۴۴۸', major: true }
  };


  
  // محاسبه خودکار تاریخ زنده سیستم بر اساس تقویم شمسی
  function getLiveSystemDate() {
    const now = new Date();
    try {
      const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).formatToParts(now);

      let y = 1405, m = 7, d = 9;
      parts.forEach(p => {
        if (p.type === 'year') y = parseInt(p.value, 10);
        if (p.type === 'month') m = parseInt(p.value, 10);
        if (p.type === 'day') d = parseInt(p.value, 10);
      });
      return { year: y, monthIndex: m - 1, day: d };
    } catch (e) {
      return { year: 1405, monthIndex: 6, day: 9 };
    }
  }

  const baseRealToday = getLiveSystemDate();
  let currentYear = baseRealToday.year;
  let currentMonthIndex = baseRealToday.monthIndex;


  const calMonthText = document.getElementById('cal-month-text');
  const calSubText = document.getElementById('cal-sub-text');
  const calDates = document.getElementById('cal-dates');
  const calPrevBtn = document.getElementById('cal-prev-btn');
  const calNextBtn = document.getElementById('cal-next-btn');
  const calMonthHeaderBtn = document.getElementById('cal-month-header-btn');
  const monthYearPicker = document.getElementById('month-year-picker');
  const pickerYearsList = document.getElementById('picker-years-list');
  const pickerMonthsList = document.getElementById('picker-months-list');
  const pickerConfirmBtn = document.getElementById('picker-confirm-btn');
  const dateEventPopup = document.getElementById('date-event-popup');
  const eventPopupText = document.getElementById('event-popup-text');
  const eventPopupDates = document.getElementById('event-popup-dates');
  const eventPopupClose = document.getElementById('event-popup-close');

  let selectedPickerYear = currentYear;
  let selectedPickerMonth = currentMonthIndex;

  function renderCalendar(year, monthIndex) {
    if (!calMonthText || !calDates) return;
    calMonthText.textContent = `${persianMonthNames[monthIndex]} ${toFa(year)}`;
    calSubText.textContent = monthSubTitles[monthIndex];

    calDates.innerHTML = '';
    const daysInMonth = monthIndex < 6 ? 31 : (monthIndex < 11 ? 30 : 29);
    const startOffset = (monthIndex * 2 + 1) % 7;

    for (let k = 0; k < startOffset; k++) {
      calDates.appendChild(document.createElement('span'));
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const span = document.createElement('span');
      span.textContent = toFa(i);
      const dayOfWeek = (i + startOffset - 1) % 7;
      if (dayOfWeek === 6) span.className = 'fri holiday';
      const liveToday = getLivePersianDate();
      if (year === liveToday.year && monthIndex === liveToday.monthIndex && i === liveToday.day) {
        span.className = 'today-circle';
      }

      const eventKey = `${year}-${monthIndex + 1}-${i}`;
      if (specialEventsData[eventKey] && specialEventsData[eventKey].major) span.classList.add('event-green-dot');

      span.onclick = (e) => {
        e.stopPropagation();
        if (specialEventsData[eventKey]) {
          const ev = specialEventsData[eventKey];
          eventPopupText.textContent = ev.title;
          eventPopupDates.textContent = `${ev.hDate} / ${ev.gDate}`;
          dateEventPopup.style.display = 'flex';
        } else {
          dateEventPopup.style.display = 'none';
        }
      };
      calDates.appendChild(span);
    }
  }

  if (eventPopupClose) eventPopupClose.onclick = (e) => { e.stopPropagation(); dateEventPopup.style.display = 'none'; };

  if (calPrevBtn) {
    calPrevBtn.onclick = (e) => {
      e.stopPropagation();
      currentMonthIndex--;
      if (currentMonthIndex < 0) { currentMonthIndex = 11; currentYear--; }
      renderCalendar(currentYear, currentMonthIndex);
    };
  }

  if (calNextBtn) {
    calNextBtn.onclick = (e) => {
      e.stopPropagation();
      currentMonthIndex++;
      if (currentMonthIndex > 11) { currentMonthIndex = 0; currentYear++; }
      renderCalendar(currentYear, currentMonthIndex);
    };
  }

  function initPickerLists() {
    if (!pickerYearsList || !pickerMonthsList) return;
    pickerYearsList.innerHTML = '';
    for (let y = 1300; y <= 1500; y++) {
      const item = document.createElement('div');
      item.className = `picker-item ${y === selectedPickerYear ? 'selected' : ''}`;
      item.textContent = toFa(y);
      item.dataset.year = y;
      item.onclick = (e) => {
        e.stopPropagation();
        selectedPickerYear = y;
        document.querySelectorAll('#picker-years-list .picker-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        pickerConfirmBtn.textContent = `نمایش ${persianMonthNames[selectedPickerMonth]} ${toFa(selectedPickerYear)}`;
      };
      pickerYearsList.appendChild(item);
    }

    pickerMonthsList.innerHTML = '';
    persianMonthNames.forEach((m, idx) => {
      const item = document.createElement('div');
      item.className = `picker-item ${idx === selectedPickerMonth ? 'selected' : ''}`;
      item.textContent = m;
      item.onclick = (e) => {
        e.stopPropagation();
        selectedPickerMonth = idx;
        document.querySelectorAll('#picker-months-list .picker-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        pickerConfirmBtn.textContent = `نمایش ${persianMonthNames[selectedPickerMonth]} ${toFa(selectedPickerYear)}`;
      };
      pickerMonthsList.appendChild(item);
    });

    setTimeout(() => {
      const selectedEl = pickerYearsList.querySelector(`[data-year="${selectedPickerYear}"]`);
      if (selectedEl) pickerYearsList.scrollTop = selectedEl.offsetTop - pickerYearsList.offsetTop - 35;
    }, 50);
  }

  if (calMonthHeaderBtn && monthYearPicker) {
    calMonthHeaderBtn.onclick = (e) => {
      e.stopPropagation();
      closeAllDrawersAndPopups();
      selectedPickerYear = currentYear;
      selectedPickerMonth = currentMonthIndex;
      initPickerLists();
      pickerConfirmBtn.textContent = `نمایش ${persianMonthNames[selectedPickerMonth]} ${toFa(selectedPickerYear)}`;
      monthYearPicker.classList.toggle('active');
    };
  }

  if (pickerConfirmBtn) {
    pickerConfirmBtn.onclick = (e) => {
      e.stopPropagation();
      currentYear = selectedPickerYear;
      currentMonthIndex = selectedPickerMonth;
      renderCalendar(currentYear, currentMonthIndex);
      monthYearPicker.classList.remove('active');

  const pickerTodayBtn = document.getElementById('picker-today-btn');
  if (pickerTodayBtn) {
    pickerTodayBtn.onclick = (e) => {
      e.stopPropagation();
      const freshNow = getLivePersianDate();
      currentYear = freshNow.year;
      currentMonthIndex = freshNow.monthIndex;
      renderCalendar(currentYear, currentMonthIndex);
      monthYearPicker.classList.remove('active');
    };
  }

    };
  }
  renderCalendar(currentYear, currentMonthIndex);

  // ۵. ساعت زنده
  const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  function updateLiveClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const clockElem = document.getElementById('clock');
    if (clockElem) clockElem.textContent = `${toFa(String(hours).padStart(2, '0'))}:${toFa(minutes)}`;

    const dayElem = document.getElementById('clock-day-label');
    if (dayElem) dayElem.textContent = persianDays[now.getDay()];
  }
  setInterval(updateLiveClock, 1000);
  
    // همگام‌سازی استک تاریخ با سیستم
    try {
      const now = new Date();
      const shamsiStr = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
      const shamsiMonthName = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' }).format(now);
      const shamsiRow = document.getElementById('shamsi-row');
      if (shamsiRow) {
        shamsiRow.innerHTML = `<span class="month-part">(${shamsiMonthName})</span><span class="digits-part">${shamsiStr}</span>`;
      }

      const miladiStr = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
      const miladiMonthName = new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(now);
      const gregorianRow = document.getElementById('gregorian-row');
      if (gregorianRow) {
        gregorianRow.innerHTML = `<span class="month-part">(${miladiMonthName})</span><span class="digits-part">${miladiStr}</span>`;
      }
    } catch (err) {}

  updateLiveClock();

  // ۶. تقویم گوگل ۲۴ ساعته
  const googleCalBtn = document.getElementById('google-cal-btn');
  const calStandardView = document.getElementById('calendar-standard-view');
  const calGoogleView = document.getElementById('calendar-google-view');
  const gBackToCalBtn = document.getElementById('g-back-to-cal-btn');
  const gAddEventBtn = document.getElementById('g-add-event-btn');
  const gPrevDayBtn = document.getElementById('g-prev-day');
  const gNextDayBtn = document.getElementById('g-next-day');
  const gTimeline24h = document.getElementById('g-timeline-24h');
  const gViewDateText = document.getElementById('g-view-date-text');
  const gViewDayText = document.getElementById('g-view-day-text');

  let googleCurrentDayOffset = 0;

  function updateGoogleCalendarTimeline() {
    if (!gTimeline24h) return;
    gTimeline24h.innerHTML = '';
    const now = new Date();
    now.setDate(now.getDate() + googleCurrentDayOffset);
    
    const dayName = persianDays[now.getDay()];
    if (gViewDayText) gViewDayText.textContent = dayName;
    if (gViewDateText) {
      const mDay = 9 + googleCurrentDayOffset;
      gViewDateText.textContent = `۱۴۰۵/۰۷/${toFa(String(mDay).padStart(2, '0'))}`;
    }

    const curHour = new Date().getHours();
    const curMin = new Date().getMinutes();

    for (let h = 0; h < 24; h++) {
      const row = document.createElement('div');
      const isLiveHour = (googleCurrentDayOffset === 0 && h === curHour);
      row.className = `g-hour-row ${isLiveHour ? 'current-live-hour' : ''}`;
      row.dataset.hour = h;

      const label = document.createElement('span');
      label.className = 'g-hour-label';
      label.textContent = `${toFa(String(h).padStart(2, '0'))}:۰۰`;
      row.appendChild(label);

      const line = document.createElement('div');
      line.className = 'g-hour-line';

      if (isLiveHour) {
        const liveRed = document.createElement('div');
        liveRed.className = 'g-live-red-line';
        liveRed.innerHTML = `<span class="g-live-badge">${toFa(String(curHour).padStart(2, '0'))}:${toFa(String(curMin).padStart(2, '0'))}</span>`;
        line.appendChild(liveRed);
      }

      row.appendChild(line);
      gTimeline24h.appendChild(row);
    }
  }

  if (gNextDayBtn) {
    gNextDayBtn.onclick = (e) => {
      e.stopPropagation();
      googleCurrentDayOffset++;
      updateGoogleCalendarTimeline();
    };
  }

  if (gPrevDayBtn) {
    gPrevDayBtn.onclick = (e) => {
      e.stopPropagation();
      googleCurrentDayOffset--;
      updateGoogleCalendarTimeline();
    };
  }

  if (googleCalBtn && calStandardView && calGoogleView) {
    googleCalBtn.onclick = (e) => {
      e.stopPropagation();
      closeAllDrawersAndPopups();
      calStandardView.style.display = 'none';
      calGoogleView.style.display = 'flex';
      updateGoogleCalendarTimeline();
      const scroller = document.getElementById('g-timeline-scroller');
      if (scroller) scroller.scrollTop = 450;
    };
  }
  if (gBackToCalBtn) {
    gBackToCalBtn.onclick = (e) => {
      e.stopPropagation();
      calGoogleView.style.display = 'none';
      calStandardView.style.display = 'block';
    };
  }
  if (gAddEventBtn) gAddEventBtn.onclick = () => window.open('https://calendar.google.com/calendar/r/eventedit', '_blank');

  // ۷. تبدیل تاریخ
  const calConvertBtn = document.getElementById('cal-convert-btn');
  const dateConvertModal = document.getElementById('date-convert-modal');
  const convertCloseBtn = document.getElementById('convert-close-btn');
  const convertInputView = document.getElementById('convert-input-view');
  const convertResultView = document.getElementById('convert-result-view');
  const doConvertBtn = document.getElementById('do-convert-btn');
  const convertAgainBtn = document.getElementById('convert-again-btn');
  const wheelDay = document.getElementById('wheel-day-select');
  const wheelMonth = document.getElementById('wheel-month-select');
  const wheelYear = document.getElementById('wheel-year-select');

  function initConvertSelects() {
    if (!wheelDay || !wheelMonth || !wheelYear) return;
    wheelDay.innerHTML = '';
    for (let d = 1; d <= 31; d++) wheelDay.innerHTML += `<option value="${d}" ${d === 19 ? 'selected' : ''}>${toFa(d)}</option>`;
    wheelMonth.innerHTML = '';
    persianMonthNames.forEach((m, idx) => wheelMonth.innerHTML += `<option value="${idx + 1}" ${idx === 3 ? 'selected' : ''}>${m}</option>`);
    wheelYear.innerHTML = '';
    for (let y = 1300; y <= 1500; y++) wheelYear.innerHTML += `<option value="${y}" ${y === 1405 ? 'selected' : ''}>${toFa(y)}</option>`;
  }
  initConvertSelects();

  if (calConvertBtn && dateConvertModal) {
    calConvertBtn.onclick = (e) => {
      e.stopPropagation();
      closeAllDrawersAndPopups();
      convertInputView.style.display = 'block';
      convertResultView.style.display = 'none';
      dateConvertModal.classList.add('active');
    };
  }
  if (convertCloseBtn) convertCloseBtn.onclick = () => dateConvertModal.classList.remove('active');

  document.querySelectorAll('.type-tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.type-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  if (doConvertBtn) {
    doConvertBtn.onclick = () => {
      const d = wheelDay.value;
      const m = wheelMonth.value;
      const y = wheelYear.value;
      document.getElementById('res-shamsi-val').textContent = `${toFa(d)} ${persianMonthNames[m - 1]} ${toFa(y)}`;
      document.getElementById('res-ghamari-val').textContent = `۱۷ ربیع‌‌الثانی ۱۴۴۸`;
      document.getElementById('res-miladi-val').textContent = `29 سپتامبر 2026`;
      document.getElementById('res-day-name').textContent = `سه‌شنبه`;
      document.getElementById('res-age-val').textContent = `۴ روز`;
      convertInputView.style.display = 'none';
      convertResultView.style.display = 'block';
    };
  }

  if (convertAgainBtn) {
    convertAgainBtn.onclick = () => {
      convertResultView.style.display = 'none';
      convertInputView.style.display = 'block';
    };
  }

  // ۸. سیستم آب‌وهوا و آیکون متحرک روز و شب
  const cityLabel = document.getElementById('current-city-label');
  const weatherTemp = document.getElementById('weather-temp');
  const weatherIconContainer = document.getElementById('weather-icon-container');
  const weatherPhrase = document.getElementById('weather-phrase');
  const weatherRange = document.getElementById('weather-range');
  const forecastDrawer = document.getElementById('forecast-drawer');
  const forecastToggleBtn = document.getElementById('forecast-toggle-btn');
  const forecastGrid = document.getElementById('forecast-grid');

  const cityModal = document.getElementById('city-modal');
  const citySelectBtn = document.getElementById('city-select-btn');
  const autoGpsBtn = document.getElementById('auto-gps-btn');
  const autoIpBtn = document.getElementById('auto-ip-btn');
  const manualCityInput = document.getElementById('manual-city-input');
  const citySaveBtn = document.getElementById('city-save-btn');
  const cityCancelBtn = document.getElementById('city-cancel-btn');

  let activeCoords = JSON.parse(localStorage.getItem('weather_coords')) || { lat: 35.6892, lon: 51.3890, name: 'تهران' };

  function renderWeatherAnimatedIcon(code, isDay) {
    // شب صاف
    if (!isDay && (code === 0 || code === 1)) {
      return `<div class="weather-dynamic-art night-clear"><div class="art-moon"></div></div>`;
    }
    // روز صاف
    if (code === 0) {
      return `<div class="weather-dynamic-art sunny"><div class="art-sun"></div></div>`;
    }
    // بارانی یا رگبار
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return `<div class="weather-dynamic-art rainy"><div class="art-cloud"></div><div class="art-rain-drop d1"></div><div class="art-rain-drop d2"></div><div class="art-rain-drop d3"></div></div>`;
    }
    // برفی یا تگرگ
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return `<div class="weather-dynamic-art snowy"><div class="art-cloud"></div><div class="art-snow-flake s1">❄</div><div class="art-snow-flake s2">❄</div></div>`;
    }
    // ابری یا نیمه ابری
    return `<div class="weather-dynamic-art cloudy"><div class="art-cloud"></div></div>`;
  }

  function getWeatherPhrase(code, isDay) {
    if (code === 0) return isDay ? 'آفتابی و دلنشین ☀' : 'شب صاف و مهتابی 🌙';
    if ([1, 2].includes(code)) return isDay ? 'کمی تا نیمه‌ابری 🌤️' : 'شب کمی ابری ☁️';
    if (code === 3) return 'تمام ابری ☁️';
    if ([45, 48].includes(code)) return 'مه‌آلود و غبارآلود 🌫️';
    if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) return 'بارانی و با طراوت 🌧️';
    if ([71, 73, 75, 85].includes(code)) return 'برفی و زمستانی ❄️';
    if ([95, 96, 99].includes(code)) return 'رعد و برق و تگرگ ⛈️';
    return 'معتدل و آرام ⛅';
  }

  async function fetchRealWeather(lat, lon, cityName) {
    try {
      if (cityLabel) cityLabel.textContent = cityName;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const cur = data.current_weather;
      const daily = data.daily;
      const isDay = cur.is_day === 1;

      if (weatherTemp) weatherTemp.textContent = `${toFa(Math.round(cur.temperature))}°`;
      if (weatherIconContainer) weatherIconContainer.innerHTML = renderWeatherAnimatedIcon(cur.weathercode, isDay);
      if (weatherPhrase) weatherPhrase.textContent = getWeatherPhrase(cur.weathercode, isDay);

      const maxT = Math.round(daily.temperature_2m_max[0]);
      const minT = Math.round(daily.temperature_2m_min[0]);
      if (weatherRange) weatherRange.textContent = `${toFa(maxT)}° حداکثر . ${toFa(minT)}° حداقل`;

      if (forecastGrid) {
        forecastGrid.innerHTML = '';
        const dayNames = ['امروز', 'فردا', 'پس‌فردا', '۴ روز بعد', '۵ روز بعد'];
        const emojis = ['☀️', '⛅', '☁️', '🌧', '🌦'];
        for (let i = 0; i < 5; i++) {
          const dMax = Math.round(daily.temperature_2m_max[i]);
          const dMin = Math.round(daily.temperature_2m_min[i]);
          const box = document.createElement('div');
          box.className = 'forecast-day-box';
          box.innerHTML = `
            <span class="forecast-day-name">${dayNames[i]}</span>
            <div class="forecast-day-icon-box">${emojis[i % 5]}</div>
            <span class="forecast-day-max">${toFa(dMax)}°</span>
            <span class="forecast-day-min">${toFa(dMin)}°</span>
          `;
          forecastGrid.appendChild(box);
        }
      }
      fetchAzanTimes(lat, lon, cityName);
    } catch (e) {
      if (weatherPhrase) weatherPhrase.textContent = 'خطا در اتصال به سرور هواشناسی';
    }
  }
  fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);

  // پیش‌بینی ۵ روزه (عکس ۳)
  if (forecastToggleBtn && forecastDrawer) {
    forecastToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = forecastDrawer.classList.contains('active');
      closeAllDrawersAndPopups();
      if (!isActive) forecastDrawer.classList.add('active');
    });
  }

  // رویدادهای باز شدن و گزینه‌های پنجره موقعیت مکانی (عکس ۲)
  if (citySelectBtn && cityModal) {
    citySelectBtn.onclick = (e) => {
      e.stopPropagation();
      closeAllDrawersAndPopups();
      cityModal.classList.add('active');
    };
  }

  if (cityCancelBtn && cityModal) {
    cityCancelBtn.onclick = () => cityModal.classList.remove('active');
  }

  
  // موقعیت‌یابی زنده GPS با قابلیت درخواست مجدد مجوز
  if (autoGpsBtn) {
    autoGpsBtn.onclick = () => {
      if (!navigator.geolocation) {
        
        return;
      }
      autoGpsBtn.style.opacity = '0.6';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          autoGpsBtn.style.opacity = '1';
          activeCoords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: 'موقعیت دستگاه'
          };
          localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
          fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);
          cityModal.classList.remove('active');
        },
        (err) => {
          autoGpsBtn.style.opacity = '1';
          if (err.code === 1) {
            
          } else {
            
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };
  }

  // تشخیص موقعیت بر اساس آی‌پی با سرورهای پشتیبان بدون تحریم
  if (autoIpBtn) {
    autoIpBtn.onclick = async () => {
      const confirmAccess = confirm('آیا اجازه می‌دهید موقعیت تقریبی شما از طریق آی‌پی اینترنت دریافت شود؟');
      if (!confirmAccess) return;

      autoIpBtn.style.opacity = '0.6';
      let fetched = false;

      // سرور ۱: ipapi.co
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.latitude && data.longitude) {
          activeCoords = { lat: data.latitude, lon: data.longitude, name: data.city || 'منطقه شما' };
          fetched = true;
        }
      } catch (e) {}

      // سرور ۲ (پشتیبان در صورت بروز خطا در اولی): ipwho.is
      if (!fetched) {
        try {
          const res = await fetch('https://ipwho.is/');
          const data = await res.json();
          if (data.success && data.latitude && data.longitude) {
            activeCoords = { lat: data.latitude, lon: data.longitude, name: data.city || 'منطقه شما' };
            fetched = true;
          }
        } catch (e) {}
      }

      autoIpBtn.style.opacity = '1';
      if (fetched) {
        localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
        fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);
        cityModal.classList.remove('active');
      } else {
        
      }
    };
  }

  // جستجوی دستی شهر
  if (citySaveBtn && manualCityInput) {
    citySaveBtn.onclick = async () => {
      const cityName = manualCityInput.value.trim();
      if (!cityName) return;
      citySaveBtn.textContent = 'در حال جستجو...';
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fa&format=json`);
        const data = await res.json();
        citySaveBtn.textContent = 'تأیید و ذخیره';
        if (data.results && data.results.length > 0) {
          const loc = data.results[0];
          activeCoords = {
            lat: loc.latitude,
            lon: loc.longitude,
            name: loc.name
          };
          localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
          fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);
          manualCityInput.value = '';
          cityModal.classList.remove('active');
        } else {
          
        }
      } catch (err) {
        citySaveBtn.textContent = 'تأیید و ذخیره';
        
      }
    };

    manualCityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        citySaveBtn.click();
      }
    });
  }

  // ۹. اوقات شرعی و منوی انتخاب شهر (عکس ۴)
  const azanToggleBtn = document.getElementById('azan-toggle-btn');
  const azanDrawer = document.getElementById('azan-drawer');
  const azanCurrentCity = document.getElementById('azan-current-city');
  const azanCityPickBtn = document.getElementById('azan-city-pick-btn');
  const azanCityDropdown = document.getElementById('azan-city-dropdown');
  const azanCitySearchInput = document.getElementById('azan-city-search-input');
  const azanCityList = document.getElementById('azan-city-list');

  const popularCities = [
    { name: 'تهران', lat: 35.6892, lon: 51.3890 },
    { name: 'مشهد', lat: 36.2972, lon: 59.6067 },
    { name: 'اصفهان', lat: 32.6546, lon: 51.6680 },
    { name: 'شیراز', lat: 29.5918, lon: 52.5837 },
    { name: 'تبریز', lat: 38.0800, lon: 46.2919 },
    { name: 'قم', lat: 34.6401, lon: 50.8764 },
    { name: 'اهواز', lat: 31.3183, lon: 48.6706 },
    { name: 'کرج', lat: 35.8327, lon: 50.9915 },
    { name: 'کرمانشاه', lat: 34.3142, lon: 47.0650 },
    { name: 'رشت', lat: 37.2808, lon: 49.5832 },
    { name: 'یزد', lat: 31.8974, lon: 54.3569 }
  ];

  function renderAzanCities(filterText = '') {
    if (!azanCityList) return;
    azanCityList.innerHTML = '';
    const filtered = popularCities.filter(c => c.name.includes(filterText));
    filtered.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c.name;
      li.onclick = (e) => {
        e.stopPropagation();
        activeCoords = { lat: c.lat, lon: c.lon, name: c.name };
        localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
        fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);
        azanCityDropdown.classList.remove('active');
      };
      azanCityList.appendChild(li);
    });
  }

  if (azanCityPickBtn && azanCityDropdown) {
    azanCityPickBtn.onclick = (e) => {
      e.stopPropagation();
      renderAzanCities();
      azanCityDropdown.classList.toggle('active');
    };
  }

  if (azanCitySearchInput) {
    azanCitySearchInput.oninput = (e) => {
      renderAzanCities(e.target.value.trim());
    };
    azanCitySearchInput.onclick = e => e.stopPropagation();
  }

  async function fetchAzanTimes(lat, lon, cityName) {
    if (azanCurrentCity) azanCurrentCity.textContent = cityName;
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=7`);
      const data = await res.json();
      const t = data.data.timings;
      document.getElementById('azan-fajr').textContent = toFa(t.Fajr);
      document.getElementById('azan-sunrise').textContent = toFa(t.Sunrise);
      document.getElementById('azan-dhuhr').textContent = toFa(t.Dhuhr);
      document.getElementById('azan-sunset').textContent = toFa(t.Sunset);
      document.getElementById('azan-maghrib').textContent = toFa(t.Maghrib);
      document.getElementById('azan-midnight').textContent = toFa(t.Midnight);
    } catch (e) {}
  }

  if (azanToggleBtn && azanDrawer) {
    azanToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = azanDrawer.classList.contains('active');
      closeAllDrawersAndPopups();
      if (!isActive) azanDrawer.classList.add('active');
    });
  }

  // ۱۰. تایمر همراه با اسکرول ماوس (عکس ۵)
  const timerToggleBtn = document.getElementById('timer-toggle-btn');
  const timerDrawer = document.getElementById('timer-drawer');
  const timerActionMain = document.getElementById('timer-toggle-action');
  const timerHr = document.getElementById('timer-hr');
  const timerMin = document.getElementById('timer-min');
  const timerSec = document.getElementById('timer-sec');

  let timerInterval = null;
  let totalRemainingSec = 0;

  if (timerToggleBtn && timerDrawer) {
    timerToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = timerDrawer.classList.contains('active');
      closeAllDrawersAndPopups();
      if (!isActive) timerDrawer.classList.add('active');
    });
  }

  // اسکرول و تایپ اعداد تایمر
  [
    { input: timerSec, max: 59 },
    { input: timerMin, max: 59 },
    { input: timerHr, max: 99 }
  ].forEach(({ input, max }) => {
    if (!input) return;
    input.addEventListener('click', (e) => e.stopPropagation());

    // کم و زیاد کردن با چرخ ماوس
    input.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let currentVal = parseInt(toEn(input.value), 10) || 0;
      if (e.deltaY < 0) {
        currentVal = currentVal < max ? currentVal + 1 : 0;
      } else {
        currentVal = currentVal > 0 ? currentVal - 1 : max;
      }
      input.value = toFa(String(currentVal).padStart(2, '0'));
    });

    // تایپ دستی
    input.addEventListener('input', (e) => {
      let val = toEn(e.target.value).replace(/\D/g, '');
      if (val.length > 2) val = val.slice(-2);
      if (parseInt(val, 10) > max) val = String(max);
      e.target.value = val ? toFa(val) : '';
    });
  });

  if (timerActionMain) {
    timerActionMain.addEventListener('click', (e) => {
      e.stopPropagation();
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerActionMain.textContent = 'شروع';
        timerActionMain.classList.remove('running');
      } else {
        const h = parseInt(toEn(timerHr.value), 10) || 0;
        const m = parseInt(toEn(timerMin.value), 10) || 0;
        const s = parseInt(toEn(timerSec.value), 10) || 0;
        totalRemainingSec = (h * 3600) + (m * 60) + s;
        if (totalRemainingSec <= 0) return;

        timerActionMain.textContent = 'توقف';
        timerActionMain.classList.add('running');

        timerInterval = setInterval(() => {
          totalRemainingSec--;
          if (totalRemainingSec <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerActionMain.textContent = 'شروع';
            timerActionMain.classList.remove('running');
            timerHr.value = '۰۰'; timerMin.value = '۲۵'; timerSec.value = '۰۰';
            startAlarmSound();
            if (timerAlarmModal) timerAlarmModal.classList.add('active');
            return;
          }
          const curH = Math.floor(totalRemainingSec / 3600);
          const curM = Math.floor((totalRemainingSec % 3600) / 60);
          const curS = totalRemainingSec % 60;
          timerHr.value = toFa(String(curH).padStart(2, '0'));
          timerMin.value = toFa(String(curM).padStart(2, '0'));
          timerSec.value = toFa(String(curS).padStart(2, '0'));
        }, 1000);
      }
    });
  }

  // ۱۱. سرچ‌بار
  const engineSwitcher = document.getElementById('engine-switcher');
  const googleLogo = document.getElementById('google-logo');
  const zarebinLogo = document.getElementById('zarebin-logo');
  const searchTools = document.getElementById('search-tools');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const lensBtn = document.getElementById('lens-btn');
  const voiceBtn = document.getElementById('voice-btn');

  let currentEngine = localStorage.getItem('search_engine') || 'google';

  function updateSearchEngineUI() {
    if (!searchForm || !searchInput) return;
    if (currentEngine === 'zarebin') {
      if (googleLogo) googleLogo.style.display = 'none';
      if (zarebinLogo) zarebinLogo.style.display = 'inline-block';
      if (searchTools) searchTools.style.display = 'none';
      searchInput.placeholder = 'جستجو در ذره‌بین...';
      searchForm.action = 'https://zarebin.ir/search';
    } else {
      if (googleLogo) googleLogo.style.display = 'inline-block';
      if (zarebinLogo) zarebinLogo.style.display = 'none';
      if (searchTools) searchTools.style.display = 'flex';
      searchInput.placeholder = 'جستجو در گوگل...';
      searchForm.action = 'https://www.google.com/search';
    }
  }

  if (engineSwitcher) {
    engineSwitcher.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      currentEngine = currentEngine === 'google' ? 'zarebin' : 'google';
      localStorage.setItem('search_engine', currentEngine);
      updateSearchEngineUI();
    });
  }
  updateSearchEngineUI();

  if (lensBtn) lensBtn.onclick = (e) => { e.preventDefault(); window.open('https://lens.google.com/', '_blank'); };

  // ۱۲. میانبرها
  const shortcutsGrid = document.getElementById('shortcuts-grid');
  const addModal = document.getElementById('add-modal');
  const modalSaveBtn = document.getElementById('modal-save-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalTitle = document.getElementById('modal-site-title');
  const modalUrl = document.getElementById('modal-site-url');

  const defaultShortcuts = [
    { title: 'تلگرام', url: 'https://web.telegram.org' },
    { title: 'تلفنچی', url: 'https://telephonchi.com' },
    { title: 'X', url: 'https://x.com' },
    { title: 'پینترست', url: 'https://www.pinterest.com' },
    { title: 'یوتیوب', url: 'https://www.youtube.com' },
    { title: 'App', url: 'https://cafebazaar.ir' },
    { title: 'آپ‌تی‌وی', url: 'https://uptvs.com' },
    { title: 'اینستاگرام', url: 'https://www.instagram.com' },
    { title: 'تردز', url: 'https://www.threads.net' },
    { title: 'دیجی‌کالا', url: 'https://www.digikala.com' },
    { title: 'دیوار', url: 'https://divar.ir' },
    { title: 'واتساپ', url: 'https://web.whatsapp.com' }
  ];

  
  if (localStorage.getItem('sc_ver_tag') !== 'v11') {
    localStorage.removeItem('my_shortcuts');
    localStorage.setItem('sc_ver_tag', 'v11');
  }

  let shortcuts = JSON.parse(localStorage.getItem('my_shortcuts')) || defaultShortcuts;

  function renderShortcuts() {
    if (!shortcutsGrid) return;
    shortcutsGrid.innerHTML = '';
    shortcuts.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'shortcut-box';
      const domain = new URL(item.url).hostname;
      card.innerHTML = `
        <button class="more-btn" data-index="${index}">⋮</button>
        <div class="context-menu" id="menu-${index}">
          <button class="menu-item open-tab" data-url="${item.url}">🔗 تب جدید</button>
          <button class="menu-item copy-link" data-url="${item.url}">📋 کپی لینک</button>
          <button class="menu-item delete" data-index="${index}">🗑 حذف</button>
        </div>
        <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=128" class="shortcut-icon-img" alt="${item.title}">
        <span class="shortcut-title">${item.title}</span>
      `;
      card.onclick = (e) => {
        if (e.target.closest('.more-btn') || e.target.closest('.context-menu')) return;
        window.location.href = item.url;
      };
      shortcutsGrid.appendChild(card);
    });

    const addBtn = document.createElement('div');
    addBtn.className = 'add-shortcut-box';
    addBtn.innerHTML = '<span class="add-plus-icon">+</span>';
    addBtn.onclick = () => { if (addModal) addModal.classList.add('active'); };
    shortcutsGrid.appendChild(addBtn);

    document.querySelectorAll('.more-btn').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        closeAllDrawersAndPopups();
        const m = document.getElementById(`menu-${b.dataset.index}`);
        if (m) m.classList.toggle('active');
      };
    });

    document.querySelectorAll('.menu-item.delete').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        shortcuts.splice(b.dataset.index, 1);
        localStorage.setItem('my_shortcuts', JSON.stringify(shortcuts));
        renderShortcuts();
      };
    });
  }

  if (modalSaveBtn) {
    modalSaveBtn.onclick = () => {
      const t = modalTitle.value.trim();
      let u = modalUrl.value.trim();
      if (!t || !u) return;
      if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'https://' + u;
      shortcuts.push({ title: t, url: u });
      localStorage.setItem('my_shortcuts', JSON.stringify(shortcuts));
      modalTitle.value = ''; modalUrl.value = '';
      if (addModal) addModal.classList.remove('active');
      renderShortcuts();
    };
  }
  if (modalCancelBtn) modalCancelBtn.onclick = () => addModal.classList.remove('active');
  renderShortcuts();

  // ۱۳. سیستم تسک
  const tabTasks = document.getElementById('tab-tasks');
  const tabNotes = document.getElementById('tab-notes');
  const emptyState = document.getElementById('empty-state');
  const todoList = document.getElementById('todo-list');

  const taskTriggerCollapsed = document.getElementById('task-trigger-collapsed');
  const taskComposerExpanded = document.getElementById('task-composer-expanded');
  const composerTitle = document.getElementById('composer-title');
  const composerDesc = document.getElementById('composer-desc');
  const composerSubmitBtn = document.getElementById('composer-submit-btn');
  const toggleDoneBtn = document.getElementById('toggle-done-tasks-btn');

  const editTaskModal = document.getElementById('edit-task-modal');
  const editTaskCloseBtn = document.getElementById('edit-task-close-btn');
  const editTaskTitleInput = document.getElementById('edit-task-title-input');
  const editTaskDescInput = document.getElementById('edit-task-desc-input');
  const editTaskChkIndicator = document.getElementById('edit-task-chk-indicator');
  
  const editBoardBtn = document.getElementById('edit-board-btn');
  const editBoardLabel = document.getElementById('edit-board-label');
  const boardDropdownMenu = document.getElementById('board-dropdown-menu');

  const editToolRepeatBtn = document.getElementById('edit-tool-repeat-btn');
  const editToolDateBtn = document.getElementById('edit-tool-date-btn');
  const editToolTimeBtn = document.getElementById('edit-tool-time-btn');
  const editToolTagBtn = document.getElementById('edit-tool-tag-btn');
  const editToolPriorityBtn = document.getElementById('edit-tool-priority-btn');

  const editPopupRepeat = document.getElementById('edit-popup-repeat');
  const editPopupDate = document.getElementById('edit-popup-date');
  const editPopupTime = document.getElementById('edit-popup-time');
  const editPopupTag = document.getElementById('edit-popup-tag');
  const editPopupPriority = document.getElementById('edit-popup-priority');

  const editRepeatLabel = document.getElementById('edit-repeat-label');
  const editDateLabel = document.getElementById('edit-date-label');
  const editTimeLabel = document.getElementById('edit-time-label');
  const editTagLabel = document.getElementById('edit-tag-label');
  const editPriorityLabel = document.getElementById('edit-priority-label');

  const btnEditTaskSave = document.getElementById('btn-edit-task-save');
  const btnEditTaskDelete = document.getElementById('btn-edit-task-delete');

  let currentEditingIndex = -1;
  let currentEditingBoard = 'none';

  let draftTask = { tag: '', date: '', time: '', priority: 'none', repeat: '' };
  let isEditingMode = false;
  let todos = JSON.parse(localStorage.getItem('my_todos')) || [];
  let hideDoneTasks = false;

  if (toggleDoneBtn) {
    toggleDoneBtn.onclick = () => {
      hideDoneTasks = !hideDoneTasks;
      saveAndRenderTodos();

  const timerAlarmModal = document.getElementById('timer-alarm-modal');
  const timerAlarmDismissBtn = document.getElementById('timer-alarm-dismiss-btn');
  if (timerAlarmDismissBtn && timerAlarmModal) {
    timerAlarmDismissBtn.onclick = () => {
      stopAlarmSound();
      timerAlarmModal.classList.remove('active');
    };
  }

    };
  }

  if (taskTriggerCollapsed && taskComposerExpanded) {
    taskTriggerCollapsed.onclick = (e) => {
      e.stopPropagation();
      closeAllDrawersAndPopups();
      taskTriggerCollapsed.style.display = 'none';
      taskComposerExpanded.style.display = 'flex';
      composerTitle.focus();
    };
  }

  if (composerDesc) {
    composerDesc.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }

  function openEditTaskModal(index) {
    currentEditingIndex = index;
    const item = todos[index];
    if (!item) return;

    editTaskTitleInput.value = item.title || '';
    editTaskDescInput.value = item.desc || '';
    currentEditingBoard = item.board || 'none';

    draftTask = {
      tag: item.tag || '',
      date: item.date || '',
      time: item.time || '',
      priority: item.priority || 'none',
      repeat: item.repeat || ''
    };

    if (editBoardLabel) {
      if (item.board === 'in_progress') editBoardLabel.textContent = '📁 در دست اقدام ⌵';
      else if (item.board === 'done') editBoardLabel.textContent = '📁 انجام شده ⌵';
      else editBoardLabel.textContent = '📁 بورد ⌵';
    }

    if (editRepeatLabel) editRepeatLabel.textContent = item.repeat ? item.repeat : 'تکرار';
    if (editDateLabel) editDateLabel.textContent = item.date ? item.date : 'سررسید';
    if (editTimeLabel) editTimeLabel.textContent = item.time ? item.time : 'ساعت';
    if (editTagLabel) editTagLabel.textContent = item.tag ? item.tag : 'برچسب‌ها';
    
    const prioNames = { none: 'بدون اولویت', low: 'پایین', medium: 'متوسط', high: 'بالا' };
    if (editPriorityLabel) editPriorityLabel.textContent = prioNames[item.priority] || 'بدون اولویت';

    if (item.done) {
      editTaskChkIndicator.style.background = '#2563eb';
      editTaskChkIndicator.style.borderColor = '#2563eb';
    } else {
      editTaskChkIndicator.style.background = 'transparent';
      editTaskChkIndicator.style.borderColor = '#94a3b8';
    }

    closeAllDrawersAndPopups();
    if (editTaskModal) editTaskModal.classList.add('active');
  }

  if (editTaskCloseBtn && editTaskModal) {
    editTaskCloseBtn.onclick = () => {
      editTaskModal.classList.remove('active');
      isEditingMode = false;
      closeAllDrawersAndPopups();
    };
  }

  if (editBoardBtn && boardDropdownMenu) {
    editBoardBtn.onclick = (e) => {
      e.stopPropagation();
      const isVisible = boardDropdownMenu.style.display === 'flex';
      closeAllDrawersAndPopups();
      boardDropdownMenu.style.display = isVisible ? 'none' : 'flex';
    };

    boardDropdownMenu.querySelectorAll('.board-opt-item').forEach(opt => {
      opt.onclick = (ev) => {
        ev.stopPropagation();
        currentEditingBoard = opt.dataset.board;
        if (editBoardLabel) {
          if (currentEditingBoard === 'in_progress') editBoardLabel.textContent = '📁 در دست اقدام ⌵';
          else if (currentEditingBoard === 'done') editBoardLabel.textContent = '📁 انجام شده ⌵';
          else editBoardLabel.textContent = '📁 بورد ⌵';
        }
        boardDropdownMenu.style.display = 'none';
      };
    });
  }

  function toggleEditPopup(popupEl) {
    const isVisible = popupEl.style.display === 'flex';
    closeAllDrawersAndPopups();
    popupEl.style.display = isVisible ? 'none' : 'flex';
  }

  if (editToolRepeatBtn && editPopupRepeat) {
    editToolRepeatBtn.onclick = (e) => {
      e.stopPropagation();
      renderEditRepeatUI();
      toggleEditPopup(editPopupRepeat);
    };
  }

  if (editToolDateBtn && editPopupDate) {
    editToolDateBtn.onclick = (e) => {
      e.stopPropagation();
      renderEditCalendar();
      toggleEditPopup(editPopupDate);
    };
  }

  if (editToolTimeBtn && editPopupTime) {
    editToolTimeBtn.onclick = (e) => {
      e.stopPropagation();
      initEditTimeWheels();
      toggleEditPopup(editPopupTime);
    };
  }

  if (editToolTagBtn && editPopupTag) {
    editToolTagBtn.onclick = (e) => {
      e.stopPropagation();
      toggleEditPopup(editPopupTag);
    };
  }

  if (editToolPriorityBtn && editPopupPriority) {
    editToolPriorityBtn.onclick = (e) => {
      e.stopPropagation();
      toggleEditPopup(editPopupPriority);
    };
  }

  if (btnEditTaskSave && editTaskModal) {
    btnEditTaskSave.onclick = () => {
      if (currentEditingIndex > -1 && todos[currentEditingIndex]) {
        todos[currentEditingIndex].title = editTaskTitleInput.value.trim() || todos[currentEditingIndex].title;
        todos[currentEditingIndex].desc = editTaskDescInput.value.trim();
        todos[currentEditingIndex].board = currentEditingBoard;
        todos[currentEditingIndex].tag = draftTask.tag;
        todos[currentEditingIndex].date = draftTask.date;
        todos[currentEditingIndex].time = draftTask.time;
        todos[currentEditingIndex].priority = draftTask.priority;
        todos[currentEditingIndex].repeat = draftTask.repeat;
        saveAndRenderTodos();
      }
      isEditingMode = false;
      closeAllDrawersAndPopups();
      editTaskModal.classList.remove('active');
    };
  }

  if (btnEditTaskDelete && editTaskModal) {
    btnEditTaskDelete.onclick = () => {
      if (currentEditingIndex > -1 && todos[currentEditingIndex]) {
        todos.splice(currentEditingIndex, 1);
        saveAndRenderTodos();
      }
      isEditingMode = false;
      closeAllDrawersAndPopups();
      editTaskModal.classList.remove('active');
    };
  }

  if (editPopupPriority) {
    editPopupPriority.querySelectorAll('.prio-item').forEach(el => {
      el.onclick = (ev) => {
        ev.stopPropagation();
        editPopupPriority.querySelectorAll('.prio-item').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        draftTask.priority = el.dataset.prio;
        const prioNames = { none: 'بدون اولویت', low: 'پایین', medium: 'متوسط', high: 'بالا' };
        if (editPriorityLabel) editPriorityLabel.textContent = prioNames[el.dataset.prio];
        editPopupPriority.style.display = 'none';
      };
    });
  }

  const editNewTagInput = document.getElementById('edit-new-tag-input');
  const editTagAddPlusBtn = document.getElementById('edit-tag-add-plus-btn');
  const editTagsChipsList = document.getElementById('edit-tags-chips-list');

  if (editTagAddPlusBtn && editNewTagInput) {
    editTagAddPlusBtn.onclick = (e) => {
      e.stopPropagation();
      const val = editNewTagInput.value.trim();
      if (!val) return;
      draftTask.tag = val;
      if (editTagLabel) editTagLabel.textContent = val;
      const chip = document.createElement('span');
      chip.className = 'tag-chip-item';
      chip.textContent = val;
      chip.onclick = (ev) => {
        ev.stopPropagation();
        draftTask.tag = val;
        if (editTagLabel) editTagLabel.textContent = val;
        editPopupTag.style.display = 'none';
      };
      editTagsChipsList.appendChild(chip);
      editNewTagInput.value = '';
      editPopupTag.style.display = 'none';
    };
  }

  let editTaskCalYear = 1405;
  let editTaskCalMonthIdx = 6;
  let editTaskCalSelectedDay = 11;
  const editTaskCalMonthTitle = document.getElementById('edit-task-cal-month-title');
  const editTaskCalGrid = document.getElementById('edit-task-cal-grid');
  const editCalPopUp = document.getElementById('edit-cal-pop-up');
  const editCalPopDown = document.getElementById('edit-cal-pop-down');
  const editCalPopToday = document.getElementById('edit-cal-pop-today');
  const editBtnDateConfirm = document.getElementById('edit-btn-date-confirm');

  function renderEditCalendar() {
    if (!editTaskCalMonthTitle || !editTaskCalGrid) return;
    editTaskCalMonthTitle.textContent = `${persianMonthNames[editTaskCalMonthIdx]} ${toFa(editTaskCalYear)}`;
    editTaskCalGrid.innerHTML = '';

    const daysCount = editTaskCalMonthIdx < 6 ? 31 : (editTaskCalMonthIdx < 11 ? 30 : 29);
    const startOff = (editTaskCalMonthIdx * 2 + 1) % 7;

    for (let k = 0; k < startOff; k++) {
      editTaskCalGrid.appendChild(document.createElement('span'));
    }

    for (let d = 1; d <= daysCount; d++) {
      const span = document.createElement('span');
      span.textContent = toFa(d);
      const dayOfWeek = (d + startOff - 1) % 7;
      if (dayOfWeek === 6) span.className = 'holiday';
      if (d === editTaskCalSelectedDay) span.classList.add('active-day');

      span.onclick = (ev) => {
        ev.stopPropagation();
        editTaskCalSelectedDay = d;
        renderEditCalendar();
      };
      editTaskCalGrid.appendChild(span);
    }
  }

  if (editCalPopUp) {
    editCalPopUp.onclick = (e) => {
      e.stopPropagation();
      editTaskCalMonthIdx++;
      if (editTaskCalMonthIdx > 11) { editTaskCalMonthIdx = 0; editTaskCalYear++; }
      renderEditCalendar();
    };
  }

  if (editCalPopDown) {
    editCalPopDown.onclick = (e) => {
      e.stopPropagation();
      editTaskCalMonthIdx--;
      if (editTaskCalMonthIdx < 0) { editTaskCalMonthIdx = 11; editTaskCalYear--; }
      renderEditCalendar();
    };
  }

  if (editCalPopToday) {
    editCalPopToday.onclick = (e) => {
      e.stopPropagation();
      editTaskCalYear = 1405;
      editTaskCalMonthIdx = 6;
      editTaskCalSelectedDay = 9;
      renderEditCalendar();
    };
  }

  if (editBtnDateConfirm) {
    editBtnDateConfirm.onclick = (e) => {
      e.stopPropagation();
      draftTask.date = `${toFa(editTaskCalSelectedDay)} ${persianMonthNames[editTaskCalMonthIdx]}`;
      if (editDateLabel) editDateLabel.textContent = draftTask.date;
      editPopupDate.style.display = 'none';
    };
  }

  let editSelectedHour = '13';
  let editSelectedMinute = '15';
  const editWheelHour = document.getElementById('edit-wheel-hour');
  const editWheelMinute = document.getElementById('edit-wheel-minute');
  const editBtnTimeConfirm = document.getElementById('edit-btn-time-confirm');

  function initEditTimeWheels() {
    if (!editWheelHour || !editWheelMinute) return;
    editWheelHour.innerHTML = '';
    editWheelMinute.innerHTML = '';

    for (let h = 0; h < 24; h++) {
      const hStr = String(h).padStart(2, '0');
      const div = document.createElement('div');
      div.className = `time-num-item ${hStr === editSelectedHour ? 'selected' : ''}`;
      div.textContent = toFa(hStr);
      div.dataset.value = hStr;
      div.onclick = (ev) => {
        ev.stopPropagation();
        editSelectedHour = hStr;
        editWheelHour.querySelectorAll('.time-num-item').forEach(el => el.classList.remove('selected'));
        div.classList.add('selected');
        div.scrollIntoView({ block: 'center', behavior: 'smooth' });
      };
      editWheelHour.appendChild(div);
    }

    for (let m = 0; m < 60; m += 5) {
      const mStr = String(m).padStart(2, '0');
      const div = document.createElement('div');
      div.className = `time-num-item ${mStr === editSelectedMinute ? 'selected' : ''}`;
      div.textContent = toFa(mStr);
      div.dataset.value = mStr;
      div.onclick = (ev) => {
        ev.stopPropagation();
        editSelectedMinute = mStr;
        editWheelMinute.querySelectorAll('.time-num-item').forEach(el => el.classList.remove('selected'));
        div.classList.add('selected');
        div.scrollIntoView({ block: 'center', behavior: 'smooth' });
      };
      editWheelMinute.appendChild(div);
    }

    setTimeout(() => {
      const selH = editWheelHour.querySelector(`.time-num-item[data-value="${editSelectedHour}"]`);
      if (selH) selH.scrollIntoView({ block: 'center', behavior: 'auto' });
      const selM = editWheelMinute.querySelector(`.time-num-item[data-value="${editSelectedMinute}"]`);
      if (selM) selM.scrollIntoView({ block: 'center', behavior: 'auto' });
    }, 40);
  }

  if (editBtnTimeConfirm) {
    editBtnTimeConfirm.onclick = (e) => {
      e.stopPropagation();
      draftTask.time = `${toFa(editSelectedHour)}:${toFa(editSelectedMinute)}`;
      if (editTimeLabel) editTimeLabel.textContent = draftTask.time;
      editPopupTime.style.display = 'none';
    };
  }

  let editRepeatCount = 2;
  let editRepeatSelectedDays = [0];
  let editRepeatSelectedMonthDays = [1];
  let editRepeatSelectedMonths = [0];

  const editRepeatUnitSelect = document.getElementById('edit-repeat-unit-select');
  const editCntMinus = document.getElementById('edit-cnt-minus');
  const editCntPlus = document.getElementById('edit-cnt-plus');
  const editCntVal = document.getElementById('edit-cnt-val');
  const editRepeatDynamicSub = document.getElementById('edit-repeat-dynamic-sub');
  const editBtnRepeatConfirm = document.getElementById('edit-btn-repeat-confirm');
  const editBtnRepeatCancel = document.getElementById('edit-btn-repeat-cancel');

  function renderEditRepeatUI() {
    if (!editRepeatDynamicSub) return;
    editRepeatDynamicSub.innerHTML = '';
    const unit = editRepeatUnitSelect.value;

    if (unit === 'week') {
      const wrap = document.createElement('div');
      wrap.className = 'sub-row-wrap';
      wrap.innerHTML = `<span class="sub-row-label">چه روزهایی؟</span>`;
      const grid = document.createElement('div');
      grid.className = 'weekday-repeat-grid';
      
      const fullDays = [
        { label: 'شنبه', idx: 0 },
        { label: 'یکشنبه', idx: 1 },
        { label: 'دوشنبه', idx: 2 },
        { label: 'سه‌شنبه', idx: 3 },
        { label: 'چهارشنبه', idx: 4 },
        { label: 'پنج‌شنبه', idx: 5 },
        { label: 'جمعه', idx: 6 }
      ];

      fullDays.forEach(d => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `rpt-weekday-btn ${editRepeatSelectedDays.includes(d.idx) ? 'selected' : ''}`;
        btn.textContent = d.label;
        btn.onclick = (ev) => {
          ev.stopPropagation();
          if (editRepeatSelectedDays.includes(d.idx)) {
            editRepeatSelectedDays = editRepeatSelectedDays.filter(x => x !== d.idx);
          } else {
            editRepeatSelectedDays.push(d.idx);
          }
          renderEditRepeatUI();
        };
        grid.appendChild(btn);
      });
      wrap.appendChild(grid);
      editRepeatDynamicSub.appendChild(wrap);

    } else if (unit === 'month') {
      const wrap = document.createElement('div');
      wrap.className = 'sub-row-wrap';
      wrap.innerHTML = `<span class="sub-row-label">چه روزهایی از ماه؟</span>`;
      const grid = document.createElement('div');
      grid.className = 'monthday-repeat-grid';
      for (let i = 1; i <= 31; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `rpt-circle-btn ${editRepeatSelectedMonthDays.includes(i) ? 'selected' : ''}`;
        btn.textContent = toFa(i);
        btn.onclick = (ev) => {
          ev.stopPropagation();
          if (editRepeatSelectedMonthDays.includes(i)) {
            editRepeatSelectedMonthDays = editRepeatSelectedMonthDays.filter(x => x !== i);
          } else {
            editRepeatSelectedMonthDays.push(i);
          }
          renderEditRepeatUI();
        };
        grid.appendChild(btn);
      }
      wrap.appendChild(grid);
      editRepeatDynamicSub.appendChild(wrap);

    } else if (unit === 'year') {
      const wrapMonths = document.createElement('div');
      wrapMonths.className = 'sub-row-wrap';
      wrapMonths.innerHTML = `<span class="sub-row-label">چه ماه‌هایی؟</span>`;
      const mGrid = document.createElement('div');
      mGrid.className = 'month-repeat-grid';
      persianMonthNames.forEach((m, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `rpt-month-btn ${editRepeatSelectedMonths.includes(idx) ? 'selected' : ''}`;
        btn.textContent = m;
        btn.onclick = (ev) => {
          ev.stopPropagation();
          if (editRepeatSelectedMonths.includes(idx)) {
            editRepeatSelectedMonths = editRepeatSelectedMonths.filter(x => x !== idx);
          } else {
            editRepeatSelectedMonths.push(idx);
          }
          renderEditRepeatUI();
        };
        mGrid.appendChild(btn);
      });
      wrapMonths.appendChild(mGrid);
      editRepeatDynamicSub.appendChild(wrapMonths);

      const wrapDays = document.createElement('div');
      wrapDays.className = 'sub-row-wrap';
      wrapDays.innerHTML = `<span class="sub-row-label">چه روزهایی از ماه؟</span>`;
      const dGrid = document.createElement('div');
      dGrid.className = 'monthday-repeat-grid';
      for (let i = 1; i <= 31; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `rpt-circle-btn ${editRepeatSelectedMonthDays.includes(i) ? 'selected' : ''}`;
        btn.textContent = toFa(i);
        btn.onclick = (ev) => {
          ev.stopPropagation();
          if (editRepeatSelectedMonthDays.includes(i)) {
            editRepeatSelectedMonthDays = editRepeatSelectedMonthDays.filter(x => x !== i);
          } else {
            editRepeatSelectedMonthDays.push(i);
          }
          renderEditRepeatUI();
        };
        dGrid.appendChild(btn);
      }
      wrapDays.appendChild(dGrid);
      editRepeatDynamicSub.appendChild(wrapDays);
    }
  }

  if (editRepeatUnitSelect) editRepeatUnitSelect.onchange = () => renderEditRepeatUI();

  if (editCntMinus) {
    editCntMinus.onclick = (e) => {
      e.stopPropagation();
      if (editRepeatCount > 1) {
        editRepeatCount--;
        editCntVal.textContent = toFa(editRepeatCount);
      }
    };
  }

  if (editCntPlus) {
    editCntPlus.onclick = (e) => {
      e.stopPropagation();
      editRepeatCount++;
      editCntVal.textContent = toFa(editRepeatCount);
    };
  }

  if (editBtnRepeatCancel) editBtnRepeatCancel.onclick = () => editPopupRepeat.style.display = 'none';

  if (editBtnRepeatConfirm) {
    editBtnRepeatConfirm.onclick = () => {
      const uText = editRepeatUnitSelect.options[editRepeatUnitSelect.selectedIndex].text;
      draftTask.repeat = (editRepeatCount === 1) ? uText + 'انه' : `هر ${toFa(editRepeatCount)} ${uText}`;
      if (editRepeatLabel) editRepeatLabel.textContent = draftTask.repeat;
      editPopupRepeat.style.display = 'none';
    };
  }

  // دکمه‌های کادر تسک پایین صفحه برای ساخت تسک جدید
  const toolBtnRepeat = document.getElementById('tool-btn-repeat');
  const toolBtnPriority = document.getElementById('tool-btn-priority');
  const toolBtnTime = document.getElementById('tool-btn-time');
  const toolBtnDate = document.getElementById('tool-btn-date');
  const toolBtnTag = document.getElementById('tool-btn-tag');

  const popupRepeat = document.getElementById('popup-repeat');
  const popupPriority = document.getElementById('popup-priority');
  const popupTime = document.getElementById('popup-time');
  const popupDate = document.getElementById('popup-date');
  const popupTag = document.getElementById('popup-tag');

  function toggleCreatePopup(popupEl) {
    const isVisible = popupEl.style.display === 'flex';
    closeAllDrawersAndPopups();
    popupEl.style.display = isVisible ? 'none' : 'flex';
  }

  if (toolBtnRepeat) {
    toolBtnRepeat.onclick = (e) => {
      e.stopPropagation();
      toggleCreatePopup(popupRepeat);
    };
  }

  if (toolBtnPriority) {
    toolBtnPriority.onclick = (e) => {
      e.stopPropagation();
      toggleCreatePopup(popupPriority);
    };
  }

  if (toolBtnTime) {
    toolBtnTime.onclick = (e) => {
      e.stopPropagation();
      toggleCreatePopup(popupTime);
    };
  }

  if (toolBtnDate) {
    toolBtnDate.onclick = (e) => {
      e.stopPropagation();
      toggleCreatePopup(popupDate);
    };
  }

  if (toolBtnTag) {
    toolBtnTag.onclick = (e) => {
      e.stopPropagation();
      toggleCreatePopup(popupTag);
    };
  }

  const newTagInput = document.getElementById('new-tag-input');
  const tagAddPlusBtn = document.getElementById('tag-add-plus-btn');
  const tagsChipsList = document.getElementById('tags-chips-list');

  if (tagAddPlusBtn && newTagInput) {
    tagAddPlusBtn.onclick = (e) => {
      e.stopPropagation();
      const val = newTagInput.value.trim();
      if (!val) return;
      draftTask.tag = val;
      const chip = document.createElement('span');
      chip.className = 'tag-chip-item';
      chip.textContent = val;
      chip.onclick = (ev) => {
        ev.stopPropagation();
        draftTask.tag = val;
        popupTag.style.display = 'none';
      };
      tagsChipsList.appendChild(chip);
      newTagInput.value = '';
      popupTag.style.display = 'none';
    };
  }

  const calPopUp = document.getElementById('cal-pop-up');
  const calPopDown = document.getElementById('cal-pop-down');
  const calPopToday = document.getElementById('cal-pop-today');
  const taskCalMonthTitle = document.getElementById('task-cal-month-title');
  const taskCalGrid = document.getElementById('task-cal-grid');
  const btnDateConfirm = document.getElementById('btn-date-confirm');

  let taskCalYear = 1405;
  let taskCalMonthIdx = 6;
  let taskCalSelectedDay = 11;

  function renderTaskCalendar() {
    if (!taskCalMonthTitle || !taskCalGrid) return;
    taskCalMonthTitle.textContent = `${persianMonthNames[taskCalMonthIdx]} ${toFa(taskCalYear)}`;
    taskCalGrid.innerHTML = '';

    const daysCount = taskCalMonthIdx < 6 ? 31 : (taskCalMonthIdx < 11 ? 30 : 29);
    const startOff = (taskCalMonthIdx * 2 + 1) % 7;

    for (let k = 0; k < startOff; k++) {
      taskCalGrid.appendChild(document.createElement('span'));
    }

    for (let d = 1; d <= daysCount; d++) {
      const span = document.createElement('span');
      span.textContent = toFa(d);
      const dayOfWeek = (d + startOff - 1) % 7;
      if (dayOfWeek === 6) span.className = 'holiday';
      if (d === taskCalSelectedDay) span.classList.add('active-day');

      span.onclick = (ev) => {
        ev.stopPropagation();
        taskCalSelectedDay = d;
        renderTaskCalendar();
      };
      taskCalGrid.appendChild(span);
    }
  }

  if (calPopUp) {
    calPopUp.onclick = (e) => {
      e.stopPropagation();
      taskCalMonthIdx++;
      if (taskCalMonthIdx > 11) { taskCalMonthIdx = 0; taskCalYear++; }
      renderTaskCalendar();
    };
  }

  if (calPopDown) {
    calPopDown.onclick = (e) => {
      e.stopPropagation();
      taskCalMonthIdx--;
      if (taskCalMonthIdx < 0) { taskCalMonthIdx = 11; taskCalYear--; }
      renderTaskCalendar();
    };
  }

  if (calPopToday) {
    calPopToday.onclick = (e) => {
      e.stopPropagation();
      taskCalYear = 1405;
      taskCalMonthIdx = 6;
      taskCalSelectedDay = 9;
      renderTaskCalendar();
    };
  }

  if (btnDateConfirm) {
    btnDateConfirm.onclick = (e) => {
      e.stopPropagation();
      draftTask.date = `${toFa(taskCalSelectedDay)} ${persianMonthNames[taskCalMonthIdx]}`;
      popupDate.style.display = 'none';
      if (toolBtnDate) toolBtnDate.classList.add('active-tool');
    };
  }

  const wheelHour = document.getElementById('wheel-hour');
  const wheelMinute = document.getElementById('wheel-minute');
  const btnTimeConfirm = document.getElementById('btn-time-confirm');

  let selectedHour = '13';
  let selectedMinute = '15';

  function initTimeWheels() {
    if (!wheelHour || !wheelMinute) return;
    wheelHour.innerHTML = '';
    wheelMinute.innerHTML = '';

    for (let h = 0; h < 24; h++) {
      const hStr = String(h).padStart(2, '0');
      const div = document.createElement('div');
      div.className = `time-num-item ${hStr === selectedHour ? 'selected' : ''}`;
      div.textContent = toFa(hStr);
      div.dataset.value = hStr;
      div.onclick = (ev) => {
        ev.stopPropagation();
        selectedHour = hStr;
        wheelHour.querySelectorAll('.time-num-item').forEach(el => el.classList.remove('selected'));
        div.classList.add('selected');
        div.scrollIntoView({ block: 'center', behavior: 'smooth' });
      };
      wheelHour.appendChild(div);
    }

    for (let m = 0; m < 60; m += 5) {
      const mStr = String(m).padStart(2, '0');
      const div = document.createElement('div');
      div.className = `time-num-item ${mStr === selectedMinute ? 'selected' : ''}`;
      div.textContent = toFa(mStr);
      div.dataset.value = mStr;
      div.onclick = (ev) => {
        ev.stopPropagation();
        selectedMinute = mStr;
        wheelMinute.querySelectorAll('.time-num-item').forEach(el => el.classList.remove('selected'));
        div.classList.add('selected');
        div.scrollIntoView({ block: 'center', behavior: 'smooth' });
      };
      wheelMinute.appendChild(div);
    }

    setTimeout(() => {
      const selH = wheelHour.querySelector(`.time-num-item[data-value="${selectedHour}"]`);
      if (selH) selH.scrollIntoView({ block: 'center', behavior: 'auto' });
      const selM = wheelMinute.querySelector(`.time-num-item[data-value="${selectedMinute}"]`);
      if (selM) selM.scrollIntoView({ block: 'center', behavior: 'auto' });
    }, 40);
  }

  if (btnTimeConfirm) {
    btnTimeConfirm.onclick = (e) => {
      e.stopPropagation();
      draftTask.time = `${toFa(selectedHour)}:${toFa(selectedMinute)}`;
      popupTime.style.display = 'none';
      if (toolBtnTime) toolBtnTime.classList.add('active-tool');
    };
  }

  if (popupPriority) {
    popupPriority.querySelectorAll('.prio-item').forEach(el => {
      el.onclick = (ev) => {
        ev.stopPropagation();
        popupPriority.querySelectorAll('.prio-item').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        draftTask.priority = el.dataset.prio;
        popupPriority.style.display = 'none';
        if (toolBtnPriority) toolBtnPriority.classList.add('active-tool');
      };
    });
  }

  const repeatUnitSelect = document.getElementById('repeat-unit-select');
  const cntMinus = document.getElementById('cnt-minus');
  const cntPlus = document.getElementById('cnt-plus');
  const cntVal = document.getElementById('cnt-val');
  const btnRepeatConfirm = document.getElementById('btn-repeat-confirm');
  const btnRepeatCancel = document.getElementById('btn-repeat-cancel');

  let repeatCount = 2;

  if (cntMinus) {
    cntMinus.onclick = (e) => {
      e.stopPropagation();
      if (repeatCount > 1) {
        repeatCount--;
        cntVal.textContent = toFa(repeatCount);
      }
    };
  }

  if (cntPlus) {
    cntPlus.onclick = (e) => {
      e.stopPropagation();
      repeatCount++;
      cntVal.textContent = toFa(repeatCount);
    };
  }

  if (btnRepeatCancel) btnRepeatCancel.onclick = () => popupRepeat.style.display = 'none';

  if (btnRepeatConfirm) {
    btnRepeatConfirm.onclick = () => {
      const uText = repeatUnitSelect.options[repeatUnitSelect.selectedIndex].text;
      draftTask.repeat = (repeatCount === 1) ? uText + 'انه' : `هر ${toFa(repeatCount)} ${uText}`;
      popupRepeat.style.display = 'none';
      if (toolBtnRepeat) toolBtnRepeat.classList.add('active-tool');
    };
  }

  // رندر تسک‌ها با تثبیت قطعی تیک در راست، متون در کنار آن، و دکمه‌ها در چپ
  function saveAndRenderTodos() {
    localStorage.setItem('my_todos', JSON.stringify(todos));
    if (!todoList || !emptyState) return;

    todoList.innerHTML = '';

    if (todos.length === 0) {
      emptyState.style.display = 'flex';
      todoList.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    todoList.style.display = 'flex';

    todos.forEach((item, index) => {
      if (hideDoneTasks && item.done) return;

      const li = document.createElement('li');
      li.className = `task-item-card ios-glass-card ${item.done ? 'done' : ''}`;
      
      let metaHtml = '';
      const pills = [];

      if (item.board === 'in_progress') {
        pills.push(`<span class="task-board-badge in-progress">● در دست اقدام</span>`);
      } else if (item.board === 'done') {
        pills.push(`<span class="task-board-badge done-badge">● انجام شده</span>`);
      }

      if (item.date) {
        pills.push(`<span class="task-meta-pill"><span>${item.date}</span><span>📅</span></span>`);
      }
      if (item.time) {
        pills.push(`<span class="task-meta-pill"><span>${item.time}</span><span>⏰</span></span>`);
      }
      if (item.repeat) {
        pills.push(`<span class="task-meta-pill"><span>${item.repeat}</span><span>↺</span></span>`);
      }
      if (item.tag) {
        pills.push(`<span class="task-meta-pill"><span>${item.tag}</span><span>🏷️</span></span>`);
      }

      if (pills.length > 0) {
        metaHtml = `<div class="task-meta-pills">${pills.join('')}</div>`;
      }

      const prioClass = `prio-${item.priority || 'none'}`;
      const firstLineDesc = item.desc ? item.desc.split('\n')[0].trim() : '';

      li.innerHTML = `
        <div class="task-card-right-group">
          <div class="task-checkbox-custom ${prioClass}" title="تغییر وضعیت">
            ${item.done ? '✓' : ''}
          </div>
          <div class="task-text-stack">
            <span class="task-item-title">${item.title}</span>
            ${firstLineDesc ? `<span class="task-item-desc">${firstLineDesc}</span>` : ''}
            ${metaHtml}
          </div>
        </div>

        <div class="task-card-left-actions">
          <button class="task-act-btn edit-btn" title="ویرایش">✏️</button>
          <button class="task-act-btn delete-btn" title="حذف">🗑</button>
        </div>
      `;

      const chk = li.querySelector('.task-checkbox-custom');
      chk.onclick = (e) => {
        e.stopPropagation();
        todos[index].done = !todos[index].done;
        saveAndRenderTodos();
      };

      const editBtn = li.querySelector('.edit-btn');
      editBtn.onclick = (e) => {
        e.stopPropagation();
        openEditTaskModal(index);
      };

      const delBtn = li.querySelector('.delete-btn');
      delBtn.onclick = (e) => {
        e.stopPropagation();
        todos.splice(index, 1);
        saveAndRenderTodos();
      };

      todoList.appendChild(li);
    });
  }

  // ثبت نهایی تسک جدید
  if (composerSubmitBtn && composerTitle) {
    const handleCreateTask = () => {
      const t = composerTitle.value.trim();
      const d = composerDesc.value.trim();
      if (!t) return;

      todos.push({
        title: t,
        desc: d,
        done: false,
        tag: draftTask.tag,
        date: draftTask.date,
        time: draftTask.time,
        priority: draftTask.priority || 'none',
        repeat: draftTask.repeat,
        board: 'none'
      });

      composerTitle.value = '';
      composerDesc.value = '';
      if (composerDesc) composerDesc.style.height = 'auto';
      draftTask = { tag: '', date: '', time: '', priority: 'none', repeat: '' };
      document.querySelectorAll('.composer-tool-btn').forEach(b => b.classList.remove('active-tool'));
      closeAllDrawersAndPopups();
      taskComposerExpanded.style.display = 'none';
      taskTriggerCollapsed.style.display = 'block';

      saveAndRenderTodos();
    };

    composerSubmitBtn.onclick = (e) => {
      e.stopPropagation();
      handleCreateTask();
    };

    composerTitle.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCreateTask();
      }
    });
  }

  saveAndRenderTodos();

  // ۱۴. Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

});

  // بستن پاپ‌آپ تنظیمات با کلیک روی فضای بیرونی
  const viewSettingsModal = document.getElementById('view-settings');
  if (viewSettingsModal) {
    viewSettingsModal.addEventListener('click', (e) => {
      if (e.target === viewSettingsModal) {
        viewSettingsModal.classList.remove('active');
        document.getElementById('view-dashboard')?.classList.add('active');
        document.getElementById('dock-home-btn')?.classList.add('active');
      }
    });
  }

  // سوئیچ مستقیم و تضمینی تب‌های تنظیمات
  function bindSettingsNavClick() {
    const navItems = document.querySelectorAll('.settings-sidebar-nav .nav-item-glass');
    const panes = document.querySelectorAll('.settings-tab-pane');
    const headerTitle = document.getElementById('settings-header-label');

    navItems.forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const tabKey = item.getAttribute('data-tab');
        if (!tabKey) return;

        // تغییر وضعیت فعال دکمه‌های سایدبار
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // مخفی‌سازی همه تب‌ها و نمایش تب انتخابی
        panes.forEach(pane => {
          pane.style.setProperty('display', 'none', 'important');
          pane.classList.remove('active');
        });

        const targetPane = document.getElementById('pane-' + tabKey);
        if (targetPane) {
          targetPane.style.setProperty('display', 'flex', 'important');
          targetPane.classList.add('active');
        }

        // تغییر عنوان پنجره
        if (headerTitle) {
          headerTitle.textContent = 'تنظیمات › ' + item.textContent.replace(/[^؀-ۿs]/g, '').trim();
        }
      };
    });
  }

  // اجرا پس از لود کامل صفحه
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSettingsNavClick);
  } else {
    bindSettingsNavClick();
  }


  // ========================================================
  // موتور جامع تنظیمات زنده تم، ماتی، رنگ و فونت
  // ========================================================

  // ۱. کنترل تم (دارک، لایت، خودکار) - عکس ۲
  function applyThemeMode(mode) {
    document.querySelectorAll('.theme-mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', mode);
    }
    localStorage.setItem('user_theme_mode', mode);
  }

  document.querySelectorAll('.theme-mode-btn').forEach(btn => {
    btn.onclick = () => applyThemeMode(btn.dataset.mode);
  });

  const savedThemeMode = localStorage.getItem('user_theme_mode') || 'auto';
  applyThemeMode(savedThemeMode);

  // ۲. کنترل ماتی زنده با تایید و انصراف - عکس ۳
  const sDash = document.getElementById('slider-dash-blur');
  const sPopup = document.getElementById('slider-popup-blur');
  const tDash = document.getElementById('val-dash-blur');
  const tPopup = document.getElementById('val-popup-blur');
  const btnBlurSave = document.getElementById('blur-save-btn');
  const btnBlurCancel = document.getElementById('blur-cancel-btn');

  let currentDashBlur = localStorage.getItem('val_d_blur') || '25';
  let currentPopupBlur = localStorage.getItem('val_p_blur') || '65';

  function setLiveBlur(dPct, pPct) {
    if (tDash) tDash.textContent = toFa(dPct) + '٪';
    if (tPopup) tPopup.textContent = toFa(pPct) + '٪';

    const dPx = (dPct * 0.6).toFixed(1) + 'px';
    const pPx = (pPct * 0.9).toFixed(1) + 'px';

    document.documentElement.style.setProperty('--dash-blur', dPx);
    document.documentElement.style.setProperty('--popup-blur', pPx);
  }

  if (sDash) {
    sDash.value = currentDashBlur;
    sDash.oninput = (e) => setLiveBlur(e.target.value, sPopup ? sPopup.value : currentPopupBlur);
  }
  if (sPopup) {
    sPopup.value = currentPopupBlur;
    sPopup.oninput = (e) => setLiveBlur(sDash ? sDash.value : currentDashBlur, e.target.value);
  }

  if (btnBlurSave) {
    btnBlurSave.onclick = () => {
      currentDashBlur = sDash.value;
      currentPopupBlur = sPopup.value;
      localStorage.setItem('val_d_blur', currentDashBlur);
      localStorage.setItem('val_p_blur', currentPopupBlur);
      setLiveBlur(currentDashBlur, currentPopupBlur);
      
    };
  }

  if (btnBlurCancel) {
    btnBlurCancel.onclick = () => {
      if (sDash) sDash.value = currentDashBlur;
      if (sPopup) sPopup.value = currentPopupBlur;
      setLiveBlur(currentDashBlur, currentPopupBlur);
    };
  }
  setLiveBlur(currentDashBlur, currentPopupBlur);

  // ۳. کنترل رنگ اصلی و تایید پالت RGB - عکس ۴
  function setDashboardAccent(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('dash_accent_color', color);

    document.querySelectorAll('.color-palette-circle').forEach(btn => {
      const match = btn.dataset.color.toLowerCase() === color.toLowerCase();
      btn.classList.toggle('active', match);
      btn.textContent = match ? '✓' : '';
    });
  }

  document.querySelectorAll('.color-palette-circle').forEach(circle => {
    circle.onclick = () => {
      setDashboardAccent(circle.dataset.color);
    };
  });

  const rgbColorInput = document.getElementById('rgb-color-picker');
  const rgbConfirmBtn = document.getElementById('rgb-confirm-btn');

  if (rgbConfirmBtn && rgbColorInput) {
    rgbConfirmBtn.onclick = () => {
      const chosenColor = rgbColorInput.value;
      setDashboardAccent(chosenColor);
      
    };
  }

  const initialAccent = localStorage.getItem('dash_accent_color') || '#2563eb';
  setDashboardAccent(initialAccent);
  if (rgbColorInput) rgbColorInput.value = initialAccent;

  // ۴. مدیریت فونت‌ها و آپلود فونت دلخواه - عکس ۵
  function applyActiveFont(fontName) {
    document.documentElement.style.setProperty('--app-font', "'" + fontName + "', system-ui, -apple-system, sans-serif");
    document.body.style.fontFamily = "'" + fontName + "', system-ui, -apple-system, sans-serif";
    localStorage.setItem('dash_active_font', fontName);

    document.querySelectorAll('.font-card-item:not(.font-card-upload)').forEach(card => {
      const isSelected = card.dataset.font === fontName;
      card.classList.toggle('active', isSelected);
      const sample = card.querySelector('.font-card-sample');
      if (sample) {
        sample.textContent = isSelected ? 'من اینطوریم ✓' : 'من اینطوریم';
      }
    });
  }

  document.querySelectorAll('.font-card-item:not(.font-card-upload)').forEach(card => {
    card.onclick = () => applyActiveFont(card.dataset.font);
  });

  const fontUploadInput = document.getElementById('custom-font-file');
  const fontUploadStatus = document.getElementById('upload-font-status');
  const fontUploadSample = document.getElementById('upload-font-sample');
  const uploadCard = document.getElementById('upload-font-card');

  if (fontUploadInput) {
    fontUploadInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const fontData = evt.target.result;
        const fontName = 'CustomUserFont';

        let fontStyleTag = document.getElementById('custom-user-font-tag');
        if (!fontStyleTag) {
          fontStyleTag = document.createElement('style');
          fontStyleTag.id = 'custom-user-font-tag';
          document.head.appendChild(fontStyleTag);
        }
        fontStyleTag.textContent = '@font-face { font-family: "' + fontName + '"; src: url(' + fontData + '); }';

        localStorage.setItem('custom_font_base64', fontData);
        applyActiveFont(fontName);

        if (uploadCard) uploadCard.classList.add('active');
        if (fontUploadSample) fontUploadSample.textContent = 'فونت شخصی ✓';
        if (fontUploadStatus) fontUploadStatus.textContent = file.name.slice(0, 14);
        
      };
      reader.readAsDataURL(file);
    };
  }

  const storedCustomFont = localStorage.getItem('custom_font_base64');
  if (storedCustomFont) {
    let fontStyleTag = document.createElement('style');
    fontStyleTag.id = 'custom-user-font-tag';
    fontStyleTag.textContent = '@font-face { font-family: "CustomUserFont"; src: url(' + storedCustomFont + '); }';
    document.head.appendChild(fontStyleTag);
  }

  const initialFont = localStorage.getItem('dash_active_font') || 'Vazirmatn';
  applyActiveFont(initialFont);


  // موتور مستقیم اعمال ماتی به کل عناصر داشبورد و پاپ‌آپ‌ها
  function injectDynamicBlurStyles(dashBlurPx, popupBlurPx) {
    // کنترل بلر خالص و شیشه کریستالی بدون هیچ‌گونه لایه سفید یا کدر
      // کنترل تفکیک‌شده بلر داشبورد (شامل مکان) و پاپ‌آپ‌ها (پیش‌بینی، اوقات شرعی، تایمر)
      let styleTag = document.getElementById('live-custom-blur-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'live-custom-blur-style';
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = `

        /* ۱. داشبورد: بار سرچ، میانبرها (حتی میانبرهای جدید یا حذفی) و کارت‌ها */
        .ios-glass-card,
        .weather-card,
        .clock-card,
        .calendar-card,
        .task-card,
        .search-bar-container,
        .search-box,
        .google-search-bar,
        .shortcuts-grid,
        .shortcut-item,
        .shortcut-btn,
        .shortcut-card,
        .add-shortcut-btn,
        .location-modal-box,
        #weather-city-btn,
        .location-chip {
          backdrop-filter: blur(${dPx}px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(${dPx}px) saturate(160%) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        [data-theme="dark"] .search-bar-container,
        [data-theme="dark"] .search-box,
        [data-theme="dark"] .google-search-bar,
        [data-theme="dark"] .shortcut-item,
        [data-theme="dark"] .shortcut-btn,
        [data-theme="dark"] .shortcut-card,
        [data-theme="dark"] .add-shortcut-btn {
          background: rgba(15, 23, 42, 0.20) !important;
        }
  

        /* ۲. پاپ‌آپ‌ها و منوهای کشویی پیش‌بینی، اوقات شرعی، تایمر */
        .forecast-drawer,
        #forecast-drawer,
        .forecast-drawer-content,
        .clock-drawer,
        #timer-drawer,
        #azan-drawer,
        .azan-drawer-content,
        .timer-drawer-content,
        .drawer-panel,
        .glass-blur-menu,
        .azan-city-dropdown,
        .settings-modal-card,
        #forecast-btn,
        #azan-btn,
        #timer-btn {
          backdrop-filter: blur(${popupPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(${popupPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, 0.10) !important;
        }
        [data-theme="dark"] .forecast-drawer,
        [data-theme="dark"] #forecast-drawer,
        [data-theme="dark"] .forecast-drawer-content,
        [data-theme="dark"] .clock-drawer,
        [data-theme="dark"] #timer-drawer,
        [data-theme="dark"] #azan-drawer,
        [data-theme="dark"] .azan-drawer-content,
        [data-theme="dark"] .timer-drawer-content,
        [data-theme="dark"] .drawer-panel {
          background: rgba(15, 23, 42, 0.25) !important;
        }
  
      `;
  }

  // متصل کردن اسلایدرهای صفحه
  const slD = document.getElementById('slider-dash-blur');
  const slP = document.getElementById('slider-popup-blur');
  const lblD = document.getElementById('val-dash-blur');
  const lblP = document.getElementById('val-popup-blur');
  const btnSave = document.getElementById('blur-save-btn');
  const btnCancel = document.getElementById('blur-cancel-btn');

  let persistentDash = localStorage.getItem('user_dash_blur_pct') || '25';
  let persistentPopup = localStorage.getItem('user_popup_blur_pct') || '65';

  function onSliderDrag() {
    const dVal = slD ? slD.value : persistentDash;
    const pVal = slP ? slP.value : persistentPopup;

    if (lblD) lblD.textContent = toFa(dVal) + '٪';
    if (lblP) lblP.textContent = toFa(pVal) + '٪';

    // اعمال آنی در همان لحظه کشیدن اسلایدر حتی روی خود کادر تنظیمات
    applyAbsoluteBlurEngine(dVal, pVal);
  }

  if (slD) {
    slD.value = persistentDash;
    slD.oninput = onSliderDrag;
  }
  if (slP) {
    slP.value = persistentPopup;
    slP.oninput = onSliderDrag;
  }

  // اعمال مقدار اولیه
  onSliderDrag();

  if (btnSave) {
    btnSave.onclick = () => {
      persistentDash = slD.value;
      persistentPopup = slP.value;
      localStorage.setItem('user_dash_blur_pct', persistentDash);
      localStorage.setItem('user_popup_blur_pct', persistentPopup);
      onSliderDrag();
      
    };
  }

  if (btnCancel) {
    btnCancel.onclick = () => {
      if (slD) slD.value = persistentDash;
      if (slP) slP.value = persistentPopup;
      onSliderDrag();
    };
  }


  


  // ========================================================
  // موتور پایدار ماتی زنده، درصد فارسی و بستن پاپ‌آپ
  // ========================================================
  (function initBulletproofBlur() {
    const sDash = document.getElementById('slider-dash-blur');
    const sPopup = document.getElementById('slider-popup-blur');
    const lDash = document.getElementById('val-dash-blur');
    const lPopup = document.getElementById('val-popup-blur');
    const btnSave = document.getElementById('blur-save-btn');
    const btnCancel = document.getElementById('blur-cancel-btn');
    const modalSettings = document.getElementById('view-settings');

    // تابع مستقل تبدیل عدد به فارسی بدون وابستگی
    function formatFaPercent(num) {
      const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return '٪' + String(num).replace(/\d/g, d => farsiDigits[d]);
    }

    let savedD = localStorage.getItem('blur_dash_val') || '25';
    let savedP = localStorage.getItem('blur_popup_val') || '65';

    function setLiveBlur(dVal, pVal) {
      const d = parseInt(dVal, 10);
      const p = parseInt(pVal, 10);

      // آپدیت متن درصد در همان لحظه حرکت اسلایدر
      if (lDash) lDash.textContent = formatFaPercent(d);
      if (lPopup) lPopup.textContent = formatFaPercent(p);

      const dPx = (d * 0.7).toFixed(1);
      const pPx = (p * 0.95).toFixed(1);

      // کنترل شفافیت و بلر بدون تداخل
      // کنترل شفافیت شیشه کریستالی (حفظ بافت شیشه بدون کدر شدن رنگ)
      const dAlpha = (0.05 + (d / 100 * 0.10)).toFixed(2);
      const pAlpha = (0.08 + (p / 100 * 0.12)).toFixed(2);

      // کنترل بلر خالص و شیشه کریستالی بدون هیچ‌گونه لایه سفید یا کدر
      let styleTag = document.getElementById('live-custom-blur-style');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'live-custom-blur-style';
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = `
        /* ۱. اعمال بلر بر تمامی کارت‌های اصلی داشبورد، آب‌وهوا، ساعت، تقویم و تسک‌ها */
        .ios-glass-card,
        .weather-card,
        .clock-card,
        .calendar-card,
        .task-card,
        .quick-actions-bar,
        .dock-container,
        .task-item-card,
        .stat-card {
          backdrop-filter: blur(${dPx}px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(${dPx}px) saturate(160%) !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }
        [data-theme="dark"] .ios-glass-card,
        [data-theme="dark"] .weather-card,
        [data-theme="dark"] .clock-card,
        [data-theme="dark"] .calendar-card,
        [data-theme="dark"] .task-card,
        [data-theme="dark"] .dock-container,
        [data-theme="dark"] .task-item-card {
          background: rgba(15, 23, 42, 0.15) !important;
        }

        /* ۲. اعمال بلر بر تمامی پاپ‌آپ‌ها، دراورها، ویرایش تسک و پنجره‌های تنظیمات */
        .glass-blur-menu,
        .forecast-drawer,
        .clock-drawer,
        .azan-city-dropdown,
        .month-year-picker-modal,
        .date-event-popup,
        .task-tool-popup,
        .task-modal-box,
        .task-edit-modal,
        .location-modal-box,
        .settings-modal-card,
        .modal-overlay .modal-card,
        .app-view.modal-overlay {
          backdrop-filter: blur(${popupPx}px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(${popupPx}px) saturate(180%) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        [data-theme="dark"] .glass-blur-menu,
        [data-theme="dark"] .forecast-drawer,
        [data-theme="dark"] .clock-drawer,
        [data-theme="dark"] .task-modal-box,
        [data-theme="dark"] .task-edit-modal,
        [data-theme="dark"] .settings-modal-card,
        [data-theme="dark"] .modal-overlay .modal-card {
          background: rgba(15, 23, 42, 0.22) !important;
        }
      `;
    }

    // متصل کردن رویداد مستقیم کشیدن اسلایدر (input)
    if (sDash) {
      sDash.value = savedD;
      sDash.addEventListener('input', () => {
        setLiveBlur(sDash.value, sPopup ? sPopup.value : savedP);
      });
    }

    if (sPopup) {
      sPopup.value = savedP;
      sPopup.addEventListener('input', () => {
        setLiveBlur(sDash ? sDash.value : savedD, sPopup.value);
      });
    }

    // اعمال مقدار ذخیره شده در شروع
    setLiveBlur(savedD, savedP);

    // دکمه تأیید ماتی: ذخیره دائمی و بستن پاپ‌آپ
    if (btnSave) {
      btnSave.onclick = (e) => {
        e.stopPropagation();
        savedD = sDash ? sDash.value : savedD;
        savedP = sPopup ? sPopup.value : savedP;
        localStorage.setItem('blur_dash_val', savedD);
        localStorage.setItem('blur_popup_val', savedP);
        setLiveBlur(savedD, savedP);

        if (modalSettings) modalSettings.classList.remove('active');
        document.getElementById('view-dashboard')?.classList.add('active');
        document.getElementById('dock-home-btn')?.classList.add('active');
      };
    }

    // دکمه انصراف: برگرداندن درصدها و ماتی به مقدار قبلی و بستن پاپ‌آپ
    if (btnCancel) {
      btnCancel.onclick = (e) => {
        e.stopPropagation();
        if (sDash) sDash.value = savedD;
        if (sPopup) sPopup.value = savedP;
        setLiveBlur(savedD, savedP);

        if (modalSettings) modalSettings.classList.remove('active');
        document.getElementById('view-dashboard')?.classList.add('active');
        document.getElementById('dock-home-btn')?.classList.add('active');
      };
    }
  })();


  // بستن قطعی پاپ‌آپ تنظیمات هنگام تایید و انصراف
  
  

  // اتصال مستقیم دکمه‌های تایید و انصراف ماتی
  (function initModalButtons() {
    const btnOk = document.getElementById('blur-save-btn');
    const btnCancel = document.getElementById('blur-cancel-btn');
    const sD = document.getElementById('slider-dash-blur');
    const sP = document.getElementById('slider-popup-blur');

    let initialD = localStorage.getItem('blur_dash_val') || (sD ? sD.value : '25');
    let initialP = localStorage.getItem('blur_popup_val') || (sP ? sP.value : '65');

    function closeSettings() {
      const modal = document.getElementById('view-settings');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
      const dash = document.getElementById('view-dashboard');
      if (dash) {
        dash.classList.add('active');
        dash.style.display = '';
      }
      const dock = document.getElementById('dock-home-btn');
      if (dock) dock.classList.add('active');
    }

    if (btnOk) {
      btnOk.onclick = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const curD = sD ? sD.value : initialD;
        const curP = sP ? sP.value : initialP;
        localStorage.setItem('blur_dash_val', curD);
        localStorage.setItem('blur_popup_val', curP);
        localStorage.setItem('cfg_dash_blur', curD);
        localStorage.setItem('cfg_popup_blur', curP);
        initialD = curD;
        initialP = curP;
        closeSettings();
      };
    }

    if (btnCancel) {
      btnCancel.onclick = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (sD) sD.value = initialD;
        if (sP) sP.value = initialP;
        if (typeof setLiveBlur === 'function') setLiveBlur(initialD, initialP);
        if (typeof applyBlurStyles === 'function') applyBlurStyles(initialD, initialP);
        if (typeof window.handleDashBlurLive === 'function') window.handleDashBlurLive(initialD);
        if (typeof window.handlePopupBlurLive === 'function') window.handlePopupBlurLive(initialP);
        closeSettings();
      };
    }
  })();
  

  // اتصال مستقیم دکمه‌های تایید و انصراف ماتی با بستن فوری
  (function initModalButtonsClean() {
    const btnOk = document.getElementById('blur-save-btn');
    const btnCancel = document.getElementById('blur-cancel-btn');
    const sD = document.getElementById('slider-dash-blur');
    const sP = document.getElementById('slider-popup-blur');

    let initialD = localStorage.getItem('blur_dash_val') || (sD ? sD.value : '25');
    let initialP = localStorage.getItem('blur_popup_val') || (sP ? sP.value : '65');

    function closeSettingsPopup() {
      // بستن کامل منوی تنظیمات
      const settingsView = document.getElementById('view-settings');
      if (settingsView) {
        settingsView.classList.remove('active');
        settingsView.style.display = 'none';
      }
      // بازگشت به نمای اصلی داشبورد
      const dashboardView = document.getElementById('view-dashboard');
      if (dashboardView) {
        dashboardView.classList.add('active');
        dashboardView.style.display = '';
      }
      const dockHome = document.getElementById('dock-home-btn');
      if (dockHome) dockHome.classList.add('active');
    }

    if (btnOk) {
      btnOk.onclick = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const curD = sD ? sD.value : initialD;
        const curP = sP ? sP.value : initialP;
        localStorage.setItem('blur_dash_val', curD);
        localStorage.setItem('blur_popup_val', curP);
        initialD = curD;
        initialP = curP;
        closeSettingsPopup();
      };
    }

    if (btnCancel) {
      btnCancel.onclick = function(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (sD) sD.value = initialD;
        if (sP) sP.value = initialP;
        if (typeof setLiveBlur === 'function') setLiveBlur(initialD, initialP);
        if (typeof applyBlurStyles === 'function') applyBlurStyles(initialD, initialP);
        if (typeof window.handleDashBlurLive === 'function') window.handleDashBlurLive(initialD);
        if (typeof window.handlePopupBlurLive === 'function') window.handlePopupBlurLive(initialP);
        closeSettingsPopup();
      };
    }
  })();


  // ========================================================
  // تفکیک لوکیشن اوقات شرعی و تقدم لوکیشن آب‌وهوا
  // ========================================================
  (function setupLocationIndependence() {
    // رویداد تغییر لوکیشن مستقل اوقات شرعی
    window.updateAzanOnlyCity = function(cityName) {
      if (!cityName) return;
      localStorage.setItem('azan_custom_city_override', cityName);
      if (typeof fetchAzanTimes === 'function') fetchAzanTimes(cityName);
      else if (typeof updateAzanTimes === 'function') updateAzanTimes(cityName);
      else if (typeof loadPrayerTimes === 'function') loadPrayerTimes(cityName);
    };

    // هماهنگی با تغییر لوکیشن آب‌وهوا (به عنوان لوکیشن اصلی)
    const baseSaveCity = window.saveCitySelection || window.applyCityChange;
    if (typeof baseSaveCity === 'function') {
      window.saveCitySelection = function(newCity) {
        baseSaveCity(newCity);
        localStorage.removeItem('azan_custom_city_override');
        if (typeof fetchAzanTimes === 'function') fetchAzanTimes(newCity);
        else if (typeof updateAzanTimes === 'function') updateAzanTimes(newCity);
        else if (typeof loadPrayerTimes === 'function') loadPrayerTimes(newCity);
      };
    }
  })();


  // تابع اختصاصی بستن پنجره تنظیمات
  function triggerCloseSettings() {
    // روش ۱: شبیه‌سازی کلیک روی دکمه ضربدر بستن
    const closeBtn = document.querySelector('.settings-modal-close, #close-settings-btn, .modal-close-btn, [data-close-modal]');
    if (closeBtn) {
      closeBtn.click();
      return;
    }
    // روش ۲: حذف کلاس اکتیو از مودال تنظیمات
    const sModal = document.querySelector('.settings-modal-card, #settings-modal, #view-settings, .settings-modal-overlay');
    if (sModal) {
      sModal.classList.remove('active');
      sModal.style.display = 'none';
    }
    const dView = document.getElementById('view-dashboard');
    if (dView) {
      dView.classList.add('active');
      dView.style.display = '';
    }
  }

  // رویداد تایید ماتی
  document.getElementById('blur-save-btn')?.addEventListener('click', function(e) {
    if (e) e.stopPropagation();
    triggerCloseSettings();
  }, true);

  // رویداد انصراف ماتی
  document.getElementById('blur-cancel-btn')?.addEventListener('click', function(e) {
    if (e) e.stopPropagation();
    triggerCloseSettings();
  }, true);
  