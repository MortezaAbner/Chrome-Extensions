
/**
 * ماژول تسک‌های کامل آبنر مستقر در پنل سمت چپ
 */
(function initAbnerLeftTodo() {
  const STORAGE_KEY = 'abner_todos_v2';
  let activeTab = 'tasks';
  let isHidden = false;
  let sortMode = 'default'; // 'default', 'completed', 'active'

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
    // ۱. پاک‌سازی هرگونه کانتینر تسک تکراری در وسط یا بالای صفحه
    document.querySelectorAll('#abner-todo-container, .top-todo-card, .center-column .ab-todo-panel').forEach(el => el.remove());

    // ۲. یافتن کانتینر اختصاصی در ستون سمت چپ
    let container = document.getElementById('abner-left-todo');
    if (!container) {
      container = document.createElement('div');
      container.id = 'abner-left-todo';
      const leftCol = document.querySelector('.left-column') || document.querySelector('.todo-column') || document.body;
      leftCol.prepend(container);
    }

    let allTodos = getTodos();
    let currentList = allTodos.filter(t => (t.type || 'tasks') === activeTab);

    // سورت
    if (sortMode === 'completed') {
      currentList = currentList.filter(t => t.completed);
    } else if (sortMode === 'active') {
      currentList = currentList.filter(t => !t.completed);
    }

    let itemsHtml = '';
    if (currentList.length === 0) {
      itemsHtml = '<div style="margin:auto;text-align:center;color:rgba(255,255,255,0.5);font-size:12px;">موردی وجود ندارد</div>';
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
      <div class="ab-todo-panel">
        <div class="ab-todo-tabs">
          <button class="ab-todo-tab-btn ${activeTab === 'tasks' ? 'active' : ''}" id="ab-btn-tasks">تسک</button>
          <button class="ab-todo-tab-btn ${activeTab === 'notes' ? 'active' : ''}" id="ab-btn-notes">یادداشت</button>
        </div>

        <div class="ab-todo-toolbar">
          <div style="display:flex;gap:4px;">
            <button class="ab-tool-btn" id="ab-tool-add-quick" title="افزودن سریع">+</button>
            <button class="ab-tool-btn ${sortMode !== 'default' ? 'active' : ''}" id="ab-tool-sort" title="فیلتر وضعیت">⚡ فیلتر</button>
            <button class="ab-tool-btn ${isHidden ? 'active' : ''}" id="ab-tool-hide" title="مخفی‌سازی">${isHidden ? '👁️‍🗨️' : '👁️'}</button>
          </div>
          <button class="ab-tool-btn" id="ab-tool-clear" title="حذف انجام‌شده‌ها">•••</button>
        </div>

        <div class="ab-todo-list ${isHidden ? 'is-hidden' : ''}">
          ${itemsHtml}
        </div>
        ${isHidden ? '<div class="ab-todo-hidden-notice">لیست مخفی است</div>' : ''}

        <div class="ab-todo-input-wrap">
          <input type="text" class="ab-todo-input" id="ab-todo-input" placeholder="نوشتن ${activeTab === 'tasks' ? 'تسک جدید' : 'یادداشت جدید'}...">
          <button class="ab-todo-add-btn" id="ab-todo-add">+</button>
        </div>
      </div>
    `;

    // تب‌ها
    document.getElementById('ab-btn-tasks').onclick = () => { activeTab = 'tasks'; render(); };
    document.getElementById('ab-btn-notes').onclick = () => { activeTab = 'notes'; render(); };

    // نوار ابزار: هاید
    document.getElementById('ab-tool-hide').onclick = () => {
      isHidden = !isHidden;
      render();
    };

    // نوار ابزار: فیلتر وضعیت
    document.getElementById('ab-tool-sort').onclick = () => {
      if (sortMode === 'default') sortMode = 'active';
      else if (sortMode === 'active') sortMode = 'completed';
      else sortMode = 'default';
      render();
    };

    // نوار ابزار: پاک‌سازی تمام‌شده‌ها
    document.getElementById('ab-tool-clear').onclick = () => {
      if (confirm('تسک‌های انجام‌شده حذف شوند؟')) {
        let list = getTodos();
        list = list.filter(t => !t.completed);
        saveTodos(list);
      }
    };

    // اینپوت افزودن
    const inp = document.getElementById('ab-todo-input');
    const addBtn = document.getElementById('ab-todo-add');
    const quickBtn = document.getElementById('ab-tool-add-quick');

    function handleAdd() {
      const text = inp.value.trim();
      if (!text) return;
      const list = getTodos();
      list.push({
        id: 't_' + Date.now(),
        text,
        completed: false,
        type: activeTab
      });
      inp.value = '';
      saveTodos(list);
    }

    addBtn.onclick = handleAdd;
    quickBtn.onclick = () => inp.focus();
    inp.onkeydown = (e) => { if (e.key === 'Enter') handleAdd(); };

    // عملیات آیتم‌ها
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

      itemEl.querySelector('.btn-delete').onclick = () => delConfirm.classList.add('active');
      itemEl.querySelector('.ab-del-btn-cancel').onclick = () => delConfirm.classList.remove('active');
      itemEl.querySelector('.ab-del-btn-apply').onclick = () => {
        let list = getTodos();
        list = list.filter(x => x.id !== id);
        saveTodos(list);
      };

      itemEl.querySelector('.btn-edit').onclick = () => {
        const currentItem = getTodos().find(x => x.id === id);
        const newText = prompt('ویرایش:', currentItem ? currentItem.text : '');
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
