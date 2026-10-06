
/**
 * هماهنگ‌سازی دقیق و زنده لبه پایینی کادر تسک با لبه پایینی تقویم
 */
(function matchTaskWithCalendarBottom() {
  function sync() {
    // یافتن ستون راست یا المان تقویم
    const rightCol = document.querySelector('.right-column') || 
                     document.querySelector('.Calendar')?.closest('div') ||
                     document.querySelector('[class*="calendar"]')?.parentElement;

    const leftCol = document.querySelector('.left-column');
    if (!leftCol) return;

    let targetHeight = 720;
    if (rightCol && rightCol.offsetHeight > 400) {
      targetHeight = rightCol.offsetHeight;
    }

    // اعمال ارتفاع به کادر تسک و تگ‌های والد آن
    const taskCard = leftCol.firstElementChild || leftCol;
    taskCard.style.setProperty('height', targetHeight + 'px', 'important');
    taskCard.style.setProperty('min-height', targetHeight + 'px', 'important');
    taskCard.style.setProperty('max-height', targetHeight + 'px', 'important');

    const formFlex = leftCol.querySelector('form > div');
    if (formFlex) {
      formFlex.style.setProperty('height', targetHeight + 'px', 'important');
      formFlex.style.setProperty('min-height', targetHeight + 'px', 'important');
      formFlex.style.setProperty('max-height', targetHeight + 'px', 'important');
    }
  }

  window.addEventListener('load', sync);
  window.addEventListener('resize', sync);
  document.addEventListener('DOMContentLoaded', sync);
  setInterval(sync, 400);
})();
