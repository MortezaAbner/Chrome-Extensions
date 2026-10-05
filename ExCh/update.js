const fs = require('fs');

if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  // ۱. اضافه کردن سلکتورهای این سه دکمه به رول استایل پاپ‌آپ‌ها در بخش تزریق زنده بلر
  const chipsTargetSelectors = `
        #forecast-btn,
        #azan-btn,
        #timer-btn,
        .widget-action-chip,
        .forecast-toggle-btn,
        .azan-toggle-btn,
        .timer-toggle-btn,
        .location-chip:not(#weather-city-btn),
  `;

  if (!js.includes('#forecast-btn')) {
    js = js.replace(
      /(\.glass-blur-menu,[\s\S]*?\.settings-modal-card)/,
      `${chipsTargetSelectors.trim()}\n        $1`
    );
  }

  // ۲. مدیریت مستقل لوکیشن اوقات شرعی و تقدم لوکیشن آب‌وهوا
  const prayerWeatherSyncLogic = `
  // ========================================================
  // تفکیک لوکیشن اوقات شرعی و تقدم لوکیشن آب‌وهوا
  // ========================================================
  (function setupLocationIndependence() {
    // رویداد تغییر لوکیشن مستقل اوقات شرعی
    window.updateAzanOnlyCity = function(cityName) {
      if (!cityName) return;
      localStorage.setItem('azan_custom_city_override', cityName);
      if (typeof fetchAzanTimes === 'function') fetchAzanTimes(cityName);
      else if (typeof updateAzanTimes === 'function') updateAzanTimes(cityName);
      else if (typeof loadPrayerTimes === 'function') loadPrayerTimes(cityName);
    };

    // هماهنگی با تغییر لوکیشن آب‌وهوا (به عنوان لوکیشن اصلی)
    const baseSaveCity = window.saveCitySelection || window.applyCityChange;
    if (typeof baseSaveCity === 'function') {
      window.saveCitySelection = function(newCity) {
        baseSaveCity(newCity);
        localStorage.removeItem('azan_custom_city_override');
        if (typeof fetchAzanTimes === 'function') fetchAzanTimes(newCity);
        else if (typeof updateAzanTimes === 'function') updateAzanTimes(newCity);
        else if (typeof loadPrayerTimes === 'function') loadPrayerTimes(newCity);
      };
    }
  })();
`;

  // پاک کردن تعاریف تکراری قبلی و ثبت نسخه جدید
  js = js.replace(/\/\/ ========================================================\s*\/\/ تفکیک لوکیشن اوقات شرعی[\s\S]*?setupLocationIndependence\(\);?\s*\}\)\(\);?/g, '');
  js += '\n' + prayerWeatherSyncLogic;

  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ اتصال ماتی ۳ دکمه و منطق تفکیک لوکیشن اوقات شرعی با موفقیت اعمال شد.');
}