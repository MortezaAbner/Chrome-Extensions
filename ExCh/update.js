const fs = require('fs');

// ۱. افزودن استایل شیشه‌ای اختصاصی میانبرها به style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const shortcutCss = `
/* ========================================================
   استایل‌های شیشه‌ای میانبرها و منوی سه‌نقطه بر پایه دستیار
======================================================== */
.shortcut-item-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 6px;
  border-radius: 18px;
  cursor: pointer;
  user-select: none;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  transition: transform 0.15s ease, background 0.2s ease;
}
.shortcut-item-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.14) !important;
}
[data-theme="dark"] .shortcut-item-card {
  background: rgba(15, 23, 42, 0.22) !important;
}

/* تیک آبی انتخاب میانبر */
.shortcut-item-card.is-selected {
  outline: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.18) !important;
}
.shortcut-item-card.is-selected::after {
  content: "✓";
  position: absolute;
  top: 4px;
  right: 4px;
  background: #3b82f6;
  color: #fff;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
}

.shortcut-dots-btn {
  position: absolute;
  top: 4px;
  left: 4px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 6px;
}
.shortcut-dots-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* نوار انتخاب دسته‌‌جمعی شناور در پایین */
.shortcut-bulk-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 9999px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 99999;
  color: #fff;
  direction: rtl;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s ease;
}
.shortcut-bulk-bar.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.shortcut-bulk-bar .bulk-badge {
  background: #3b82f6;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
.shortcut-bulk-bar .bulk-del { color: #ef4444; cursor: pointer; }
.shortcut-bulk-bar .bulk-close { cursor: pointer; opacity: 0.6; }
.shortcut-bulk-bar .bulk-close:hover { opacity: 1; }

/* منوی شناور سه‌نقطه میانبر */
.shortcut-floating-menu {
  position: absolute;
  z-index: 100000;
  background: rgba(28, 25, 23, 0.88);
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 6px;
  min-width: 165px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  direction: rtl;
}
.shortcut-floating-menu .menu-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  color: #f1f5f9;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
}
.shortcut-floating-menu .menu-action:hover { background: rgba(255, 255, 255, 0.14); }
.shortcut-floating-menu .menu-action.danger { color: #ef4444; }
.shortcut-floating-menu .menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}

/* مودال شیشه‌ای افزودن و ویرایش */
.shortcut-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100005;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.shortcut-modal-overlay.active { opacity: 1; pointer-events: auto; }
.shortcut-glass-modal {
  width: 90%;
  max-width: 360px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(170%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(170%) !important;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  direction: rtl;
}
.shortcut-glass-modal h3 { margin: 0 0 14px 0; font-size: 16px; }
.shortcut-glass-modal input {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  box-sizing: border-box;
}
.shortcut-glass-modal .modal-btn-row { display: flex; gap: 10px; margin-top: 6px; }
.shortcut-glass-modal .btn-confirm {
  flex: 1; padding: 10px; border-radius: 12px; background: #2563eb; border: none; color: #fff; font-weight: bold; cursor: pointer;
}
.shortcut-glass-modal .btn-cancel {
  flex: 1; padding: 10px; border-radius: 12px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; cursor: pointer;
}
`;

  if (!css.includes('shortcut-bulk-bar')) {
    css += '\n' + shortcutCss;
    fs.writeFileSync('./style.css', css, 'utf8');
  }
}

// ۲. تزریق منطق اجرایی ۱ به ۱ دستیار به script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const shortcutJs = `
// ========================================================
// موتور اجرایی میانبرهای دستیار با حفظ استایل شیشه‌ای
// ========================================================
(function initShortcutsEngine() {
  const STORAGE_KEY = 'user_shortcuts';
  let selectedIndices = new Set();

  function getShortcuts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [
        { title: 'گوگل', url: 'https://www.google.com' },
        { title: 'یوتیوب', url: 'https://www.youtube.com' },
        { title: 'تلگرام', url: 'https://web.telegram.org' },
        { title: 'اینستاگرام', url: 'https://www.instagram.com' },
        { title: 'دیجی‌کالا', url: 'https://www.digikala.com' },
        { title: 'دیوار', url: 'https://divar.ir' }
      ];
    } catch (e) {
      return [];
    }
  }

  function saveShortcuts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    renderShortcuts();
  }

  function ensureBulkBar() {
    let bar = document.getElementById('shortcut-bulk-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'shortcut-bulk-bar';
      bar.className = 'shortcut-bulk-bar';
      bar.innerHTML = \`
        <span class="bulk-close" id="bulk-close-btn" title="لغو انتخاب">✕</span>
        <span class="bulk-del" id="bulk-del-btn">حذف 🗑️</span>
        <span style="opacity:0.3">|</span>
        <span>مورد انتخاب شده</span>
        <span class="bulk-badge" id="bulk-counter">۰</span>
      \`;
      document.body.appendChild(bar);

      document.getElementById('bulk-close-btn').onclick = clearSelection;
      document.getElementById('bulk-del-btn').onclick = deleteSelected;
    }
    return bar;
  }

  function updateBulkBar() {
    const bar = ensureBulkBar();
    const counter = document.getElementById('bulk-counter');
    const count = selectedIndices.size;
    if (counter) counter.textContent = count;
    if (count > 0) bar.classList.add('visible');
    else bar.classList.remove('visible');
  }

  function clearSelection() {
    selectedIndices.clear();
    document.querySelectorAll('.shortcut-item-card').forEach(el => el.classList.remove('is-selected'));
    updateBulkBar();
  }

  function deleteSelected() {
    if (selectedIndices.size === 0) return;
    let list = getShortcuts();
    list = list.filter((_, idx) => !selectedIndices.has(idx));
    clearSelection();
    saveShortcuts(list);
  }

  function openShortcutModal(index = null, currentItem = null) {
    const isEdit = index !== null && currentItem !== null;
    let modalOverlay = document.getElementById('shortcut-editor-overlay');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'shortcut-editor-overlay';
      modalOverlay.className = 'shortcut-modal-overlay';
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = \`
      <div class="shortcut-glass-modal">
        <h3>\${isEdit ? 'ویرایش میانبر' : 'افزودن میانبر'}</h3>
        <input type="text" id="sh-input-name" placeholder="نام میانبر" value="\${isEdit ? (currentItem.title || '') : ''}">
        <input type="text" id="sh-input-url" placeholder="آدرس سایت (مثال: https://site.com)" value="\${isEdit ? (currentItem.url || '') : ''}">
        <div class="modal-btn-row">
          <button class="btn-confirm" id="sh-btn-save">\${isEdit ? 'تأیید و ذخیره' : 'افزودن'}</button>
          <button class="btn-cancel" id="sh-btn-cancel">انصراف</button>
        </div>
      </div>
    \`;

    modalOverlay.classList.add('active');

    document.getElementById('sh-btn-cancel').onclick = () => modalOverlay.classList.remove('active');
    document.getElementById('sh-btn-save').onclick = () => {
      const name = document.getElementById('sh-input-name').value.trim();
      let url = document.getElementById('sh-input-url').value.trim();
      if (!url) return;
      if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;

      let list = getShortcuts();
      if (isEdit) {
        list[index] = { title: name || url, url: url };
      } else {
        list.push({ title: name || url, url: url });
      }
      modalOverlay.classList.remove('active');
      saveShortcuts(list);
    };
  }

  function openContextMenu(e, index, item, targetCard) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.querySelectorAll('.shortcut-floating-menu').forEach(m => m.remove());

    const isSelected = selectedIndices.has(index);
    const menu = document.createElement('div');
    menu.className = 'shortcut-floating-menu';

    menu.innerHTML = \`
      <div class="menu-action" id="ctx-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="menu-action" id="ctx-open-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="menu-action" id="ctx-select"><span>\${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>\${isSelected ? '✕' : '☑'}</span></div>
      <div class="menu-divider"></div>
      <div class="menu-action" id="ctx-edit"><span>ویرایش</span> <span>✏</span></div>
      <div class="menu-action" id="ctx-copy"><span>کپی لینک</span> <span>📋</span></div>
      <div class="menu-divider"></div>
      <div class="menu-action danger" id="ctx-delete"><span>حذف</span> <span>🗑️</span></div>
    \`;

    document.body.appendChild(menu);

    const rect = targetCard.getBoundingClientRect();
    menu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    menu.style.left = Math.max(12, rect.left + window.scrollX - 25) + 'px';

    menu.querySelector('#ctx-open').onclick = () => { window.location.href = item.url; menu.remove(); };
    menu.querySelector('#ctx-open-tab').onclick = () => { window.open(item.url, '_blank'); menu.remove(); };
    menu.querySelector('#ctx-select').onclick = () => {
      if (isSelected) {
        selectedIndices.delete(index);
        targetCard.classList.remove('is-selected');
      } else {
        selectedIndices.add(index);
        targetCard.classList.add('is-selected');
      }
      updateBulkBar();
      menu.remove();
    };
    menu.querySelector('#ctx-edit').onclick = () => { menu.remove(); openShortcutModal(index, item); };
    menu.querySelector('#ctx-copy').onclick = () => { navigator.clipboard.writeText(item.url); menu.remove(); };
    menu.querySelector('#ctx-delete').onclick = () => {
      menu.remove();
      let list = getShortcuts();
      list.splice(index, 1);
      selectedIndices.delete(index);
      updateBulkBar();
      saveShortcuts(list);
    };

    const docClick = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', docClick);
      }
    };
    setTimeout(() => document.addEventListener('click', docClick), 50);
  }

  window.renderShortcuts = function () {
    const container = document.getElementById('shortcuts-container') || document.querySelector('.shortcuts-grid');
    if (!container) return;

    container.innerHTML = '';
    const shortcuts = getShortcuts();

    shortcuts.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'shortcut-item-card ' + (selectedIndices.has(index) ? 'is-selected' : '');
      const domain = (new URL(item.url || 'https://google.com')).hostname;

      card.innerHTML = \`
        <button class="shortcut-dots-btn" title="گزینه‌ها">⋮</button>
        <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
          <img src="https://www.google.com/s2/favicons?domain=\${domain}&sz=64" style="width:28px;height:28px;object-fit:contain;" onerror="this.style.display='none'">
        </div>
        <span style="font-size:12px;color:#fff;max-width:76px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${item.title}</span>
      \`;

      card.onclick = (e) => {
        if (e.target.closest('.shortcut-dots-btn')) return;
        if (selectedIndices.size > 0) {
          if (selectedIndices.has(index)) {
            selectedIndices.delete(index);
            card.classList.remove('is-selected');
          } else {
            selectedIndices.add(index);
            card.classList.add('is-selected');
          }
          updateBulkBar();
          return;
        }
        window.location.href = item.url;
      };

      const dots = card.querySelector('.shortcut-dots-btn');
      dots.onclick = (e) => openContextMenu(e, index, item, card);
      card.oncontextmenu = (e) => openContextMenu(e, index, item, card);

      container.appendChild(card);
    });

    // دکمه افزودن (+)
    const addCard = document.createElement('div');
    addCard.className = 'shortcut-item-card';
    addCard.innerHTML = \`
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff;">+</div>
      <span style="font-size:12px;color:#fff;opacity:0.8;">افزودن</span>
    \`;
    addCard.onclick = () => openShortcutModal();
    container.appendChild(addCard);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.renderShortcuts);
  } else {
    window.renderShortcuts();
  }
})();
`;

  // پاک‌سازی تعریف‌های قبلی و ثبت نسخه استاندارد
  js = js.replace(/\/\/ ========================================================\s*\/\/ موتور اجرایی میانبرهای دستیار[\s\S]*?initShortcutsEngine\(\);?\s*\}\)\(\);?/g, '');
  js += '\n' + shortcutJs;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ ماژول شیشه‌ای میانبرها بر پایه دستیار با موفقیت ادغام شد.');
}