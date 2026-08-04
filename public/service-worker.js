const CACHE_NAME = 'koodiapina-ruoka-v6';
const urlsToCache = [
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim clients immediately
  return self.clients.claim();
});

// Fetch event - network first for everything
self.addEventListener('fetch', (event) => {
  // Skip service worker for:
  // - Chrome extension requests
  // - Vite HMR WebSocket connections
  // - Non-http(s) requests
  if (
    event.request.url.startsWith('chrome-extension://') ||
    event.request.url.includes('/__vite') ||
    event.request.url.includes('@vite') ||
    !event.request.url.startsWith('http')
  ) {
    return;
  }

  // Network-first strategy: always try network, fallback to cache only for navigation
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Detect stale asset requests that got SPA fallback HTML instead of JS/CSS
        if (event.request.url.match(/\/assets\/.*\.(js|css)$/) &&
            response.headers.get('content-type')?.includes('text/html')) {
          self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({ type: 'FORCE_RELOAD' }));
          });
          return new Response('', { status: 404 });
        }
        return response;
      })
      .catch(() => {
        // Only use cache as fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(event.request);
        }
        throw new Error('Network request failed');
      })
  );
});
