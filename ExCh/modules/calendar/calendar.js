
/**
 * ماژول تقویم آبنر (modules/calendar/calendar.js)
 * پاک‌سازی تقویم‌های ساختگی اضافه و حفظ تقویم اصلی سمت راست
 */
(function cleanInjectedCalendars() {
  function removeExtra() {
    const fakeCalendar = document.getElementById('abner-native-calendar');
    if (fakeCalendar) fakeCalendar.remove();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeExtra);
  } else {
    removeExtra();
  }
  window.addEventListener('load', removeExtra);
})();
