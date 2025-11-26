const CACHE_NAME = 'koodiapina-ruoka-v3';
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

// Fetch event - cache first for all resources
self.addEventListener('fetch', (event) => {
  // Skip service worker for:
  // - Non-GET requests (POST, PUT, DELETE, etc.)
  // - Chrome extension requests
  // - Vite HMR WebSocket connections
  // - Non-http(s) requests
  if (
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension://') ||
    event.request.url.includes('/__vite') ||
    event.request.url.includes('@vite') ||
    event.request.url.includes('?') && event.request.url.includes('token=') ||
    !event.request.url.startsWith('http')
  ) {
    return;
  }

  // Cache-first strategy for all resources
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});
