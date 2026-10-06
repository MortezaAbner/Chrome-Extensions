const fs = require('fs');
const path = require('path');

console.log('🏷️ در حال اتصال اکشن‌های برچسب و گزینه‌های نوار ثبت و ادیت تسک آبنر...');

// ۱. افزودن استایل برچسب‌ها بر اساس Badge و استایل شیشه‌ای آبنر
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const tagBadgeStyle = `
/* ========================================================
   استایل برچسب‌ها (Badges) و پاپ‌آپ ابزارهای تسک آبنر
======================================================== */
.ab-tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  padding: 2px 7px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.18));
  color: #D4D8E9;
  margin-top: 4px;
}

/* پاپ‌آپ شیشه‌ای انتخاب برچسب */
.ab-tag-picker-popup {
  position: absolute;
  bottom: 50px;
  right: 15px;
  background: var(--dash-glass-bg, rgba(20, 24, 35, 0.88)) !important;
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--dash-glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 99999;
  box-shadow: 0 10px 25px rgba(0,0,0,0.35);
  direction: rtl;
  min-width: 140px;
}
.ab-tag-chip {
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 11.5px;
  color: #fff;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid transparent;
  text-align: right;
  transition: all 0.15s ease;
}
.ab-tag-chip:hover {
  background: #2563eb;
}
`;
  if (!themeCss.includes('ab-tag-picker-popup')) {
    themeCss += '\n' + tagBadgeStyle;
    fs.writeFileSync(themeCssPath, themeCss, 'utf8');
    console.log('✅ استایل برچسب‌ها به theme.css افزوده شد.');
  }
}

// ۲. فعال‌سازی گزینه‌های نوار ابزار پایینی در script.js برای هر دو فرم ثبت و ویرایش
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const bottomActionHook = `
/* فعال‌سازی اکشن‌های برچسب و دکمه‌های پایینی در فرم ثبت و ویرایش */
(function setupTaskFormActions() {
  const predefinedTags = ['فوری ⚡', 'کاری 💼', 'شخصی 👤', 'پروژه آبنر 🚀'];
  let selectedTag = null;

  function initToolbarEvents() {
    // یافتن دکمه‌های نوار پایینی در هر فرمی که در صفحه هست (ثبت یا ادیت)
    const forms = document.querySelectorAll('.left-column form, form[class*="todo"], form[class*="task"]');
    
    forms.forEach(form => {
      // دکمه تگ (اولین دکمه از سمت راست/چپ در نوار ابزار)
      const tagBtn = form.querySelector('button:has(svg), div:has(svg), [class*="tag"], [title*="برچسب"]') ||
                     form.querySelectorAll('.left-column form button, form button')[0];
      
      const submitBtn = form.querySelector('button[type="submit"], [class*="submit"], button:last-child');
      const inputField = form.querySelector('input[type="text"]');

      // ایجاد پنجره انتخاب برچسب
      if (tagBtn && !tagBtn.dataset.tagBound) {
        tagBtn.dataset.tagBound = "true";
        tagBtn.style.cursor = "pointer";

        tagBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          document.querySelectorAll('.ab-tag-picker-popup').forEach(el => el.remove());

          const popup = document.createElement('div');
          popup.className = 'ab-tag-picker-popup';
          popup.innerHTML = predefinedTags.map(t => \`<div class="ab-tag-chip">\${t}</div>\`).join('');

          form.style.position = 'relative';
          form.appendChild(popup);

          popup.querySelectorAll('.ab-tag-chip').forEach(chip => {
            chip.onclick = (ev) => {
              ev.stopPropagation();
              selectedTag = chip.innerText;
              popup.remove();

              // نمایش بچ برچسب انتخاب‌شده داخل فرم
              let currentBadge = form.querySelector('.ab-tag-badge');
              if (!currentBadge) {
                currentBadge = document.createElement('span');
                currentBadge.className = 'ab-tag-badge';
                form.insertBefore(currentBadge, form.children[1] || null);
              }
              currentBadge.innerText = '🏷️ ' + selectedTag;
            };
          });
        };
      }

      // عملکرد دکمه ثبت (فلش رو به بالا)
      if (submitBtn && !submitBtn.dataset.bound) {
        submitBtn.dataset.bound = "true";
        submitBtn.onclick = (e) => {
          if (inputField && inputField.value.trim() !== "") {
            // اجازه به سابمیت پیش‌فرض یا ثبت مستقیم
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }
        };
      }
    });

    // بستن پاپ‌آپ با کلیک در بیرون
    document.addEventListener('click', () => {
      document.querySelectorAll('.ab-tag-picker-popup').forEach(el => el.remove());
    });
  }

  window.addEventListener('load', initToolbarEvents);
  document.addEventListener('DOMContentLoaded', initToolbarEvents);
  setInterval(initToolbarEvents, 1000);
})();
`;

  if (!js.includes('setupTaskFormActions')) {
    js += '\n' + bottomActionHook;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ فعال‌ساز گزینه‌های نوار پایینی به script.js اضافه شد.');
  }
}