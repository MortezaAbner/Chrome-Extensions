const fs = require('fs');
const path = require('path');

// ۱. ساخت دایرکتوری‌های ماژولار
const dirs = [
  './modules',
  './modules/core',
  './modules/shortcuts'
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});
console.log('📁 ساختار پوشه‌بندی ماژولار ایجاد شد.');

// ۲. هسته استایل: تعریف متغیرهای زنده ماتی (بلر) و شفافیت (modules/core/theme.css)
const themeCss = `
/* ========================================================
   متغیرهای سراسری سیستم شیشه‌ای (ماتی + شفافیت متغیر)
======================================================== */
:root {
  --dash-blur-px: 20px;
  --dash-glass-opacity: 0.12;
  --dash-glass-border-opacity: 0.18;
  --dash-glass-bg: rgba(255, 255, 255, var(--dash-glass-opacity));
  --dash-glass-border: rgba(255, 255, 255, var(--dash-glass-border-opacity));
  --dash-menu-bg: rgba(28, 22, 26, calc(var(--dash-glass-opacity) + 0.72));
}

[data-theme="dark"] {
  --dash-glass-bg: rgba(15, 23, 42, calc(var(--dash-glass-opacity) + 0.15));
  --dash-glass-border: rgba(255, 255, 255, var(--dash-glass-border-opacity));
  --dash-menu-bg: rgba(20, 16, 22, calc(var(--dash-glass-opacity) + 0.78));
}
`;
fs.writeFileSync('./modules/core/theme.css', themeCss, 'utf8');

// ۳. هسته منطق تم و تنظیمات زنده (modules/core/theme.js)
const themeJs = `
/**
 * ماژول مدیریت بلر و شفافیت زنده داشبورد
 */
(function initThemeEngine() {
  function applyGlassSettings() {
    const blurVal = localStorage.getItem('dash_blur_px') || '20';
    const opacityVal = localStorage.getItem('dash_glass_opacity') || '0.12';
    
    document.documentElement.style.setProperty('--dash-blur-px', blurVal + 'px');
    document.documentElement.style.setProperty('--dash-glass-opacity', opacityVal);
  }

  // توابع عمومی قابل اتصال به اسلایدرهای منوی تنظیمات
  window.setDashboardBlur = function(px) {
    localStorage.setItem('dash_blur_px', px);
    document.documentElement.style.setProperty('--dash-blur-px', px + 'px');
  };

  window.setDashboardOpacity = function(opacityPercent) {
    // تبدیل مقدار درصد ۰ تا ۱۰۰ به اعشار ۰.۰ تا ۱.۰
    const alpha = (opacityPercent / 100).toFixed(2);
    localStorage.setItem('dash_glass_opacity', alpha);
    document.documentElement.style.setProperty('--dash-glass-opacity', alpha);
  };

  applyGlassSettings();
})();
`;
fs.writeFileSync('./modules/core/theme.js', themeJs, 'utf8');

// ۴. استایل ماژول میانبرها (modules/shortcuts/shortcuts.css)
const shortcutsCss = `
.ds-shortcut-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 6px;
  border-radius: 18px;
  cursor: pointer;
  user-select: none;
  background: var(--dash-glass-bg) !important;
  backdrop-filter: blur(var(--dash-blur-px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px)) saturate(160%) !important;
  border: 1px solid var(--dash-glass-border) !important;
  transition: transform 0.15s ease, background 0.2s ease;
}
.ds-shortcut-card:hover {
  transform: translateY(-2px);
  filter: brightness(1.15);
}

.ds-shortcut-card.is-selected {
  outline: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, calc(var(--dash-glass-opacity) + 0.15)) !important;
}
.ds-shortcut-card.is-selected::after {
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
  z-index: 10;
}

.ds-icon-wrapper {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ds-icon-wrapper img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.ds-title {
  font-size: 12px;
  color: #fff;
  max-width: 76px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ds-dots-btn {
  position: absolute;
  top: 4px;
  left: 4px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 6px;
}
.ds-dots-btn:hover { background: rgba(255, 255, 255, 0.2); color: #fff; }

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
  user-select: none !important;
  font-family: inherit !important;
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
  -webkit-backdrop-filter: blur(var(--dash-blur-px));
  border: 1px solid var(--dash-glass-border);
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
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
fs.writeFileSync('./modules/shortcuts/shortcuts.css', shortcutsCss, 'utf8');

// ۵. جاوااسکریپت ماژول مستقل میانبرها (modules/shortcuts/shortcuts.js)
const shortcutsJs = `
/**
 * ماژول مستقل میانبرهای دستیار
 */
(function() {
  const STORAGE_KEY = 'shortcuts';
  let selectedIndices = new Set();

  const defaultList = [
    { title: 'گوگل', url: 'https://www.google.com' },
    { title: 'یوتیوب', url: 'https://www.youtube.com' },
    { title: 'تلگرام', url: 'https://web.telegram.org' },
    { title: 'اینستاگرام', url: 'https://www.instagram.com' },
    { title: 'دیجی‌کالا', url: 'https://www.digikala.com' },
    { title: 'دیوار', url: 'https://divar.ir' }
  ];

  function getShortcuts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('user_shortcuts');
      const list = JSON.parse(data);
      if (Array.isArray(list) && list.length > 0) return list;
    } catch(e) {}
    return defaultList;
  }

  function saveShortcuts(list) {
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
        <span class="ds-bulk-del" id="ds-bulk-del">حذف 🗑️</span>
        <span style="opacity:0.3">|</span>
        <span>مورد انتخاب شده</span>
        <span class="ds-bulk-counter" id="ds-bulk-counter">۰</span>
      \`;
      document.body.appendChild(bar);

      document.getElementById('ds-bulk-close').onclick = () => {
        selectedIndices.clear();
        document.querySelectorAll('.ds-shortcut-card').forEach(c => c.classList.remove('is-selected'));
        updateBulkBar();
      };

      document.getElementById('ds-bulk-del').onclick = () => {
        let list = getShortcuts();
        list = list.filter((_, idx) => !selectedIndices.has(idx));
        selectedIndices.clear();
        saveShortcuts(list);
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
        <h3>\${isEdit ? 'ویرایش میانبر' : 'افزودن میانبر'}</h3>
        <input type="text" id="ds-inp-title" placeholder="نام میانبر" value="\${isEdit ? (item.title || '') : ''}">
        <input type="text" id="ds-inp-url" placeholder="آدرس سایت" value="\${isEdit ? (item.url || '') : ''}">
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

      let list = getShortcuts();
      if (isEdit) {
        list[index] = { title: title || url, url };
      } else {
        list.push({ title: title || url, url });
      }
      overlay.remove();
      saveShortcuts(list);
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
          <div class="ds-submenu-row"><span></span> <div style="display:flex;gap:6px;"><span>App</span> <span>📁</span></div></div>
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
      let list = getShortcuts();
      list.splice(index, 1);
      selectedIndices.delete(index);
      saveShortcuts(list);
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
    const container = document.getElementById('shortcuts-container') || document.querySelector('.shortcuts-grid');
    if (!container) return;

    container.innerHTML = '';
    const list = getShortcuts();

    list.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'ds-shortcut-card' + (selectedIndices.has(index) ? ' is-selected' : '');

      card.innerHTML = \`
        <button class="ds-dots-btn" title="گزینه‌ها">⋮</button>
        <div class="ds-icon-wrapper">
          <img src="\${getFavicon(item.url)}" onerror="this.style.opacity='0'" alt="">
        </div>
        <span class="ds-title">\${item.title}</span>
      \`;

      card.onclick = (e) => {
        if (e.target.closest('.ds-dots-btn')) return;
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

      const dots = card.querySelector('.ds-dots-btn');
      dots.onclick = (e) => openMenu(e, index, item, card);
      card.oncontextmenu = (e) => openMenu(e, index, item, card);

      container.appendChild(card);
    });

    const addCard = document.createElement('div');
    addCard.className = 'ds-shortcut-card ds-add-card';
    addCard.innerHTML = \`
      <div class="ds-icon-wrapper" style="font-size:26px;color:#fff;">+</div>
      <span class="ds-title" style="opacity:0.8;">افزودن</span>
    \`;
    addCard.onclick = () => openEditModal();
    container.appendChild(addCard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
`;
fs.writeFileSync('./modules/shortcuts/shortcuts.js', shortcutsJs, 'utf8');

// ۶. پاک‌سازی قطعی خطای سینتکس script.js (خطوط ۳۶۲۰ به بعد)
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');
  const cutMarkers = [
    '/* ========================================================',
    '// ========================================================',
    '(function restoreUserShortcuts',
    '(function initShortcutsModule',
    '(function fixDastyarMenuPermanently',
    'function openContextMenu'
  ];

  let cutPoint = -1;
  for (const m of cutMarkers) {
    const idx = js.indexOf(m);
    if (idx !== -1 && idx > 2000) {
      if (cutPoint === -1 || idx < cutPoint) cutPoint = idx;
    }
  }

  if (cutPoint !== -1) {
    js = js.substring(0, cutPoint).trim();
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('🧹 خطای سینتکس script.js کاملاً پاک‌سازی شد.');
  }
}

// ۷. ثبت ماژول‌ها در index.html و newtab.html
['./index.html', './newtab.html'].forEach(fp => {
  if (fs.existsSync(fp)) {
    let html = fs.readFileSync(fp, 'utf8');
    
    // افزودن CSS ماژول‌ها در head
    if (!html.includes('modules/core/theme.css')) {
      html = html.replace('</head>', '  <link rel="stylesheet" href="modules/core/theme.css">\n  <link rel="stylesheet" href="modules/shortcuts/shortcuts.css">\n</head>');
    }
    // افزودن JS ماژول‌ها قبل از بسته شدن body
    if (!html.includes('modules/core/theme.js')) {
      html = html.replace('</body>', '  <script src="modules/core/theme.js"></script>\n  <script src="modules/shortcuts/shortcuts.js"></script>\n</body>');
    }
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`🔗 ماژول‌ها به ${fp} متصل شدند.`);
  }
});