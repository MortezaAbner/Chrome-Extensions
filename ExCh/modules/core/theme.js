
/**
 * ماژول مدیریت بلر و شفافیت زنده داشبورد
 */
(function initThemeEngine() {
  function applyGlassSettings() {
    const blurVal = localStorage.getItem('dash_blur_px') || '20';
    const opacityVal = localStorage.getItem('dash_glass_opacity') || '0.12';
    
    document.documentElement.style.setProperty('--dash-blur-px', blurVal + 'px');
    document.documentElement.style.setProperty('--dash-glass-opacity', opacityVal);
  }

  // توابع عمومی قابل اتصال به اسلایدرهای منوی تنظیمات
  window.setDashboardBlur = function(px) {
    localStorage.setItem('dash_blur_px', px);
    document.documentElement.style.setProperty('--dash-blur-px', px + 'px');
  };

  window.setDashboardOpacity = function(opacityPercent) {
    // تبدیل مقدار درصد ۰ تا ۱۰۰ به اعشار ۰.۰ تا ۱.۰
    const alpha = (opacityPercent / 100).toFixed(2);
    localStorage.setItem('dash_glass_opacity', alpha);
    document.documentElement.style.setProperty('--dash-glass-opacity', alpha);
  };

  applyGlassSettings();
})();
