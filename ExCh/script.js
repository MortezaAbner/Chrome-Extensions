// ۱. سیستم پیشرفته بک‌گراند
const bgOverlay = document.getElementById('custom-bg-overlay');
const bgSettingsBtn = document.getElementById('bg-settings-btn');
const bgDropdown = document.getElementById('bg-dropdown-menu');
const bgFileInput = document.getElementById('bg-file-input');
const toggleBlurBtn = document.getElementById('toggle-blur-btn');
const blurStatusText = document.getElementById('blur-status-text');
const resetBgBtn = document.getElementById('reset-bg-btn');

bgSettingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  bgDropdown.classList.toggle('active');
});

window.addEventListener('click', () => {
  bgDropdown.classList.remove('active');
  document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
});

function applyBackgroundConfig() {
  const savedBg = localStorage.getItem('custom_bg');
  const isBlurred = localStorage.getItem('bg_blur') !== 'false';

  if (savedBg) {
    bgOverlay.style.backgroundImage = `url(${savedBg})`;
    bgOverlay.className = `bg-overlay ${isBlurred ? 'blurred' : 'clear'}`;
    blurStatusText.textContent = isBlurred ? 'مات' : 'شفاف';
  } else {
    bgOverlay.style.backgroundImage = 'none';
    bgOverlay.className = 'bg-overlay';
  }
}

bgFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        localStorage.setItem('custom_bg', event.target.result);
        applyBackgroundConfig();
      } catch (err) {
        alert('حجم عکس بالاست! لطفاً تصویر سبک‌تری انتخاب کنید.');
      }
    };
    reader.readAsDataURL(file);
  }
});

toggleBlurBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const current = localStorage.getItem('bg_blur') !== 'false';
  localStorage.setItem('bg_blur', (!current).toString());
  applyBackgroundConfig();
});

resetBgBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  localStorage.removeItem('custom_bg');
  applyBackgroundConfig();
  bgDropdown.classList.remove('active');
});

applyBackgroundConfig();

// ۲. تم شب و روز
const themeBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeIcon.textContent = t === 'dark' ? '☀️' : '🌙';
}

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

// ۳. ساعت زنده، تاریخ و آب‌وهوای هوشمند شب/روز
function updateClockAndWeather() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  // تبدیل ارقام به فارسی
  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  const toFa = n => String(n).replace(/\d/g, d => persianDigits[d]);

  document.getElementById('clock').textContent = `${toFa(String(hours).padStart(2, '0'))}:${toFa(minutes)}`;

  // آیکون هوشمند روز / شب
  const weatherIcon = document.getElementById('weather-icon');
  const weatherPhrase = document.getElementById('weather-phrase');

  if (hours >= 19 || hours < 6) {
    weatherIcon.textContent = '🌙';
    weatherPhrase.textContent = 'شب مهتابی و آرام 🧡';
  } else {
    weatherIcon.textContent = '☀️';
    weatherPhrase.textContent = 'روز آفتابی و دلنشین ☀️';
  }
}
setInterval(updateClockAndWeather, 1000);
updateClockAndWeather();

// کلیک‌های تقویم گوگل و تبدیل تاریخ
document.getElementById('google-cal-btn').onclick = () => window.open('https://calendar.google.com', '_blank');
document.getElementById('cal-convert-btn').onclick = () => alert('امکان تبدیل تاریخ شمسی به میلادی و قمری');

// ۴. سرچ‌بار و موتورهای گوگل و ذره‌بین
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
  if (currentEngine === 'zarebin') {
    googleLogo.style.display = 'none';
    zarebinLogo.style.display = 'inline-block';
    searchTools.style.display = 'none';
    searchInput.placeholder = 'جستجو در ذره‌بین...';
    searchForm.action = 'https://zarebin.ir/search';
  } else {
    googleLogo.style.display = 'inline-block';
    zarebinLogo.style.display = 'none';
    searchTools.style.display = 'flex';
    searchInput.placeholder = 'جستجو در گوگل...';
    searchForm.action = 'https://www.google.com/search';
  }
}

engineSwitcher.addEventListener('click', () => {
  currentEngine = currentEngine === 'google' ? 'zarebin' : 'google';
  localStorage.setItem('search_engine', currentEngine);
  updateSearchEngineUI();
});
updateSearchEngineUI();

lensBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.open('https://lens.google.com/', '_blank');
});

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

// ۵. میانبرهای ۶ تایی
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

function getFavicon(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return 'https://www.google.com/favicon.ico';
  }
}

function renderShortcuts() {
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

  const addBtn = document.createElement('div');
  addBtn.className = 'add-shortcut-box';
  addBtn.innerHTML = '<span class="add-plus-icon">+</span>';
  addBtn.onclick = () => addModal.classList.add('active');
  shortcutsGrid.appendChild(addBtn);

  document.querySelectorAll('.more-btn').forEach(b => {
    b.onclick = (e) => {
      e.stopPropagation();
      const idx = b.dataset.index;
      document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
      document.getElementById(`menu-${idx}`).classList.toggle('active');
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

modalSaveBtn.onclick = () => {
  const t = modalTitle.value.trim();
  let u = modalUrl.value.trim();
  if (!t || !u) return;
  if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'https://' + u;
  shortcuts.push({ title: t, url: u });
  localStorage.setItem('my_shortcuts', JSON.stringify(shortcuts));
  modalTitle.value = '';
  modalUrl.value = '';
  addModal.classList.remove('active');
  renderShortcuts();
};
modalCancelBtn.onclick = () => addModal.classList.remove('active');
renderShortcuts();

// ۶. تب‌های تسک و یادداشت
const tabTasks = document.getElementById('tab-tasks');
const tabNotes = document.getElementById('tab-notes');
const emptyState = document.getElementById('empty-state');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('new-todo');

tabTasks.onclick = () => {
  tabTasks.classList.add('active');
  tabNotes.classList.remove('active');
  todoInput.placeholder = 'نوشتن تسک جدید...';
};

tabNotes.onclick = () => {
  tabNotes.classList.add('active');
  tabTasks.classList.remove('active');
  todoInput.placeholder = 'نوشتن یادداشت جدید...';
};

document.getElementById('plan-btn').onclick = () => {
  todoInput.focus();
};

let todos = JSON.parse(localStorage.getItem('my_todos') || '[]');

function saveAndRenderTodos() {
  localStorage.setItem('my_todos', JSON.stringify(todos));
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

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && todoInput.value.trim() !== '') {
    todos.push({ text: todoInput.value.trim(), done: false });
    todoInput.value = '';
    saveAndRenderTodos();
  }
});
saveAndRenderTodos();