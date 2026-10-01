document.addEventListener('DOMContentLoaded', () => {

  const toFa = n => String(n).replace(/\d/g, d => ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'][d]);

  // ۱. پس‌زمینه کاربر
  const bgOverlay = document.getElementById('custom-bg-overlay');
  const bgSettingsBtn = document.getElementById('bg-settings-btn');
  const bgDropdown = document.getElementById('bg-dropdown-menu');
  const bgFileInput = document.getElementById('bg-file-input');
  const toggleBlurBtn = document.getElementById('toggle-blur-btn');
  const blurStatusText = document.getElementById('blur-status-text');
  const resetBgBtn = document.getElementById('reset-bg-btn');

  function applyBackgroundConfig() {
    const savedBg = localStorage.getItem('custom_bg');
    const isBlurred = localStorage.getItem('bg_blur') !== 'false';
    if (savedBg) {
      bgOverlay.style.backgroundImage = `url(${savedBg})`;
      bgOverlay.className = `bg-overlay ${isBlurred ? 'blurred' : 'clear'}`;
      if (blurStatusText) blurStatusText.textContent = isBlurred ? 'مات' : 'شفاف';
    } else {
      bgOverlay.style.backgroundImage = 'none';
      bgOverlay.className = 'bg-overlay';
    }
  }

  if (bgSettingsBtn && bgDropdown) {
    bgSettingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      bgDropdown.classList.toggle('active');
    });
    window.addEventListener('click', () => {
      bgDropdown.classList.remove('active');
      document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
      const forecastDrawer = document.getElementById('forecast-drawer');
      if (forecastDrawer) forecastDrawer.classList.remove('active');
    });
  }

  if (bgFileInput) {
    bgFileInput.addEventListener('change', (e) => {
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

  if (toggleBlurBtn) {
    toggleBlurBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = localStorage.getItem('bg_blur') !== 'false';
      localStorage.setItem('bg_blur', (!current).toString());
      applyBackgroundConfig();
    });
  }

  if (resetBgBtn) {
    resetBgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      localStorage.removeItem('custom_bg');
      applyBackgroundConfig();
      if (bgDropdown) bgDropdown.classList.remove('active');
    });
  }
  applyBackgroundConfig();

  // ۲. تم شب و روز
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
  applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  // ۳. تقویم شمسی
  function renderRealCalendar() {
    const datesGrid = document.getElementById('cal-dates');
    if (!datesGrid) return;
    datesGrid.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
      const span = document.createElement('span');
      span.textContent = toFa(i);
      const dayOfWeek = (i + 4) % 7;
      if (dayOfWeek === 6) span.className = 'fri holiday';
      if (i === 9) span.className = 'today-circle';
      if ([10, 12, 13, 14, 21].includes(i)) span.classList.add('dot');
      datesGrid.appendChild(span);
    }
  }
  renderRealCalendar();

  // ۴. ساعت و تاریخ
  function updateLiveClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const clockElem = document.getElementById('clock');
    if (clockElem) clockElem.textContent = `${toFa(String(hours).padStart(2, '0'))}:${toFa(minutes)}`;

    const shamsiElem = document.getElementById('shamsi-date');
    if (shamsiElem) shamsiElem.textContent = 'پنج‌شنبه، ۹ مهر';

    const secElem = document.getElementById('date-secondary');
    if (secElem) secElem.textContent = '2026/Oct/1 | ۱۹ ربیع‌الثانی ۱۴۴۸';
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // ۵. آب‌وهوای زنده و پیش‌بینی (Open-Meteo API)
  const cityLabel = document.getElementById('current-city-label');
  const weatherTemp = document.getElementById('weather-temp');
  const weatherIcon = document.getElementById('weather-icon');
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

  const knownCities = {
    'تهران': { lat: 35.6892, lon: 51.3890 },
    'مشهد': { lat: 36.2972, lon: 59.6067 },
    'اصفهان': { lat: 32.6546, lon: 51.6680 },
    'شیراز': { lat: 29.5918, lon: 52.5837 },
    'تبریز': { lat: 38.0800, lon: 46.2919 },
    'کرج': { lat: 35.8327, lon: 50.9915 }
  };

  let activeCoords = JSON.parse(localStorage.getItem('weather_coords')) || { lat: 35.6892, lon: 51.3890, name: 'تهران' };

  function getWeatherIconAndDesc(code, isDay) {
    if (code === 0) return { icon: isDay ? '☀️' : '🌙', desc: isDay ? 'آفتابی و دلنشین' : 'شب صاف و مهتابی' };
    if ([1, 2].includes(code)) return { icon: isDay ? '🌤️' : '☁️', desc: 'کمی تا نیمه‌‌ابری' };
    if (code === 3) return { icon: '☁️', desc: 'تمام ابری' };
    if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code)) return { icon: '🌧', desc: 'بارانی و با طراوت' };
    if ([71, 73, 75, 85].includes(code)) return { icon: '❄️', desc: 'برفی و زمستانی' };
    if ([95, 96, 99].includes(code)) return { icon: '⛈️', desc: 'رعد و برق' };
    return { icon: '⛅', desc: 'هوای معتدل' };
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

      const condition = getWeatherIconAndDesc(cur.weathercode, isDay);
      weatherTemp.textContent = `${toFa(Math.round(cur.temperature))}°`;
      weatherIcon.textContent = condition.icon;
      weatherPhrase.textContent = `${condition.desc} 🧡`;

      const maxT = Math.round(daily.temperature_2m_max[0]);
      const minT = Math.round(daily.temperature_2m_min[0]);
      weatherRange.textContent = `${toFa(maxT)}° حداکثر . ${toFa(minT)}° حداقل`;

      forecastGrid.innerHTML = '';
      const dayNames = ['امروز', 'فردا', 'پس‌فردا', '۴ روز بعد', '۵ روز بعد'];
      for (let i = 0; i < 5; i++) {
        const dCode = daily.weathercode[i];
        const dIcon = getWeatherIconAndDesc(dCode, true).icon;
        const dMax = Math.round(daily.temperature_2m_max[i]);
        const dMin = Math.round(daily.temperature_2m_min[i]);

        const box = document.createElement('div');
        box.className = 'forecast-day-box';
        box.innerHTML = `
          <span class="forecast-day-name">${dayNames[i]}</span>
          <span class="forecast-day-icon">${dIcon}</span>
          <span class="forecast-day-max">${toFa(dMax)}°</span>
          <span class="forecast-day-min">${toFa(dMin)}°</span>
        `;
        forecastGrid.appendChild(box);
      }
    } catch (e) {
      weatherPhrase.textContent = 'خطا در ارتباط با سرور هواشناسی';
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

  async function resolveByIp() {
    let resolved = false;
    try {
      const r1 = await fetch('https://ipwho.is/');
      const d1 = await r1.json();
      if (d1.success !== false && d1.latitude && d1.longitude) {
        activeCoords = { lat: d1.latitude, lon: d1.longitude, name: d1.city || 'موقعیت شما' };
        resolved = true;
      }
    } catch (e) {}

    if (!resolved) {
      try {
        const r2 = await fetch('https://freeipapi.com/api/json');
        const d2 = await r2.json();
        if (d2.latitude && d2.longitude) {
          activeCoords = { lat: d2.latitude, lon: d2.longitude, name: d2.cityName || 'موقعیت شما' };
          resolved = true;
        }
      } catch (e) {}
    }

    if (!resolved) {
      try {
        const r3 = await fetch('https://ipapi.co/json/');
        const d3 = await r3.json();
        if (d3.latitude && d3.longitude) {
          activeCoords = { lat: d3.latitude, lon: d3.longitude, name: d3.city || 'موقعیت شما' };
          resolved = true;
        }
      } catch (e) {}
    }

    if (resolved) {
      localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
      fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);
      cityModal.classList.remove('active');
    } else {
      alert('سرویس‌های مکان‌یابی آنلاین در دسترس نیستند. لطفاً نام شهر را دستی وارد کنید.');
    }
  }

  if (autoGpsBtn) {
    autoGpsBtn.onclick = () => {
      const originalText = autoGpsBtn.innerHTML;
      autoGpsBtn.innerHTML = '<span style="font-size:0.8rem;">در حال دریافت خودکار موقعیت...</span>';

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            activeCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude, name: 'موقعیت شما' };
            localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
            fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);
            cityModal.classList.remove('active');
            autoGpsBtn.innerHTML = originalText;
          },
          async () => {
            await resolveByIp();
            autoGpsBtn.innerHTML = originalText;
          },
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
        );
      } else {
        resolveByIp().then(() => { autoGpsBtn.innerHTML = originalText; });
      }
    };
  }

  if (autoIpBtn) {
    autoIpBtn.onclick = async () => {
      const originalText = autoIpBtn.innerHTML;
      autoIpBtn.innerHTML = '<span style="font-size:0.8rem;">در حال شناسایی شهر با آی‌پی...</span>';
      await resolveByIp();
      autoIpBtn.innerHTML = originalText;
    };
  }

  if (citySaveBtn) {
    citySaveBtn.onclick = () => {
      const city = manualCityInput.value.trim();
      if (!city) return;
      if (knownCities[city]) {
        activeCoords = { lat: knownCities[city].lat, lon: knownCities[city].lon, name: city };
        localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
        fetchRealWeather(activeCoords.lat, activeCoords.lon, city);
        cityModal.classList.remove('active');
      } else {
        citySaveBtn.textContent = 'در حال جستجو...';
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
          .then(r => r.json())
          .then(d => {
            if (d.results && d.results.length > 0) {
              const res = d.results[0];
              activeCoords = { lat: res.latitude, lon: res.longitude, name: city };
              localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
              fetchRealWeather(activeCoords.lat, activeCoords.lon, city);
              cityModal.classList.remove('active');
            } else {
              alert('شهر مورد نظر پیدا نشد!');
            }
          })
          .catch(() => alert('خطا در جستجوی شهر'))
          .finally(() => citySaveBtn.textContent = 'تأیید و ذخیره');
      }
    };
  }

  // ۶. سرچ‌بار گوگل / ذره‌بین و لنز و ویس
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

  if (lensBtn) {
    lensBtn.onclick = (e) => { e.preventDefault(); window.open('https://lens.google.com/', '_blank'); };
  }

  if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'fa-IR';
    voiceBtn.onclick = (e) => {
      e.preventDefault();
      voiceBtn.textContent = '🔴';
      rec.start();
    };
    rec.onresult = (ev) => {
      searchInput.value = ev.results[0][0].transcript;
      voiceBtn.textContent = '🎙️';
      searchForm.submit();
    };
    rec.onend = () => { voiceBtn.textContent = '🎙️️'; };
  }

  // ۷. میانبرهای ۶ ستونه وسط
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

  let shortcuts = JSON.parse(localStorage.getItem('my_shortcuts'));
  if (!shortcuts || !Array.isArray(shortcuts) || shortcuts.length === 0) shortcuts = defaultShortcuts;

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

    document.querySelectorAll('.menu-item.open-tab').forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); window.open(b.dataset.url, '_blank'); };
    });

    document.querySelectorAll('.menu-item.copy-link').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(b.dataset.url);
        alert('لینک کپی شد!');
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

  // ۸. بخش تسک و یادداشت
  const tabTasks = document.getElementById('tab-tasks');
  const tabNotes = document.getElementById('tab-notes');
  const emptyState = document.getElementById('empty-state');
  const todoList = document.getElementById('todo-list');
  const todoInput = document.getElementById('new-todo');

  if (tabTasks && tabNotes && todoInput) {
    tabTasks.onclick = () => {
      tabTasks.classList.add('active');
      tabNotes.classList.remove('active');
      todoInput.placeholder = 'نوشتن تسک جدید';
    };
    tabNotes.onclick = () => {
      tabNotes.classList.add('active');
      tabTasks.classList.remove('active');
      todoInput.placeholder = 'نوشتن یادداشت جدید';
    };
  }

  let todos = JSON.parse(localStorage.getItem('my_todos') || '[]');

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
      const li = document.createElement('li');
      li.className = `todo-item ${item.done ? 'done' : ''}`;
      li.innerHTML = `<span>${item.text}</span><button>✖</button>`;
      li.querySelector('span').onclick = () => { todos[index].done = !todos[index].done; saveAndRenderTodos(); };
      li.querySelector('button').onclick = () => { todos.splice(index, 1); saveAndRenderTodos(); };
      todoList.appendChild(li);
    });
  }

  if (todoInput) {
    todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && todoInput.value.trim() !== '') {
        todos.push({ text: todoInput.value.trim(), done: false });
        todoInput.value = '';
        saveAndRenderTodos();
      }
    });
  }
  saveAndRenderTodos();

  // ۹. ثبت Service Worker برای پشتیبانی از PWA و نصب روی موبایل و تبلت
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

});