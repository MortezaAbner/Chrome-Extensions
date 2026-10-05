const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // تابع پویا برای استخراج دقیق تاریخ روز سیستم در تقویم شمسی
  const liveDateSystemLogic = `
  // محاسبه خودکار تاریخ زنده سیستم بر اساس تقویم شمسی
  function getLiveSystemDate() {
    const now = new Date();
    try {
      const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).formatToParts(now);

      let y = 1405, m = 7, d = 9;
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

  const baseRealToday = getLiveSystemDate();
  let currentYear = baseRealToday.year;
  let currentMonthIndex = baseRealToday.monthIndex;
`;

  // جایگزینی مقادیر ثابت با منطق محاسبه زنده سیستم
  js = js.replace(/const baseRealToday\s*=\s*\{[\s\S]*?\};\s*let currentYear\s*=\s*\d+;\s*let currentMonthIndex\s*=\s*\d+;/, liveDateSystemLogic);
  js = js.replace(/let currentYear\s*=\s*1405;\s*let currentMonthIndex\s*=\s*6;/, liveDateSystemLogic);

  // به‌روزرسانی تاریخ‌های سه‌گانه در باکس ساعت به تاریخ روز سیستم
  const liveDateCardsUpdate = `
    // همگام‌سازی استک تاریخ با سیستم
    try {
      const now = new Date();
      const shamsiStr = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
      const shamsiMonthName = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' }).format(now);
      const shamsiRow = document.getElementById('shamsi-row');
      if (shamsiRow) {
        shamsiRow.innerHTML = \`<span class="month-part">(\${shamsiMonthName})</span><span class="digits-part">\${shamsiStr}</span>\`;
      }

      const miladiStr = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
      const miladiMonthName = new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(now);
      const gregorianRow = document.getElementById('gregorian-row');
      if (gregorianRow) {
        gregorianRow.innerHTML = \`<span class="month-part">(\${miladiMonthName})</span><span class="digits-part">\${miladiStr}</span>\`;
      }
    } catch (err) {}
`;

  if (!js.includes('shamsiRow.innerHTML')) {
    js = js.replace('updateLiveClock();', `${liveDateCardsUpdate}\n  updateLiveClock();`);
  }

  // به‌روزرسانی عملکرد دکمه برو به امروز
  js = js.replace(
    /currentYear\s*=\s*baseRealToday\.year;\s*currentMonthIndex\s*=\s*baseRealToday\.month;/,
    'const freshToday = getLiveSystemDate();\n      currentYear = freshToday.year;\n      currentMonthIndex = freshToday.monthIndex;'
  );

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ تقویم و ساعت با تاریخ سیستم همگام‌سازی شدند.');
}