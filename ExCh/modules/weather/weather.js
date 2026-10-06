
/**
 * اصلاح هوشمند و منظم تاریخ سه‌جانبه آبنر
 * سطر ۱: شمسی (مهر)
 * سطر ۲: میلادی (اکتبر)
 * سطر ۳: قمری (ربیع‌الثانی)
 */
(function fixTripleDateDisplay() {
  function toFaDigits(n) {
    return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  const gMonthsFa = [
    'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
    'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'
  ];

  function updateDates() {
    // پیدا کردن سطر دوم تاریخ در کارت تاریخ
    const dateContainers = document.querySelectorAll('.right-column div, .datetime-section div, [class*="date"]');
    
    // هدف‌گیری دقیق ردیف‌های سه‌گانه تاریخ
    let rows = [];
    document.querySelectorAll('.right-column span, .right-column div').forEach(el => {
      if (el.innerText && el.innerText.includes('(مهر)')) {
        const row = el.closest('div');
        if (row && !rows.includes(row)) rows.push(row);
      }
    });

    if (rows.length >= 2) {
      // ردیف دوم که اشتباهاً تکرار مهر بود به تاریخ میلادی تغییر می‌یابد
      const now = new Date();
      const gy = toFaDigits(now.getFullYear());
      const gm = toFaDigits(String(now.getMonth() + 1).padStart(2, '0'));
      const gd = toFaDigits(String(now.getDate()).padStart(2, '0'));
      const gMonthName = gMonthsFa[now.getMonth()];

      const secondRow = rows[1];
      secondRow.innerHTML = `
        <span style="font-family: inherit;">${gy}/${gm}/${gd}</span>
        <span style="opacity: 0.8; font-size: 11px;">(${gMonthName})</span>
      `;
      secondRow.style.display = 'flex';
      secondRow.style.justifyContent = 'space-between';
      secondRow.style.alignItems = 'center';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDates);
  } else {
    updateDates();
  }
  window.addEventListener('load', updateDates);
  setInterval(updateDates, 3000);
})();
