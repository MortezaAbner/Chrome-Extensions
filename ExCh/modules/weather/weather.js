
/**
 * مدیریت کدهای تفکیک‌شده ویجت‌های آب‌وهوا و تاریخ سه‌جانبه آبنر
 */
(function cleanupAndManageWidgets() {
  function cleanup() {
    // حذف قطعی هرگونه المان تزریقی که در وسط بالای صفحه ساخته شده بود
    document.querySelectorAll('#abner-datetime-widget, #abner-weather-widget').forEach(el => el.remove());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup);
  } else {
    cleanup();
  }
  window.addEventListener('load', cleanup);
})();
