import { initGlass } from './modules/glass/glass.js';

document.addEventListener('DOMContentLoaded', () => {
  // ۱. فعال‌سازی موتور شیشه‌ای با قابلیت تنظیم ماتی[cite: 2]
  initGlass();

  // ۲. ساعت زنده
  const clockTime = document.getElementById('clockTime');
  function updateClock() {
    const now = new Date();
    if (clockTime) {
      clockTime.textContent = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ۳. ارسال ورودی سرچ‌بار به گوگل با فشردن اینتر
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }
});