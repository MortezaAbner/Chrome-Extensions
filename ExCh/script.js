// مدیریت تم شب و روز هوشمند
const themeBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  // بررسی تم سیستم کاربر (Dark Mode ویندوز یا مک)
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// گوش دادن به تغییر تم در سیستم کاربر به شکل زنده
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

applyTheme(getInitialTheme());

// به‌روزرسانی ساعت زنده
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// مدیریت تسک‌ها
const todoInput = document.getElementById('new-todo');
const todoList = document.getElementById('todo-list');
let todos = JSON.parse(localStorage.getItem('my_todos') || '[]');

function saveAndRender() {
  localStorage.setItem('my_todos', JSON.stringify(todos));
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<li style="color:var(--text-muted); text-align:center; padding-top:30px;">هیچ تسکی وجود ندارد ✨</li>';
    return;
  }

  todos.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${item.done ? 'done' : ''}`;

    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    textSpan.onclick = () => {
      todos[index].done = !todos[index].done;
      saveAndRender();
    };

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '✖';
    delBtn.onclick = () => {
      todos.splice(index, 1);
      saveAndRender();
    };

    li.appendChild(textSpan);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && todoInput.value.trim() !== '') {
    todos.push({ text: todoInput.value.trim(), done: false });
    todoInput.value = '';
    saveAndRender();
  }
});

saveAndRender();