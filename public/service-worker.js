const CACHE_NAME = 'koodiapina-ruoka-v5';
const urlsToCache = [
  '/',
  '/index.html',
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
        // Only cache successful GET requests for navigation (HTML)
        if (event.request.method === 'GET' && 
            event.request.mode === 'navigate' &&
            response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
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
