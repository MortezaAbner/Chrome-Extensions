const fs = require('fs');

// ۱. به‌روزرسانی newtab.html
if (fs.existsSync('./newtab.html')) {
  let html = fs.readFileSync('./newtab.html', 'utf8');

  // دکمه برو به امروز
  if (!html.includes('id="picker-today-btn"')) {
    html = html.replace(
      '<button class="picker-confirm-btn" id="picker-confirm-btn">نمایش مهر ۱۴۰۵</button>',
      '<button class="picker-confirm-btn" id="picker-confirm-btn">نمایش مهر ۱۴۰۵</button>\n              <button class="picker-today-btn" id="picker-today-btn">برو به امروز 📍</button>'
    );
  }

  // تغییر متن جستجوی اوقات شرعی به شهرهای جهان
  html = html.replace('placeholder="جستجوی شهر یا کشور..."', 'placeholder="جستجوی شهر یا کشور در جهان..."');

  // پاپ‌آپ شیشه‌ای هشدار تایمر
  if (!html.includes('id="timer-alarm-modal"')) {
    const alarmModalHtml = `
  <!-- مودال شیشه‌ای پایان زمان تایمر -->
  <div id="timer-alarm-modal" class="modal-overlay">
    <div class="modal-content ios-glass-card location-modal-box glass-blur-menu" style="text-align: center; gap: 18px;">
      <div class="modal-header-title">
        <div style="font-size: 3rem; margin-bottom: 6px;">⏰</div>
        <h3 style="justify-content: center;">زمان تایمر به پایان رسید!</h3>
        <p>مدت زمان مشخص‌شده شما با موفقیت سپری شد.</p>
      </div>
      <div class="modal-buttons">
        <button id="timer-alarm-dismiss-btn" class="modal-btn save">تأیید و بستن ✓</button>
      </div>
    </div>
  </div>
`;
    html = html.replace('<!-- مودال افزودن شورتکات -->', `${alarmModalHtml}\n  <!-- مودال افزودن شورتکات -->`);
  }

  fs.writeFileSync('./newtab.html', html, 'utf8');
  console.log('✅ newtab.html با تمام بخش‌های جدید به‌روز شد.');
}

// ۲. به‌روزرسانی style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  // مات‌تر شدن پس‌زمینه شیشه‌ای کپسول‌ها
  css = css.replace(/--pill-bg:\s*rgba\(255,\s*255,\s*255,\s*0\.75\);/g, '--pill-bg: rgba(255, 255, 255, 0.25);');
  css = css.replace(/--pill-bg:\s*rgba\(255,\s*255,\s*255,\s*0\.18\);/g, '--pill-bg: rgba(255, 255, 255, 0.12);');

  // مات‌تر و خواناتر شدن دراورها و مودال‌ها
  css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.9\)\s*!important;/g, 'rgba(255, 255, 255, 0.75) !important;');
  css = css.replace(/blur\(28px\)/g, 'blur(55px)');

  if (!css.includes('.picker-today-btn')) {
    const extraCss = `
.picker-today-btn {
  background: rgba(255, 255, 255, 0.4); color: var(--text-main); border: 1px solid var(--glass-border); border-radius: 12px;
  padding: 6px 0; font-size: 0.82rem; font-weight: 800; cursor: pointer; margin-top: 5px; width: 100%; transition: background 0.15s;
}
.picker-today-btn:hover {
  background: rgba(37, 99, 235, 0.18);
  color: #2563eb;
}
.weather-dynamic-art.night-clear .art-moon {
  width: 30px; height: 30px; border-radius: 50%; box-shadow: 5px 5px 0 0 #fde047;
  position: absolute; top: 4px; left: 6px; transform: rotate(-25deg);
}
`;
    css += extraCss;
  }

  fs.writeFileSync('./style.css', css, 'utf8');
  console.log('✅ style.css با استایل‌های مات و شیشه‌ای جدید به‌روز شد.');
}

// ۳. به‌روزرسانی منطق‌های کامل script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // الف) افزودن سیستم صوتی آلارم و بستن سراسری پنجره‌ها
  if (!js.includes('playAlarmBeep')) {
    const audioAndCloseSystem = `
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
`;
    js = js.replace("const toEn = n => String(n).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));", `const toEn = n => String(n).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));\n${audioAndCloseSystem}`);
  }

  // ب) منطق دکمه برو به امروز در تقویم
  if (!js.includes('pickerTodayBtn')) {
    const todayBtnLogic = `
  const pickerTodayBtn = document.getElementById('picker-today-btn');
  if (pickerTodayBtn) {
    pickerTodayBtn.onclick = (e) => {
      e.stopPropagation();
      currentYear = 1405;
      currentMonthIndex = 6;
      renderCalendar(currentYear, currentMonthIndex);
      monthYearPicker.classList.remove('active');
    };
  }
`;
    js = js.replace('monthYearPicker.classList.remove(\'active\');', `monthYearPicker.classList.remove('active');\n${todayBtnLogic}`);
  }

  // ج) تقویم هوشمند مناسبت‌ها با تفکیک روزهای شاخص (دایره سبز)
  if (!js.includes('major: true')) {
    const fullEventsData = `
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
`;
    js = js.replace(/const specialEventsData = \{[\s\S]*?\};/, fullEventsData);
    js = js.replace('if (specialEventsData[eventKey]) span.classList.add(\'event-green-dot\');', 'if (specialEventsData[eventKey] && specialEventsData[eventKey].major) span.classList.add(\'event-green-dot\');');
  }

  // د) پاپ‌آپ و آلارم پایان تایمر
  if (!js.includes('timerAlarmModal')) {
    const timerAlarmLogic = `
  const timerAlarmModal = document.getElementById('timer-alarm-modal');
  const timerAlarmDismissBtn = document.getElementById('timer-alarm-dismiss-btn');
  if (timerAlarmDismissBtn && timerAlarmModal) {
    timerAlarmDismissBtn.onclick = () => {
      stopAlarmSound();
      timerAlarmModal.classList.remove('active');
    };
  }
`;
    js = js.replace("alert('⏰ زمان تایمر به پایان رسید!');", "startAlarmSound();\n            if (timerAlarmModal) timerAlarmModal.classList.add('active');");
    js = js.replace('saveAndRenderTodos();', `saveAndRenderTodos();\n${timerAlarmLogic}`);
  }

  // ه) تفکیک تغییر مکان اوقات شرعی از آب‌وهوا
  if (js.includes('fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);') && js.includes('azanCityList.appendChild(li);')) {
    js = js.replace(
      'activeCoords = { lat: c.lat, lon: c.lon, name: c.name };\n        localStorage.setItem(\'weather_coords\', JSON.stringify(activeCoords));\n        fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);',
      'fetchAzanTimes(c.lat, c.lon, c.name);'
    );
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ script.js با تمام قابلیت‌های آلارم تایمر، تقویم و اوقات شرعی به‌روز شد.');
}