const fs = require('fs');
const path = require('path');

console.log('🚀 در حال فعال‌سازی ماژول بوکمارک آبنر و پاک‌سازی نسخه‌های قدیمی...');

// ۱. ایجاد دایرکتوری اختصاصی بوکمارک آبنر
const bookmarkDir = path.join(__dirname, 'modules', 'bookmark');
if (!fs.existsSync(bookmarkDir)) {
  fs.mkdirSync(bookmarkDir, { recursive: true });
}

// ۲. استایل شیشه‌ای کامل بوکمارک و منوی ۶ گزینه‌ای آبنر (modules/bookmark/bookmark.css)
const bookmarkCss = `
/* ========================================================
   استایل شیشه‌ای شبکه بوکمارک و منوی ۶ حالته آبنر
======================================================== */
.ab-bookmarks-grid {
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
  min-height: 96px;
  padding: 12px 8px;
  border-radius: 20px;
  cursor: pointer;
  background: var(--dash-glass-bg, rgba(255, 255, 255, 0.12)) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18)) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.15s ease, filter 0.2s ease, background 0.2s ease;
}

.ab-bookmark-box:hover {
  transform: translateY(-2px);
  filter: brightness(1.15);
}

/* خانه شاخص دم‌دستی */
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
  max-width: 84px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/* دکمه سه نقطه گزینه‌ها */
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

/* کارت انتخاب شده برای مدیریت */
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

/* منوی ۶ حالته شیشه‌ای آبنر */
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
  width: 140px;
  background: var(--dash-menu-bg, rgba(28, 22, 26, 0.95));
  backdrop-filter: blur(var(--dash-blur-px, 20px));
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
.ab-submenu-trigger:hover .ab-submenu-box { display: block; }
.ab-submenu-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
}
.ab-submenu-row.active { color: #60a5fa; }

/* نوار انتخاب دسته‌جمعی */
.ab-bulk-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  background: var(--dash-menu-bg, rgba(15, 23, 42, 0.9));
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
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

/* پاپ‌‌آپ شیشه‌ای افزودن/ویرایش */
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
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(170%) !important;
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

// ۳. کد جاوااسکریپت مستقل بوکمارک آبنر با اولویت اجرایی بالا (modules/bookmark/bookmark.js)
const bookmarkJs = `
/**
 * ماژول مستقل بوکمارک‌های آبنر
 * شامل شبکه ۱۲تایی، منوی ۶ حالته راست‌کلیک و پاپ‌آپ شیشه‌ای
 */
(function initAbnerBookmark() {
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
    const counterEl = document.getElementById('ab-bulk-counter');
    if (counterEl) counterEl.textContent = count;
    if (count > 0) bar.classList.add('visible');
    else bar.classList.remove('visible');
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
        <input type="text" id="ab-inp-url" placeholder="آدرس سایت (مثلاً: https://example.com)" value="\${isEdit ? (item.url || '') : ''}">
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

  // ایجاد منوی ۶ حالته آبنر
  function openContextMenu(e, index, item, card) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    document.querySelectorAll('.ab-context-menu').forEach(m => m.remove());

    const isSelected = selectedIndices.has(index);
    const menu = document.createElement('div');
    menu.className = 'ab-context-menu';

    menu.innerHTML = \`
      <div class="ab-menu-item" id="ab-act-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="ab-menu-item" id="ab-act-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="ab-menu-item" id="ab-act-select"><span>\${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>\${isSelected ? '✕' : '☑'}</span></div>
      <div class="ab-menu-item" id="ab-act-edit"><span>ویرایش</span> <span>✏</span></div>
      <div class="ab-menu-item ab-submenu-trigger">
        <span style="font-size:11px;opacity:0.6;">‹</span>
        <div style="display:flex;align-items:center;gap:8px;"><span>انتقال به</span> <span>📁</span></div>
        <div class="ab-submenu-box">
          <div class="ab-submenu-row active"><span>✓</span> <div style="display:flex;gap:6px;"><span>صفحه اصلی</span> <span>🏠</span></div></div>
          <div class="ab-submenu-row"><span></span> <div style="display:flex;gap:6px;"><span>دم دستی</span> <span>📁</span></div></div>
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
      let list = getBookmarks();
      list.splice(index, 1);
      selectedIndices.delete(index);
      saveBookmarks(list);
      updateBulkBar();
    };

    const docDismiss = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', docDismiss);
      }
    };
    setTimeout(() => document.addEventListener('click', docDismiss), 40);
  }

  function render() {
    let container = document.getElementById('shortcuts-container') || document.querySelector('.shortcuts-grid') || document.getElementById('bookmarks-container');
    if (!container) return;

    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'ab-bookmarks-grid';

    // خانه شاخص: دم دستی
    const damDastiBox = document.createElement('div');
    damDastiBox.className = 'ab-bookmark-box is-damdasti';
    damDastiBox.innerHTML = \`
      <div class="ab-box-icon" style="font-size:24px;">⋮⋮⋮</div>
      <span class="ab-box-title" style="color:#60a5fa;font-weight:bold;">دم دستی</span>
    \`;
    damDastiBox.onclick = () => alert('پوشه دسترسی سریع «دم دستی» در آبنر');
    grid.appendChild(damDastiBox);

    const list = getBookmarks();

    // رندر کارت‌های فعال
    list.forEach((item, index) => {
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

    // پر کردن جایگاه‌های باقیمانده تا ۱۱ خانه با علامت +
    const emptyCount = Math.max(0, MAX_SLOTS - list.length);
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

    container.appendChild(grid);
  }

  // لود با اولویت بالا و جایگزینی کامل
  window.renderAbnerBookmarks = render;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
`;
fs.writeFileSync(path.join(bookmarkDir, 'bookmark.js'), bookmarkJs, 'utf8');

// ۴. غیرفعال کردن رندرهای قدیمی تداخل‌زا در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');
  js = js.replace(/function renderShortcuts\s*\(/g, 'function disabled_renderShortcuts(');
  js = js.replace(/function loadShortcuts\s*\(/g, 'function disabled_loadShortcuts(');
  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ رندرهای قدیمی در script.js غیرفعال شدند.');
}

// ۵. اطمینان از قرارگیری لینک‌ها در فایل‌های HTML
['./index.html', './newtab.html'].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // پاک کردن فراخوانی‌های قدیمی
    html = html.replace(/<link rel="stylesheet" href="modules\/shortcuts\/shortcuts\.css">/g, '');
    html = html.replace(/<script src="modules\/shortcuts\/shortcuts\.js"><\/script>/g, '');

    if (!html.includes('modules/bookmark/bookmark.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/bookmark/bookmark.css">\n</head>');
    }
    if (!html.includes('modules/bookmark/bookmark.js')) {
      html = html.replace('</body>', '  <script src="modules/bookmark/bookmark.js"></script>\n</body>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`🔗 ماژول بوکمارک آبنر به ${filePath} متصل شد.`);
  }
});