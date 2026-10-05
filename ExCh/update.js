const fs = require('fs');

// ۱. تنظیم استایل شیشه‌ای کامل و دقیق منوی دستیار در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const fullDastyarMenuCss = `
/* ========================================================
   استایل کامل میانبرها و منوی زمینه دستیار با بلر زنده داشبورد
======================================================== */
.shortcut-item,
.shortcut-card,
.shortcut-item-card,
.search-bar-container,
.search-box {
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
}
[data-theme="dark"] .shortcut-item,
[data-theme="dark"] .shortcut-card,
[data-theme="dark"] .shortcut-item-card,
[data-theme="dark"] .search-bar-container {
  background: rgba(15, 23, 42, 0.3) !important;
}

/* منوی اصلی سه‌نقطه دستیار */
.dastyar-full-context-menu {
  position: fixed;
  z-index: 999999;
  width: 175px;
  background: rgba(30, 20, 25, 0.85);
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  padding: 6px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
  direction: rtl;
  font-family: inherit;
  user-select: none;
}

.dastyar-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  color: #f3f4f6;
  font-size: 13px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease;
}
.dastyar-menu-item:hover {
  background: rgba(255, 255, 255, 0.12);
}
.dastyar-menu-item.danger {
  color: #f87171;
}
.dastyar-menu-item .item-label-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dastyar-menu-item .item-icon {
  font-size: 14px;
  opacity: 0.85;
}

/* ساب‌منوی انتقال به */
.dastyar-submenu-wrapper {
  position: relative;
}
.dastyar-submenu-panel {
  display: none;
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 6px;
  width: 145px;
  background: rgba(30, 20, 25, 0.9);
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.45);
}
.dastyar-submenu-wrapper:hover .dastyar-submenu-panel {
  display: block;
}

.dastyar-submenu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  color: #f3f4f6;
  font-size: 12.5px;
  border-radius: 10px;
  cursor: pointer;
}
.dastyar-submenu-item:hover {
  background: rgba(255, 255, 255, 0.12);
}
.dastyar-submenu-item.current-folder {
  color: #60a5fa;
}
`;

  // پاک‌سازی نسخه‌های استایل تکراری و افزودن استایل جدید
  css = css.replace(/\/\* ========================================================\s*استایل کامل میانبرها[\s\S]*?\.dastyar-submenu-item\.current-folder\s*\{[^}]*\}\s*/g, '');
  css += '\n' + fullDastyarMenuCss;
  fs.writeFileSync('./style.css', css, 'utf8');
}

// ۲. تزریق منطق اجرایی ۱ به ۱ منوی ۶ گزینه‌ای به script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const liveDastyarEngine = `
// ========================================================
// لاجیک اجرایی منوی ۶ گزینه‌ای دستیار و هماهنگی بلر داشبورد
// ========================================================
(function setupExactDastyarMenu() {
  // بستن منوهای قبلی پروژه برای جلوگیری از تداخل تصویر ۱
  const oldMenus = document.querySelectorAll('.shortcut-menu, .shortcut-popover, .shortcut-context-menu');
  oldMenus.forEach(m => m.style.display = 'none');

  window.openExactDastyarContextMenu = function(e, cardEl) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // حذف منوی فعال قبلی
    document.querySelectorAll('.dastyar-full-context-menu').forEach(m => m.remove());

    const title = cardEl.querySelector('.shortcut-title, .title, span')?.textContent?.trim() || 'میانبر';
    const targetUrl = cardEl.getAttribute('href') || cardEl.dataset.url || 'https://google.com';
    const isSelected = cardEl.classList.contains('is-selected');

    const menu = document.createElement('div');
    menu.className = 'dastyar-full-context-menu';

    menu.innerHTML = \`
      <div class="dastyar-menu-item" id="act-open">
        <span>باز کردن</span>
        <span class="item-icon">🔗</span>
      </div>
      <div class="dastyar-menu-item" id="act-tab">
        <span>باز کردن در تب جدید</span>
        <span class="item-icon">↗</span>
      </div>
      <div class="dastyar-menu-item" id="act-select">
        <span>\${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span>
        <span class="item-icon">\${isSelected ? '✕' : '☑'}</span>
      </div>
      <div class="dastyar-menu-item" id="act-edit">
        <span>ویرایش</span>
        <span class="item-icon">✏</span>
      </div>
      <div class="dastyar-menu-item dastyar-submenu-wrapper" id="act-move">
        <span style="font-size: 11px; opacity: 0.6;">‹</span>
        <div class="item-label-group">
          <span>انتقال به</span>
          <span class="item-icon">📁</span>
        </div>
        <div class="dastyar-submenu-panel">
          <div class="dastyar-submenu-item current-folder" data-folder="home">
            <span class="item-icon">✓</span>
            <div class="item-label-group">
              <span>صفحه اصلی</span>
              <span class="item-icon">🏠</span>
            </div>
          </div>
          <div class="dastyar-submenu-item" data-folder="app">
            <span></span>
            <div class="item-label-group">
              <span>App</span>
              <span class="item-icon">📁</span>
            </div>
          </div>
        </div>
      </div>
      <div class="dastyar-menu-item" id="act-copy">
        <span>کپی لینک</span>
        <span class="item-icon">📋</span>
      </div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:4px 0;">
      <div class="dastyar-menu-item danger" id="act-delete">
        <span>حذف</span>
        <span class="item-icon">🗑️</span>
      </div>
    \`;

    document.body.appendChild(menu);

    // محاسبه محل باز شدن منو نسبت به کارت
    const rect = cardEl.getBoundingClientRect();
    let leftPos = rect.left - 20;
    let topPos = rect.bottom + 8;
    if (leftPos < 15) leftPos = 15;
    if (topPos + 260 > window.innerHeight) topPos = rect.top - 265;

    menu.style.left = leftPos + 'px';
    menu.style.top = topPos + 'px';

    // رویداد گزینه‌ها
    menu.querySelector('#act-open').onclick = () => {
      window.location.href = targetUrl;
      menu.remove();
    };
    menu.querySelector('#act-tab').onclick = () => {
      window.open(targetUrl, '_blank');
      menu.remove();
    };
    menu.querySelector('#act-select').onclick = () => {
      cardEl.classList.toggle('is-selected');
      if (typeof updateBulkBar === 'function') updateBulkBar();
      menu.remove();
    };
    menu.querySelector('#act-copy').onclick = () => {
      navigator.clipboard.writeText(targetUrl);
      menu.remove();
    };
    menu.querySelector('#act-edit').onclick = () => {
      menu.remove();
      if (typeof openShortcutModal === 'function') {
        openShortcutModal(null, { title: title, url: targetUrl });
      }
    };
    menu.querySelector('#act-delete').onclick = () => {
      menu.remove();
      cardEl.remove();
    };

    // کلیک بیرون برای بستن
    const dismissHandler = (evt) => {
      if (!menu.contains(evt.target)) {
        menu.remove();
        document.removeEventListener('click', dismissHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', dismissHandler), 40);
  };

  // الصاق به آیکون‌های ۳ نقطه و کارت‌های فعلی صفحه
  function bindToCurrentCards() {
    const cards = document.querySelectorAll('.shortcut-item, .shortcut-card, .shortcut-item-card');
    cards.forEach(card => {
      // غیرفعال کردن پاپ‌آپ‌های قدیمی
      const oldDots = card.querySelector('.shortcut-more-btn, .more-btn, [data-action="more"], .shortcut-dots-btn');
      if (oldDots && !oldDots.dataset.boundDastyarExact) {
        oldDots.dataset.boundDastyarExact = 'true';
        oldDots.onclick = (e) => window.openExactDastyarContextMenu(e, card);
      }
      if (!card.dataset.boundDastyarExactCtx) {
        card.dataset.boundDastyarExactCtx = 'true';
        card.oncontextmenu = (e) => window.openExactDastyarContextMenu(e, card);
      }
    });
  }

  setInterval(bindToCurrentCards, 1000);
})();
`;

  // پاک کردن تعاریف قبلی و ثبت ماژول تازه
  js = js.replace(/\/\/ ========================================================\s*\/\/ لاجیک اجرایی منوی ۶ گزینه‌ای دستیار[\s\S]*?setupExactDastyarMenu\(\);?\s*\}\)\(\);?/g, '');
  js += '\n' + liveDastyarEngine;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ منوی دقیق دستیار با ۶ گزینه و ساب‌منوی پوشه‌ها با موفقیت اعمال شد.');
}