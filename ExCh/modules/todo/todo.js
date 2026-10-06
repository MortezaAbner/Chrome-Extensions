
/**
 * ماژول جاوااسکریپت تسک و یادداشت آبنر
 */
(function() {
  const KEY = 'abner_todo_list_data';
  let activeTab = 'tasks';
  let isHidden = false;

  function loadTodos() {
    try {
      const data = localStorage.getItem(KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return [
      { id: '1', text: 'بررسی پروژه‌های کاری آبنر', completed: false, type: 'tasks' },
      { id: '2', text: 'تنظیم ماژولار استایل شیشه‌ای', completed: true, type: 'tasks' }
    ];
  }

  function saveTodos(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    render();
  }

  function render() {
    const leftCol = document.querySelector('.left-column') || document.body;
    let box = document.getElementById('abner-modular-todo');
    if (!box) {
      box = document.createElement('div');
      box.id = 'abner-modular-todo';
      leftCol.prepend(box);
    }

    const todos = loadTodos().filter(t => (t.type || 'tasks') === activeTab);
    let items = '';
    todos.forEach(t => {
      items += `
        <div class="ab-todo-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
          <div class="ab-todo-row">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" class="ab-todo-chk" ${t.completed ? 'checked' : ''}>
              <span>${t.text}</span>
            </label>
            <div style="display:flex;gap:6px;">
              <button class="ab-todo-tool-btn btn-del" style="height:22px;padding:0 5px;">🗑️</button>
            </div>
          </div>
          <div class="ab-todo-del-box">
            <button class="ab-del-cancel">Esc بیخیال</button>
            <button class="ab-del-apply">حذف</button>
          </div>
        </div>
      `;
    });

    box.innerHTML = `
      <div class="ab-todo-container">
        <div class="ab-todo-tabs">
          <button class="ab-todo-tab-btn ${activeTab === 'tasks' ? 'active' : ''}" id="tab-tasks">تسک</button>
          <button class="ab-todo-tab-btn ${activeTab === 'notes' ? 'active' : ''}" id="tab-notes">یادداشت</button>
        </div>
        <div class="ab-todo-toolbar">
          <button class="ab-todo-tool-btn" id="tool-filter">⚡ فیلتر</button>
          <button class="ab-todo-tool-btn" id="tool-hide">${isHidden ? '👁️‍🗨️' : '👁️'}</button>
          <button class="ab-todo-tool-btn" id="tool-clear">•••</button>
        </div>
        <div class="ab-todo-list" style="${isHidden ? 'display:none;' : ''}">
          ${items || '<div style="margin:auto;opacity:0.6;font-size:12px;">هنوز تسکی ثبت نشده است</div>'}
        </div>
        <div class="ab-todo-input-bar">
          <input type="text" id="ab-todo-inp" placeholder="نوشتن ${activeTab === 'tasks' ? 'تسک جدید' : 'یادداشت جدید'}...">
          <button id="ab-todo-add">+</button>
        </div>
      </div>
    `;

    document.getElementById('tab-tasks').onclick = () => { activeTab = 'tasks'; render(); };
    document.getElementById('tab-notes').onclick = () => { activeTab = 'notes'; render(); };
    document.getElementById('tool-hide').onclick = () => { isHidden = !isHidden; render(); };

    const inp = document.getElementById('ab-todo-inp');
    const addBtn = document.getElementById('ab-todo-add');
    const add = () => {
      if (!inp.value.trim()) return;
      const list = loadTodos();
      list.push({ id: Date.now().toString(), text: inp.value.trim(), completed: false, type: activeTab });
      inp.value = '';
      saveTodos(list);
    };
    addBtn.onclick = add;
    inp.onkeydown = (e) => { if (e.key === 'Enter') add(); };

    box.querySelectorAll('.ab-todo-item').forEach(item => {
      const id = item.dataset.id;
      item.querySelector('.ab-todo-chk').onchange = (e) => {
        const list = loadTodos();
        const t = list.find(x => x.id === id);
        if (t) { t.completed = e.target.checked; saveTodos(list); }
      };
      const delBox = item.querySelector('.ab-todo-del-box');
      item.querySelector('.btn-del').onclick = () => delBox.classList.add('open');
      item.querySelector('.ab-del-cancel').onclick = () => delBox.classList.remove('open');
      item.querySelector('.ab-del-apply').onclick = () => {
        saveTodos(loadTodos().filter(x => x.id !== id));
      };
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
