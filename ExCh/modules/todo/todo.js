
/**
 * تثبیت ارتفاع کادر تسک متناسب با تقویم ستون راست
 */
(function lockTaskHeight() {
  function applyHeight() {
    const leftCol = document.querySelector('.left-column');
    if (!leftCol) return;

    // اعمال ارتفاع به کانتینر اصلی ستون چپ
    leftCol.style.setProperty('height', '610px', 'important');
    leftCol.style.setProperty('min-height', '610px', 'important');
    leftCol.style.setProperty('max-height', '610px', 'important');

    // اعمال به فرم و کادرهای داخلی ری‌اکت
    const innerContainers = leftCol.querySelectorAll('div, form');
    innerContainers.forEach(el => {
      if (el.offsetHeight > 300 || el.tagName.toLowerCase() === 'form') {
        el.style.setProperty('height', '610px', 'important');
        el.style.setProperty('min-height', '610px', 'important');
      }
    });
  }

  window.addEventListener('load', applyHeight);
  document.addEventListener('DOMContentLoaded', applyHeight);
  setInterval(applyHeight, 1000);
})();
