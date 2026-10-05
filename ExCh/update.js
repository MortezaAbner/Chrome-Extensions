const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const fixTabsAndOutsideClose = `
  // بستن پاپ‌آپ تنظیمات با کلیک روی فضای بیرونی
  const viewSettingsModal = document.getElementById('view-settings');
  if (viewSettingsModal) {
    viewSettingsModal.addEventListener('click', (e) => {
      if (e.target === viewSettingsModal) {
        viewSettingsModal.classList.remove('active');
        document.getElementById('view-dashboard')?.classList.add('active');
        document.getElementById('dock-home-btn')?.classList.add('active');
      }
    });
  }

  // سوئیچ مستقیم و تضمینی تب‌های تنظیمات
  function bindSettingsNavClick() {
    const navItems = document.querySelectorAll('.settings-sidebar-nav .nav-item-glass');
    const panes = document.querySelectorAll('.settings-tab-pane');
    const headerTitle = document.getElementById('settings-header-label');

    navItems.forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const tabKey = item.getAttribute('data-tab');
        if (!tabKey) return;

        // تغییر وضعیت فعال دکمه‌های سایدبار
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // مخفی‌سازی همه تب‌ها و نمایش تب انتخابی
        panes.forEach(pane => {
          pane.style.setProperty('display', 'none', 'important');
          pane.classList.remove('active');
        });

        const targetPane = document.getElementById('pane-' + tabKey);
        if (targetPane) {
          targetPane.style.setProperty('display', 'flex', 'important');
          targetPane.classList.add('active');
        }

        // تغییر عنوان پنجره
        if (headerTitle) {
          headerTitle.textContent = 'تنظیمات › ' + item.textContent.replace(/[^\u0600-\u06FF\s]/g, '').trim();
        }
      };
    });
  }

  // اجرا پس از لود کامل صفحه
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSettingsNavClick);
  } else {
    bindSettingsNavClick();
  }
`;

  // افزودن یا جایگزینی لاجیک سوییچ تب‌ها
  if (js.includes('bindSettingsNavClick()')) {
    js = js.replace(/\/\/ بستن پاپ‌آپ تنظیمات با کلیک روی فضای بیرونی[\s\S]*?bindSettingsNavClick\(\);[\s\S]*?\}/, fixTabsAndOutsideClose);
  } else {
    js += '\n' + fixTabsAndOutsideClose;
  }

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ مشکل باز نشدن تب‌ها و قابلیت بستن با کلیک بیرون برطرف شد.');
}