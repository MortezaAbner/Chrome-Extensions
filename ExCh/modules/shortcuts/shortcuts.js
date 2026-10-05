
/**
 * ماژول مستقل شبکه بوکمارک‌های دستیار
 * برگرفته از کامپوننت Bookmarks.jsx
 */
(function() {
  const STORAGE_KEY = 'shortcuts';
  const MAX_SLOTS = 11; // ۱۱ جایگاه افزوده به علاوه خانه دم دستی
  let selectedIndices = new Set();

  function getShortcuts() {
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
      bar.innerHTML = `
        <span class="ds-bulk-close" id="ds-bulk-close">✕</span>
        <span class="ds-bulk-del" id="ds-bulk-del">حذف 🗑️️</span>
        <span style="opacity:0.3">|</span>
        <span>مورد انتخاب شده</span>
        <span class="ds-bulk-counter" id="ds-bulk-counter">۰</span>
      `;
      document.body.appendChild(bar);

      document.getElementById('ds-bulk-close').onclick = () => {
        selectedIndices.clear();
        document.querySelectorAll('.ds-bookmark-box').forEach(c => c.classList.remove('is-selected'));
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

    overlay.innerHTML = `
      <div class="ds-glass-modal">
        <h3>${isEdit ? 'ویرایش میانبر' : 'افزودن میانبر جدید'}</h3>
        <input type="text" id="ds-inp-title" placeholder="نام میانبر" value="${isEdit ? (item.title || '') : ''}">
        <input type="text" id="ds-inp-url" placeholder="آدرس سایت" value="${isEdit ? (item.url || '') : ''}">
        <div class="ds-modal-actions">
          <button class="ds-btn-save" id="ds-btn-save">${isEdit ? 'تأیید و ذخیره' : 'افزودن'}</button>
          <button class="ds-btn-cancel" id="ds-btn-cancel">انصراف</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('ds-btn-cancel').onclick = () => overlay.remove();
    document.getElementById('ds-btn-save').onclick = () => {
      const title = document.getElementById('ds-inp-title').value.trim();
      let url = document.getElementById('ds-inp-url').value.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

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

    menu.innerHTML = `
      <div class="ds-menu-item" id="act-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="ds-menu-item" id="act-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="ds-menu-item" id="act-select"><span>${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>${isSelected ? '✕' : '☑'}</span></div>
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
    `;

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
    let container = document.getElementById('shortcuts-container') || document.querySelector('.shortcuts-grid');
    if (!container) return;

    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'ds-bookmarks-grid';

    // ۱. خانه شاخص: «دم دستی» برگرفته از سورس ری‌اکت
    const damDastiBox = document.createElement('div');
    damDastiBox.className = 'ds-bookmark-box is-damdasti';
    damDastiBox.innerHTML = `
      <div class="ds-box-icon" style="font-size:24px;">⋮⋮⋮</div>
      <span class="ds-box-title" style="color:#60a5fa;font-weight:bold;">دم دستی</span>
    `;
    damDastiBox.onclick = () => alert('پوشه دسترسی سریع «دم دستی»');
    grid.appendChild(damDastiBox);

    const list = getShortcuts();

    // ۲. رندر میانبرهای پر شده
    list.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'ds-bookmark-box' + (selectedIndices.has(index) ? ' is-selected' : '');

      card.innerHTML = `
        <button class="ds-box-dots" title="گزینه‌ها">⋮</button>
        <div class="ds-box-icon">
          <img src="${getFavicon(item.url)}" onerror="this.style.opacity='0'" alt="">
        </div>
        <span class="ds-box-title">${item.title}</span>
      `;

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

    // ۳. پر کردن جایگاه‌های خالی تا سقف ۱۱ کارت با آیکون +
    const emptySlots = Math.max(0, MAX_SLOTS - list.length);
    for (let i = 0; i < emptySlots; i++) {
      const addBox = document.createElement('div');
      addBox.className = 'ds-bookmark-box';
      addBox.innerHTML = `
        <div class="ds-box-icon" style="font-size:28px;opacity:0.4;">+</div>
        <span class="ds-box-title" style="opacity:0.4;">افزودن</span>
      `;
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
