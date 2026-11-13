const CACHE = 'good-food-v2';

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

  // 菜谱库：优先联网获取最新版本，断网时读取本地缓存
  if (url.pathname.endsWith('/recipes.json')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => {
              cache.put('./recipes.json', copy);
            });
          }
          return response;
        })
        .catch(async () => {
          return await caches.match('./recipes.json') ||
            new Response('菜谱暂时无法加载', {
              status: 503,
              headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            });
        })
    );
    return;
  }

  // 页面：优先获取最新版本，断网时使用缓存
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 其他静态文件：优先使用缓存
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});