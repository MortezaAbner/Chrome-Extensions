const fs = require('fs');
const path = require('path');

console.log('🚀 در حال راه‌اندازی ماژول بوکمارک گروهی و شبکه شیشه‌ای آبنر...');

const bookmarkDir = path.join(__dirname, 'modules', 'bookmark');
if (!fs.existsSync(bookmarkDir)) {
  fs.mkdirSync(bookmarkDir, { recursive: true });
}

// ۱. استایل کامل شیشه‌ای برای بوکمارک‌های گروهی و تک‌کارت‌ها (modules/bookmark/bookmark.css)
const bookmarkCss = `
/* ========================================================
   استایل ماژولار شبکه بوکمارک گروهی آبنر
======================================================== */
.ab-bookmarks-wrapper {
  width: 100%;
  max-width: 920px;
  margin: 0 auto 30px auto;
  direction: rtl;
  user-select: none;
  font-family: inherit;
}

/* تب‌ها و دسته‌بندی‌های پوشه‌ها */
.ab-folder-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
}
.ab-folder-tabs::-webkit-scrollbar { display: none; }

.ab-folder-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: rgba(255, 255, 255, calc(var(--dash-glass-opacity, 0.12) + 0.05)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  color: #fff;
  transition: all 0.2s ease;
}
.ab-folder-tab:hover {
  background: rgba(255, 255, 255, 0.22) !important;
}
.ab-folder-tab.active {
  background: #2563eb !important;
  border-color: #3b82f6 !important;
}

.ab-add-folder-btn {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  border: 1px dashed var(--dash-glass-border, rgba(255, 255, 255, 0.3));
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}
.ab-add-folder-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* شبکه کارت‌های بوکمارک */
.ab-bookmarks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  width: 100%;
}
@media (min-width: 992px) {
  .ab-bookmarks-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.ab-bookmark-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 98px;
  padding: 12px 8px;
  border-radius: 20px;
  cursor: pointer;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s ease, filter 0.2s ease, background 0.2s ease;
}
.ab-bookmark-box:hover {
  transform: translateY(-2px);
  filter: brightness(1.15);
}

.ab-bookmark-box.is-damdasti {
  border: 1px dashed rgba(59, 130, 246, 0.6) !important;
  background: rgba(59, 130, 246, calc(var(--dash-glass-opacity, 0.12) + 0.1)) !important;
}

.ab-box-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #fff;
  margin-bottom: 6px;
}
.ab-box-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.ab-box-title {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  max-width: 86px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.ab-box-dots {
  position: absolute;
  top: 6px;
  left: 6px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 6px;
  z-index: 5;
}
.ab-box-dots:hover { background: rgba(255, 255, 255, 0.25); color: #fff; }

.ab-bookmark-box.is-selected {
  outline: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.28) !important;
}
.ab-bookmark-box.is-selected::after {
  content: "✓";
  position: absolute;
  top: 6px;
  right: 6px;
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
  z-index: 10;
}

/* منوی ۶ حالته آبنر */
.ab-context-menu {
  position: fixed;
  z-index: 9999999;
  width: 185px;
  background: var(--dash-menu-bg, rgba(28, 22, 26, 0.92)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.22)) !important;
  border-radius: 18px !important;
  padding: 6px !important;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6) !important;
  direction: rtl !important;
  color: #fff !important;
  font-family: inherit !important;
  user-select: none !important;
}
.ab-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.ab-menu-item:hover { background: rgba(255, 255, 255, 0.15); }
.ab-menu-item.danger { color: #ef4444; }

.ab-submenu-trigger { position: relative; }
.ab-submenu-box {
  display: none;
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 6px;
  width: 145px;
  background: var(--dash-menu-bg, rgba(28, 22, 26, 0.95));
  backdrop-filter: blur(var(--dash-blur-px, 20px));
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 14px;
  padding: 6px;
}
.ab-submenu-trigger:hover .ab-submenu-box { display: block; }
.ab-submenu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.ab-submenu-row:hover { background: rgba(255,255,255,0.12); }
.ab-submenu-row.active { color: #60a5fa; }

/* نوار انتخاب دسته‌جمعی */
.ab-bulk-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  background: var(--dash-menu-bg, rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 9999px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 999999;
  color: #fff;
  direction: rtl;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s ease;
}
.ab-bulk-bar.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.ab-bulk-counter {
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
.ab-bulk-del { color: #ef4444; cursor: pointer; }
.ab-bulk-close { cursor: pointer; opacity: 0.7; }

/* پاپ‌‌آپ شیشه‌ای */
.ab-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000000;
  direction: rtl;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.ab-modal-overlay.active { opacity: 1; pointer-events: auto; }
.ab-glass-modal {
  width: 90%;
  max-width: 360px;
  padding: 22px;
  border-radius: 22px;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.15)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(170%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.25));
  color: #fff;
}
.ab-glass-modal h3 { margin: 0 0 14px 0; font-size: 15px; }
.ab-glass-modal input {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  box-sizing: border-box;
}
.ab-modal-actions { display: flex; gap: 10px; margin-top: 6px; }
.ab-btn-save {
  flex: 1; padding: 10px; background: #2563eb; color: #fff; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;
}
.ab-btn-cancel {
  flex: 1; padding: 10px; background: rgba(255, 255, 255, 0.15); border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2)); color: #fff; border-radius: 12px; cursor: pointer;
}
`;
fs.writeFileSync(path.join(bookmarkDir, 'bookmark.css'), bookmarkCss, 'utf8');

// ۲. ماژول جاوااسکریپت بوکمارک گروهی با ساخت خودکار کانتینر در صورت نبودن (modules/bookmark/bookmark.js)
const bookmarkJs = `
/**
 * ماژول مستقل بوکمارک‌های گروهی آبنر
 */
(function initAbnerBookmarks() {
  const STORAGE_KEY = 'abner_bookmarks_data';
  const MAX_SLOTS = 11;
  let selectedIndices = new Set();
  let currentFolder = 'all';

  function getData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    
    // مهاجرت داده‌های ساده قبلی یا ایجاد حالت پیش‌فرض
    let oldList = [];
    try {
      oldList = JSON.parse(localStorage.getItem('shortcuts') || localStorage.getItem('user_shortcuts') || '[]');
    } catch(e) {}

    const defaultItems = (Array.isArray(oldList) && oldList.length > 0) ? oldList.map(item => ({ ...item, folder: 'all' })) : [
      { title: 'گوگل', url: 'https://www.google.com', folder: 'all' },
      { title: 'یوتیوب', url: 'https://www.youtube.com', folder: 'all' },
      { title: 'تلگرام', url: 'https://web.telegram.org', folder: 'all' },
      { title: 'اینستاگرام', url: 'https://www.instagram.com', folder: 'all' },
      { title: 'دیجی‌کالا', url: 'https://www.digikala.com', folder: 'all' },
      { title: 'دیوار', url: 'https://divar.ir', folder: 'all' }
    ];

    return {
      folders: [
        { id: 'all', title: 'صفحه اصلی' },
        { id: 'work', title: 'دم دستی' }
      ],
      items: defaultItems
    };
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // پشتیبانی معکوس برای سازگاری دیگر بخش‌ها
    localStorage.setItem('shortcuts', JSON.stringify(data.items));
    render();
  }

  function getFavicon(url) {
    try {
      const host = new URL(url).hostname;
      return 'https://www.google.com/s2/favicons?domain=' + host + '&sz=64';
    } catch(e) {
      return '';
    }
  }

  function ensureBulkBar() {
    let bar = document.getElementById('ab-bulk-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'ab-bulk-bar';
      bar.className = 'ab-bulk-bar';
      bar.innerHTML = \`
        <span class="ab-bulk-close" id="ab-bulk-close">✕</span>
        <span class="ab-bulk-del" id="ab-bulk-del">حذف 🗑</span>
        <span style="opacity:0.3">|</span>
        <span>مورد انتخاب شده</span>
        <span class="ab-bulk-counter" id="ab-bulk-counter">۰</span>
      \`;
      document.body.appendChild(bar);

      document.getElementById('ab-bulk-close').onclick = () => {
        selectedIndices.clear();
        document.querySelectorAll('.ab-bookmark-box').forEach(c => c.classList.remove('is-selected'));
        updateBulkBar();
      };

      document.getElementById('ab-bulk-del').onclick = () => {
        const data = getData();
        const activeItems = data.items.filter(it => currentFolder === 'all' || it.folder === currentFolder);
        const toDeleteUrls = new Set();
        selectedIndices.forEach(idx => {
          if (activeItems[idx]) toDeleteUrls.add(activeItems[idx].url);
        });

        data.items = data.items.filter(it => !toDeleteUrls.has(it.url));
        selectedIndices.clear();
        saveData(data);
        updateBulkBar();
      };
    }
    return bar;
  }

  function updateBulkBar() {
    const bar = ensureBulkBar();
    const count = selectedIndices.size;
    const counterEl = document.getElementById('ab-bulk-counter');
    if (counterEl) counterEl.textContent = count;
    if (count > 0) bar.classList.add('visible');
    else bar.classList.remove('visible');
  }

  function openFolderModal() {
    document.getElementById('ab-modal-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'ab-modal-overlay';
    overlay.className = 'ab-modal-overlay active';

    overlay.innerHTML = \`
      <div class="ab-glass-modal">
        <h3>ساخت پوشه بوکمارک جدید در آبنر</h3>
        <input type="text" id="ab-folder-inp" placeholder="نام پوشه (مثلاً: ابزارها، کار، دانشگاه)">
        <div class="ab-modal-actions">
          <button class="ab-btn-save" id="ab-btn-save-folder">ایجاد پوشه</button>
          <button class="ab-btn-cancel" id="ab-btn-cancel-folder">انصراف</button>
        </div>
      </div>
    \`;
    document.body.appendChild(overlay);

    document.getElementById('ab-btn-cancel-folder').onclick = () => overlay.remove();
    document.getElementById('ab-btn-save-folder').onclick = () => {
      const name = document.getElementById('ab-folder-inp').value.trim();
      if (!name) return;
      const data = getData();
      const id = 'f_' + Date.now();
      data.folders.push({ id, title: name });
      currentFolder = id;
      overlay.remove();
      saveData(data);
    };
  }

  function openEditModal(index = null, item = null) {
    const isEdit = index !== null && item !== null;
    document.getElementById('ab-modal-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ab-modal-overlay';
    overlay.className = 'ab-modal-overlay active';

    overlay.innerHTML = \`
      <div class="ab-glass-modal">
        <h3>\${isEdit ? 'ویرایش بوکمارک آبنر' : 'افزودن بوکمارک به آبنر'}</h3>
        <input type="text" id="ab-inp-title" placeholder="نام بوکمارک" value="\${isEdit ? (item.title || '') : ''}">
        <input type="text" id="ab-inp-url" placeholder="آدرس سایت" value="\${isEdit ? (item.url || '') : ''}">
        <div class="ab-modal-actions">
          <button class="ab-btn-save" id="ab-btn-save">\${isEdit ? 'تأیید و ذخیره' : 'افزودن'}</button>
          <button class="ab-btn-cancel" id="ab-btn-cancel">انصراف</button>
        </div>
      </div>
    \`;
    document.body.appendChild(overlay);

    document.getElementById('ab-btn-cancel').onclick = () => overlay.remove();
    document.getElementById('ab-btn-save').onclick = () => {
      const title = document.getElementById('ab-inp-title').value.trim();
      let url = document.getElementById('ab-inp-url').value.trim();
      if (!url) return;
      if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;

      const data = getData();
      if (isEdit) {
        const itemIdx = data.items.findIndex(it => it.url === item.url);
        if (itemIdx !== -1) {
          data.items[itemIdx].title = title || url;
          data.items[itemIdx].url = url;
        }
      } else {
        data.items.push({
          title: title || url,
          url: url,
          folder: currentFolder === 'all' ? 'all' : currentFolder
        });
      }
      overlay.remove();
      saveData(data);
    };
  }

  function openContextMenu(e, index, item, card) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.querySelectorAll('.ab-context-menu').forEach(m => m.remove());

    const isSelected = selectedIndices.has(index);
    const data = getData();
    const menu = document.createElement('div');
    menu.className = 'ab-context-menu';

    let foldersHtml = '';
    data.folders.forEach(f => {
      const isCur = (item.folder || 'all') === f.id;
      foldersHtml += \`
        <div class="ab-submenu-row \${isCur ? 'active' : ''}" data-fid="\${f.id}">
          <span>\${isCur ? '✓' : ''}</span>
          <span>\${f.title}</span>
        </div>
      \`;
    });

    menu.innerHTML = \`
      <div class="ab-menu-item" id="ab-act-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="ab-menu-item" id="ab-act-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="ab-menu-item" id="ab-act-select"><span>\${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>\${isSelected ? '✕' : '☑'}</span></div>
      <div class="ab-menu-item" id="ab-act-edit"><span>ویرایش</span> <span>✏</span></div>
      <div class="ab-menu-item ab-submenu-trigger">
        <span style="font-size:11px;opacity:0.6;">‹</span>
        <div style="display:flex;align-items:center;gap:8px;"><span>انتقال به پوشه</span> <span>📁</span></div>
        <div class="ab-submenu-box">
          \${foldersHtml}
        </div>
      </div>
      <div class="ab-menu-item" id="ab-act-copy"><span>کپی لینک</span> <span>📋</span></div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.15);margin:4px 0;">
      <div class="ab-menu-item danger" id="ab-act-del"><span>حذف</span> <span>🗑️</span></div>
    \`;
    document.body.appendChild(menu);

    let left = e ? e.clientX : card.getBoundingClientRect().left;
    let top = e ? e.clientY : card.getBoundingClientRect().bottom + 5;
    if (left + 190 > window.innerWidth) left = window.innerWidth - 195;
    if (top + 285 > window.innerHeight) top = window.innerHeight - 290;
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    menu.querySelector('#ab-act-open').onclick = () => { window.location.href = item.url; menu.remove(); };
    menu.querySelector('#ab-act-tab').onclick = () => { window.open(item.url, '_blank'); menu.remove(); };
    menu.querySelector('#ab-act-select').onclick = () => {
      if (isSelected) {
        selectedIndices.delete(index);
        card.classList.remove('is-selected');
      } else {
        selectedIndices.add(index);
        card.classList.add('is-selected');
      }
      updateBulkBar();
      menu.remove();
    };
    menu.querySelector('#ab-act-edit').onclick = () => { menu.remove(); openEditModal(index, item); };
    menu.querySelector('#ab-act-copy').onclick = () => { navigator.clipboard.writeText(item.url); menu.remove(); };
    menu.querySelector('#ab-act-del').onclick = () => {
      menu.remove();
      const currentData = getData();
      currentData.items = currentData.items.filter(it => it.url !== item.url);
      selectedIndices.delete(index);
      saveData(currentData);
      updateBulkBar();
    };

    menu.querySelectorAll('.ab-submenu-row').forEach(row => {
      row.onclick = () => {
        const targetFid = row.getAttribute('data-fid');
        const currentData = getData();
        const itemIdx = currentData.items.findIndex(it => it.url === item.url);
        if (itemIdx !== -1) {
          currentData.items[itemIdx].folder = targetFid;
          saveData(currentData);
        }
        menu.remove();
      };
    });

    const docDismiss = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', docDismiss);
      }
    };
    setTimeout(() => document.addEventListener('click', docDismiss), 40);
  }

  function render() {
    let container = document.getElementById('bookmarks-container') || document.getElementById('shortcuts-container') || document.querySelector('.shortcuts-grid');
    
    // اگر کانتینر در HTML وجود نداشت، آن را به شکل خودکار در صفحه ایجاد می‌کنیم
    if (!container) {
      container = document.createElement('div');
      container.id = 'bookmarks-container';
      const mainSection = document.querySelector('main') || document.body;
      mainSection.appendChild(container);
    }

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'ab-bookmarks-wrapper';

    const data = getData();

    // رندر تب‌های پوشه‌ها
    const tabsRow = document.createElement('div');
    tabsRow.className = 'ab-folder-tabs';

    data.folders.forEach(f => {
      const tab = document.createElement('div');
      tab.className = 'ab-folder-tab' + (currentFolder === f.id ? ' active' : '');
      tab.innerHTML = \`<span>📁</span> <span>\${f.title}</span>\`;
      tab.onclick = () => {
        currentFolder = f.id;
        selectedIndices.clear();
        updateBulkBar();
        render();
      };
      tabsRow.appendChild(tab);
    });

    const addFolderBtn = document.createElement('button');
    addFolderBtn.className = 'ab-add-folder-btn';
    addFolderBtn.textContent = '+ پوشه جدید';
    addFolderBtn.onclick = openFolderModal;
    tabsRow.appendChild(addFolderBtn);

    wrapper.appendChild(tabsRow);

    // رندر شبکه کارت‌ها
    const grid = document.createElement('div');
    grid.className = 'ab-bookmarks-grid';

    // خانه شاخص دم دستی
    const damDastiBox = document.createElement('div');
    damDastiBox.className = 'ab-bookmark-box is-damdasti';
    damDastiBox.innerHTML = \`
      <div class="ab-box-icon">⋮⋮⋮</div>
      <span class="ab-box-title" style="color:#60a5fa;font-weight:bold;">دم دستی</span>
    \`;
    damDastiBox.onclick = () => {
      currentFolder = 'work';
      render();
    };
    grid.appendChild(damDastiBox);

    const activeList = data.items.filter(it => currentFolder === 'all' || it.folder === currentFolder);

    activeList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'ab-bookmark-box' + (selectedIndices.has(index) ? ' is-selected' : '');

      card.innerHTML = \`
        <button class="ab-box-dots" title="گزینه‌ها">⋮</button>
        <div class="ab-box-icon">
          <img src="\${getFavicon(item.url)}" onerror="this.style.opacity='0'" alt="">
        </div>
        <span class="ab-box-title">\${item.title}</span>
      \`;

      card.onclick = (e) => {
        if (e.target.closest('.ab-box-dots')) return;
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

      const dots = card.querySelector('.ab-box-dots');
      dots.onclick = (e) => openContextMenu(e, index, item, card);
      card.oncontextmenu = (e) => openContextMenu(e, index, item, card);

      grid.appendChild(card);
    });

    // پر کردن جایگاه‌های خالی با +
    const emptyCount = Math.max(0, MAX_SLOTS - activeList.length);
    for (let i = 0; i < emptyCount; i++) {
      const addBox = document.createElement('div');
      addBox.className = 'ab-bookmark-box';
      addBox.innerHTML = \`
        <div class="ab-box-icon" style="font-size:28px;opacity:0.4;">+</div>
        <span class="ab-box-title" style="opacity:0.4;">افزودن</span>
      \`;
      addBox.onclick = () => openEditModal();
      grid.appendChild(addBox);
    }

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  }

  window.renderAbnerBookmarks = render;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
`;
fs.writeFileSync(path.join(bookmarkDir, 'bookmark.js'), bookmarkJs, 'utf8');
console.log('✅ ماژول بوکمارک گروهی آبنر ثبت شد.');

// ۳. اتصال به فایل‌های HTML
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    if (!html.includes('modules/bookmark/bookmark.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/bookmark/bookmark.css">\n</head>');
    }
    if (!html.includes('modules/bookmark/bookmark.js')) {
      html = html.replace('</body>', '  <script src="modules/bookmark/bookmark.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 اتصال به ${filePath} برقرار شد.`);
  }
});