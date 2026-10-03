document.addEventListener('DOMContentLoaded', () => {

  const toFa = n => String(n).replace(/\d/g, d => ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'][d]);
  const toEn = n => String(n).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

  // ۱. کنترل ناوبری داخلی SPA (بدون اسکرول و بدون تب جدید)
  const viewDashboard = document.getElementById('view-dashboard');
  const viewSettings = document.getElementById('view-settings');
  const viewTasks = document.getElementById('view-tasks');

  const dockHomeBtn = document.getElementById('dock-home-btn');
  const dockSettingsBtn = document.getElementById('dock-settings-btn');
  const dockTasksBtn = document.getElementById('dock-tasks-btn');
  const settingsCloseBtn = document.getElementById('settings-close-btn');

  function switchView(activeView, activeBtn) {
    [viewDashboard, viewSettings, viewTasks].forEach(v => v.classList.remove('active'));
    activeView.classList.add('active');
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
  }

  if (dockHomeBtn) {
    dockHomeBtn.onclick = () => switchView(viewDashboard, dockHomeBtn);
  }

  if (dockSettingsBtn) {
    dockSettingsBtn.onclick = () => switchView(viewSettings, dockSettingsBtn);
  }
  if (settingsCloseBtn) {
    settingsCloseBtn.onclick = () => switchView(viewDashboard, dockHomeBtn);
  }

  if (dockTasksBtn) {
    dockTasksBtn.onclick = () => {
      switchView(viewTasks, dockTasksBtn);
      document.getElementById('full-tab-tasks')?.click();
    };
  }

  // ۲. مدیریت پس‌زمینه و وضعیت بلر در صفحه تنظیمات
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
          } catch (err) {
            alert('حجم عکس بالاست!');
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
    '1405-7-9': { title: 'روز آتش‌نشانی و ایمنی (شمسی) / روز جهانی ترجمه (میلادی)', gDate: '1 Oct 2026', hDate: '۱۹ ربیع‌‌الثانی ۱۴۴۸' },
    '1405-7-10': { title: 'روز بزرگداشت مولوی (شمسی) / روز جهانی سالمندان (میلادی)', gDate: '2 Oct 2026', hDate: '۲۰ ربیع‌الثانی ۱۴۴۸' },
    '1405-7-12': { title: 'روز همبستگی با کودکان فلسطینی (شمسی) / روز جهانی حیوانات (میلادی)', gDate: '4 Oct 2026', hDate: '۲۲ ربیع‌الثانی ۱۴۴۸' },
    '1405-7-13': { title: 'روز نیروی انتظامی (شمسی) 🍮 روز رول دارچینی (میلادی)', gDate: '5 Oct 2026', hDate: '۲۳ ربیع‌الثانی ۱۴۴۸' },
    '1405-7-14': { title: 'روز دامپزشکی (شمسی) / روز جهانی معلمان (میلادی)', gDate: '6 Oct 2026', hDate: '۲۴ ربیع‌الثانی ۱۴۴۸' },
    '1405-7-16': { title: 'روز جهانی کودک (بین‌المللی) / ولادت امام حسن عسکری (ع) (قمری)', gDate: '8 Oct 2026', hDate: '۲۶ ربیع‌الثانی ۱۴۴۸' },
    '1405-7-20': { title: 'روز بزرگداشت حافظ (شمسی) / روز جهانی دختر (میلادی)', gDate: '12 Oct 2026', hDate: '۳۰ ربیع‌الثانی ۱۴۴۸' },
    '1405-7-23': { title: 'روز جهانی استاندارد (میلادی) / روز نابینایان (عصای سفید)', gDate: '15 Oct 2026', hDate: '۳ جمادی‌الاول ۱۴۴۸' }
  };

  let currentYear = 1405;
  let currentMonthIndex = 6;

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
      const emptySpan = document.createElement('span');
      calDates.appendChild(emptySpan);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const span = document.createElement('span');
      span.textContent = toFa(i);
      const dayOfWeek = (i + startOffset - 1) % 7;
      if (dayOfWeek === 6) span.className = 'fri holiday';
      if (year === 1405 && monthIndex === 6 && i === 9) span.className = 'today-circle';

      const eventKey = `${year}-${monthIndex + 1}-${i}`;
      if (specialEventsData[eventKey]) {
        span.classList.add('event-green-dot');
      }

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

  if (eventPopupClose) {
    eventPopupClose.onclick = (e) => {
      e.stopPropagation();
      dateEventPopup.style.display = 'none';
    };
  }

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
      if (selectedEl) {
        pickerYearsList.scrollTop = selectedEl.offsetTop - pickerYearsList.offsetTop - 35;
      }
    }, 50);
  }

  if (calMonthHeaderBtn && monthYearPicker) {
    calMonthHeaderBtn.onclick = (e) => {
      e.stopPropagation();
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
    };
  }
  renderCalendar(currentYear, currentMonthIndex);

  // ۵. ساعت زنده
  const persianDays = ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
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
  if (gAddEventBtn) {
    gAddEventBtn.onclick = () => window.open('https://calendar.google.com/calendar/r/eventedit', '_blank');
  }

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
      document.getElementById('res-ghamari-val').textContent = `۱۷ ربیع‌الثانی ۱۴۴۸`;
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

  // ۸. آب‌وهوا
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

  const cityDatabase = {
    'تهران': { lat: 35.6892, lon: 51.3890 },
    'مشهد': { lat: 36.2972, lon: 59.6067 },
    'اصفهان': { lat: 32.6546, lon: 51.6680 },
    'شیراز': { lat: 29.5918, lon: 52.5837 },
    'تبریز': { lat: 38.0800, lon: 46.2919 }
  };

  let activeCoords = JSON.parse(localStorage.getItem('weather_coords')) || { lat: 35.6892, lon: 51.3890, name: 'تهران' };

  function renderWeatherAnimatedIcon(code, isDay) {
    if (code === 0) return `<div class="weather-dynamic-art sunny"><div class="art-sun"></div></div>`;
    if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) {
      return `<div class="weather-dynamic-art rainy"><div class="art-cloud"></div><div class="art-rain-drop d1"></div><div class="art-rain-drop d2"></div><div class="art-rain-drop d3"></div></div>`;
    }
    return `<div class="weather-dynamic-art cloudy"><div class="art-cloud"></div></div>`;
  }

  function getWeatherPhrase(code, isDay) {
    if (code === 0) return isDay ? 'آفتابی و دلنشین ☀' : 'شب صاف و مهتابی 🌙';
    if ([1, 2].includes(code)) return 'کمی تا نیمه‌ابری 🌤️';
    if (code === 3) return 'تمام ابری 🧡';
    if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) return 'بارانی و با طراوت 🌧';
    if ([71, 73, 75, 85].includes(code)) return 'برفی و زمستانی ❄️';
    return 'معتدل و آرام ⛅';
  }

  async function fetchRealWeather(lat, lon, cityName) {
    try {
      cityLabel.textContent = cityName;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      const cur = data.current_weather;
      const daily = data.daily;
      const isDay = cur.is_day === 1;

      weatherTemp.textContent = `${toFa(Math.round(cur.temperature))}°`;
      if (weatherIconContainer) weatherIconContainer.innerHTML = renderWeatherAnimatedIcon(cur.weathercode, isDay);
      weatherPhrase.textContent = getWeatherPhrase(cur.weathercode, isDay);

      const maxT = Math.round(daily.temperature_2m_max[0]);
      const minT = Math.round(daily.temperature_2m_min[0]);
      weatherRange.textContent = `${toFa(maxT)}° حداکثر . ${toFa(minT)}° حداقل`;

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
    } catch (e) {
      weatherPhrase.textContent = 'خطا در اتصال به سرور هواشناسی';
    }
  }
  fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);

  if (forecastToggleBtn && forecastDrawer) {
    forecastToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      forecastDrawer.classList.toggle('active');
    });
  }

  if (citySelectBtn) citySelectBtn.onclick = () => cityModal.classList.add('active');
  if (cityCancelBtn) cityCancelBtn.onclick = () => cityModal.classList.remove('active');

  // ۹. اوقات شرعی
  const azanToggleBtn = document.getElementById('azan-toggle-btn');
  const azanDrawer = document.getElementById('azan-drawer');
  const azanCurrentCity = document.getElementById('azan-current-city');

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
  fetchAzanTimes(activeCoords.lat, activeCoords.lon, activeCoords.name);

  if (azanToggleBtn && azanDrawer) {
    azanToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      azanDrawer.classList.toggle('active');
      document.getElementById('timer-drawer')?.classList.remove('active');
    });
  }

  // ۱۰. تایمر
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
      timerDrawer.classList.toggle('active');
      document.getElementById('azan-drawer')?.classList.remove('active');
    });
  }

  [timerHr, timerMin, timerSec].forEach(input => {
    if (!input) return;
    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('input', (e) => {
      let val = toEn(e.target.value).replace(/\D/g, '');
      if (val.length > 2) val = val.slice(-2);
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
            alert('⏰ زمان تایمر به پایان رسید!');
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
    { title: 'دم‌دستی', url: 'https://dastyar.io' },
    { title: 'تلفنچی', url: 'https://telephonchi.com' },
    { title: 'X', url: 'https://x.com' },
    { title: 'پینترست', url: 'https://www.pinterest.com' },
    { title: 'یوتیوب', url: 'https://www.youtube.com' },
    { title: 'App', url: 'https://cafebazaar.ir' },
    { title: 'آپ‌تی‌وی', url: 'https://uptvs.com' },
    { title: 'دیجی‌مووی', url: 'https://digimovie.top' },
    { title: 'دیجی‌موویز ۲', url: 'https://digimovie.top' },
    { title: 'دیجی‌کالا', url: 'https://www.digikala.com' },
    { title: 'دیوار', url: 'https://divar.ir' },
    { title: 'واتساپ', url: 'https://web.whatsapp.com' }
  ];

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
        document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
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

  // ۱۳. سیستم تسک و یادداشت ارتقایافته (عکس ۱، ۲، ۳ و ۴)
  const tabTasks = document.getElementById('tab-tasks');
  const tabNotes = document.getElementById('tab-notes');
  const emptyState = document.getElementById('empty-state');
  const todoList = document.getElementById('todo-list');
  const taskPromoBanner = document.getElementById('task-promo-banner');
  const bannerCloseBtn = document.getElementById('banner-close-btn');

  const taskInputTrigger = document.getElementById('task-input-trigger');
  const taskComposerPopup = document.getElementById('task-composer-popup');
  const composerTitle = document.getElementById('composer-title');
  const composerDesc = document.getElementById('composer-desc');
  const composerSubmitBtn = document.getElementById('composer-submit-btn');
  const toggleDoneBtn = document.getElementById('toggle-done-tasks-btn');

  let todos = JSON.parse(localStorage.getItem('my_todos')) || [];
  let isBannerDismissed = localStorage.getItem('task_banner_dismissed') === 'true';
  let hideDoneTasks = false;

  if (bannerCloseBtn) {
    bannerCloseBtn.onclick = (e) => {
      e.stopPropagation();
      taskPromoBanner.style.display = 'none';
      localStorage.setItem('task_banner_dismissed', 'true');
    };
  }

  if (toggleDoneBtn) {
    toggleDoneBtn.onclick = () => {
      hideDoneTasks = !hideDoneTasks;
      saveAndRenderTodos();
    };
  }

  // باز کردن پاپ‌آپ ایجاد تسک با کلیک روی فیلد نوشتن
  if (taskInputTrigger && taskComposerPopup) {
    taskInputTrigger.onclick = (e) => {
      e.stopPropagation();
      taskComposerPopup.style.display = 'flex';
      composerTitle.focus();
    };
    window.addEventListener('click', (e) => {
      if (!e.target.closest('#task-composer-popup') && !e.target.closest('#task-input-trigger')) {
        taskComposerPopup.style.display = 'none';
      }
    });
  }

  function saveAndRenderTodos() {
    localStorage.setItem('my_todos', JSON.stringify(todos));
    if (!todoList || !emptyState) return;

    // اگر بنر بسته نشده بود و تسکی وجود نداشت بنر نمایش داده شود
    if (taskPromoBanner) {
      if (isBannerDismissed || todos.length > 0) {
        taskPromoBanner.style.display = 'none';
      } else {
        taskPromoBanner.style.display = 'flex';
      }
    }

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
      li.className = `task-item-card ${item.done ? 'done' : ''}`;
      
      li.innerHTML = `
        <div class="task-card-left-actions">
          <button class="task-act-btn tag-badge" title="برچسب">🏷️</button>
          <button class="task-act-btn edit-btn" title="ویرایش">✏️</button>
          <button class="task-act-btn delete-btn" title="حذف">🗑️</button>
        </div>
        <div class="task-card-right">
          <div class="task-text-stack">
            <span class="task-item-title">${item.title}</span>
            ${item.desc ? `<span class="task-item-desc">${item.desc}</span>` : ''}
          </div>
          <div class="task-checkbox-custom" title="تغییر وضعیت">
            ${item.done ? '✓' : ''}
          </div>
        </div>
      `;

      // تغییر وضعیت تیک تسک (عکس ۴)
      const chk = li.querySelector('.task-checkbox-custom');
      chk.onclick = (e) => {
        e.stopPropagation();
        todos[index].done = !todos[index].done;
        saveAndRenderTodos();
      };

      // حذف تسک
      const delBtn = li.querySelector('.delete-btn');
      delBtn.onclick = (e) => {
        e.stopPropagation();
        todos.splice(index, 1);
        saveAndRenderTodos();
      };

      // ویرایش تسک
      const editBtn = li.querySelector('.edit-btn');
      editBtn.onclick = (e) => {
        e.stopPropagation();
        const newTitle = prompt('عنوان جدید تسک:', item.title);
        if (newTitle !== null && newTitle.trim() !== '') {
          todos[index].title = newTitle.trim();
          saveAndRenderTodos();
        }
      };

      todoList.appendChild(li);
    });
  }

  // ثبت تسک جدید از طریق پاپ‌آپ (عکس ۲)
  if (composerSubmitBtn && composerTitle) {
    const handleCreateTask = () => {
      const t = composerTitle.value.trim();
      const d = composerDesc.value.trim();
      if (!t) return;
      todos.push({ title: t, desc: d, done: false });
      composerTitle.value = '';
      composerDesc.value = '';
      taskComposerPopup.style.display = 'none';
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