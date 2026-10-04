document.addEventListener('DOMContentLoaded', () => {

  const toFa = n => String(n).replace(/\d/g, d => ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'][d]);
  const toEn = n => String(n).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

  // ۱. کنترل ناوبری داخلی SPA
  const viewDashboard = document.getElementById('view-dashboard');
  const viewSettings = document.getElementById('view-settings');
  const viewTasks = document.getElementById('view-tasks');

  const dockHomeBtn = document.getElementById('dock-home-btn');
  const dockSettingsBtn = document.getElementById('dock-settings-btn');
  const dockTasksBtn = document.getElementById('dock-tasks-btn');
  const settingsCloseBtn = document.getElementById('settings-close-btn');

  function switchView(activeView, activeBtn) {
    [viewDashboard, viewSettings, viewTasks].forEach(v => v.classList.remove('active'));
    activeView.classList.add('active');
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
  }

  if (dockHomeBtn) dockHomeBtn.onclick = () => switchView(viewDashboard, dockHomeBtn);
  if (dockSettingsBtn) dockSettingsBtn.onclick = () => switchView(viewSettings, dockSettingsBtn);
  if (settingsCloseBtn) settingsCloseBtn.onclick = () => switchView(viewDashboard, dockHomeBtn);

  if (dockTasksBtn) {
    dockTasksBtn.onclick = () => {
      switchView(viewTasks, dockTasksBtn);
      document.getElementById('full-tab-tasks')?.click();
    };
  }

  // ۲. مدیریت پس‌زمینه
  const bgOverlay = document.getElementById('custom-bg-overlay');
  const settingsBgFile = document.getElementById('settings-bg-file');
  const settingsBlurToggle = document.getElementById('settings-blur-toggle');
  const settingsBlurStatus = document.getElementById('settings-blur-status');
  const settingsResetBg = document.getElementById('settings-reset-bg');

  function applyBackgroundConfig() {
    const savedBg = localStorage.getItem('custom_bg');
    const isBlurred = localStorage.getItem('bg_blur') !== 'false';
    if (savedBg) {
      bgOverlay.style.backgroundImage = `url(${savedBg})`;
      bgOverlay.className = `bg-overlay ${isBlurred ? 'blurred' : 'clear'}`;
      if (settingsBlurStatus) settingsBlurStatus.textContent = isBlurred ? 'مات' : 'شفاف';
    } else {
      bgOverlay.style.backgroundImage = 'none';
      bgOverlay.className = 'bg-overlay';
    }
  }

  if (settingsBgFile) {
    settingsBgFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            localStorage.setItem('custom_bg', event.target.result);
            applyBackgroundConfig();
          } catch (err) {
            alert('حجم عکس بالاست!');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (settingsBlurToggle) {
    settingsBlurToggle.addEventListener('click', () => {
      const current = localStorage.getItem('bg_blur') !== 'false';
      localStorage.setItem('bg_blur', (!current).toString());
      applyBackgroundConfig();
    });
  }

  if (settingsResetBg) {
    settingsResetBg.addEventListener('click', () => {
      localStorage.removeItem('custom_bg');
      applyBackgroundConfig();
    });
  }
  applyBackgroundConfig();

  // ۳. شب / روز
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
  applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  // ۴. تقویم شمسی
  const persianMonthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const monthSubTitles = [
    'رمضان-شوال Mar-Apr', 'شوال-ذی القعده Apr-May', 'ذی القعده-ذی الحجه May-Jun',
    'ذی الحجه-محرم Jun-Jul', 'محرم-صفر Jul-Aug', 'صفر-ربیع الاول Aug-Sep',
    'ربیع الثانی-جمادی الاول Sep-Oct', 'جمادی الاول-جمادی الثانی Oct-Nov',
    'جمادی الثانی-رجب Nov-Dec', 'رجب-شعبان Dec-Jan', 'شعبان-رمضان Jan-Feb', 'رمضان-شوال Feb-Mar'
  ];

  let currentYear = 1405;
  let currentMonthIndex = 6;

  const calMonthText = document.getElementById('cal-month-text');
  const calSubText = document.getElementById('cal-sub-text');
  const calDates = document.getElementById('cal-dates');
  const calPrevBtn = document.getElementById('cal-prev-btn');
  const calNextBtn = document.getElementById('cal-next-btn');

  function renderCalendar(year, monthIndex) {
    if (!calMonthText || !calDates) return;
    calMonthText.textContent = `${persianMonthNames[monthIndex]} ${toFa(year)}`;
    calSubText.textContent = monthSubTitles[monthIndex];

    calDates.innerHTML = '';
    const daysInMonth = monthIndex < 6 ? 31 : (monthIndex < 11 ? 30 : 29);
    const startOffset = (monthIndex * 2 + 1) % 7;

    for (let k = 0; k < startOffset; k++) {
      calDates.appendChild(document.createElement('span'));
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const span = document.createElement('span');
      span.textContent = toFa(i);
      const dayOfWeek = (i + startOffset - 1) % 7;
      if (dayOfWeek === 6) span.className = 'fri holiday';
      if (year === 1405 && monthIndex === 6 && i === 9) span.className = 'today-circle';
      calDates.appendChild(span);
    }
  }

  if (calPrevBtn) {
    calPrevBtn.onclick = (e) => {
      e.stopPropagation();
      currentMonthIndex--;
      if (currentMonthIndex < 0) { currentMonthIndex = 11; currentYear--; }
      renderCalendar(currentYear, currentMonthIndex);
    };
  }

  if (calNextBtn) {
    calNextBtn.onclick = (e) => {
      e.stopPropagation();
      currentMonthIndex++;
      if (currentMonthIndex > 11) { currentMonthIndex = 0; currentYear++; }
      renderCalendar(currentYear, currentMonthIndex);
    };
  }
  renderCalendar(currentYear, currentMonthIndex);

  // ۵. ساعت زنده
  const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  function updateLiveClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const clockElem = document.getElementById('clock');
    if (clockElem) clockElem.textContent = `${toFa(String(hours).padStart(2, '0'))}:${toFa(minutes)}`;

    const dayElem = document.getElementById('clock-day-label');
    if (dayElem) dayElem.textContent = persianDays[now.getDay()];
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // ۶. سرچ‌بار
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const engineSwitcher = document.getElementById('engine-switcher');
  const googleLogo = document.getElementById('google-logo');
  const zarebinLogo = document.getElementById('zarebin-logo');
  let currentEngine = localStorage.getItem('search_engine') || 'google';

  function updateSearchEngineUI() {
    if (!searchForm || !searchInput) return;
    if (currentEngine === 'zarebin') {
      if (googleLogo) googleLogo.style.display = 'none';
      if (zarebinLogo) zarebinLogo.style.display = 'inline-block';
      searchInput.placeholder = 'جستجو در ذره‌بین...';
      searchForm.action = 'https://zarebin.ir/search';
    } else {
      if (googleLogo) googleLogo.style.display = 'inline-block';
      if (zarebinLogo) zarebinLogo.style.display = 'none';
      searchInput.placeholder = 'جستجو در گوگل...';
      searchForm.action = 'https://www.google.com/search';
    }
  }

  if (engineSwitcher) {
    engineSwitcher.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      currentEngine = currentEngine === 'google' ? 'zarebin' : 'google';
      localStorage.setItem('search_engine', currentEngine);
      updateSearchEngineUI();
    });
  }
  updateSearchEngineUI();

  // ۷. شورتکات‌ها
  const shortcutsGrid = document.getElementById('shortcuts-grid');
  const defaultShortcuts = [
    { title: 'دم‌دستی', url: 'https://dastyar.io' },
    { title: 'یوتیوب', url: 'https://www.youtube.com' },
    { title: 'پینترست', url: 'https://www.pinterest.com' },
    { title: 'دیجی‌کالا', url: 'https://www.digikala.com' }
  ];
  let shortcuts = JSON.parse(localStorage.getItem('my_shortcuts')) || defaultShortcuts;

  function renderShortcuts() {
    if (!shortcutsGrid) return;
    shortcutsGrid.innerHTML = '';
    shortcuts.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'shortcut-box';
      const domain = new URL(item.url).hostname;
      card.innerHTML = `
        <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=128" class="shortcut-icon-img" alt="${item.title}">
        <span class="shortcut-title">${item.title}</span>
      `;
      card.onclick = () => window.location.href = item.url;
      shortcutsGrid.appendChild(card);
    });
  }
  renderShortcuts();

  // ۸. مدیریت تسک و پاپ‌آپ‌های مستقل در ویرایش
  const emptyState = document.getElementById('empty-state');
  const todoList = document.getElementById('todo-list');
  const taskTriggerCollapsed = document.getElementById('task-trigger-collapsed');
  const taskComposerExpanded = document.getElementById('task-composer-expanded');
  const composerTitle = document.getElementById('composer-title');
  const composerDesc = document.getElementById('composer-desc');
  const composerSubmitBtn = document.getElementById('composer-submit-btn');

  // مودال ویرایش
  const editTaskModal = document.getElementById('edit-task-modal');
  const editTaskCloseBtn = document.getElementById('edit-task-close-btn');
  const editTaskTitleInput = document.getElementById('edit-task-title-input');
  const editTaskDescInput = document.getElementById('edit-task-desc-input');
  const editTaskChkIndicator = document.getElementById('edit-task-chk-indicator');

  const editBoardBtn = document.getElementById('edit-board-btn');
  const editBoardLabel = document.getElementById('edit-board-label');
  const boardDropdownMenu = document.getElementById('board-dropdown-menu');

  const editToolRepeatBtn = document.getElementById('edit-tool-repeat-btn');
  const editToolDateBtn = document.getElementById('edit-tool-date-btn');
  const editToolTimeBtn = document.getElementById('edit-tool-time-btn');
  const editToolTagBtn = document.getElementById('edit-tool-tag-btn');
  const editToolPriorityBtn = document.getElementById('edit-tool-priority-btn');

  const editPopupRepeat = document.getElementById('edit-popup-repeat');
  const editPopupDate = document.getElementById('edit-popup-date');
  const editPopupTime = document.getElementById('edit-popup-time');
  const editPopupTag = document.getElementById('edit-popup-tag');
  const editPopupPriority = document.getElementById('edit-popup-priority');

  const editRepeatLabel = document.getElementById('edit-repeat-label');
  const editDateLabel = document.getElementById('edit-date-label');
  const editTimeLabel = document.getElementById('edit-time-label');
  const editTagLabel = document.getElementById('edit-tag-label');
  const editPriorityLabel = document.getElementById('edit-priority-label');

  const btnEditTaskSave = document.getElementById('btn-edit-task-save');
  const btnEditTaskDelete = document.getElementById('btn-edit-task-delete');

  let currentEditingIndex = -1;
  let currentEditingBoard = 'none';

  let draftTask = { tag: '', date: '', time: '', priority: 'none', repeat: '' };
  let createDraftTask = { tag: '', date: '', time: '', priority: 'none', repeat: '' };

  let todos = JSON.parse(localStorage.getItem('my_todos')) || [];

  function closeAllPopups() {
    document.querySelectorAll('.task-tool-popup').forEach(p => p.style.display = 'none');
    if (boardDropdownMenu) boardDropdownMenu.style.display = 'none';
  }

  window.addEventListener('click', (e) => {
    if (!e.target.closest('.tool-popup-wrap') && !e.target.closest('#inline-task-box') && !e.target.closest('#edit-task-modal')) {
      closeAllPopups();
      if (taskComposerExpanded) {
        taskComposerExpanded.style.display = 'none';
        taskTriggerCollapsed.style.display = 'block';
      }
    }
  });

  if (taskTriggerCollapsed && taskComposerExpanded) {
    taskTriggerCollapsed.onclick = (e) => {
      e.stopPropagation();
      closeAllPopups();
      taskTriggerCollapsed.style.display = 'none';
      taskComposerExpanded.style.display = 'flex';
      composerTitle.focus();
    };
  }

  function openEditTaskModal(index) {
    currentEditingIndex = index;
    const item = todos[index];
    if (!item) return;

    editTaskTitleInput.value = item.title || '';
    editTaskDescInput.value = item.desc || '';
    currentEditingBoard = item.board || 'none';

    draftTask = {
      tag: item.tag || '',
      date: item.date || '',
      time: item.time || '',
      priority: item.priority || 'none',
      repeat: item.repeat || ''
    };

    if (editBoardLabel) {
      if (item.board === 'in_progress') editBoardLabel.textContent = '📁 در دست اقدام ⌵';
      else if (item.board === 'done') editBoardLabel.textContent = '📁 انجام شده ⌵';
      else editBoardLabel.textContent = '📁 بورد ⌵';
    }

    if (editRepeatLabel) editRepeatLabel.textContent = item.repeat ? item.repeat : 'تکرار';
    if (editDateLabel) editDateLabel.textContent = item.date ? item.date : 'سررسید';
    if (editTimeLabel) editTimeLabel.textContent = item.time ? item.time : 'ساعت';
    if (editTagLabel) editTagLabel.textContent = item.tag ? item.tag : 'برچسب‌ها';

    const prioNames = { none: 'بدون اولویت', low: 'پایین', medium: 'متوسط', high: 'بالا' };
    if (editPriorityLabel) editPriorityLabel.textContent = prioNames[item.priority] || 'بدون اولویت';

    closeAllPopups();
    if (editTaskModal) editTaskModal.classList.add('active');
  }

  if (editTaskCloseBtn && editTaskModal) {
    editTaskCloseBtn.onclick = () => {
      editTaskModal.classList.remove('active');
      closeAllPopups();
    };
  }

  if (editBoardBtn && boardDropdownMenu) {
    editBoardBtn.onclick = (e) => {
      e.stopPropagation();
      const isVisible = boardDropdownMenu.style.display === 'flex';
      closeAllPopups();
      boardDropdownMenu.style.display = isVisible ? 'none' : 'flex';
    };

    boardDropdownMenu.querySelectorAll('.board-opt-item').forEach(opt => {
      opt.onclick = (ev) => {
        ev.stopPropagation();
        currentEditingBoard = opt.dataset.board;
        if (editBoardLabel) {
          if (currentEditingBoard === 'in_progress') editBoardLabel.textContent = '📁 در دست اقدام ⌵';
          else if (currentEditingBoard === 'done') editBoardLabel.textContent = '📁 انجام شده ⌵';
          else editBoardLabel.textContent = '📁 بورد ⌵';
        }
        boardDropdownMenu.style.display = 'none';
      };
    });
  }

  function toggleLocalPopup(popupEl) {
    const isVisible = popupEl.style.display === 'flex';
    closeAllPopups();
    popupEl.style.display = isVisible ? 'none' : 'flex';
  }

  if (editToolRepeatBtn && editPopupRepeat) {
    editToolRepeatBtn.onclick = (e) => { e.stopPropagation(); toggleLocalPopup(editPopupRepeat); };
  }
  if (editToolDateBtn && editPopupDate) {
    editToolDateBtn.onclick = (e) => { e.stopPropagation(); toggleLocalPopup(editPopupDate); };
  }
  if (editToolTimeBtn && editPopupTime) {
    editToolTimeBtn.onclick = (e) => { e.stopPropagation(); toggleLocalPopup(editPopupTime); };
  }
  if (editToolTagBtn && editPopupTag) {
    editToolTagBtn.onclick = (e) => { e.stopPropagation(); toggleLocalPopup(editPopupTag); };
  }
  if (editToolPriorityBtn && editPopupPriority) {
    editToolPriorityBtn.onclick = (e) => { e.stopPropagation(); toggleLocalPopup(editPopupPriority); };
  }

  if (editPopupPriority) {
    editPopupPriority.querySelectorAll('.prio-item').forEach(el => {
      el.onclick = (ev) => {
        ev.stopPropagation();
        editPopupPriority.querySelectorAll('.prio-item').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        draftTask.priority = el.dataset.prio;
        const prioNames = { none: 'بدون اولویت', low: 'پایین', medium: 'متوسط', high: 'بالا' };
        if (editPriorityLabel) editPriorityLabel.textContent = prioNames[el.dataset.prio];
        editPopupPriority.style.display = 'none';
      };
    });
  }

  const editNewTagInput = document.getElementById('edit-new-tag-input');
  const editTagAddPlusBtn = document.getElementById('edit-tag-add-plus-btn');
  if (editTagAddPlusBtn && editNewTagInput) {
    editTagAddPlusBtn.onclick = (e) => {
      e.stopPropagation();
      const val = editNewTagInput.value.trim();
      if (!val) return;
      draftTask.tag = val;
      if (editTagLabel) editTagLabel.textContent = val;
      editNewTagInput.value = '';
      editPopupTag.style.display = 'none';
    };
  }

  if (btnEditTaskSave && editTaskModal) {
    btnEditTaskSave.onclick = () => {
      if (currentEditingIndex > -1 && todos[currentEditingIndex]) {
        todos[currentEditingIndex].title = editTaskTitleInput.value.trim() || todos[currentEditingIndex].title;
        todos[currentEditingIndex].desc = editTaskDescInput.value.trim();
        todos[currentEditingIndex].board = currentEditingBoard;
        todos[currentEditingIndex].tag = draftTask.tag;
        todos[currentEditingIndex].date = draftTask.date;
        todos[currentEditingIndex].time = draftTask.time;
        todos[currentEditingIndex].priority = draftTask.priority;
        todos[currentEditingIndex].repeat = draftTask.repeat;
        saveAndRenderTodos();
      }
      closeAllPopups();
      editTaskModal.classList.remove('active');
    };
  }

  if (btnEditTaskDelete && editTaskModal) {
    btnEditTaskDelete.onclick = () => {
      if (currentEditingIndex > -1 && todos[currentEditingIndex]) {
        todos.splice(currentEditingIndex, 1);
        saveAndRenderTodos();
      }
      closeAllPopups();
      editTaskModal.classList.remove('active');
    };
  }

  function saveAndRenderTodos() {
    localStorage.setItem('my_todos', JSON.stringify(todos));
    if (!todoList || !emptyState) return;

    todoList.innerHTML = '';
    if (todos.length === 0) {
      emptyState.style.display = 'flex';
      todoList.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    todoList.style.display = 'flex';

    todos.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = `task-item-card ios-glass-card ${item.done ? 'done' : ''}`;
      
      const pills = [];
      if (item.board === 'in_progress') pills.push(`<span class="task-board-badge in-progress">● در دست اقدام</span>`);
      else if (item.board === 'done') pills.push(`<span class="task-board-badge done-badge">● انجام شده</span>`);

      if (item.date) pills.push(`<span class="task-meta-pill"><span>${item.date}</span><span>📅</span></span>`);
      if (item.time) pills.push(`<span class="task-meta-pill"><span>${item.time}</span><span>⏰</span></span>`);
      if (item.repeat) pills.push(`<span class="task-meta-pill"><span>${item.repeat}</span><span>↺</span></span>`);
      if (item.tag) pills.push(`<span class="task-meta-pill"><span>${item.tag}</span><span>🏷️</span></span>`);

      const metaHtml = pills.length > 0 ? `<div class="task-meta-pills">${pills.join('')}</div>` : '';
      const prioClass = `prio-${item.priority || 'none'}`;
      const firstLineDesc = item.desc ? item.desc.split('\n')[0].trim() : '';

      li.innerHTML = `
        <div class="task-card-right-group">
          <div class="task-checkbox-custom ${prioClass}" title="تغییر وضعیت">
            ${item.done ? '✓' : ''}
          </div>
          <div class="task-text-stack">
            <span class="task-item-title">${item.title}</span>
            ${firstLineDesc ? `<span class="task-item-desc">${firstLineDesc}</span>` : ''}
            ${metaHtml}
          </div>
        </div>

        <div class="task-card-left-actions">
          <button class="task-act-btn edit-btn" title="ویرایش">✏️</button>
          <button class="task-act-btn delete-btn" title="حذف">🗑️</button>
        </div>
      `;

      li.querySelector('.task-checkbox-custom').onclick = (e) => {
        e.stopPropagation();
        todos[index].done = !todos[index].done;
        saveAndRenderTodos();
      };

      li.querySelector('.edit-btn').onclick = (e) => {
        e.stopPropagation();
        openEditTaskModal(index);
      };

      li.querySelector('.delete-btn').onclick = (e) => {
        e.stopPropagation();
        todos.splice(index, 1);
        saveAndRenderTodos();
      };

      todoList.appendChild(li);
    });
  }

  if (composerSubmitBtn && composerTitle) {
    const handleCreateTask = () => {
      const t = composerTitle.value.trim();
      const d = composerDesc.value.trim();
      if (!t) return;

      todos.push({
        title: t,
        desc: d,
        done: false,
        tag: createDraftTask.tag,
        date: createDraftTask.date,
        time: createDraftTask.time,
        priority: createDraftTask.priority || 'none',
        repeat: createDraftTask.repeat,
        board: 'none'
      });

      composerTitle.value = '';
      composerDesc.value = '';
      createDraftTask = { tag: '', date: '', time: '', priority: 'none', repeat: '' };
      closeAllPopups();
      taskComposerExpanded.style.display = 'none';
      taskTriggerCollapsed.style.display = 'block';
      saveAndRenderTodos();
    };

    composerSubmitBtn.onclick = (e) => { e.stopPropagation(); handleCreateTask(); };
    composerTitle.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); handleCreateTask(); }
    });
  }

  saveAndRenderTodos();
});