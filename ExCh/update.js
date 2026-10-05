const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // ۱. تزریق منطق و استایل شیشه‌ای کامل به بدنه script.js
  const finalInjectCode = `
/* ========================================================
   ماژول نهایی و بازنویسی‌شده منوی ۶ گزینه‌ای دستیار + بلر زنده
======================================================== */
(function() {
  // پاک‌سازی تمام لایسنسورها و منوهای قدیمی
  window.showCustomDastyarMenu = function(e, cardEl, itemData, index) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    document.querySelectorAll('.dastyar-master-menu, .context-menu, .shortcut-menu').forEach(m => m.remove());

    const isSelected = cardEl.classList.contains('is-selected');
    const menu = document.createElement('div');
    menu.className = 'dastyar-master-menu';

    menu.innerHTML = \`
      <div class="ds-row" id="act-open"><span>باز کردن</span> <span>🔗</span></div>
      <div class="ds-row" id="act-tab"><span>باز کردن در تب جدید</span> <span>↗</span></div>
      <div class="ds-row" id="act-select"><span>\${isSelected ? 'لغو انتخاب' : 'انتخاب'}</span> <span>\${isSelected ? '✕' : '☑'}</span></div>
      <div class="ds-row" id="act-edit"><span>ویرایش</span> <span>✏</span></div>
      <div class="ds-row ds-has-sub" id="act-move">
        <span style="font-size:11px;opacity:0.6;">‹</span>
        <div style="display:flex;align-items:center;gap:8px;"><span>انتقال به</span> <span>📁</span></div>
        <div class="ds-sub-box">
          <div class="ds-sub-item active-f"><span>✓</span> <div style="display:flex;gap:6px;"><span>صفحه اصلی</span> <span>🏠</span></div></div>
          <div class="ds-sub-item"><span></span> <div style="display:flex;gap:6px;"><span>App</span> <span>📁</span></div></div>
        </div>
      </div>
      <div class="ds-row" id="act-copy"><span>کپی لینک</span> <span>📋</span></div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.12);margin:4px 0;">
      <div class="ds-row danger" id="act-del"><span>حذف</span> <span>🗑️</span></div>
    \`;

    document.body.appendChild(menu);

    // محاسبه محل نمایش منو
    const rect = cardEl.getBoundingClientRect();
    let left = rect.left - 20;
    let top = rect.bottom + 8;
    if (left < 15) left = 15;
    if (top + 280 > window.innerHeight) top = rect.top - 280;
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';

    // اتصال اکشن‌ها
    menu.querySelector('#act-open').onclick = () => { window.location.href = itemData.url; menu.remove(); };
    menu.querySelector('#act-tab').onclick = () => { window.open(itemData.url, '_blank'); menu.remove(); };
    menu.querySelector('#act-select').onclick = () => {
      cardEl.classList.toggle('is-selected');
      updateGlobalBulkBar();
      menu.remove();
    };
    menu.querySelector('#act-copy').onclick = () => {
      navigator.clipboard.writeText(itemData.url);
      menu.remove();
    };
    menu.querySelector('#act-edit').onclick = () => {
      menu.remove();
      openGlassEditModal(index, itemData);
    };
    menu.querySelector('#act-del').onclick = () => {
      menu.remove();
      let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
      list.splice(index, 1);
      localStorage.setItem('user_shortcuts', JSON.stringify(list));
      location.reload();
    };

    const docClick = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', docClick);
      }
    };
    setTimeout(() => document.addEventListener('click', docClick), 40);
  };

  // دیالوگ ویرایش شیشه‌ای
  function openGlassEditModal(index, item) {
    document.getElementById('shortcut-editor-dialog')?.remove();
    const dPx = localStorage.getItem('blur_dash_val') || '20';
    const dlg = document.createElement('div');
    dlg.id = 'shortcut-editor-dialog';
    dlg.className = 'shortcut-modal-overlay active';

    dlg.innerHTML = \`
      <div class="shortcut-glass-modal" style="backdrop-filter:blur(\${dPx}px) saturate(170%);-webkit-backdrop-filter:blur(\${dPx}px) saturate(170%);">
        <h3 style="margin:0 0 14px 0;font-size:15px;color:#fff;">ویرایش میانبر</h3>
        <input type="text" id="dlg-title" value="\${item.title || item.name || ''}" placeholder="نام میانبر">
        <input type="text" id="dlg-url" value="\${item.url || ''}" placeholder="آدرس سایت">
        <div style="display:flex;gap:10px;margin-top:12px;">
          <button id="dlg-save" style="flex:1;padding:10px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-weight:bold;cursor:pointer;">تأیید و ذخیره</button>
          <button id="dlg-cancel" style="flex:1;padding:10px;background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:12px;cursor:pointer;">انصراف</button>
        </div>
      </div>
    \`;

    document.body.appendChild(dlg);
    document.getElementById('dlg-cancel').onclick = () => dlg.remove();
    document.getElementById('dlg-save').onclick = () => {
      const t = document.getElementById('dlg-title').value.trim();
      let u = document.getElementById('dlg-url').value.trim();
      if (!u) return;
      if (!/^https?:\\/\\//i.test(u)) u = 'https://' + u;

      let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
      if (list[index]) {
        list[index].title = t || u;
        list[index].name = t || u;
        list[index].url = u;
        localStorage.setItem('user_shortcuts', JSON.stringify(list));
      }
      dlg.remove();
      location.reload();
    };
  }

  // نوار مدیریت دسته‌جمعی
  function updateGlobalBulkBar() {
    let bar = document.getElementById('dastyar-bulk-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'dastyar-bulk-bar';
      bar.innerHTML = \`
        <span style="cursor:pointer;opacity:0.7;" id="bulk-close">✕</span>
        <span style="color:#ef4444;cursor:pointer;display:flex;align-items:center;gap:4px;" id="bulk-del">حذف 🗑️</span>
        <span style="opacity:0.3">|</span>
        <span>مورد انتخاب شده</span>
        <span class="count-pill" id="bulk-count">۰</span>
      \`;
      document.body.appendChild(bar);

      document.getElementById('bulk-close').onclick = () => {
        document.querySelectorAll('.shortcut-item, .shortcut-card').forEach(el => el.classList.remove('is-selected'));
        updateGlobalBulkBar();
      };

      document.getElementById('bulk-del').onclick = () => {
        let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
        const selected = [];
        document.querySelectorAll('.shortcut-item, .shortcut-card').forEach((el, i) => {
          if (el.classList.contains('is-selected')) selected.push(i);
        });
        list = list.filter((_, idx) => !selected.includes(idx));
        localStorage.setItem('user_shortcuts', JSON.stringify(list));
        location.reload();
      };
    }

    const count = document.querySelectorAll('.shortcut-item.is-selected, .shortcut-card.is-selected').length;
    document.getElementById('bulk-count').textContent = count;
    if (count > 0) bar.classList.add('active');
    else bar.classList.remove('active');
  }

  // قلاب کردن قطعی به تمام المان‌ها و کارت‌ها در هر بار رندر
  function hookAllShortcuts() {
    let list = JSON.parse(localStorage.getItem('user_shortcuts') || '[]');
    document.querySelectorAll('.shortcut-item, .shortcut-card').forEach((card, idx) => {
      const item = list[idx] || { title: card.innerText.trim(), url: card.getAttribute('href') || '#' };
      
      const moreBtn = card.querySelector('.shortcut-more-btn, .more-btn, [data-action="more"], .shortcut-dots-btn');
      if (moreBtn && !moreBtn.dataset.hooked) {
        moreBtn.dataset.hooked = 'true';
        moreBtn.onclick = (e) => window.showCustomDastyarMenu(e, card, item, idx);
      }
      if (!card.dataset.hookedCtx) {
        card.dataset.hookedCtx = 'true';
        card.oncontextmenu = (e) => window.showCustomDastyarMenu(e, card, item, idx);
      }
    });
  }

  setInterval(hookAllShortcuts, 500);
})();
`;

  // پاک کردن کدهای ناقص قبلی در انتهای script.js و ثبت بلوک جدید
  js = js.replace(/\/\* ========================================================\s*ماژول نهایی و بازنویسی‌شده[\s\S]*?\)\(\);?/g, '');
  js += '\n' + finalInjectCode;
  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ ماژول قطعی منوی ۶ گزینه‌ای در script.js اعمال شد.');
}

// ۲. اعمال استایل شیشه‌ای کامل به style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const cssRules = `
/* استایل کارت‌های میانبر و نوار جستجو شیشه‌ای متصل به اسلایدر */
.shortcut-item, .shortcut-card, .search-bar-container, .search-box {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
}

/* تیک آبی انتخاب */
.shortcut-item.is-selected, .shortcut-card.is-selected {
  outline: 2px solid #3b82f6 !important;
  position: relative !important;
}
.shortcut-item.is-selected::after, .shortcut-card.is-selected::after {
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
  z-index: 20;
}

/* منوی ۶ گزینه‌ای اصلی */
.dastyar-master-menu {
  position: fixed;
  z-index: 1000000;
  width: 175px;
  background: rgba(28, 22, 26, 0.88) !important;
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: 18px !important;
  padding: 6px !important;
  box-shadow: 0 16px 36px rgba(0,0,0,0.5) !important;
  direction: rtl !important;
  color: #fff !important;
  font-family: inherit !important;
  user-select: none !important;
}
.dastyar-master-menu .ds-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}
.dastyar-master-menu .ds-row:hover { background: rgba(255, 255, 255, 0.12); }
.dastyar-master-menu .ds-row.danger { color: #ef4444; }

/* ساب‌منوی انتقال به */
.dastyar-master-menu .ds-has-sub { position: relative; }
.dastyar-master-menu .ds-sub-box {
  display: none;
  position: absolute;
  right: 100%;
  top: 0;
  margin-right: 6px;
  width: 140px;
  background: rgba(28, 22, 26, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  padding: 6px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
.dastyar-master-menu .ds-has-sub:hover .ds-sub-box { display: block; }
.dastyar-master-menu .ds-sub-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
}
.dastyar-master-menu .ds-sub-item.active-f { color: #60a5fa; }

/* نوار دسته‌جمعی شناور */
#dastyar-bulk-bar {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  -webkit-backdrop-filter: blur(var(--dash-blur-px, 20px)) saturate(160%) !important;
  border: 1px solid rgba(255, 255, 255, 0.18);
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
#dastyar-bulk-bar.active {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
#dastyar-bulk-bar .count-pill {
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
`;

  css = css.replace(/\/\* استایل کارت‌های میانبر و نوار جستجو[\s\S]*?font-weight: bold;\s*\}\s*/g, '');
  css += '\n' + cssRules;
  fs.writeFileSync('./style.css', css, 'utf8');
  console.log('✅ استایل‌های شیشه‌ای در style.css درج شدند.');
}