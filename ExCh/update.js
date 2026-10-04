const fs = require('fs');

// ۱. به‌روزرسانی استایل مودال به شیشه‌ای شفاف داشبورد در style.css
if (fs.existsSync('./style.css')) {
  let css = fs.readFileSync('./style.css', 'utf8');

  const glassModalCss = `
/* استایل شیشه‌ای داشبورد برای پنجره تنظیم موقعیت مکانی */
.location-modal-box {
  width: 440px !important;
  max-width: 92%;
  padding: 26px 22px !important;
  border-radius: 32px !important;
  gap: 16px !important;
  display: flex;
  flex-direction: column;
  background: var(--glass-bg) !important;
  backdrop-filter: blur(50px) saturate(220%) !important;
  -webkit-backdrop-filter: blur(50px) saturate(220%) !important;
  border: 1.5px solid var(--glass-border) !important;
  box-shadow: var(--glass-shadow), var(--glass-specular) !important;
}

[data-theme="dark"] .location-modal-box {
  background: var(--glass-bg) !important;
  border-color: var(--glass-border) !important;
}

.loc-method-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 20px;
  border: 1px solid var(--glass-border) !important;
  cursor: pointer;
  text-align: right;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(255, 255, 255, 0.35) !important;
  backdrop-filter: blur(25px) !important;
  -webkit-backdrop-filter: blur(25px) !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.loc-method-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.55) !important;
  border-color: rgba(255, 255, 255, 0.95) !important;
}

[data-theme="dark"] .loc-method-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: var(--glass-border) !important;
}

[data-theme="dark"] .loc-method-btn:hover {
  background: rgba(255, 255, 255, 0.16) !important;
}

.manual-input-wrapper input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.35) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: 18px;
  outline: none;
  font-size: 0.92rem;
  color: var(--text-main);
  font-weight: 750;
  text-align: right;
}

[data-theme="dark"] .manual-input-wrapper input {
  background: rgba(0, 0, 0, 0.25) !important;
  color: #fff;
}

.manual-input-wrapper input:focus {
  border-color: #2563eb !important;
  background: rgba(255, 255, 255, 0.6) !important;
}
`;

  if (!css.includes('/* استایل شیشه‌ای داشبورد برای پنجره تنظیم موقعیت مکانی */')) {
    css += '\n' + glassModalCss;
    fs.writeFileSync('./style.css', css, 'utf8');
    console.log('✅ استایل شیشه‌ای مودال در style.css اعمال شد.');
  }
}

// ۲. ارتقای لاجیک GPS و IP با فال‌بک چندگانه و درخواست مجوز در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');

  const updatedLocationLogic = `
  // موقعیت‌یابی زنده GPS با قابلیت درخواست مجدد مجوز
  if (autoGpsBtn) {
    autoGpsBtn.onclick = () => {
      if (!navigator.geolocation) {
        alert('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.');
        return;
      }
      autoGpsBtn.style.opacity = '0.6';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          autoGpsBtn.style.opacity = '1';
          activeCoords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: 'موقعیت دستگاه'
          };
          localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
          fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);
          cityModal.classList.remove('active');
        },
        (err) => {
          autoGpsBtn.style.opacity = '1';
          if (err.code === 1) {
            alert('دسترسی به موقعیت مکانی رد شد. برای استفاده مجدد، دسترسی لوکیشن را در نوار آدرس مرورگر فعال کنید یا دوباره کلیک کنید.');
          } else {
            alert('خطا در دریافت مختصات GPS دستگاه.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };
  }

  // تشخیص موقعیت بر اساس آی‌پی با سرورهای پشتیبان بدون تحریم
  if (autoIpBtn) {
    autoIpBtn.onclick = async () => {
      const confirmAccess = confirm('آیا اجازه می‌دهید موقعیت تقریبی شما از طریق آی‌پی اینترنت دریافت شود؟');
      if (!confirmAccess) return;

      autoIpBtn.style.opacity = '0.6';
      let fetched = false;

      // سرور ۱: ipapi.co
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.latitude && data.longitude) {
          activeCoords = { lat: data.latitude, lon: data.longitude, name: data.city || 'منطقه شما' };
          fetched = true;
        }
      } catch (e) {}

      // سرور ۲ (پشتیبان در صورت بروز خطا در اولی): ipwho.is
      if (!fetched) {
        try {
          const res = await fetch('https://ipwho.is/');
          const data = await res.json();
          if (data.success && data.latitude && data.longitude) {
            activeCoords = { lat: data.latitude, lon: data.longitude, name: data.city || 'منطقه شما' };
            fetched = true;
          }
        } catch (e) {}
      }

      autoIpBtn.style.opacity = '1';
      if (fetched) {
        localStorage.setItem('weather_coords', JSON.stringify(activeCoords));
        fetchRealWeather(activeCoords.lat, activeCoords.lon, activeCoords.name);
        cityModal.classList.remove('active');
      } else {
        alert('خطا در ارتباط با سرورهای تشخیص آی‌پی. اتصال اینترنت خود را بررسی کنید یا نام شهر را دستی جستجو نمایید.');
      }
    };
  }
`;

  // جایگزینی بخش‌های قبلی مربوط به دکمه‌های autoGpsBtn و autoIpBtn
  const regexGpsAndIp = /\/\/ موقعیت‌یابی زنده GPS[\s\S]*?\/\/ جستجوی دستی شهر/;
  if (regexGpsAndIp.test(js)) {
    js = js.replace(regexGpsAndIp, updatedLocationLogic + '\n  // جستجوی دستی شهر');
    fs.writeFileSync('./script.js', js, 'utf8');
    console.log('✅ منطق موقعیت‌یابی GPS و فال‌بک آی‌پی در script.js به‌روزرسانی شد.');
  }
}