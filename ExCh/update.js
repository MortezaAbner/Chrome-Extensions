const fs = require('fs');
const path = require('path');

console.log('🚀 در حال ایجاد و استقرار کدهای کامل در پوشه‌های modules/todo و modules/calendar و modules/weather...');

// ایجاد پوشه‌ها در صورت عدم وجود
['todo', 'calendar', 'weather'].forEach(dir => {
  const p = path.join(__dirname, 'modules', dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// ==========================================
// ۱. ماژول تسک و یادداشت (modules/todo)
// ==========================================
const todoCss = `
/* استایل ماژولار تسک و یادداشت آبنر */
.ab-todo-container {
  width: 100% !important;
  height: 575px !important;
  min-height: 575px !important;
  max-height: 575px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
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
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
}

.ab-todo-tabs {
  display: flex !important;
  gap: 8px !important;
  margin-bottom: 12px !important;
}
.ab-todo-tab-btn {
  flex: 1 !important;
  padding: 8px 12px !important;
  border-radius: 12px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.75) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}
.ab-todo-tab-btn.active {
  background: #2563eb !important;
  color: #fff !important;
  border-color: #3b82f6 !important;
}

.ab-todo-toolbar {
  display: flex !important;
  justify-content: space-between !important;
  gap: 6px !important;
  margin-bottom: 10px !important;
  padding-bottom: 8px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
}
.ab-todo-tool-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: #fff !important;
  height: 28px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  padding: 0 8px !important;
  font-size: 12px !important;
}

.ab-todo-list {
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  padding-right: 4px !important;
}
.ab-todo-list::-webkit-scrollbar { width: 4px; }
.ab-todo-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.ab-todo-item {
  background: rgba(238, 240, 245, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 14px !important;
  padding: 8px 10px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
}
.ab-todo-item.completed span {
  text-decoration: line-through !important;
  opacity: 0.45 !important;
}
.ab-todo-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}
.ab-todo-del-box {
  display: none;
  justify-content: space-around;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed rgba(255,255,255,0.15);
}
.ab-todo-del-box.open { display: flex; }
.ab-del-cancel { background: #333740; color: #a8abba; border: none; border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 11px; }
.ab-del-apply { background: #42282d; color: #de4237; border: none; border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 11px; }

/* نوار ثبت تک‌خطی در کف کادر */
.ab-todo-input-bar {
  flex: 0 0 44px !important;
  height: 44px !important;
  margin-top: auto !important;
  display: flex !important;
  align-items: center !important;
  position: relative !important;
}
.ab-todo-input-bar input {
  width: 100% !important;
  height: 40px !important;
  background: rgba(0, 0, 0, 0.28) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2)) !important;
  border-radius: 12px !important;
  color: #fff !important;
  padding: 0 12px 0 38px !important;
  outline: none !important;
  font-family: inherit !important;
  font-size: 12.5px !important;
  box-sizing: border-box !important;
}
.ab-todo-input-bar button {
  position: absolute !important;
  left: 6px !important;
  width: 28px !important;
  height: 28px !important;
  background: #2563eb !important;
  border: none !important;
  border-radius: 8px !important;
  color: #fff !important;
  cursor: pointer !important;
  font-size: 16px !important;
}
`;
fs.writeFileSync(path.join(__dirname, 'modules', 'todo', 'todo.css'), todoCss, 'utf8');

const todoJs = `
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
      items += \`
        <div class="ab-todo-item \${t.completed ? 'completed' : ''}" data-id="\${t.id}">
          <div class="ab-todo-row">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" class="ab-todo-chk" \${t.completed ? 'checked' : ''}>
              <span>\${t.text}</span>
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
      \`;
    });

    box.innerHTML = \`
      <div class="ab-todo-container">
        <div class="ab-todo-tabs">
          <button class="ab-todo-tab-btn \${activeTab === 'tasks' ? 'active' : ''}" id="tab-tasks">تسک</button>
          <button class="ab-todo-tab-btn \${activeTab === 'notes' ? 'active' : ''}" id="tab-notes">یادداشت</button>
        </div>
        <div class="ab-todo-toolbar">
          <button class="ab-todo-tool-btn" id="tool-filter">⚡ فیلتر</button>
          <button class="ab-todo-tool-btn" id="tool-hide">\${isHidden ? '👁️‍🗨️' : '👁️'}</button>
          <button class="ab-todo-tool-btn" id="tool-clear">•••</button>
        </div>
        <div class="ab-todo-list" style="\${isHidden ? 'display:none;' : ''}">
          \${items || '<div style="margin:auto;opacity:0.6;font-size:12px;">هنوز تسکی ثبت نشده است</div>'}
        </div>
        <div class="ab-todo-input-bar">
          <input type="text" id="ab-todo-inp" placeholder="نوشتن \${activeTab === 'tasks' ? 'تسک جدید' : 'یادداشت جدید'}...">
          <button id="ab-todo-add">+</button>
        </div>
      </div>
    \`;

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
`;
fs.writeFileSync(path.join(__dirname, 'modules', 'todo', 'todo.js'), todoJs, 'utf8');

// ==========================================
// ۲. ماژول تقویم (modules/calendar)
// ==========================================
const calCss = `
/* استایل شیشه‌ای ماژولار تقویم آبنر */
.ab-calendar-card {
  width: 100% !important;
  max-width: 330px !important;
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
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
}
.ab-cal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.ab-cal-arrow { background: rgba(255,255,255,0.15); border: none; color: #fff; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; }
.ab-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
.ab-cal-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 38px; border-radius: 10px; cursor: pointer; }
.ab-cal-cell.is-today { border: 1.5px solid #3b82f6; background: rgba(59,130,246,0.15); }
.ab-cal-cell.is-selected { background: #2563eb !important; }
.ab-cal-foot { display: flex; justify-content: space-between; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.12); font-size: 11.5px; }
.ab-cal-foot button { background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; }
`;
fs.writeFileSync(path.join(__dirname, 'modules', 'calendar', 'calendar.css'), calCss, 'utf8');

const calJs = `
/**
 * ماژول جاوااسکریپت تقویم شمسی آبنر
 */
(function() {
  const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const weekDays = ['ش','ی','د','س','چ','پ','ج'];
  let state = { year: 1405, month: 7, day: 13, sel: 13 };

  function toFa(n) { return n.toString().replace(/\\d/g, x => '۰۱۲۳۴۵۶۷۸۹'[x]); }

  function render() {
    const rightCol = document.querySelector('.right-column') || document.body;
    let root = document.getElementById('abner-modular-calendar');
    if (!root) {
      root = document.createElement('div');
      root.id = 'abner-modular-calendar';
      rightCol.appendChild(root);
    }

    let cells = '';
    for (let d = 1; d <= 30; d++) {
      const isToday = d === state.day;
      const isSel = d === state.sel;
      cells += \`
        <div class="ab-cal-cell \${isToday ? 'is-today' : ''} \${isSel ? 'is-selected' : ''}" data-day="\${d}">
          <span style="font-size:12.5px;font-weight:600;">\${toFa(d)}</span>
          <span style="font-size:8.5px;opacity:0.5;">\${weekDays[(d - 1) % 7]}</span>
        </div>
      \`;
    }

    root.innerHTML = \`
      <div class="ab-calendar-card">
        <div class="ab-cal-head">
          <button class="ab-cal-arrow" id="ab-m-prev">‹</button>
          <span style="font-weight:700;">\${months[state.month - 1]} \${toFa(state.year)}</span>
          <button class="ab-cal-arrow" id="ab-m-next">›</button>
        </div>
        <div class="ab-cal-grid" style="font-size:11px;opacity:0.8;margin-bottom:6px;">
          \${weekDays.map(w => '<span>' + w + '</span>').join('')}
        </div>
        <div class="ab-cal-grid">\${cells}</div>
        <div class="ab-cal-foot">
          <button id="btn-gcal">📅 تقویم گوگل</button>
          <button id="btn-jump">🔄 رفتن به تاریخ</button>
        </div>
      </div>
    \`;

    document.getElementById('ab-m-prev').onclick = () => { if (state.month > 1) state.month--; render(); };
    document.getElementById('ab-m-next').onclick = () => { if (state.month < 12) state.month++; render(); };
    document.getElementById('btn-gcal').onclick = () => window.open('https://calendar.google.com/', '_blank');
    root.querySelectorAll('.ab-cal-cell').forEach(c => {
      c.onclick = () => { state.sel = parseInt(c.dataset.day); render(); };
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
`;
fs.writeFileSync(path.join(__dirname, 'modules', 'calendar', 'calendar.js'), calJs, 'utf8');

// ==========================================
// ۳. ماژول آب‌وهوا و ساعت (modules/weather)
// ==========================================
const weatherCss = `
/* استایل ماژولار آب‌وهوا و ساعت آبنر */
.ab-weather-card {
  width: 100% !important;
  max-width: 330px !important;
  padding: 14px 18px !important;
  border-radius: 20px !important;
  box-sizing: border-box !important;
  direction: rtl !important;
  font-family: inherit !important;
  color: #fff !important;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18) !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 12px !important;
}
`;
fs.writeFileSync(path.join(__dirname, 'modules', 'weather', 'weather.css'), weatherCss, 'utf8');

const weatherJs = `
/**
 * ماژول جاوااسکریپت ساعت و آب‌وهوای آبنر
 */
(function() {
  function render() {
    const rightCol = document.querySelector('.right-column') || document.body;
    let box = document.getElementById('abner-modular-weather');
    if (!box) {
      box = document.createElement('div');
      box.id = 'abner-modular-weather';
      rightCol.prepend(box);
    }
    const d = new Date();
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');

    box.innerHTML = \`
      <div class="ab-weather-card">
        <div>
          <div style="font-size:18px;font-weight:bold;">\${h}:\${m}</div>
          <div style="font-size:11px;opacity:0.75;">سه‌شنبه . تهران</div>
        </div>
        <div style="text-align:left;">
          <div style="font-size:18px;font-weight:bold;color:#60a5fa;">۲۸°</div>
          <div style="font-size:11px;opacity:0.75;">کمی ابری ⛅</div>
        </div>
      </div>
    \`;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
  setInterval(render, 10000);
})();
`;
fs.writeFileSync(path.join(__dirname, 'modules', 'weather', 'weather.js'), weatherJs, 'utf8');

// ==========================================
// ۴. الصاق دقیق و مرتب تمام ماژول‌ها در HTMLها
// ==========================================
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // حذف پیوندهای قدیمی
    html = html.replace(/\s*<link rel="stylesheet" href="modules\/[^"]+">\s*/g, '\n');
    html = html.replace(/\s*<script src="modules\/[^"]+"><\/script>\s*/g, '\n');

    // الصاق استایل‌ها
    const cssTags = `
  <link rel="stylesheet" href="modules/bookmark/bookmark.css">
  <link rel="stylesheet" href="modules/todo/todo.css">
  <link rel="stylesheet" href="modules/weather/weather.css">
  <link rel="stylesheet" href="modules/calendar/calendar.css">
</head>`;
    html = html.replace('</head>', cssTags);

    // الصاق اسکریپت‌ها
    const jsTags = `
  <script src="modules/bookmark/bookmark.js"></script>
  <script src="modules/todo/todo.js"></script>
  <script src="modules/weather/weather.js"></script>
  <script src="modules/calendar/calendar.js"></script>
</body>`;
    html = html.replace('</body>', jsTags);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 تمامی ماژول‌ها در ${filePath} رجیستر شدند.`);
  }
});

console.log('✨ تمام کدهای تسک، تقویم و آب‌وهوا داخل پوشه‌های اختصاصی خود نوشته شدند.');