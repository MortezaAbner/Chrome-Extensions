const fs = require('fs');
const path = require('path');

console.log('📝 در حال استقرار ماژول دست‌نویس و تسک‌های آبنر (modules/todo)...');

const todoDir = path.join(__dirname, 'modules', 'todo');
if (!fs.existsSync(todoDir)) {
  fs.mkdirSync(todoDir, { recursive: true });
}

// ۱. ساخت استایل شیشه‌ای ماژول تسک‌های آبنر (modules/todo/todo.css)
const todoCss = `
/* ========================================================
   استایل شیشه‌ای ماژول تسک و یادداشت آبنر
======================================================== */
.ab-todo-container {
  width: 100%;
  max-width: 320px;
  height: 480px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 24px;
  box-sizing: border-box;
  direction: rtl;
  user-select: none;
  font-family: inherit;
  color: #fff;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  margin: 0 auto;
}

/* تب‌های بالای تسک و یادداشت */
.ab-todo-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}
.ab-todo-tab-btn {
  flex: 1;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18));
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}
.ab-todo-tab-btn.active {
  background: #2563eb !important;
  color: #fff !important;
  border-color: #3b82f6 !important;
}

/* هدر دست‌نویس */
.ab-todo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.ab-todo-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
.ab-todo-hide-btn {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18));
  color: #E8ECFD;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.ab-todo-hide-btn:hover { background: rgba(255, 255, 255, 0.2); }

/* لیست اسکرول تسک‌ها */
.ab-todo-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ab-todo-list::-webkit-scrollbar { width: 4px; }
.ab-todo-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

/* هر آیتم تسک */
.ab-todo-item {
  display: flex;
  flex-direction: column;
  background: rgba(238, 240, 245, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 8px 10px;
  transition: all 0.2s ease;
}
.ab-todo-item:hover {
  background: rgba(255, 255, 255, 0.12);
}
.ab-todo-item.completed .ab-todo-text {
  text-decoration: line-through;
  opacity: 0.45;
}

.ab-todo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ab-todo-content {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}
.ab-todo-checkbox {
  width: 17px;
  height: 17px;
  accent-color: #2563eb;
  cursor: pointer;
}
.ab-todo-text {
  font-size: 13px;
  color: #fff;
  word-break: break-word;
}

/* دکمه‌های ویرایش و حذف هنگام هاور */
.ab-todo-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.ab-todo-item:hover .ab-todo-actions {
  opacity: 1;
}
.ab-todo-btn {
  background: transparent;
  border: none;
  color: #868A9B;
  cursor: pointer;
  padding: 2px;
  font-size: 13px;
}
.ab-todo-btn:hover { color: #fff; }

/* پنل تایید حذف */
.ab-todo-del-confirm {
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}
.ab-todo-del-confirm.active {
  display: flex;
}
.ab-del-btn-cancel {
  background: #333740;
  color: #A8ABBA;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
}
.ab-del-btn-apply {
  background: #42282D;
  color: #DE4237;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
}

/* اینپوت اضافه کردن تسک */
.ab-todo-input-wrap {
  position: relative;
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.ab-todo-input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border-radius: 14px;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 12.5px;
  box-sizing: border-box;
  outline: none;
  direction: rtl;
}
.ab-todo-input::placeholder {
  color: rgba(255, 255, 255, 0.65);
}
.ab-todo-add-btn {
  position: absolute;
  left: 6px;
  width: 26px;
  height: 26px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* حالت خالی بودن لیست */
.ab-todo-empty {
  margin: auto;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12.5px;
  padding: 20px 0;
}
`;
fs.writeFileSync(path.join(todoDir, 'todo.css'), todoCss, 'utf8');

// ۲. ساخت جاوااسکریپت مستقل دست‌نویس و تسک‌های آبنر (modules/todo/todo.js)
const todoJs = `
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
        itemsHtml += \`
          <div class="ab-todo-item \${t.completed ? 'completed' : ''}" data-id="\${t.id}">
            <div class="ab-todo-row">
              <div class="ab-todo-content">
                <input type="checkbox" class="ab-todo-checkbox" \${t.completed ? 'checked' : ''}>
                <span class="ab-todo-text">\${t.text}</span>
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
        \`;
      });
    }

    container.innerHTML = \`
      <div class="ab-todo-container">
        <div class="ab-todo-tabs">
          <button class="ab-todo-tab-btn \${activeTab === 'tasks' ? 'active' : ''}" id="ab-tab-tasks">تسک</button>
          <button class="ab-todo-tab-btn \${activeTab === 'notes' ? 'active' : ''}" id="ab-tab-notes">یادداشت</button>
        </div>

        <div class="ab-todo-header">
          <span class="ab-todo-title">دست‌نویس</span>
          <button class="ab-todo-hide-btn" id="ab-todo-toggle-view" title="مخفی کن">👁️</button>
        </div>

        <div class="ab-todo-list" id="ab-todo-list-scroll">
          \${itemsHtml}
        </div>

        <div class="ab-todo-input-wrap">
          <input type="text" class="ab-todo-input" id="ab-todo-input-field" placeholder="نوشتن \${activeTab === 'tasks' ? 'تسک جدید' : 'یادداشت جدید'}...">
          <button class="ab-todo-add-btn" id="ab-todo-add-btn">+</button>
        </div>
      </div>
    \`;

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
`;
fs.writeFileSync(path.join(todoDir, 'todo.js'), todoJs, 'utf8');

// ۳. اتصال ماژول به فایل‌های HTML
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('modules/todo/todo.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/todo/todo.css">\n</head>');
    }
    if (!html.includes('modules/todo/todo.js')) {
      html = html.replace('</body>', '  <script src="modules/todo/todo.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 اتصال ماژول تسک‌های آبنر به ${filePath} برقرار شد.`);
  }
});