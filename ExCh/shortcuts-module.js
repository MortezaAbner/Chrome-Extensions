/**
 * ماژول کامل میانبرها (برگرفته ۱ به ۱ از ساختار دستیار با موتور شیشه‌ای)
 * سازگار با هر دو محیط وب‌اپ و اکستنشن کروم
 */
(function () {
  const STORAGE_KEY = 'user_shortcuts';
  let selectedIndices = new Set();

  // میانبرهای پیش‌فرض در صورت خالی بودن حافظه
  const defaultShortcuts = [
    { title: 'گوگل', url: 'https://www.google.com' },
    { title: 'یوتیوب', url: 'https://www.youtube.com' },
    { title: 'تلگرام', url: 'https://web.telegram.org' },
    { title: 'اینستاگرام', url: 'https://www.instagram.com' },
    { title: 'دیجی‌کالا', url: 'https://www.digikala.com' },
    { title: 'دیوار', url: 'https://divar.ir' }
  ];

  function getShortcuts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : defaultShortcuts;
    } catch (e) {
      return defaultShortcuts;
    }
  }

  function saveShortcuts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    renderShortcuts();
  }

  function getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return '';
    }
  }

  // تزریق نوار مدیریت دسته‌جمعی (عکس ۷)
  function ensureBulkBar() {
    let bar = document.getElementById('shortcut-bulk-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'shortcut-bulk-bar';
      bar.className = 'shortcut-bulk-bar';
      bar.innerHTML = `
        <span class="bulk-close" id="bulk-close-btn" title="لغو انتخاب">✕</span>
        <span class="bulk-del" id="bulk-del-btn">حذف 🗑️</span>
        <span class="bulk-divider">|</span>
        <span>مورد انتخاب شده</span>
        <span class="bulk-badge" id="bulk-counter">۰</span>
      `;
      document.body.appendChild(bar);

      document.getElementById('bulk-close-btn').onclick = clearSelection;
      document.getElementById('bulk-del-btn').onclick = deleteSelected;
    }
    return bar;
  }

  function updateBulkBar() {
    const bar = ensureBulkBar();
    const counter = document.getElementById('bulk-counter');
    const count = selectedIndices.size;
    if (counter) counter.textContent = count;

    if (count > 0) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }

  function clearSelection() {
    selectedIndices.clear();
    document.querySelectorAll('.shortcut-item-card').forEach(el => el.classList.remove('is-selected'));
    updateBulkBar();
  }

  function deleteSelected() {
    if (selectedIndices.size === 0) return;
    let list = getShortcuts();
    list = list.filter((_, idx) => !selectedIndices.has(idx));
    clearSelection();
    saveShortcuts(list);
  }

  // ایجاد پاپ‌‌آپ ویرایش یا افزودن میانبر (عکس ۱ و ۹)
  function openShortcutModal(index = null, currentItem = null) {
    const isEdit = index !== null && currentItem !== null;
    let modalOverlay = document.getElementById('shortcut-editor-overlay');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'shortcut-editor-overlay';
      modalOverlay.className = 'shortcut-modal-overlay';
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
      <div class="shortcut-glass-modal">
        <h3>${isEdit ? 'ویرایش میانبر' : 'افزودن میانبر'}</h3>
        <input type="text" id="sh-input-name" placeholder="نام میانبر" value="${isEdit ? (currentItem.title || '') : ''}">
        <input type="text" id="sh-input-url" placeholder="آدرس سایت (مثال: https://site.com)" value="${isEdit ? (currentItem.url || '') : ''}">
        <div class="modal-btn-row">
          <button class="btn-confirm" id="sh-btn-save">${isEdit ? 'تأیید و ذخیره' : 'افزودن'}</button>
          <button class="btn-cancel" id="sh-btn-cancel">انصراف</button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');

    document.getElementById('sh-btn-cancel').onclick = () => {
      modalOverlay.classList.remove('active');
    };

    document.getElementById('sh-btn-save').onclick = () => {
      const name = document.getElementById('sh-input-name').value.trim();
      let url = document.getElementById('sh-input-url').value.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

      let list = getShortcuts();
      if (isEdit) {
        list[index] = { title: name || url, url: url };
      } else {
        list.push({ title: name || url, url: url });
      }
      modalOverlay.classList.remove('active');
      saveShortcuts(list);
    };
  }

  // منوی سه‌نقطه میانبرها (عکس ۳ و ۴ و ۵ و ۶ و ۸)
  function openContextMenu(e, index, item, targetCard) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    document.querySelectorAll('.shortcut-floating-menu').forEach(m => m.remove());

    const isSelected = selectedIndices.has(index);
    const menu = document.createElement('div');
    menu.className = 'shortcut-floating-menu';

    menu.innerHTML = `
      <div class="menu-action" id="ctx-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="menu-action" id="ctx-open-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="menu-action" id="ctx-select"><span>${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>${isSelected ? '✕' : '☑'}</span></div>
      <div class="menu-divider"></div>
      <div class="menu-action" id="ctx-edit"><span>ویرایش</span> <span>✏</span></div>
      <div class="menu-action" id="ctx-copy"><span>کپی لینک</span> <span>📋</span></div>
      <div class="menu-divider"></div>
      <div class="menu-action danger" id="ctx-delete"><span>حذف</span> <span>🗑️</span></div>
    `;

    document.body.appendChild(menu);

    const rect = targetCard.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 6}px`;
    menu.style.left = `${Math.max(12, rect.left + window.scrollX - 25)}px`;

    menu.querySelector('#ctx-open').onclick = () => {
      window.location.href = item.url;
      menu.remove();
    };
    menu.querySelector('#ctx-open-tab').onclick = () => {
      window.open(item.url, '_blank');
      menu.remove();
    };
    menu.querySelector('#ctx-select').onclick = () => {
      if (isSelected) {
        selectedIndices.delete(index);
        targetCard.classList.remove('is-selected');
      } else {
        selectedIndices.add(index);
        targetCard.classList.add('is-selected');
      }
      updateBulkBar();
      menu.remove();
    };
    menu.querySelector('#ctx-edit').onclick = () => {
      menu.remove();
      openShortcutModal(index, item);
    };
    menu.querySelector('#ctx-copy').onclick = () => {
      navigator.clipboard.writeText(item.url);
      menu.remove();
    };
    menu.querySelector('#ctx-delete').onclick = () => {
      menu.remove();
      let list = getShortcuts();
      list.splice(index, 1);
      selectedIndices.delete(index);
      updateBulkBar();
      saveShortcuts(list);
    };

    const docClick = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', docClick);
      }
    };
    setTimeout(() => document.addEventListener('click', docClick), 50);
  }

  // تابع رندرینگ اصلی شبکه میانبرها
  window.renderShortcuts = function () {
    const container = document.getElementById('shortcuts-container') || document.querySelector('.shortcuts-grid');
    if (!container) return;

    container.innerHTML = '';
    const shortcuts = getShortcuts();

    shortcuts.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `shortcut-item-card ${selectedIndices.has(index) ? 'is-selected' : ''}`;

      card.innerHTML = `
        <button class="shortcut-dots-btn" title="گزینه‌ها">⋮</button>
        <div class="shortcut-icon-box">
          <img src="${getFaviconUrl(item.url)}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23fff\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'10\\'/></svg>'" alt="">
        </div>
        <span class="shortcut-title">${item.title}</span>
      `;

      // کلیک روی کلید برای هدایت به سایت
      card.onclick = (e) => {
        if (e.target.closest('.shortcut-dots-btn')) return;
        if (selectedIndices.size > 0) {
          // اگر در حالت انتخاب باشد، کلیک روی کارت آن را انتخاب/لغو می‌کند
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

      // دکمه سه‌نقطه و کلیک راست
      const dotsBtn = card.querySelector('.shortcut-dots-btn');
      dotsBtn.onclick = (e) => openContextMenu(e, index, item, card);
      card.oncontextmenu = (e) => openContextMenu(e, index, item, card);

      container.appendChild(card);
    });

    // دکمه افزودن میانبر (+)
    const addCard = document.createElement('div');
    addCard.className = 'shortcut-item-card add-btn-card';
    addCard.innerHTML = `
      <div class="shortcut-icon-box add-icon-box">
        <span style="font-size:24px;line-height:1;">+</span>
      </div>
      <span class="shortcut-title" style="opacity:0.8;">افزودن</span>
    `;
    addCard.onclick = () => openShortcutModal();
    container.appendChild(addCard);
  };

  // رندر اولیه هنگام لود صفحه
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.renderShortcuts);
  } else {
    window.renderShortcuts();
  }
})();