// Service Worker for ApexSwap - Advanced caching and offline functionality

const CACHE_NAME = 'apexswap-v1';
const STATIC_CACHE = 'apexswap-static-v1';
const DYNAMIC_CACHE = 'apexswap-dynamic-v1';
const API_CACHE = 'apexswap-api-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/apexswap',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/tokens',
  '/api/global-stats',
  '/api/market-data'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Static assets - Cache First
  STATIC: 'cache-first',
  // API data - Network First with fallback
  API: 'network-first',
  // Images - Cache First with long TTL
  IMAGES: 'cache-first',
  // Dynamic content - Stale While Revalidate
  DYNAMIC: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE).then((cache) => {
        console.log('API cache ready...');
        return Promise.resolve();
      })
    ]).then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Determine cache strategy based on request type
  const strategy = getCacheStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Determine cache strategy for request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Static assets
  if (url.pathname.includes('/static/') || 
      url.pathname.includes('/assets/') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg')) {
    return CACHE_STRATEGIES.STATIC;
  }
  
  // API endpoints
  if (url.pathname.startsWith('/api/')) {
    return CACHE_STRATEGIES.API;
  }
  
  // Images
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return CACHE_STRATEGIES.IMAGES;
  }
  
  // Default to dynamic
  return CACHE_STRATEGIES.DYNAMIC;
}

// Handle request based on strategy
async function handleRequest(request, strategy) {
  const url = new URL(request.url);
  
  try {
    switch (strategy) {
      case CACHE_STRATEGIES.STATIC:
        return await cacheFirst(request, STATIC_CACHE);
        
      case CACHE_STRATEGIES.API:
        return await networkFirst(request, API_CACHE);
        
      case CACHE_STRATEGIES.IMAGES:
        return await cacheFirst(request, DYNAMIC_CACHE);
        
      case CACHE_STRATEGIES.DYNAMIC:
        return await staleWhileRevalidate(request, DYNAMIC_CACHE);
        
      default:
        return await fetch(request);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    
    // Fallback to offline page for navigation requests
    if (request.mode === 'navigate') {
      return await caches.match('/offline.html') || 
             new Response('Offline - Please check your connection', {
               status: 503,
               statusText: 'Service Unavailable'
             });
    }
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Ignore network errors for background updates
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cached version
  return await fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync implementation
async function doBackgroundSync() {
  try {
    // Sync any pending actions when back online
    console.log('Performing background sync...');
    
    // Example: Sync watchlist changes, portfolio updates, etc.
    // This would typically involve sending queued data to the server
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ApexSwap Update', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/apexswap')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.urls)
    );
  }
});

// Cache specific URLs
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  return Promise.all(
    urls.map(url => 
      fetch(url).then(response => {
        if (response.ok) {
          cache.put(url, response);
        }
      }).catch(error => {
        console.error('Failed to cache URL:', url, error);
      })
    )
  );
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync triggered:', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

// Sync content periodically
async function syncContent() {
  try {
    console.log('Syncing content...');
    
    // Update market data, token prices, etc.
    const response = await fetch('/api/market-data');
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put('/api/market-data', response.clone());
    }
    
    console.log('Content sync completed');
  } catch (error) {
    console.error('Content sync failed:', error);
  }
}

console.log('Service Worker script loaded');
