
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

    overlay.innerHTML = `
      <div class="ab-glass-modal">
        <h3>ساخت پوشه بوکمارک جدید در آبنر</h3>
        <input type="text" id="ab-folder-inp" placeholder="نام پوشه (مثلاً: ابزارها، کار، دانشگاه)">
        <div class="ab-modal-actions">
          <button class="ab-btn-save" id="ab-btn-save-folder">ایجاد پوشه</button>
          <button class="ab-btn-cancel" id="ab-btn-cancel-folder">انصراف</button>
        </div>
      </div>
    `;
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

    overlay.innerHTML = `
      <div class="ab-glass-modal">
        <h3>${isEdit ? 'ویرایش بوکمارک آبنر' : 'افزودن بوکمارک به آبنر'}</h3>
        <input type="text" id="ab-inp-title" placeholder="نام بوکمارک" value="${isEdit ? (item.title || '') : ''}">
        <input type="text" id="ab-inp-url" placeholder="آدرس سایت" value="${isEdit ? (item.url || '') : ''}">
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
      foldersHtml += `
        <div class="ab-submenu-row ${isCur ? 'active' : ''}" data-fid="${f.id}">
          <span>${isCur ? '✓' : ''}</span>
          <span>${f.title}</span>
        </div>
      `;
    });

    menu.innerHTML = `
      <div class="ab-menu-item" id="ab-act-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="ab-menu-item" id="ab-act-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="ab-menu-item" id="ab-act-select"><span>${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>${isSelected ? '✕' : '☑'}</span></div>
      <div class="ab-menu-item" id="ab-act-edit"><span>ویرایش</span> <span>✏</span></div>
      <div class="ab-menu-item ab-submenu-trigger">
        <span style="font-size:11px;opacity:0.6;">‹</span>
        <div style="display:flex;align-items:center;gap:8px;"><span>انتقال به پوشه</span> <span>📁</span></div>
        <div class="ab-submenu-box">
          ${foldersHtml}
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
      tab.innerHTML = `<span>📁</span> <span>${f.title}</span>`;
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
    damDastiBox.innerHTML = `
      <div class="ab-box-icon">⋮⋮⋮</div>
      <span class="ab-box-title" style="color:#60a5fa;font-weight:bold;">دم دستی</span>
    `;
    damDastiBox.onclick = () => {
      currentFolder = 'work';
      render();
    };
    grid.appendChild(damDastiBox);

    const activeList = data.items.filter(it => currentFolder === 'all' || it.folder === currentFolder);

    activeList.forEach((item, index) => {
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

    // پر کردن جایگاه‌های خالی با +
    const emptyCount = Math.max(0, MAX_SLOTS - activeList.length);
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
