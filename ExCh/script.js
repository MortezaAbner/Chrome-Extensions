// ۱. سیستم مدیریت تصویر پس‌زمینه
const bgOverlay = document.getElementById('custom-bg-overlay');
const bgInput = document.getElementById('bg-file-input');
const resetBgBtn = document.getElementById('reset-bg-btn');

function loadCustomBackground() {
  const savedBg = localStorage.getItem('custom_bg');
  if (savedBg) {
    bgOverlay.style.backgroundImage = `url(${savedBg})`;
    bgOverlay.classList.add('active');
    resetBgBtn.style.display = 'flex';
  } else {
    bgOverlay.style.backgroundImage = 'none';
    bgOverlay.classList.remove('active');
    resetBgBtn.style.display = 'none';
  }
}

bgInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Img = event.target.result;
      try {
        localStorage.setItem('custom_bg', base64Img);
        loadCustomBackground();
      } catch (err) {
        alert('حجم عکس بالاست! لطفاً تصویر کم‌حجم‌تری انتخاب کنید.');
      }
    };
    reader.readAsDataURL(file);
  }
});

resetBgBtn.addEventListener('click', () => {
  localStorage.removeItem('custom_bg');
  loadCustomBackground();
});

loadCustomBackground();

// ۲. تم شب و روز هوشمند
const themeBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeIcon.textContent = t === 'dark' ? '☀️' : '🌙';
}

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

applyTheme(getInitialTheme());

// ۳. ساعت زنده
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = 
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}
setInterval(updateClock, 1000);
updateClock();

// ۴. مدیریت میانبرها با امکان افزودن، حذف و منوی ۳ نقطه
const shortcutsGrid = document.getElementById('shortcuts-grid');
const addModal = document.getElementById('add-modal');
const modalSaveBtn = document.getElementById('modal-save-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const modalTitle = document.getElementById('modal-site-title');
const modalUrl = document.getElementById('modal-site-url');

const defaultShortcuts = [
  { title: 'یوتیوب', url: 'https://www.youtube.com' },
  { title: 'واتساپ', url: 'https://web.whatsapp.com' },
  { title: 'پینترست', url: 'https://www.pinterest.com' },
  { title: 'توییتر', url: 'https://x.com' },
  { title: 'دیجی‌کالا', url: 'https://www.digikala.com' },
  { title: 'دیوار', url: 'https://divar.ir' },
  { title: 'آپارات', url: 'https://www.aparat.com' }
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

  // دکمه مثبت افزودن میانبر
  const addBtn = document.createElement('div');
  addBtn.className = 'add-shortcut-box';
  addBtn.innerHTML = '<span class="add-plus-icon">+</span>';
  addBtn.onclick = () => { addModal.classList.add('active'); };
  shortcutsGrid.appendChild(addBtn);

  setupShortcutEvents();
}

function setupShortcutEvents() {
  document.querySelectorAll('.more-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const idx = btn.dataset.index;
      document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
      document.getElementById(`menu-${idx}`).classList.toggle('active');
    };
  });

  document.querySelectorAll('.menu-item.delete').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      shortcuts.splice(btn.dataset.index, 1);
      localStorage.setItem('my_shortcuts', JSON.stringify(shortcuts));
      renderShortcuts();
    };
  });

  document.querySelectorAll('.menu-item.open-tab').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      window.open(btn.dataset.url, '_blank');
      document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
    };
  });

  document.querySelectorAll('.menu-item.copy-link').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(btn.dataset.url);
      alert('لینک کپی شد!');
      document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
    };
  });
}

window.addEventListener('click', () => {
  document.querySelectorAll('.context-menu').forEach(m => m.classList.remove('active'));
});

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

// ۵. مدیریت تسک‌ها
const todoInput = document.getElementById('new-todo');
const todoList = document.getElementById('todo-list');
let todos = JSON.parse(localStorage.getItem('my_todos') || '[]');

function saveAndRenderTodos() {
  localStorage.setItem('my_todos', JSON.stringify(todos));
  todoList.innerHTML = '';
  if (todos.length === 0) {
    todoList.innerHTML = '<li style="color:var(--text-muted); text-align:center; padding-top:30px;">هیچ تسکی وجود ندارد ✨</li>';
    return;
  }
  todos.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${item.done ? 'done' : ''}`;
    li.innerHTML = `
      <span>${item.text}</span>
      <button>✖</button>
    `;
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