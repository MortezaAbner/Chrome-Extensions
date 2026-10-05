const fs = require('fs');

// ۱. افزودن استایل‌ها به style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const shortcutEnhanceStyles = `
/* ========================================================
   استایل شیشه‌ای مودال افزودن میانبر و نوار انتخاب دسته‌جمعی
======================================================== */
.add-shortcut-modal-card,
#add-shortcut-modal,
#edit-shortcut-modal,
.shortcut-modal-box {
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 20px !important;
}

/* تیک آبی انتخاب میانبر */
.shortcut-item.is-selected {
  position: relative;
  outline: 2px solid #3b82f6 !important;
  border-radius: 16px !important;
}
.shortcut-item.is-selected::after {
  content: "✓";
  position: absolute;
  top: 4px;
  right: 4px;
  background: #3b82f6;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  z-index: 10;
}

/* نوار انتخاب دسته‌جمعی پایین صفحه */
#shortcut-bulk-bar {
  position: fixed;
  bottom: 85px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 40px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s ease;
  color: white;
  direction: rtl;
}
#shortcut-bulk-bar.active {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
#shortcut-bulk-bar .count-badge {
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
#shortcut-bulk-bar .btn-bulk-delete {
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
#shortcut-bulk-bar .btn-bulk-close {
  cursor: pointer;
  opacity: 0.7;
}
#shortcut-bulk-bar .btn-bulk-close:hover {
  opacity: 1;
}

/* منوی پاپ‌آپ سه‌نقطه میانبرها */
.shortcut-custom-menu {
  position: absolute;
  z-index: 10000;
  background: rgba(28, 25, 23, 0.88);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 6px;
  min-width: 160px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  direction: rtl;
}
.shortcut-custom-menu .menu-row {
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
.shortcut-custom-menu .menu-row:hover {
  background: rgba(255, 255, 255, 0.12);
}
.shortcut-custom-menu .menu-row.danger {
  color: #ef4444;
}
.shortcut-custom-menu hr {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}
`;

  if (!css.includes('shortcut-bulk-bar')) {
    css += '\n' + shortcutEnhanceStyles;
    fs.writeFileSync('./style.css', css, 'utf8');
  }
}

// ۲. تزریق منطق کامل رفتاری به script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const shortcutFullModule = `
// ========================================================
// ماژول مدیریت جامع میانبرها (منوی ۳ نقطه، انتخاب، ویرایش و تیک)
// ========================================================
(function initCompleteShortcutSuite() {
  let selectedShortcuts = new Set();

  // ۱. ایجاد نوار وضعیت انتخاب دسته‌جمعی در صورت نبودن در صفحه
  let bulkBar = document.getElementById('shortcut-bulk-bar');
  if (!bulkBar) {
    bulkBar = document.createElement('div');
    bulkBar.id = 'shortcut-bulk-bar';
    bulkBar.innerHTML = \`
      <span class="btn-bulk-close" id="bulk-bar-close">✕</span>
      <span class="btn-bulk-delete" id="bulk-bar-del">حذف 🗑️</span>
      <span style="opacity:0.3">|</span>
      <span>مورد انتخاب شده</span>
      <span class="count-badge" id="bulk-bar-count">۰</span>
    \`;
    document.body.appendChild(bulkBar);

    document.getElementById('bulk-bar-close')?.addEventListener('click', clearAllShortcutSelections);
    document.getElementById('bulk-bar-del')?.addEventListener('click', deleteSelectedShortcuts);
  }

  function updateBulkBar() {
    const countEl = document.getElementById('bulk-bar-count');
    if (!countEl) return;
    const count = selectedShortcuts.size;
    countEl.textContent = count;
    if (count > 0) {
      bulkBar.classList.add('active');
    } else {
      bulkBar.classList.remove('active');
    }
  }

  function clearAllShortcutSelections() {
    selectedShortcuts.clear();
    document.querySelectorAll('.shortcut-item, .shortcut-card').forEach(el => {
      el.classList.remove('is-selected');
    });
    updateBulkBar();
  }

  function deleteSelectedShortcuts() {
    if (selectedShortcuts.size === 0) return;
    let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
    list = list.filter((_, idx) => !selectedShortcuts.has(idx.toString()));
    localStorage.setItem('user_shortcuts', JSON.stringify(list));
    clearAllShortcutSelections();
    if (typeof renderShortcuts === 'function') renderShortcuts();
    else location.reload();
  }

  // ۲. مدیریت کلیک راست یا سه‌نقطه میانبرها برای باز کردن منو
  window.openShortcutOptionsMenu = function(e, index, itemEl, shortcutData) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.querySelectorAll('.shortcut-custom-menu').forEach(m => m.remove());

    const isSelected = selectedShortcuts.has(index.toString());
    const menu = document.createElement('div');
    menu.className = 'shortcut-custom-menu';

    menu.innerHTML = \`
      <div class="menu-row" id="m-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="menu-row" id="m-open-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="menu-row" id="m-select"><span>\${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>\${isSelected ? '✕' : '☑'}</span></div>
      <hr>
      <div class="menu-row" id="m-edit"><span>ویرایش</span> <span>✏️️</span></div>
      <div class="menu-row" id="m-copy"><span>کپی لینک</span> <span>📋</span></div>
      <hr>
      <div class="menu-row danger" id="m-delete"><span>حذف</span> <span>🗑️</span></div>
    \`;

    document.body.appendChild(menu);

    const rect = itemEl.getBoundingClientRect();
    menu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    menu.style.left = Math.max(10, rect.left + window.scrollX - 40) + 'px';

    // عملکرد گزینه‌ها
    menu.querySelector('#m-open').onclick = () => {
      window.location.href = shortcutData.url;
      menu.remove();
    };
    menu.querySelector('#m-open-tab').onclick = () => {
      window.open(shortcutData.url, '_blank');
      menu.remove();
    };
    menu.querySelector('#m-select').onclick = () => {
      if (isSelected) {
        selectedShortcuts.delete(index.toString());
        itemEl.classList.remove('is-selected');
      } else {
        selectedShortcuts.add(index.toString());
        itemEl.classList.add('is-selected');
      }
      updateBulkBar();
      menu.remove();
    };
    menu.querySelector('#m-copy').onclick = () => {
      navigator.clipboard.writeText(shortcutData.url);
      menu.remove();
    };
    menu.querySelector('#m-edit').onclick = () => {
      menu.remove();
      openShortcutEditModal(index, shortcutData);
    };
    menu.querySelector('#m-delete').onclick = () => {
      menu.remove();
      let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
      list.splice(index, 1);
      localStorage.setItem('user_shortcuts', JSON.stringify(list));
      selectedShortcuts.delete(index.toString());
      updateBulkBar();
      if (typeof renderShortcuts === 'function') renderShortcuts();
      else location.reload();
    };

    const closeHandler = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 50);
  };

  // ۳. پاپ‌آپ اختصاصی ویرایش میانبر با تایید و انصراف
  function openShortcutEditModal(index, data) {
    document.getElementById('shortcut-edit-dialog')?.remove();

    const dPx = localStorage.getItem('blur_dash_val') || '25';
    const dialog = document.createElement('div');
    dialog.id = 'shortcut-edit-dialog';
    dialog.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:99999;background:rgba(0,0,0,0.4);';

    dialog.innerHTML = \`
      <div style="width:340px;padding:20px;border-radius:20px;background:rgba(255,255,255,0.12);backdrop-filter:blur(\${dPx}px) saturate(160%);-webkit-backdrop-filter:blur(\${dPx}px) saturate(160%);border:1px solid rgba(255,255,255,0.25);color:white;direction:rtl;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
        <h4 style="margin:0 0 15px 0;font-size:15px;font-weight:bold;">ویرایش میانبر</h4>
        <input id="edit-s-title" type="text" value="\${data.title || data.name || ''}" placeholder="نام میانبر" style="width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.25);color:white;margin-bottom:10px;box-sizing:border-box;">
        <input id="edit-s-url" type="text" value="\${data.url || ''}" placeholder="آدرس سایت" style="width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.25);color:white;margin-bottom:15px;box-sizing:border-box;">
        <div style="display:flex;gap:10px;">
          <button id="edit-s-save" style="flex:1;padding:10px;background:#2563eb;color:white;border:none;border-radius:12px;cursor:pointer;font-weight:bold;">تأیید و ذخیره</button>
          <button id="edit-s-cancel" style="flex:1;padding:10px;background:rgba(255,255,255,0.15);color:white;border:none;border-radius:12px;cursor:pointer;">انصراف</button>
        </div>
      </div>
    \`;

    document.body.appendChild(dialog);

    document.getElementById('edit-s-cancel').onclick = () => dialog.remove();
    document.getElementById('edit-s-save').onclick = () => {
      const newTitle = document.getElementById('edit-s-title').value.trim();
      const newUrl = document.getElementById('edit-s-url').value.trim();
      if (!newUrl) return;

      let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
      if (list[index]) {
        list[index].title = newTitle || newUrl;
        list[index].name = newTitle || newUrl;
        list[index].url = newUrl;
        localStorage.setItem('user_shortcuts', JSON.stringify(list));
      }
      dialog.remove();
      if (typeof renderShortcuts === 'function') renderShortcuts();
      else location.reload();
    };
  }

  // قلاب کردن خودکار به دکمه‌های ۳ نقطه و کارت‌های شورت‌کات
  function bindToAllShortcutCards() {
    const shortcutEls = document.querySelectorAll('.shortcut-item, .shortcut-card');
    let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');

    shortcutEls.forEach((el, idx) => {
      const moreBtn = el.querySelector('.shortcut-more-btn, .more-btn, [data-action="more"]');
      const itemData = list[idx] || { title: el.innerText, url: el.getAttribute('href') || '#' };

      if (moreBtn) {
        moreBtn.onclick = (e) => window.openShortcutOptionsMenu(e, idx, el, itemData);
      } else {
        el.oncontextmenu = (e) => window.openShortcutOptionsMenu(e, idx, el, itemData);
      }
    });
  }

  setInterval(bindToAllShortcutCards, 1500);
})();
`;

  // ثبت و پاک‌سازی نسخه‌های قدیمی این ماژول در script.js
  js = js.replace(/\/\/ ========================================================\s*\/\/ ماژول مدیریت جامع میانبرها[\s\S]*?initCompleteShortcutSuite\(\);?\s*\}\)\(\);?/g, '');
  js += '\n' + shortcutFullModule;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ منوی کامل میانبرها، گزینه‌های باز کردن، تب جدید، انتخاب و تیک، ویرایش، کپی و حذف اعمال شدند.');
}