// تب‌های تسک و یادداشت
const tabTasks = document.getElementById('tab-tasks');
const tabNotes = document.getElementById('tab-notes');
const emptyState = document.getElementById('empty-state');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('new-todo');

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