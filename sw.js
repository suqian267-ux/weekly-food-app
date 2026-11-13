const CACHE = 'good-food-v3';

const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './recipes.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  // 食谱：优先联网，断网读取缓存
  if (url.pathname.endsWith('/recipes.json')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(async response => {
          if (response.ok) {
            const cache = await caches.open(CACHE);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          return await caches.match(request) ||
            new Response('菜谱暂时无法加载', {
              status: 503,
              headers: {
                'Content-Type': 'text/plain;charset=utf-8'
              }
            });
        })
    );
    return;
  }

  // 页面：优先联网，断网使用缓存
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        return await caches.match('./index.html');
      })
    );
    return;
  }

  // 其他静态文件：优先缓存
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});