
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
      bar.innerHTML = `
        <span class="ab-bulk-close" id="ab-bulk-close">✕</span>
        <span class="ab-bulk-del" id="ab-bulk-del">حذف 🗑</span>
        <span style="opacity:0.3">|</span>
        <span>مورد انتخاب شده</span>
        <span class="ab-bulk-counter" id="ab-bulk-counter">۰</span>
      `;
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

    overlay.innerHTML = `
      <div class="ab-glass-modal">
        <h3>${isEdit ? 'ویرایش بوکمارک آبنر' : 'افزودن بوکمارک به آبنر'}</h3>
        <input type="text" id="ab-inp-title" placeholder="نام بوکمارک" value="${isEdit ? (item.title || '') : ''}">
        <input type="text" id="ab-inp-url" placeholder="آدرس سایت (مثلاً: https://example.com)" value="${isEdit ? (item.url || '') : ''}">
        <div class="ab-modal-actions">
          <button class="ab-btn-save" id="ab-btn-save">${isEdit ? 'تأیید و ذخیره' : 'افزودن'}</button>
          <button class="ab-btn-cancel" id="ab-btn-cancel">انصراف</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('ab-btn-cancel').onclick = () => overlay.remove();
    document.getElementById('ab-btn-save').onclick = () => {
      const title = document.getElementById('ab-inp-title').value.trim();
      let url = document.getElementById('ab-inp-url').value.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

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

    menu.innerHTML = `
      <div class="ab-menu-item" id="ab-act-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="ab-menu-item" id="ab-act-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="ab-menu-item" id="ab-act-select"><span>${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>${isSelected ? '✕' : '☑'}</span></div>
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
    `;

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
    damDastiBox.innerHTML = `
      <div class="ab-box-icon" style="font-size:24px;">⋮⋮⋮</div>
      <span class="ab-box-title" style="color:#60a5fa;font-weight:bold;">دم دستی</span>
    `;
    damDastiBox.onclick = () => alert('پوشه دسترسی سریع «دم دستی» در آبنر');
    grid.appendChild(damDastiBox);

    const list = getBookmarks();

    // رندر کارت‌های فعال
    list.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'ab-bookmark-box' + (selectedIndices.has(index) ? ' is-selected' : '');

      card.innerHTML = `
        <button class="ab-box-dots" title="گزینه‌ها">⋮</button>
        <div class="ab-box-icon">
          <img src="${getFavicon(item.url)}" onerror="this.style.opacity='0'" alt="">
        </div>
        <span class="ab-box-title">${item.title}</span>
      `;

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
      addBox.innerHTML = `
        <div class="ab-box-icon" style="font-size:28px;opacity:0.4;">+</div>
        <span class="ab-box-title" style="opacity:0.4;">افزودن</span>
      `;
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
