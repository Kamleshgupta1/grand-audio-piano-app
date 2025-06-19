
const CACHE_NAME = 'virtual-piano-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Handle background sync for recordings
self.addEventListener('sync', function(event) {
  if (event.tag === 'piano-recording-sync') {
    event.waitUntil(syncRecordings());
  }
});

async function syncRecordings() {
  // Sync recorded piano sessions when online
  console.log('Syncing piano recordings...');
}

// Handle push notifications for piano reminders
self.addEventListener('push', function(event) {
  const options = {
    body: 'Time for your piano practice session!',
    icon: '/piano-icon-192.png',
    badge: '/piano-icon-192.png',
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('Virtual Piano', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
