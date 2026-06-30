const CACHE_NAME = "lifehub-cache-v2";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/lifehub-icon.svg",
  "/icons/lifehub-icon-192.png",
  "/icons/lifehub-icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request).then((cachedResponse) => {
        return cachedResponse || caches.match("/index.html");
      });
    })
  );
});

self.addEventListener("push", (event) => {
  let notificationData = {
    title: "Lembrete do LifeHUB",
    body: "Você tem um lembrete pendente.",
    url: "/dashboard",
  };

  if (event.data) {
    try {
      notificationData = {
        ...notificationData,
        ...event.data.json(),
      };
    } catch {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: "/icons/lifehub-icon-192.png",
      badge: "/icons/lifehub-icon-192.png",
      tag: notificationData.tag || "lifehub-reminder",
      requireInteraction: true,
      vibrate: [300, 120, 300, 120, 300],
      data: {
        url: notificationData.url || "/dashboard",
      },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(
      (clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

        return undefined;
      }
    )
  );
});