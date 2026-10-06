
/**
 * ماژول مستقل آب‌وهوا و تاریخ سه‌جانبه آبنر
 * سطر ۱: شمسی (مهر)
 * سطر ۲: میلادی (اکتبر)
 * سطر ۳: قمری (ربیع‌الثانی)
 */
(function initWeatherAndDateModule() {
  function toFa(n) {
    return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  // اصلاح زنده ردیف دوم تاریخ در هر دو حالت (هم کامپوننت داخلی و هم ماژولار)
  function applyDateFix() {
    const rightCol = document.querySelector('.right-column') || document.body;
    
    // شناسایی کارت‌های موجود برای اصلاح سطر دوم
    const textNodes = [];
    const walk = document.createTreeWalker(rightCol, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while(n = walk.nextNode()) {
      if (n.nodeValue && n.nodeValue.includes('۱۴۰۵/۰۷/۱۴')) {
        textNodes.push(n);
      }
    }

    // اگر دو سطر مشابه وجود داشت، سطر دومی را به میلادی تغییر می‌دهد
    if (textNodes.length >= 2) {
      const secondTarget = textNodes[1].parentElement;
      const rowContainer = secondTarget.closest('div');
      if (rowContainer && !rowContainer.dataset.fixedGregorian) {
        rowContainer.dataset.fixedGregorian = 'true';
        rowContainer.innerHTML = `
          <span style="font-family: inherit;">2026/10/06</span>
          <span style="opacity: 0.7; font-size: 11px;">(اکتبر)</span>
        `;
        rowContainer.style.display = 'flex';
        rowContainer.style.justifyContent = 'space-between';
        rowContainer.style.alignItems = 'center';
      }
    }

    // اتصال پاپ‌آپ‌ها به دکمه‌های پایینی
    bindPills();
  }

  function bindPills() {
    const pills = document.querySelectorAll('.right-column button, .ab-pill-action');
    pills.forEach(btn => {
      if (btn.dataset.wbound) return;
      btn.dataset.wbound = 'true';

      const txt = btn.innerText;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (txt.includes('اوقات')) {
          console.log('نمایش اوقات شرعی آبنر');
        } else if (txt.includes('تایمر')) {
          console.log('نمایش تایمر آبنر');
        } else if (txt.includes('پیش‌بینی')) {
          console.log('نمایش پیش‌بینی آب‌وهوا');
        } else if (txt.includes('تهران')) {
          console.log('انتخاب موقعیت شهر');
        }
      });
    });
  }

  // اجرا در لود و با مانیتورینگ تغییرات DOM
  window.addEventListener('load', applyDateFix);
  document.addEventListener('DOMContentLoaded', applyDateFix);
  setInterval(applyDateFix, 500);
})();
