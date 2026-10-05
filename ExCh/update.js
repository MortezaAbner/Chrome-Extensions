const fs = require('fs');

// ۱. افزودن استایل شیشه‌ای اختصاصی به style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const dastyarShortcutStyles = `
/* ========================================================
   استایل شیشه‌ای مودال‌ها و منوی میانبرها برگرفته از دستیار
======================================================== */
.modal-overlay-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.modal-overlay-custom.active {
  opacity: 1;
  pointer-events: auto;
}

.glass-shortcut-modal {
  width: 90%;
  max-width: 380px;
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(170%);
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(170%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  color: #fff;
  direction: rtl;
  font-family: inherit;
}
[data-theme="dark"] .glass-shortcut-modal {
  background: rgba(15, 23, 42, 0.35);
  border-color: rgba(255, 255, 255, 0.12);
}

.glass-shortcut-modal h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
}
.glass-shortcut-modal input {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}
.glass-shortcut-modal input:focus {
  border-color: #3b82f6;
}

.glass-modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.glass-btn-confirm {
  flex: 1;
  padding: 11px;
  border-radius: 14px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.glass-btn-confirm:hover { opacity: 0.9; }

.glass-btn-cancel {
  flex: 1;
  padding: 11px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
}

/* تیک انتخاب میانبر */
.shortcut-item.is-selected {
  outline: 2px solid #3b82f6 !important;
  border-radius: 18px !important;
  position: relative;
}
.shortcut-item.is-selected::after {
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
  z-index: 20;
}

/* نوار انتخاب دسته‌جمعی */
#dastyar-bulk-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%);
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 9999px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 99999;
  color: #fff;
  direction: rtl;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s ease;
}
#dastyar-bulk-bar.active {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
#dastyar-bulk-bar .count-pill {
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
#dastyar-bulk-bar .bulk-btn-del {
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
#dastyar-bulk-bar .bulk-btn-close {
  cursor: pointer;
  opacity: 0.6;
}
#dastyar-bulk-bar .bulk-btn-close:hover { opacity: 1; }

/* منوی بازشونده ۳ نقطه */
.dastyar-context-menu {
  position: absolute;
  z-index: 100005;
  background: rgba(28, 25, 23, 0.88);
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 6px;
  min-width: 165px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45);
  direction: rtl;
}
.dastyar-context-menu .item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  color: #f1f5f9;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.dastyar-context-menu .item-row:hover {
  background: rgba(255, 255, 255, 0.12);
}
.dastyar-context-menu .item-row.danger {
  color: #ef4444;
}
.dastyar-context-menu hr {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}
`;

  if (!css.includes('dastyar-bulk-bar')) {
    css += '\n' + dastyarShortcutStyles;
    fs.writeFileSync('./style.css', css, 'utf8');
  }
}

// ۲. تزریق منطق کامل رفتار به script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const dastyarModuleLogic = `
// ========================================================
// لاجیک مستقل میانبرها برگرفته از ساختار دستیار
// ========================================================
(function initDastyarShortcutModule() {
  let selectedIndices = new Set();

  // ۱. نوار اقدام پایینی
  let bar = document.getElementById('dastyar-bulk-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'dastyar-bulk-bar';
    bar.innerHTML = \`
      <span class="bulk-btn-close" id="dastyar-bar-cancel">✕</span>
      <span class="bulk-btn-del" id="dastyar-bar-delete">حذف 🗑️</span>
      <span style="opacity:0.3">|</span>
      <span>مورد انتخاب شده</span>
      <span class="count-pill" id="dastyar-bar-count">۰</span>
    \`;
    document.body.appendChild(bar);

    document.getElementById('dastyar-bar-cancel')?.addEventListener('click', resetAllSelections);
    document.getElementById('dastyar-bar-delete')?.addEventListener('click', deleteBatchShortcuts);
  }

  function syncBarState() {
    const countEl = document.getElementById('dastyar-bar-count');
    if (!countEl) return;
    const count = selectedIndices.size;
    countEl.textContent = count;
    if (count > 0) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  }

  function resetAllSelections() {
    selectedIndices.clear();
    document.querySelectorAll('.shortcut-item, .shortcut-card').forEach(el => {
      el.classList.remove('is-selected');
    });
    syncBarState();
  }

  function deleteBatchShortcuts() {
    if (selectedIndices.size === 0) return;
    let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
    list = list.filter((_, idx) => !selectedIndices.has(idx.toString()));
    localStorage.setItem('user_shortcuts', JSON.stringify(list));
    resetAllSelections();
    if (typeof renderShortcuts === 'function') renderShortcuts();
    else location.reload();
  }

  // ۲. پاپ‌آپ ویرایش یا افزودن شیشه‌ای
  window.openDastyarShortcutModal = function(index, existingData) {
    const isEdit = existingData !== undefined && existingData !== null;
    let overlay = document.getElementById('dastyar-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'dastyar-modal-overlay';
      overlay.className = 'modal-overlay-custom';
      document.body.appendChild(overlay);
    }

    const titleVal = isEdit ? (existingData.title || existingData.name || '') : '';
    const urlVal = isEdit ? (existingData.url || '') : '';

    overlay.innerHTML = \`
      <div class="glass-shortcut-modal">
        <h3>\${isEdit ? 'ویرایش میانبر' : 'افزودن میانبر'}</h3>
        <input id="ds-modal-title" type="text" placeholder="نام میانبر" value="\${titleVal}">
        <input id="ds-modal-url" type="text" placeholder="آدرس سایت (مثلا: https://example.com)" value="\${urlVal}">
        <div class="glass-modal-actions">
          <button class="glass-btn-confirm" id="ds-modal-confirm">\${isEdit ? 'تأیید و ذخیره' : 'افزودن'}</button>
          <button class="glass-btn-cancel" id="ds-modal-cancel">انصراف</button>
        </div>
      </div>
    \`;

    overlay.classList.add('active');

    document.getElementById('ds-modal-cancel').onclick = () => {
      overlay.classList.remove('active');
    };

    document.getElementById('ds-modal-confirm').onclick = () => {
      const title = document.getElementById('ds-modal-title').value.trim();
      let url = document.getElementById('ds-modal-url').value.trim();
      if (!url) return;
      if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;

      let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
      if (isEdit && list[index]) {
        list[index].title = title || url;
        list[index].name = title || url;
        list[index].url = url;
      } else {
        list.push({ title: title || url, name: title || url, url: url });
      }
      localStorage.setItem('user_shortcuts', JSON.stringify(list));
      overlay.classList.remove('active');
      if (typeof renderShortcuts === 'function') renderShortcuts();
      else location.reload();
    };
  };

  // ۳. ایجاد و مدیریت منوی گزینه‌های سه‌نقطه
  window.openDastyarContextMenu = function(e, index, itemEl, data) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.querySelectorAll('.dastyar-context-menu').forEach(m => m.remove());

    const isSelected = selectedIndices.has(index.toString());
    const menu = document.createElement('div');
    menu.className = 'dastyar-context-menu';

    menu.innerHTML = \`
      <div class="item-row" id="act-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="item-row" id="act-open-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="item-row" id="act-toggle-select"><span>\${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>\${isSelected ? '✕' : '☑'}</span></div>
      <hr>
      <div class="item-row" id="act-edit"><span>ویرایش</span> <span>✏</span></div>
      <div class="item-row" id="act-copy"><span>کپی لینک</span> <span>📋</span></div>
      <hr>
      <div class="item-row danger" id="act-del"><span>حذف</span> <span>🗑️</span></div>
    \`;

    document.body.appendChild(menu);

    const rect = itemEl.getBoundingClientRect();
    menu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    menu.style.left = Math.max(12, rect.left + window.scrollX - 35) + 'px';

    menu.querySelector('#act-open').onclick = () => {
      window.location.href = data.url;
      menu.remove();
    };
    menu.querySelector('#act-open-tab').onclick = () => {
      window.open(data.url, '_blank');
      menu.remove();
    };
    menu.querySelector('#act-toggle-select').onclick = () => {
      if (isSelected) {
        selectedIndices.delete(index.toString());
        itemEl.classList.remove('is-selected');
      } else {
        selectedIndices.add(index.toString());
        itemEl.classList.add('is-selected');
      }
      syncBarState();
      menu.remove();
    };
    menu.querySelector('#act-edit').onclick = () => {
      menu.remove();
      window.openDastyarShortcutModal(index, data);
    };
    menu.querySelector('#act-copy').onclick = () => {
      navigator.clipboard.writeText(data.url);
      menu.remove();
    };
    menu.querySelector('#act-del').onclick = () => {
      menu.remove();
      let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
      list.splice(index, 1);
      localStorage.setItem('user_shortcuts', JSON.stringify(list));
      selectedIndices.delete(index.toString());
      syncBarState();
      if (typeof renderShortcuts === 'function') renderShortcuts();
      else location.reload();
    };

    const docDismiss = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', docDismiss);
      }
    };
    setTimeout(() => document.addEventListener('click', docDismiss), 40);
  };

  // ۴. اتصال خودکار به تمام آیتم‌ها و دکمه افزودن (+)
  function bindDastyarElements() {
    const addBtn = document.querySelector('.add-shortcut-btn, #add-shortcut-btn, [data-action="add-shortcut"]');
    if (addBtn && !addBtn.dataset.dastyarBound) {
      addBtn.dataset.dastyarBound = 'true';
      addBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.openDastyarShortcutModal();
      };
    }

    const shortcutCards = document.querySelectorAll('.shortcut-item, .shortcut-card');
    let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');

    shortcutCards.forEach((card, idx) => {
      const moreIcon = card.querySelector('.shortcut-more-btn, .more-btn, [data-action="more"]');
      const itemData = list[idx] || { title: card.innerText.trim(), url: card.getAttribute('href') || '#' };

      if (moreIcon && !moreIcon.dataset.dastyarBound) {
        moreIcon.dataset.dastyarBound = 'true';
        moreIcon.onclick = (e) => window.openDastyarContextMenu(e, idx, card, itemData);
      }
      if (!card.dataset.contextBound) {
        card.dataset.contextBound = 'true';
        card.oncontextmenu = (e) => window.openDastyarContextMenu(e, idx, card, itemData);
      }
    });
  }

  setInterval(bindDastyarElements, 1000);
})();
`;

  // پاک‌سازی ماژول قبلی و اتصال ماژول تمیز جدید
  js = js.replace(/\/\/ ========================================================\s*\/\/ لاجیک مستقل میانبرها برگرفته از ساختار دستیار[\s\S]*?initDastyarShortcutModule\(\);?\s*\}\)\(\);?/g, '');
  js += '\n' + dastyarModuleLogic;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ ماژول استاندارد میانبر دستیار به همراه اتصال کامل به ماتی داشبورد پیاده‌سازی شد.');
}