const fs = require('fs');
const path = require('path');

// ۱. ساخت پوشه اختصاصی bookmark در مسیر modules
const bookmarkDir = path.join(__dirname, 'modules', 'bookmark');
if (!fs.existsSync(bookmarkDir)) {
  fs.mkdirSync(bookmarkDir, { recursive: true });
  console.log('📁 پوشه modules/bookmark ساخته شد.');
}

// ۲. ساخت استایل شیشه‌ای اختصاصی بوکمارک (modules/bookmark/bookmark.css)
const bookmarkCss = `
/* ========================================================
   استایل شیشه‌ای ماژول بوکمارک دستیار (شبکه ۱۲تایی)
======================================================== */
.ds-bookmarks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto 24px auto;
  direction: rtl;
  user-select: none;
  font-family: inherit;
}

@media (min-width: 992px) {
  .ds-bookmarks-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.ds-bookmark-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  padding: 12px 8px;
  border-radius: 20px;
  cursor: pointer;
  background: var(--dash-glass-bg) !important;
  backdrop-filter: blur(var(--dash-blur-px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.15s ease, filter 0.2s ease, background 0.2s ease;
}

.ds-bookmark-box:hover {
  transform: translateY(-2px);
  filter: brightness(1.15);
}

/* خانه شاخص دم‌دستی برگرفته از سورس */
.ds-bookmark-box.is-damdasti {
  border: 1px dashed rgba(59, 130, 246, 0.5) !important;
  background: rgba(59, 130, 246, calc(var(--dash-glass-opacity) + 0.08)) !important;
}

.ds-box-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #fff;
  margin-bottom: 6px;
}
.ds-box-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.ds-box-title {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  max-width: 84px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/* دکمه سه نقطه گزینه‌ها */
.ds-box-dots {
  position: absolute;
  top: 6px;
  left: 6px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  font-size: 15px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.ds-bookmark-box:hover .ds-box-dots { opacity: 1; }
.ds-box-dots:hover { background: rgba(255, 255, 255, 0.2); color: #fff; }

/* کارت انتخاب شده */
.ds-bookmark-box.is-selected {
  outline: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.25) !important;
}
.ds-bookmark-box.is-selected::after {
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
}

/* کانتکست منوی شیشه‌ای ۶ گزینه‌ای */
.ds-context-menu {
  position: fixed;
  z-index: 1000000;
  width: 175px;
  background: var(--dash-menu-bg) !important;
  backdrop-filter: blur(var(--dash-blur-px)) saturate(180%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px)) saturate(180%) !important;
  border: 1px solid var(--dash-glass-border) !important;
  border-radius: 18px !important;
  padding: 6px !important;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5) !important;
  direction: rtl !important;
  color: #fff !important;
}
.ds-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}
.ds-menu-item:hover { background: rgba(255, 255, 255, 0.12); }
.ds-menu-item.danger { color: #ef4444; }

.ds-submenu-trigger { position: relative; }
.ds-submenu-box {
  display: none;
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 6px;
  width: 140px;
  background: var(--dash-menu-bg);
  backdrop-filter: blur(var(--dash-blur-px));
  border: 1px solid var(--dash-glass-border);
  border-radius: 14px;
  padding: 6px;
}
.ds-submenu-trigger:hover .ds-submenu-box { display: block; }
.ds-submenu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
}
.ds-submenu-row.active { color: #60a5fa; }

/* نوار انتخاب دسته‌جمعی شناور */
.ds-bulk-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  background: var(--dash-menu-bg);
  backdrop-filter: blur(var(--dash-blur-px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border);
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
.ds-bulk-bar.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.ds-bulk-counter {
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
.ds-bulk-del { color: #ef4444; cursor: pointer; }
.ds-bulk-close { cursor: pointer; opacity: 0.7; }

/* پاپ‌آپ شیشه‌ای ویرایش/افزودن */
.ds-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
  direction: rtl;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.ds-modal-overlay.active { opacity: 1; pointer-events: auto; }
.ds-glass-modal {
  width: 90%;
  max-width: 360px;
  padding: 22px;
  border-radius: 22px;
  background: var(--dash-glass-bg) !important;
  backdrop-filter: blur(var(--dash-blur-px)) saturate(170%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px)) saturate(170%) !important;
  border: 1px solid var(--dash-glass-border);
  color: #fff;
}
.ds-glass-modal h3 { margin: 0 0 14px 0; font-size: 15px; }
.ds-glass-modal input {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 10px;
  border-radius: 12px;
  border: 1px solid var(--dash-glass-border);
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  box-sizing: border-box;
}
.ds-modal-actions { display: flex; gap: 10px; margin-top: 6px; }
.ds-btn-save {
  flex: 1; padding: 10px; background: #2563eb; color: #fff; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;
}
.ds-btn-cancel {
  flex: 1; padding: 10px; background: rgba(255, 255, 255, 0.15); border: 1px solid var(--dash-glass-border); color: #fff; border-radius: 12px; cursor: pointer;
}
`;
fs.writeFileSync(path.join(bookmarkDir, 'bookmark.css'), bookmarkCss, 'utf8');
console.log('✅ فایل modules/bookmark/bookmark.css ساخته شد.');

// ۳. ساخت منطق جاوااسکریپت بوکمارک (modules/bookmark/bookmark.js)
const bookmarkJs = `
/**
 * ماژول مستقل شبکه بوکمارک‌های دستیار
 */
(function initBookmarkModule() {
  const STORAGE_KEY = 'shortcuts';
  const MAX_SLOTS = 11;
  let selectedIndices = new Set();

  function getBookmarks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('user_shortcuts');
      const list = JSON.parse(data);
      if (Array.isArray(list) && list.length > 0) return list;
    } catch(e) {}
    return [
      { title: 'گوگل', url: 'https://www.google.com' },
      { title: 'یوتیوب', url: 'https://www.youtube.com' },
      { title: 'تلگرام', url: 'https://web.telegram.org' },
      { title: 'اینستاگرام', url: 'https://www.instagram.com' },
      { title: 'دیجی‌کالا', url: 'https://www.digikala.com' },
      { title: 'دیوار', url: 'https://divar.ir' }
    ];
  }

  function saveBookmarks(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem('user_shortcuts', JSON.stringify(list));
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
    let bar = document.getElementById('ds-bulk-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'ds-bulk-bar';
      bar.className = 'ds-bulk-bar';
      bar.innerHTML = \`
        <span class="ds-bulk-close" id="ds-bulk-close">✕</span>
        <span class="ds-bulk-del" id="ds-bulk-del">حذف 🗑</span>
        <span style="opacity:0.3">|</span>
        <span>مورد انتخاب شده</span>
        <span class="ds-bulk-counter" id="ds-bulk-counter">۰</span>
      \`;
      document.body.appendChild(bar);

      document.getElementById('ds-bulk-close').onclick = () => {
        selectedIndices.clear();
        document.querySelectorAll('.ds-bookmark-box').forEach(c => c.classList.remove('is-selected'));
        updateBulkBar();
      };

      document.getElementById('ds-bulk-del').onclick = () => {
        let list = getBookmarks();
        list = list.filter((_, idx) => !selectedIndices.has(idx));
        selectedIndices.clear();
        saveBookmarks(list);
        updateBulkBar();
      };
    }
    return bar;
  }

  function updateBulkBar() {
    const bar = ensureBulkBar();
    const count = selectedIndices.size;
    const counterEl = document.getElementById('ds-bulk-counter');
    if (counterEl) counterEl.textContent = count;
    if (count > 0) bar.classList.add('visible');
    else bar.classList.remove('visible');
  }

  function openEditModal(index = null, item = null) {
    const isEdit = index !== null && item !== null;
    document.getElementById('ds-modal-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ds-modal-overlay';
    overlay.className = 'ds-modal-overlay active';

    overlay.innerHTML = \`
      <div class="ds-glass-modal">
        <h3>\${isEdit ? 'ویرایش بوکمارک' : 'افزودن بوکمارک جدید'}</h3>
        <input type="text" id="ds-inp-title" placeholder="نام بوکمارک" value="\${isEdit ? (item.title || '') : ''}">
        <input type="text" id="ds-inp-url" placeholder="آدرس سایت (مثلاً: https://example.com)" value="\${isEdit ? (item.url || '') : ''}">
        <div class="ds-modal-actions">
          <button class="ds-btn-save" id="ds-btn-save">\${isEdit ? 'تأیید و ذخیره' : 'افزودن'}</button>
          <button class="ds-btn-cancel" id="ds-btn-cancel">انصراف</button>
        </div>
      </div>
    \`;

    document.body.appendChild(overlay);

    document.getElementById('ds-btn-cancel').onclick = () => overlay.remove();
    document.getElementById('ds-btn-save').onclick = () => {
      const title = document.getElementById('ds-inp-title').value.trim();
      let url = document.getElementById('ds-inp-url').value.trim();
      if (!url) return;
      if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;

      let list = getBookmarks();
      if (isEdit) {
        list[index] = { title: title || url, url };
      } else {
        list.push({ title: title || url, url });
      }
      overlay.remove();
      saveBookmarks(list);
    };
  }

  function openMenu(e, index, item, card) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.querySelectorAll('.ds-context-menu').forEach(m => m.remove());

    const isSelected = selectedIndices.has(index);
    const menu = document.createElement('div');
    menu.className = 'ds-context-menu';

    menu.innerHTML = \`
      <div class="ds-menu-item" id="act-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="ds-menu-item" id="act-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="ds-menu-item" id="act-select"><span>\${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>\${isSelected ? '✕' : '☑'}</span></div>
      <div class="ds-menu-item" id="act-edit"><span>ویرایش</span> <span>✏</span></div>
      <div class="ds-menu-item ds-submenu-trigger">
        <span style="font-size:11px;opacity:0.6;">‹</span>
        <div style="display:flex;align-items:center;gap:8px;"><span>انتقال به</span> <span>📁</span></div>
        <div class="ds-submenu-box">
          <div class="ds-submenu-row active"><span>✓</span> <div style="display:flex;gap:6px;"><span>صفحه اصلی</span> <span>🏠</span></div></div>
          <div class="ds-submenu-row"><span></span> <div style="display:flex;gap:6px;"><span>دم دستی</span> <span>📁</span></div></div>
        </div>
      </div>
      <div class="ds-menu-item" id="act-copy"><span>کپی لینک</span> <span>📋</span></div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.12);margin:4px 0;">
      <div class="ds-menu-item danger" id="act-del"><span>حذف</span> <span>🗑️</span></div>
    \`;

    document.body.appendChild(menu);

    let left = e ? e.clientX : card.getBoundingClientRect().left;
    let top = e ? e.clientY : card.getBoundingClientRect().bottom + 5;
    if (left + 180 > window.innerWidth) left = window.innerWidth - 185;
    if (top + 280 > window.innerHeight) top = window.innerHeight - 285;
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    menu.querySelector('#act-open').onclick = () => { window.location.href = item.url; menu.remove(); };
    menu.querySelector('#act-tab').onclick = () => { window.open(item.url, '_blank'); menu.remove(); };
    menu.querySelector('#act-select').onclick = () => {
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
    menu.querySelector('#act-edit').onclick = () => { menu.remove(); openEditModal(index, item); };
    menu.querySelector('#act-copy').onclick = () => { navigator.clipboard.writeText(item.url); menu.remove(); };
    menu.querySelector('#act-del').onclick = () => {
      menu.remove();
      let list = getBookmarks();
      list.splice(index, 1);
      selectedIndices.delete(index);
      saveBookmarks(list);
      updateBulkBar();
    };

    const docClick = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', docClick);
      }
    };
    setTimeout(() => document.addEventListener('click', docClick), 40);
  }

  function render() {
    let container = document.getElementById('shortcuts-container') || document.querySelector('.shortcuts-grid') || document.getElementById('bookmarks-container');
    if (!container) return;

    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'ds-bookmarks-grid';

    // ۱. خانه شاخص: دم دستی
    const damDastiBox = document.createElement('div');
    damDastiBox.className = 'ds-bookmark-box is-damdasti';
    damDastiBox.innerHTML = \`
      <div class="ds-box-icon" style="font-size:24px;">⋮⋮⋮</div>
      <span class="ds-box-title" style="color:#60a5fa;font-weight:bold;">دم دستی</span>
    \`;
    damDastiBox.onclick = () => alert('پوشه دسترسی سریع دم‌دستی');
    grid.appendChild(damDastiBox);

    const list = getBookmarks();

    // ۲. نمایش بوکمارک‌های ذخیره‌شده
    list.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'ds-bookmark-box' + (selectedIndices.has(index) ? ' is-selected' : '');

      card.innerHTML = \`
        <button class="ds-box-dots" title="گزینه‌ها">⋮</button>
        <div class="ds-box-icon">
          <img src="\${getFavicon(item.url)}" onerror="this.style.opacity='0'" alt="">
        </div>
        <span class="ds-box-title">\${item.title}</span>
      \`;

      card.onclick = (e) => {
        if (e.target.closest('.ds-box-dots')) return;
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

      const dots = card.querySelector('.ds-box-dots');
      dots.onclick = (e) => openMenu(e, index, item, card);
      card.oncontextmenu = (e) => openMenu(e, index, item, card);

      grid.appendChild(card);
    });

    // ۳. تکمیل ظرفیت ۱۱ تایی با دکمه‌های +
    const emptyCount = Math.max(0, MAX_SLOTS - list.length);
    for (let i = 0; i < emptyCount; i++) {
      const addBox = document.createElement('div');
      addBox.className = 'ds-bookmark-box';
      addBox.innerHTML = \`
        <div class="ds-box-icon" style="font-size:28px;opacity:0.4;">+</div>
        <span class="ds-box-title" style="opacity:0.4;">افزودن</span>
      \`;
      addBox.onclick = () => openEditModal();
      grid.appendChild(addBox);
    }

    container.appendChild(grid);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
`;
fs.writeFileSync(path.join(bookmarkDir, 'bookmark.js'), bookmarkJs, 'utf8');
console.log('✅ فایل modules/bookmark/bookmark.js ساخته شد.');

// ۴. اتصال ماژول بوکمارک به index.html و newtab.html
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // جایگزینی ارجاعات قبلی shortcuts با bookmark
    html = html.replace('modules/shortcuts/shortcuts.css', 'modules/bookmark/bookmark.css');
    html = html.replace('modules/shortcuts/shortcuts.js', 'modules/bookmark/bookmark.js');

    if (!html.includes('modules/bookmark/bookmark.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/bookmark/bookmark.css">\n</head>');
    }
    if (!html.includes('modules/bookmark/bookmark.js')) {
      html = html.replace('</body>', '  <script src="modules/bookmark/bookmark.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 ماژول bookmark به ${filePath} متصل شد.`);
  }
});