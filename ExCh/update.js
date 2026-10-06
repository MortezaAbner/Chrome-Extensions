const fs = require('fs');
const path = require('path');

console.log('⚡ در حال فعال‌سازی اکشن‌های تمام آیکون‌های فرم تسک جدید آبنر...');

// ۱. افزودن استایل فعال و پاپ‌آپ‌های این آیکون‌ها در theme.css
const themeCssPath = path.join(__dirname, 'modules', 'core', 'theme.css');
if (fs.existsSync(themeCssPath)) {
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');

  const actionButtonsCss = `
/* ========================================================
   استایل تعاملی و فعال‌سازی آیکون‌های پایین فرم تسک آبنر
======================================================== */
.ab-action-active {
  background: rgba(37, 99, 235, 0.35) !important;
  border: 1.5px solid #3b82f6 !important;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5) !important;
  transform: translateY(-2px);
}

.ab-action-popup {
  position: absolute;
  bottom: 56px;
  right: 15px;
  background: rgba(22, 27, 34, 0.92) !important;
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 999999;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  direction: rtl;
  min-width: 170px;
  color: #fff;
  font-size: 12px;
}
.ab-action-item {
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ab-action-item:hover {
  background: #2563eb;
  color: #fff;
}
`;

  if (!themeCss.includes('ab-action-active')) {
    themeCss += '\n' + actionButtonsCss;
    fs.writeFileSync(themeCssPath, themeCss, 'utf8');
    console.log('✅ استایل تعاملی به theme.css افزوده شد.');
  }
}

// ۲. اعمال هندلرهای جاوااسکریپت برای تک‌تک آیکون‌ها در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const bindScript = `
/* پیاده‌سازی و فعال‌سازی کامل تمام آیتم‌های نوار نوشتن تسک جدید */
(function setupNewTaskIconsInteractions() {
  const taskState = {
    tag: null,
    date: null,
    time: null,
    priority: null,
    repeat: false
  };

  function bindIcons() {
    const bottomBar = document.querySelector('.left-column form, form[class*="todo"]');
    if (!bottomBar) return;

    // پیدا کردن دکمه‌ها از روی المان یا موقعیت چیدمان
    const buttons = bottomBar.querySelectorAll('button, div[role="button"], span[role="button"]');
    if (buttons.length < 5) return;

    const btnTag = buttons[0];       // 🏷️ برچسب
    const btnCal = buttons[1];       // 📅 تقویم
    const btnTime = buttons[2];      // ⏰ یادآور
    const btnPriority = buttons[3];  // 🚩 اولویت
    const btnRepeat = buttons[4];    // 🔄 تکرار
    const btnSubmit = buttons[5] || bottomBar.querySelector('button[type="submit"], button:last-child'); // ⬆️ ثبت

    function showPopup(targetEl, items, onSelect) {
      document.querySelectorAll('.ab-action-popup').forEach(p => p.remove());
      const popup = document.createElement('div');
      popup.className = 'ab-action-popup';
      
      items.forEach(it => {
        const itemEl = document.createElement('div');
        itemEl.className = 'ab-action-item';
        itemEl.innerText = it.label;
        itemEl.onclick = (e) => {
          e.stopPropagation();
          onSelect(it.val);
          targetEl.classList.add('ab-action-active');
          popup.remove();
        };
        popup.appendChild(itemEl);
      });

      bottomBar.style.position = 'relative';
      bottomBar.appendChild(popup);
    }

    // ۱. برچسب
    if (btnTag && !btnTag.dataset.boundTag) {
      btnTag.dataset.boundTag = 'true';
      btnTag.style.cursor = 'pointer';
      btnTag.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        showPopup(btnTag, [
          { label: 'فوری ⚡', val: 'فوری' },
          { label: 'کاری 💼', val: 'کاری' },
          { label: 'شخصی 👤', val: 'شخصی' },
          { label: 'پروژه 🚀', val: 'پروژه' }
        ], (val) => { taskState.tag = val; });
      };
    }

    // ۲. تقویم (موعد انجام)
    if (btnCal && !btnCal.dataset.boundCal) {
      btnCal.dataset.boundCal = 'true';
      btnCal.style.cursor = 'pointer';
      btnCal.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        showPopup(btnCal, [
          { label: 'امروز', val: 'امروز' },
          { label: 'فردا', val: 'فردا' },
          { label: 'پایان هفته', val: 'پایان هفته' },
          { label: 'هفته آینده', val: 'هفته آینده' }
        ], (val) => { taskState.date = val; });
      };
    }

    // ۳. ساعت و یادآور
    if (btnTime && !btnTime.dataset.boundTime) {
      btnTime.dataset.boundTime = 'true';
      btnTime.style.cursor = 'pointer';
      btnTime.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        showPopup(btnTime, [
          { label: 'صبح (۰۹:۰۰)', val: '09:00' },
          { label: 'ظهر (۱۳:۰۰)', val: '13:00' },
          { label: 'عصر (۱۸:۰۰)', val: '18:00' },
          { label: 'شب (۲۱:۰۰)', val: '21:00' }
        ], (val) => { taskState.time = val; });
      };
    }

    // ۴. پرچم اولویت
    if (btnPriority && !btnPriority.dataset.boundPriority) {
      btnPriority.dataset.boundPriority = 'true';
      btnPriority.style.cursor = 'pointer';
      btnPriority.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        showPopup(btnPriority, [
          { label: '🔴 بالا', val: 'high' },
          { label: '🟡 متوسط', val: 'medium' },
          { label: '🔵 پایین', val: 'low' }
        ], (val) => { taskState.priority = val; });
      };
    }

    // ۵. تکرار
    if (btnRepeat && !btnRepeat.dataset.boundRepeat) {
      btnRepeat.dataset.boundRepeat = 'true';
      btnRepeat.style.cursor = 'pointer';
      btnRepeat.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        taskState.repeat = !taskState.repeat;
        if (taskState.repeat) {
          btnRepeat.classList.add('ab-action-active');
        } else {
          btnRepeat.classList.remove('ab-action-active');
        }
      };
    }

    // ۶. ارسال و ثبت تسک (فلش آبی)
    if (btnSubmit && !btnSubmit.dataset.boundSubmit) {
      btnSubmit.dataset.boundSubmit = 'true';
      btnSubmit.onclick = (e) => {
        const inp = bottomBar.querySelector('input[type="text"], input');
        if (inp && inp.value.trim() !== '') {
          // الحاق ویژگی‌های انتخابی به تسک قبل از ثبت
          if (taskState.tag) inp.value += ' #' + taskState.tag;
          if (taskState.date) inp.value += ' [' + taskState.date + ']';
          
          bottomBar.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

          // ریست وضعیت دکمه‌ها
          buttons.forEach(b => b.classList.remove('ab-action-active'));
          taskState.tag = null;
          taskState.date = null;
          taskState.time = null;
          taskState.priority = null;
          taskState.repeat = false;
        }
      };
    }

    // بستن پنجره با کلیک در هر نقطه دیگر
    document.addEventListener('click', () => {
      document.querySelectorAll('.ab-action-popup').forEach(p => p.remove());
    });
  }

  window.addEventListener('load', bindIcons);
  document.addEventListener('DOMContentLoaded', bindIcons);
  setInterval(bindIcons, 800);
})();
`;

  if (!js.includes('setupNewTaskIconsInteractions')) {
    js += '\n' + bindScript;
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ منطق عملکرد تک‌تک آیکون‌ها به script.js اضافه شد.');
  }
}