/* eslint-disable no-undef */
/**
* Firebase Cloud Messaging Service Worker
* Handles background push notifications.
*
* NOTE: Service workers cannot use ES module syntax (import/export).
* Use importScripts() with the compat CDN build instead.
*
* This file is served dynamically by Laravel so that Firebase config
* values are injected from .env — never hardcoded in source.
*/

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp(@json(config('firebase.web')));

const messaging = firebase.messaging();
const SHELL_CACHE = 'epds-patient-shell-v1';

self.addEventListener('install', (event) => {
event.waitUntil(
  caches.open(SHELL_CACHE).then((cache) =>
    cache.addAll(['/patient-app', '/manifest.webmanifest', '/pwa-icon.svg'])
  )
);
self.skipWaiting();
});

self.addEventListener('activate', (event) => {
event.waitUntil(
  Promise.all([
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('epds-patient-shell-') && key !== SHELL_CACHE)
          .map((key) => caches.delete(key))
      )
    ),
    self.clients.claim(),
  ])
);
});

self.addEventListener('fetch', (event) => {
const request = event.request;
const url = new URL(request.url);

if (request.method !== 'GET' || url.origin !== self.location.origin) return;

if (request.mode === 'navigate' && url.pathname === '/patient-app') {
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response.ok) return response;

        return caches.open(SHELL_CACHE)
          .then((cache) => cache.put('/patient-app', response.clone()))
          .then(() => response);
      })
      .catch(() => caches.match('/patient-app'))
  );
  return;
}

if (/\.(?:css|js|svg|png|woff2?)$/i.test(url.pathname)) {
  event.respondWith(
    caches.open(SHELL_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
  );
}
});

messaging.onBackgroundMessage((payload) => {
console.log('[firebase-messaging-sw.js] Background message received:', payload);

if (payload.notification) return;

const title = payload.data?.title ?? payload.notification?.title ?? 'Notifikasi EPDS';
const body = payload.data?.body ?? payload.notification?.body ?? '';
const url = new URL(
  payload.data?.action_url ?? '/dashboard',
  self.location.origin
).href;

self.registration.showNotification(title, {
body,
icon : '/pwa-icon.svg',
badge: '/pwa-icon.svg',
requireInteraction: true,
tag: payload.data?.type === 'schedule'
  ? `epds-schedule-${payload.data?.baby_id}-${payload.data?.visit_number}`
  : undefined,
data : { url },
});
});

/* Open / focus the target URL when user taps the notification */
self.addEventListener('notificationclick', (event) => {
event.notification.close();
const url = event.notification.data?.url ?? '/dashboard';
event.waitUntil(
clients
.matchAll({ type: 'window', includeUncontrolled: true })
.then((windowClients) => {
const existing = windowClients.find((c) => c.url === url && 'focus' in c);
if (existing) return existing.focus();
return clients.openWindow(url);
}),
);
});