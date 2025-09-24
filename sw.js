const CACHE_NAME = 'cyclistic-analytics-v2';
const STATIC_CACHE = 'cyclistic-static-v2';
const DYNAMIC_CACHE = 'cyclistic-dynamic-v2';

const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.min.css',
  '/chart-functions.min.js',
  '/bike-station-viz.min.js',
  '/theme-toggle.min.js',
  'https://d3js.org/d3.v7.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-r.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-sql.min.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(staticAssets);
      })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first strategy for static assets
  if (staticAssets.includes(request.url) || request.url.includes('.css') || request.url.includes('.js')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request).then(fetchResponse => {
            return caches.open(STATIC_CACHE).then(cache => {
              if (url.protocol === 'https:' || url.protocol === 'http:') {
                cache.put(request, fetchResponse.clone());
              }
              return fetchResponse;
            });
          });
        })
    );
  }
  // Network-first strategy for HTML pages
  else if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            if (url.protocol === 'https:' || url.protocol === 'http:') {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
  // Stale-while-revalidate for other resources
  else {
    event.respondWith(
      caches.match(request)
        .then(response => {
          const fetchPromise = fetch(request).then(networkResponse => {
            return caches.open(DYNAMIC_CACHE).then(cache => {
              if (url.protocol === 'https:' || url.protocol === 'http:') {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            });
          });
          return response || fetchPromise;
        })
    );
  }
});