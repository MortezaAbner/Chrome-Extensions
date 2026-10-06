
/**
 * ماژول تسک و یادداشت‌های آبنر
 */
(function initAbnerTodoModule() {
  const STORAGE_KEY = 'abner_todos_data';
  let activeTab = 'tasks'; // 'tasks' یا 'notes'

  function getTodos() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return [
      { id: '1', text: 'بررسی پروژه‌های کاری آبنر', completed: false, type: 'tasks' },
      { id: '2', text: 'تنظیم ماژولار استایل شیشه‌ای', completed: true, type: 'tasks' }
    ];
  }

  function saveTodos(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    render();
  }

  function render() {
    let container = document.getElementById('abner-todo-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'abner-todo-container';
      const leftCol = document.querySelector('.left-column') || document.body;
      leftCol.prepend(container);
    }

    const allTodos = getTodos();
    const currentList = allTodos.filter(t => (t.type || 'tasks') === activeTab);

    let itemsHtml = '';
    if (currentList.length === 0) {
      itemsHtml = '<div class="ab-todo-empty">هنوز موردی ثبت نشده است!</div>';
    } else {
      currentList.forEach(t => {
        itemsHtml += `
          <div class="ab-todo-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
            <div class="ab-todo-row">
              <div class="ab-todo-content">
                <input type="checkbox" class="ab-todo-checkbox" ${t.completed ? 'checked' : ''}>
                <span class="ab-todo-text">${t.text}</span>
              </div>
              <div class="ab-todo-actions">
                <button class="ab-todo-btn btn-edit" title="ویرایش">✏️</button>
                <button class="ab-todo-btn btn-delete" title="حذف">🗑️</button>
              </div>
            </div>
            <div class="ab-todo-del-confirm">
              <button class="ab-del-btn-cancel">Esc بیخیال</button>
              <button class="ab-del-btn-apply">حذف ↵</button>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = `
      <div class="ab-todo-container">
        <div class="ab-todo-tabs">
          <button class="ab-todo-tab-btn ${activeTab === 'tasks' ? 'active' : ''}" id="ab-tab-tasks">تسک</button>
          <button class="ab-todo-tab-btn ${activeTab === 'notes' ? 'active' : ''}" id="ab-tab-notes">یادداشت</button>
        </div>

        <div class="ab-todo-header">
          <span class="ab-todo-title">دست‌نویس</span>
          <button class="ab-todo-hide-btn" id="ab-todo-toggle-view" title="مخفی کن">👁️</button>
        </div>

        <div class="ab-todo-list" id="ab-todo-list-scroll">
          ${itemsHtml}
        </div>

        <div class="ab-todo-input-wrap">
          <input type="text" class="ab-todo-input" id="ab-todo-input-field" placeholder="نوشتن ${activeTab === 'tasks' ? 'تسک جدید' : 'یادداشت جدید'}...">
          <button class="ab-todo-add-btn" id="ab-todo-add-btn">+</button>
        </div>
      </div>
    `;

    // سوییچ تب
    document.getElementById('ab-tab-tasks').onclick = () => { activeTab = 'tasks'; render(); };
    document.getElementById('ab-tab-notes').onclick = () => { activeTab = 'notes'; render(); };

    // افزودن آیتم
    const inputField = document.getElementById('ab-todo-input-field');
    const addBtn = document.getElementById('ab-todo-add-btn');

    function handleAdd() {
      const text = inputField.value.trim();
      if (!text) return;
      const list = getTodos();
      list.push({
        id: 't_' + Date.now(),
        text,
        completed: false,
        type: activeTab
      });
      inputField.value = '';
      saveTodos(list);
    }

    addBtn.onclick = handleAdd;
    inputField.onkeydown = (e) => { if (e.key === 'Enter') handleAdd(); };

    // رویدادهای آیتم‌ها
    container.querySelectorAll('.ab-todo-item').forEach(itemEl => {
      const id = itemEl.getAttribute('data-id');
      const chk = itemEl.querySelector('.ab-todo-checkbox');
      const delConfirm = itemEl.querySelector('.ab-todo-del-confirm');

      chk.onchange = () => {
        const list = getTodos();
        const target = list.find(x => x.id === id);
        if (target) {
          target.completed = chk.checked;
          saveTodos(list);
        }
      };

      itemEl.querySelector('.btn-delete').onclick = () => {
        delConfirm.classList.add('active');
      };
      itemEl.querySelector('.ab-del-btn-cancel').onclick = () => {
        delConfirm.classList.remove('active');
      };
      itemEl.querySelector('.ab-del-btn-apply').onclick = () => {
        let list = getTodos();
        list = list.filter(x => x.id !== id);
        saveTodos(list);
      };

      itemEl.querySelector('.btn-edit').onclick = () => {
        const currentItem = getTodos().find(x => x.id === id);
        const newText = prompt('ویرایش متن:', currentItem ? currentItem.text : '');
        if (newText !== null && newText.trim() !== '') {
          const list = getTodos();
          const target = list.find(x => x.id === id);
          if (target) {
            target.text = newText.trim();
            saveTodos(list);
          }
        }
      };
    });
  }

  window.renderAbnerTodos = render;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
