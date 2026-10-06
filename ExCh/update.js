const fs = require('fs');
const path = require('path');

console.log('🧹 در حال یکپارچه‌سازی و استقرار کامل تسک‌ها در پنل سمت چپ آبنر...');

const todoDir = path.join(__dirname, 'modules', 'todo');
if (!fs.existsSync(todoDir)) fs.mkdirSync(todoDir, { recursive: true });

// ۱. استایل شیشه‌ای کامل پنل تسک و ابزارهای سورت/هاید (modules/todo/todo.css)
const todoCss = `
/* ========================================================
   استایل شیشه‌ای پنل تسک و یادداشت آبنر در سمت چپ
======================================================== */
.ab-todo-panel {
  width: 100% !important;
  max-width: 320px !important;
  height: 480px !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 16px !important;
  border-radius: 24px !important;
  box-sizing: border-box !important;
  direction: rtl !important;
  user-select: none !important;
  font-family: inherit !important;
  color: #fff !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2) !important;
  margin: 0 auto 20px auto !important;
}

/* تب‌های بالای تسک و یادداشت */
.ab-todo-tabs {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  margin-bottom: 10px !important;
}
.ab-todo-tab-btn {
  flex: 1 !important;
  padding: 6px 12px !important;
  border-radius: 12px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}
.ab-todo-tab-btn.active {
  background: #2563eb !important;
  color: #fff !important;
  border-color: #3b82f6 !important;
}

/* نوار ابزار: سورت، هاید، و اکشن‌ها */
.ab-todo-toolbar {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 6px !important;
  margin-bottom: 12px !important;
  padding-bottom: 10px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
}
.ab-tool-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  color: rgba(255, 255, 255, 0.8) !important;
  height: 28px !important;
  border-radius: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 13px !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  padding: 0 8px !important;
}
.ab-tool-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}
.ab-tool-btn.active {
  background: rgba(59, 130, 246, 0.3) !important;
  color: #60a5fa !important;
  border-color: #3b82f6 !important;
}

/* محتوای پنهان‌شده */
.ab-todo-list.is-hidden {
  display: none !important;
}
.ab-todo-hidden-notice {
  margin: auto !important;
  text-align: center !important;
  color: rgba(255, 255, 255, 0.45) !important;
  font-size: 12px !important;
}

/* لیست اسکرول تسک‌ها */
.ab-todo-list {
  flex: 1 !important;
  overflow-y: auto !important;
  padding-right: 4px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}
.ab-todo-list::-webkit-scrollbar { width: 4px !important; }
.ab-todo-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 4px !important;
}

/* آیتم تسک */
.ab-todo-item {
  display: flex !important;
  flex-direction: column !important;
  background: rgba(238, 240, 245, 0.07) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 14px !important;
  padding: 8px 10px !important;
  transition: all 0.2s ease !important;
}
.ab-todo-item:hover {
  background: rgba(255, 255, 255, 0.12) !important;
}
.ab-todo-item.completed .ab-todo-text {
  text-decoration: line-through !important;
  opacity: 0.45 !important;
}

.ab-todo-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
}
.ab-todo-content {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  cursor: pointer !important;
  flex: 1 !important;
}
.ab-todo-checkbox {
  width: 17px !important;
  height: 17px !important;
  accent-color: #2563eb !important;
  cursor: pointer !important;
}
.ab-todo-text {
  font-size: 13px !important;
  color: #fff !important;
  word-break: break-word !important;
}

.ab-todo-actions {
  display: flex !important;
  gap: 8px !important;
  opacity: 0 !important;
  transition: opacity 0.2s ease !important;
}
.ab-todo-item:hover .ab-todo-actions {
  opacity: 1 !important;
}
.ab-todo-btn {
  background: transparent !important;
  border: none !important;
  color: #868A9B !important;
  cursor: pointer !important;
  font-size: 13px !important;
  padding: 2px !important;
}
.ab-todo-btn:hover { color: #fff !important; }

/* دکمه‌های تایید حذف */
.ab-todo-del-confirm {
  display: none !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  margin-top: 8px !important;
  padding-top: 6px !important;
  border-top: 1px dashed rgba(255, 255, 255, 0.1) !important;
}
.ab-todo-del-confirm.active {
  display: flex !important;
}
.ab-del-btn-cancel {
  background: #333740 !important;
  color: #A8ABBA !important;
  border: none !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  font-size: 11px !important;
  cursor: pointer !important;
}
.ab-del-btn-apply {
  background: #42282D !important;
  color: #DE4237 !important;
  border: none !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  font-size: 11px !important;
  cursor: pointer !important;
}

/* اینپوت افزودن */
.ab-todo-input-wrap {
  position: relative !important;
  margin-top: 10px !important;
  display: flex !important;
  align-items: center !important;
}
.ab-todo-input {
  width: 100% !important;
  padding: 10px 14px 10px 38px !important;
  border-radius: 14px !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2)) !important;
  background: rgba(0, 0, 0, 0.3) !important;
  color: #fff !important;
  font-size: 12.5px !important;
  box-sizing: border-box !important;
  outline: none !important;
  direction: rtl !important;
}
.ab-todo-input::placeholder { color: rgba(255, 255, 255, 0.65) !important; }
.ab-todo-add-btn {
  position: absolute !important;
  left: 6px !important;
  width: 26px !important;
  height: 26px !important;
  background: #2563eb !important;
  border: none !important;
  border-radius: 8px !important;
  color: #fff !important;
  font-size: 16px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
}
`;
fs.writeFileSync(path.join(todoDir, 'todo.css'), todoCss, 'utf8');

// ۲. جاوااسکریپت اختصاصی با تمرکز روی ستون چپ و حذف هر تسک اضافه
const todoJs = `
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
      <div class="ab-todo-panel">
        <div class="ab-todo-tabs">
          <button class="ab-todo-tab-btn \${activeTab === 'tasks' ? 'active' : ''}" id="ab-btn-tasks">تسک</button>
          <button class="ab-todo-tab-btn \${activeTab === 'notes' ? 'active' : ''}" id="ab-btn-notes">یادداشت</button>
        </div>

        <div class="ab-todo-toolbar">
          <div style="display:flex;gap:4px;">
            <button class="ab-tool-btn" id="ab-tool-add-quick" title="افزودن سریع">+</button>
            <button class="ab-tool-btn \${sortMode !== 'default' ? 'active' : ''}" id="ab-tool-sort" title="فیلتر وضعیت">⚡ فیلتر</button>
            <button class="ab-tool-btn \${isHidden ? 'active' : ''}" id="ab-tool-hide" title="مخفی‌سازی">\${isHidden ? '👁️‍🗨️' : '👁️'}</button>
          </div>
          <button class="ab-tool-btn" id="ab-tool-clear" title="حذف انجام‌شده‌ها">•••</button>
        </div>

        <div class="ab-todo-list \${isHidden ? 'is-hidden' : ''}">
          \${itemsHtml}
        </div>
        \${isHidden ? '<div class="ab-todo-hidden-notice">لیست مخفی است</div>' : ''}

        <div class="ab-todo-input-wrap">
          <input type="text" class="ab-todo-input" id="ab-todo-input" placeholder="نوشتن \${activeTab === 'tasks' ? 'تسک جدید' : 'یادداشت جدید'}...">
          <button class="ab-todo-add-btn" id="ab-todo-add">+</button>
        </div>
      </div>
    \`;

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
`;
fs.writeFileSync(path.join(todoDir, 'todo.js'), todoJs, 'utf8');

// ۳. رفع هرگونه تداخل در فایل‌های HTML
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
  }
});