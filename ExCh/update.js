const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // ۱. تعریف تابع جامع دریافت تاریخ زنده سیستم
  const liveDateFunc = `
  // محاسبه دقیق تاریخ امروز سیستم در تقویم خورشیدی
  function getLivePersianDate() {
    const now = new Date();
    try {
      const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).formatToParts(now);

      let y = 1405, m = 7, d = 1;
      parts.forEach(p => {
        if (p.type === 'year') y = parseInt(p.value, 10);
        if (p.type === 'month') m = parseInt(p.value, 10);
        if (p.type === 'day') d = parseInt(p.value, 10);
      });
      return { year: y, monthIndex: m - 1, day: d };
    } catch (e) {
      return { year: 1405, monthIndex: 6, day: 9 };
    }
  }
`;

  if (!js.includes('function getLivePersianDate()')) {
    js = liveDateFunc + '\n' + js;
  }

  // ۲. حذف شرط ثابت عدد ۹ و اتصال به روز زنده سیستم
  js = js.replace(
    /if\s*\(\s*year\s*===\s*1405\s*&&\s*monthIndex\s*===\s*6\s*&&\s*i\s*===\s*9\s*\)\s*span\.className\s*=\s*['"]today-circle['"];?/g,
    `const liveToday = getLivePersianDate();
      if (year === liveToday.year && monthIndex === liveToday.monthIndex && i === liveToday.day) {
        span.className = 'today-circle';
      }`
  );

  js = js.replace(
    /if\s*\(\s*year\s*===\s*baseRealToday\.year\s*&&\s*monthIndex\s*===\s*baseRealToday\.month\s*&&\s*i\s*===\s*baseRealToday\.day\s*\)\s*\{[\s\S]*?\}/g,
    `const liveToday = getLivePersianDate();
      if (year === liveToday.year && monthIndex === liveToday.monthIndex && i === liveToday.day) {
        span.className = 'today-circle';
      }`
  );

  // ۳. تنظیم سال و ماه شروع تقویم روی تاریخ سیستم به جای عدد ثابت
  js = js.replace(
    /let currentYear\s*=\s*\d+;\s*let currentMonthIndex\s*=\s*\d+;/,
    `const initToday = getLivePersianDate();
  let currentYear = initToday.year;
  let currentMonthIndex = initToday.monthIndex;`
  );

  // ۴. دکمه برو به امروز برای بازگشت به تاریخ زنده سیستم
  js = js.replace(
    /pickerTodayBtn\.onclick\s*=\s*\(e\)\s*=>\s*\{[\s\S]*?\};/,
    `pickerTodayBtn.onclick = (e) => {
      e.stopPropagation();
      const freshNow = getLivePersianDate();
      currentYear = freshNow.year;
      currentMonthIndex = freshNow.monthIndex;
      renderCalendar(currentYear, currentMonthIndex);
      monthYearPicker.classList.remove('active');
    };`
  );

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ مشکل دایره روز ثابت برطرف شد و تقویم به تاریخ سیستم وصل گردید.');
}