const fs = require('fs');
const path = require('path');

console.log('🔧 در حال رفع خطای CORS و فعال‌سازی قطعی دکمه‌های فرم تسک جدید آبنر...');

// ۱. رفع خطای CORS با اضافه کردن مجوز ipapi.co به manifest.json
const manifestPath = path.join(__dirname, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    if (!manifest.host_permissions) {
      manifest.host_permissions = [];
    }

    const requiredHosts = ['https://ipapi.co/*', 'https://*.ipapi.co/*'];
    requiredHosts.forEach(host => {
      if (!manifest.host_permissions.includes(host)) {
        manifest.host_permissions.push(host);
      }
    });

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log('✅ دامنه ipapi.co به host_permissions در manifest.json اضافه شد.');
  } catch (err) {
    console.error('خطا در بروزرسانی manifest.json:', err.message);
  }
}

// ۲. فعال‌سازی تمامی آیکون‌های نوار پایینی در فرم نوشتن تسک جدید در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const enableAllIconsScript = `
/* فعال‌سازی قطعی آیکون‌های نوار ابزار فرم تسک جدید آبنر */
(function bindAllTaskFormActions() {
  function initIcons() {
    // پیدا کردن فرم نوشتن تسک جدید
    const newForm = document.querySelector('.left-column form, form:not([class*="edit"])');
    if (!newForm) return;

    // پیدا کردن دکمه‌ها و آیکون‌های ردیف پایین فرم
    const iconButtons = newForm.querySelectorAll('button, div[role="button"], span[role="button"], svg');

    iconButtons.forEach((btn, index) => {
      const parentBtn = btn.closest('button, div[role="button"]') || btn;
      if (parentBtn.dataset.boundNewAction) return;
      parentBtn.dataset.boundNewAction = 'true';
      parentBtn.style.cursor = 'pointer';

      parentBtn.addEventListener('click', (e) => {
        // پیدا کردن المان معادل در فرم ادیت و شبیه‌سازی رفتار آن در صورت وجود
        const editForm = document.querySelector('form[class*="edit"], .edit-todo-form');
        if (editForm) {
          const editBtns = editForm.querySelectorAll('button, div[role="button"], span[role="button"]');
          if (editBtns[index]) {
            editBtns[index].click();
            return;
          }
        }

        // اگر دکمه ثبت (فلش آبی) بود
        if (parentBtn.querySelector('svg[class*="arrow"], svg[class*="up"]') || index === iconButtons.length - 1) {
          const inp = newForm.querySelector('input[type="text"], input');
          if (inp && inp.value.trim() !== '') {
            newForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }
      }, true);
    });
  }

  window.addEventListener('load', initIcons);
  document.addEventListener('DOMContentLoaded', initIcons);
  setInterval(initIcons, 800);
})();
`;

  if (!js.includes('bindAllTaskFormActions')) {
    js += '\n' + enableAllIconsScript;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ اتصال رفتار آیکون‌های فرم تسک جدید به script.js افزوده شد.');
  }
}