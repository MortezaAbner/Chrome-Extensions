const fs = require('fs');
const path = require('path');

console.log('🚀 در حال ارتقای ماژول بوکمارک آبنر به ظرفیت نامحدود و مدیریت کامل پوشه‌ها...');

const bookmarkDir = path.join(__dirname, 'modules', 'bookmark');
if (!fs.existsSync(bookmarkDir)) fs.mkdirSync(bookmarkDir, { recursive: true });

// ۱. جاوااسکریپت ماژولار بوکمارک و پوشه‌های آبنر (modules/bookmark/bookmark.js)
const bookmarkJs = `
/**
 * ماژول پیشرفته بوکمارک و پوشه‌بندی نامحدود آبنر
 */
(function initAbnerFullBookmarks() {
  const STORAGE_KEY = 'abner_bookmarks_v2';
  let selectedIndices = new Set();
  let currentFolder = 'all';

  function getData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}

    // داده‌های اولیه
    return {
      folders: [
        { id: 'all', title: 'صفحه اصلی' },
        { id: 'quick', title: 'دم دستی' }
      ],
      items: [
        { id: '1', title: 'گوگل', url: 'https://www.google.com', folder: 'all' },
        { id: '2', title: 'یوتیوب', url: 'https://www.youtube.com', folder: 'all' },
        { id: '3', title: 'تلگرام', url: 'https://web.telegram.org', folder: 'all' },
        { id: '4', title: 'اینستاگرام', url: 'https://www.instagram.com', folder: 'all' },
        { id: '5', title: 'دیجی‌کالا', url: 'https://www.digikala.com', folder: 'all' },
        { id: '6', title: 'دیوار', url: 'https://divar.ir', folder: 'all' }
      ]
    };
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

  // مدال شیشه‌ای چندمنظوره برای افزودن و ویرایش (بوکمارک یا پوشه)
  function openCreateModal(editItem = null) {
    document.getElementById('ab-modal-overlay')?.remove();

    const isEdit = editItem !== null;
    const isFolder = isEdit && editItem.isFolder;

    const overlay = document.createElement('div');
    overlay.id = 'ab-modal-overlay';
    overlay.className = 'ab-modal-overlay active';

    overlay.innerHTML = \`
      <div class="ab-glass-modal">
        <h3>\${isEdit ? (isFolder ? 'ویرایش پوشه آبنر' : 'ویرایش بوکمارک آبنر') : 'افزودن به آبنر'}</h3>
        \${!isEdit ? \`
          <div style="display:flex;gap:8px;margin-bottom:14px;">
            <button type="button" id="type-link-btn" class="ab-btn-save" style="background:#2563eb;">لینک / بوکمارک</button>
            <button type="button" id="type-folder-btn" class="ab-btn-cancel">پوشه جدید</button>
          </div>
        \` : ''}
        
        <input type="text" id="ab-modal-title" placeholder="عنوان" value="\${isEdit ? editItem.title : ''}">
        <input type="text" id="ab-modal-url" placeholder="آدرس سایت (https://...)" style="\${isFolder ? 'display:none;' : ''}" value="\${isEdit && !isFolder ? (editItem.url || '') : ''}">

        <div class="ab-modal-actions">
          <button class="ab-btn-save" id="ab-modal-submit">\${isEdit ? 'ذخیره تغییرات' : 'افزودن'}</button>
          <button class="ab-btn-cancel" id="ab-modal-cancel">انصراف</button>
        </div>
      </div>
    \`;
    document.body.appendChild(overlay);

    let createType = 'link';
    if (!isEdit) {
      const linkBtn = document.getElementById('type-link-btn');
      const folderBtn = document.getElementById('type-folder-btn');
      const urlInput = document.getElementById('ab-modal-url');

      linkBtn.onclick = () => {
        createType = 'link';
        linkBtn.style.background = '#2563eb';
        folderBtn.style.background = 'rgba(255, 255, 255, 0.15)';
        urlInput.style.display = 'block';
      };
      folderBtn.onclick = () => {
        createType = 'folder';
        folderBtn.style.background = '#2563eb';
        linkBtn.style.background = 'rgba(255, 255, 255, 0.15)';
        urlInput.style.display = 'none';
      };
    }

    document.getElementById('ab-modal-cancel').onclick = () => overlay.remove();
    document.getElementById('ab-modal-submit').onclick = () => {
      const title = document.getElementById('ab-modal-title').value.trim();
      let url = document.getElementById('ab-modal-url').value.trim();
      const data = getData();

      if (isEdit) {
        if (isFolder) {
          const f = data.folders.find(x => x.id === editItem.id);
          if (f) f.title = title || f.title;
        } else {
          const item = data.items.find(x => x.id === editItem.id);
          if (item) {
            item.title = title || item.title;
            if (url) {
              if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;
              item.url = url;
            }
          }
        }
      } else {
        if (createType === 'folder') {
          if (!title) return;
          const fid = 'f_' + Date.now();
          data.folders.push({ id: fid, title });
          currentFolder = fid;
        } else {
          if (!url) return;
          if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;
          data.items.push({
            id: 'b_' + Date.now(),
            title: title || url,
            url,
            folder: currentFolder
          });
        }
      }

      overlay.remove();
      saveData(data);
    };
  }

  // منوی ۶ گزینه‌ای راست‌کلیک
  function openContextMenu(e, item, isFolder = false, cardEl) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.querySelectorAll('.ab-context-menu').forEach(m => m.remove());

    const data = getData();
    const menu = document.createElement('div');
    menu.className = 'ab-context-menu';

    let foldersList = '';
    data.folders.forEach(f => {
      const isCur = (!isFolder && item.folder === f.id);
      foldersList += \`
        <div class="ab-submenu-row \${isCur ? 'active' : ''}" data-fid="\${f.id}">
          <span>\${isCur ? '✓' : ''}</span>
          <span>\${f.title}</span>
        </div>
      \`;
    });

    menu.innerHTML = \`
      \${!isFolder ? \`
        <div class="ab-menu-item" id="ab-act-open"><span>باز کردن</span> <span>🔗</span></div>
        <div class="ab-menu-item" id="ab-act-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
        <div class="ab-menu-item" id="ab-act-copy"><span>کپی لینک</span> <span>📋</span></div>
      \` : ''}
      <div class="ab-menu-item" id="ab-act-edit"><span>ویرایش نام \${isFolder ? 'پوشه' : ''}</span> <span>✏</span></div>
      \${!isFolder ? \`
        <div class="ab-menu-item ab-submenu-trigger">
          <span style="font-size:11px;opacity:0.6;">‹</span>
          <div style="display:flex;align-items:center;gap:8px;"><span>انتقال به پوشه</span> <span>📁</span></div>
          <div class="ab-submenu-box">
            \${foldersList}
          </div>
        </div>
      \` : ''}
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.15);margin:4px 0;">
      <div class="ab-menu-item danger" id="ab-act-del"><span>حذف \${isFolder ? 'پوشه و محتوا' : ''}</span> <span>🗑️</span></div>
    \`;

    document.body.appendChild(menu);

    let left = e ? e.clientX : cardEl.getBoundingClientRect().left;
    let top = e ? e.clientY : cardEl.getBoundingClientRect().bottom + 5;
    if (left + 190 > window.innerWidth) left = window.innerWidth - 195;
    if (top + 280 > window.innerHeight) top = window.innerHeight - 285;
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    if (!isFolder) {
      menu.querySelector('#ab-act-open').onclick = () => { window.location.href = item.url; menu.remove(); };
      menu.querySelector('#ab-act-tab').onclick = () => { window.open(item.url, '_blank'); menu.remove(); };
      menu.querySelector('#ab-act-copy').onclick = () => { navigator.clipboard.writeText(item.url); menu.remove(); };

      menu.querySelectorAll('.ab-submenu-row').forEach(row => {
        row.onclick = () => {
          const fid = row.getAttribute('data-fid');
          const curData = getData();
          const target = curData.items.find(x => x.id === item.id);
          if (target) {
            target.folder = fid;
            saveData(curData);
          }
          menu.remove();
        };
      });
    }

    menu.querySelector('#ab-act-edit').onclick = () => {
      menu.remove();
      openCreateModal({ ...item, isFolder });
    };

    menu.querySelector('#ab-act-del').onclick = () => {
      menu.remove();
      const curData = getData();
      if (isFolder) {
        if (confirm('آیا از حذف این پوشه و تمام بوکمارک‌های داخل آن مطمئن هستید؟')) {
          curData.folders = curData.folders.filter(f => f.id !== item.id);
          curData.items = curData.items.filter(it => it.folder !== item.id);
          currentFolder = 'all';
          saveData(curData);
        }
      } else {
        curData.items = curData.items.filter(it => it.id !== item.id);
        saveData(curData);
      }
    };

    const closeHandler = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 40);
  }

  function render() {
    let container = document.getElementById('abner-center-bookmarks');
    if (!container) {
      container = document.createElement('div');
      container.id = 'abner-center-bookmarks';
      const searchBox = document.querySelector('.search-container') || document.querySelector('.search-box') || document.querySelector('#search-input')?.closest('div') || document.querySelector('.center-column');
      if (searchBox && searchBox.parentNode) {
        searchBox.parentNode.insertBefore(container, searchBox.nextSibling);
      } else {
        (document.querySelector('main') || document.body).appendChild(container);
      }
    }

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'ab-bookmarks-wrapper';

    const data = getData();

    // ۱. رندر نوار تب‌های پوشه
    const tabsRow = document.createElement('div');
    tabsRow.className = 'ab-folder-tabs';

    data.folders.forEach(f => {
      const tab = document.createElement('div');
      tab.className = 'ab-folder-tab' + (currentFolder === f.id ? ' active' : '');
      tab.innerHTML = \`<span>📁</span> <span>\${f.title}</span>\`;
      tab.onclick = () => {
        currentFolder = f.id;
        render();
      };
      if (f.id !== 'all' && f.id !== 'quick') {
        tab.oncontextmenu = (e) => openContextMenu(e, f, true, tab);
      }
      tabsRow.appendChild(tab);
    });

    const addFolderBtn = document.createElement('button');
    addFolderBtn.className = 'ab-add-folder-btn';
    addFolderBtn.textContent = '+ پوشه جدید';
    addFolderBtn.onclick = () => openCreateModal();
    tabsRow.appendChild(addFolderBtn);

    wrapper.appendChild(tabsRow);

    // ۲. رندر شبکه مربعی کارت‌ها
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
      currentFolder = 'quick';
      render();
    };
    grid.appendChild(damDastiBox);

    // اقلام پوشه جاری
    const activeItems = data.items.filter(it => currentFolder === 'all' || it.folder === currentFolder);

    activeItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'ab-bookmark-box';
      card.innerHTML = \`
        <button class="ab-box-dots" title="گزینه‌ها">⋮</button>
        <div class="ab-box-icon">
          <img src="\${getFavicon(item.url)}" onerror="this.style.opacity='0'" alt="">
        </div>
        <span class="ab-box-title">\${item.title}</span>
      \`;

      card.onclick = (e) => {
        if (e.target.closest('.ab-box-dots')) return;
        window.location.href = item.url;
      };

      const dots = card.querySelector('.ab-box-dots');
      dots.onclick = (e) => openContextMenu(e, item, false, card);
      card.oncontextmenu = (e) => openContextMenu(e, item, false, card);

      grid.appendChild(card);
    });

    // دکمه دائمی افزودن بوکمارک بدون هیچ محدودیتی
    const addBox = document.createElement('div');
    addBox.className = 'ab-bookmark-box';
    addBox.innerHTML = \`
      <div class="ab-box-icon" style="font-size:26px;opacity:0.4;">+</div>
      <span class="ab-box-title" style="opacity:0.4;">افزودن</span>
    \`;
    addBox.onclick = () => openCreateModal();
    grid.appendChild(addBox);

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
console.log('✅ ماژول بوکمارک و پوشه‌بندی نامحدود آبنر آماده شد.');