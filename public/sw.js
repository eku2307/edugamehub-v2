const CACHE_NAME = 'edugamehub-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add your video files here
  '/videos/physics-overview.mp4',
  '/videos/chemistry-intro.mp4',
  '/videos/math-concepts.mp4',
  '/videos/biology-basics.mp4',
  // Add other static assets
  '/offline.html'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline game data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync game progress and scores when back online
      syncGameData()
    );
  }
});

async function syncGameData() {
  try {
    // Get stored game data from IndexedDB
    const gameData = await getStoredGameData();
    
    if (gameData.length > 0) {
      // Send to server when online
      await fetch('/api/sync-game-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      // Clear local storage after successful sync
      await clearStoredGameData();
    }
  } catch (error) {
    console.log('Sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
async function getStoredGameData() {
  return new Promise((resolve) => {
    const request = indexedDB.open('EduGameHub', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['gameData'], 'readonly');
      const store = transaction.objectStore('gameData');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };
    };
    
    request.onerror = () => resolve([]);
  });
}

async function clearStoredGameData() {
  return new Promise((resolve) => {
    const request = indexedDB.open('EduGameHub', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['gameData'], 'readwrite');
      const store = transaction.objectStore('gameData');
      
      store.clear().onsuccess = () => resolve();
    };
    
    request.onerror = () => resolve();
  });
}