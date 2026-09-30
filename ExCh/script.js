document.addEventListener('DOMContentLoaded', () => {

  // ۱. سیستم تصویر پس‌زمینه (آپلود، بلر و ریست)
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
            alert('حجم عکس بالاست! لطفاً تصویر کم‌حجم‌تری انتخاب کنید.');
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

  // ۲. مدیریت تم شب / روز
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

  const initialTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  // ۳. ساعت زنده، تاریخ و وضعیت روز/شب هوشمند
  function updateClockAndWeather() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    const toFa = n => String(n).replace(/\d/g, d => persianDigits[d]);

    const clockElem = document.getElementById('clock');
    if (clockElem) clockElem.textContent = `${toFa(String(hours).padStart(2, '0'))}:${toFa(minutes)}`;

    const weatherIcon = document.getElementById('weather-icon');
    const weatherPhrase = document.getElementById('weather-phrase');

    if (weatherIcon && weatherPhrase) {
      if (hours >= 19 || hours < 6) {
        weatherIcon.textContent = '🌙';
        weatherPhrase.textContent = 'شب مهتابی و آرام 🧡';
      } else {
        weatherIcon.textContent = '☀️';
        weatherPhrase.textContent = 'روز آفتابی و دلنشین ☀️';
      }
    }
  }
  setInterval(updateClockAndWeather, 1000);
  updateClockAndWeather();

  // دکمه‌های تقویم گوگل و تبدیل تاریخ
  const gCalBtn = document.getElementById('google-cal-btn');
  if (gCalBtn) gCalBtn.onclick = () => window.open('https://calendar.google.com', '_blank');

  const calConvBtn = document.getElementById('cal-convert-btn');
  if (calConvBtn) calConvBtn.onclick = () => alert('امکان تبدیل تاریخ شمسی به میلادی و قمری');

  // ۴. موتورهای جستجو (گوگل / ذره‌بین) + عملکردهای لنز و ویس
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
      e.preventDefault();
      e.stopPropagation();
      currentEngine = currentEngine === 'google' ? 'zarebin' : 'google';
      localStorage.setItem('search_engine', currentEngine);
      updateSearchEngineUI();
    });
  }
  updateSearchEngineUI();

  if (lensBtn) {
    lensBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://lens.google.com/', '_blank');
    });
  }

  if (voiceBtn) {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fa-IR';

      voiceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        voiceBtn.textContent = '🔴';
        searchInput.placeholder = 'در حال گوش دادن...';
        recognition.start();
      });

      recognition.onresult = (event) => {
        searchInput.value = event.results[0][0].transcript;
        voiceBtn.textContent = '🎙️';
        searchForm.submit();
      };

      recognition.onend = () => { voiceBtn.textContent = '🎙️'; };
    }
  }

  // ۵. رندر کامل میانبرهای ۶ تایی وسط
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
  if (!shortcuts || !Array.isArray(shortcuts) || shortcuts.length === 0) {
    shortcuts = defaultShortcuts;
  }

  function getFavicon(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return 'https://www.google.com/favicon.ico';
    }
  }

  function renderShortcuts() {
    if (!shortcutsGrid) return;
    shortcutsGrid.innerHTML = '';

    shortcuts.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'shortcut-box';
      card.innerHTML = `
        <button class="more-btn" data-index="${index}">⋮</button>
        <div class="context-menu" id="menu-${index}">
          <button class="menu-item open-tab" data-url="${item.url}">🔗 تب جدید</button>
          <button class="menu-item copy-link" data-url="${item.url}">📋 کپی لینک</button>
          <button class="menu-item delete" data-index="${index}">🗑️ حذف</button>
        </div>
        <img src="${getFavicon(item.url)}" class="shortcut-icon-img" alt="${item.title}">
        <span class="shortcut-title">${item.title}</span>
      `;

      card.onclick = (e) => {
        if (e.target.closest('.more-btn') || e.target.closest('.context-menu')) return;
        window.location.href = item.url;
      };
      shortcutsGrid.appendChild(card);
    });

    // دکمه مثبت افزودن
    const addBtn = document.createElement('div');
    addBtn.className = 'add-shortcut-box';
    addBtn.innerHTML = '<span class="add-plus-icon">+</span>';
    addBtn.onclick = () => { if (addModal) addModal.classList.add('active'); };
    shortcutsGrid.appendChild(addBtn);

    // رویدادهای منوی ۳ نقطه
    document.querySelectorAll('.more-btn').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        const idx = b.dataset.index;
        document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
        const targetMenu = document.getElementById(`menu-${idx}`);
        if (targetMenu) targetMenu.classList.toggle('active');
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
      b.onclick = (e) => {
        e.stopPropagation();
        window.open(b.dataset.url, '_blank');
      };
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
      modalTitle.value = '';
      modalUrl.value = '';
      if (addModal) addModal.classList.remove('active');
      renderShortcuts();
    };
  }

  if (modalCancelBtn) {
    modalCancelBtn.onclick = () => {
      if (addModal) addModal.classList.remove('active');
    };
  }

  renderShortcuts();

  // ۶. تب‌های تسک و یادداشت
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

});