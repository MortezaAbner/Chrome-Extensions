const CACHE_NAME = 'cache-v-' + Date.now() + Date.now();
const ASSETS = [
  './',
  './index.html',
  './newtab.html',
  './style.css',
  './script.js',
  './app.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.allSettled(ASSETS.map(url => cache.add(url).catch(() => {}))))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});



self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // فایل‌های افزونه هرگز نباید در Cache API ذخیره شوند
  if (!event.request.url.startsWith('http')) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
