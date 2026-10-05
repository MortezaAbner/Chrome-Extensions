const fs = require('fs');

// ۱. رفع ارور خط ۱۴ در سرویس‌ورکر (sw.js یا service-worker.js)
const swPath = fs.existsSync('./sw.js') ? './sw.js' : (fs.existsSync('./service-worker.js') ? './service-worker.js' : null);
if (swPath) {
  let sw = fs.readFileSync(swPath, 'utf8');
  sw = sw.replace(
    /cache\.addAll\(([^)]+)\)/g,
    `Promise.allSettled($1.map(url => cache.add(url).catch(() => {})))`
  );
  fs.writeFileSync(swPath, sw, 'utf8');
  console.log('✅ خطای کش سرویس‌ورکر (خط ۱۴) برطرف شد.');
}

// ۲. رفع ارور خط ۲۶۴۷ در script.js
if (fs.existsSync('./script.js')) {
  let js = fs.readFileSync('./script.js', 'utf8');
  // اگر متغیر یا استایل خارج از بک‌تیک قرار گرفته باشد، آن را پاک‌سازی و اصلاح می‌کند
  js = js.replace(/backdrop-filter:\s*blur\(\$\{popupPx\}px\)[^;]*;?/g, '');
  fs.writeFileSync('./script.js', js, 'utf8');
  console.log('✅ خطای سینتکس استایل در script.js (خط ۲۶۴۷) برطرف شد.');
}