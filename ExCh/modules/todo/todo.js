
/**
 * هم‌ترازسازی زنده لبه پایینی کادر تسک با لبه پایینی تقویم
 */
(function matchBottomWithCalendar() {
  function applyExactBottom() {
    const rightCol = document.querySelector('.right-column');
    const leftCol = document.querySelector('.left-column');
    if (!rightCol || !leftCol) return;

    // پیدا کردن آخرین المان در ستون راست (تقویم)
    const calEl = rightCol.querySelector('.Calendar') || 
                  rightCol.querySelector('[class*="calendar"]') || 
                  rightCol.lastElementChild;

    if (!calEl) return;

    const calBottom = calEl.getBoundingClientRect().bottom;
    const taskTop = leftCol.getBoundingClientRect().top;
    const targetH = Math.round(calBottom - taskTop);

    if (targetH > 400) {
      const taskContainer = leftCol.firstElementChild;
      const taskForm = leftCol.querySelector('form');
      const formFlex = leftCol.querySelector('form > div');

      [taskContainer, taskForm, formFlex].forEach(el => {
        if (el) {
          el.style.setProperty('height', targetH + 'px', 'important');
          el.style.setProperty('min-height', targetH + 'px', 'important');
          el.style.setProperty('max-height', targetH + 'px', 'important');
        }
      });
    }
  }

  window.addEventListener('load', applyExactBottom);
  window.addEventListener('resize', applyExactBottom);
  document.addEventListener('DOMContentLoaded', applyExactBottom);
  setInterval(applyExactBottom, 500);
})();
