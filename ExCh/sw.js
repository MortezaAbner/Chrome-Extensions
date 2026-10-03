// فورس پاک‌سازی کش و لغو کنترل نسخه‌های قدیمی
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// ارسال مستقیم درخواست‌ها به شبکه بدون نگه‌داشتن کش خراب
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
  );
});