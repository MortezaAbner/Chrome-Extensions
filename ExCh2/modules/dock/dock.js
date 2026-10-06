/**
 * ماژول تعاملی نوار داک پایین داشبورد آبنر[cite: 11]
 */
export function initDock() {
  const btnSettings = document.getElementById('dock-btn-settings');
  const btnTheme = document.getElementById('dock-btn-theme');
  const btnWallpaper = document.getElementById('dock-btn-wallpaper');
  const btnFont = document.getElementById('dock-btn-font');

  // ۱. کنترل باز شدن پنل تنظیمات[cite: 11]
  if (btnSettings) {
    btnSettings.addEventListener('click', () => {
      console.log('تنظیمات آبنر باز شد');
    });
  }

  // ۲. سوییچ حالت تم لایت / دارک[cite: 11]
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
    });
  }

  // ۳. کلیک برای انتخاب والپیپر[cite: 11]
  if (btnWallpaper) {
    btnWallpaper.addEventListener('click', () => {
      console.log('انتخاب پس‌زمینه داشبورد');
    });
  }

  // ۴. مدیریت فونت و تایپوگرافی[cite: 11]
  if (btnFont) {
    btnFont.addEventListener('click', () => {
      console.log('تنظیمات قلم و فونت');
    });
  }
}