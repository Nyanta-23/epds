/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const SHELL_CACHE = 'epds-patient-assets-v5';
const STATIC_SHELL = [
'/manifest.webmanifest',
'/pwa-icon.svg',
];

self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(SHELL_CACHE).then((cache) => cache.addAll(STATIC_SHELL))
);
self.skipWaiting();
});

self.addEventListener('activate', (event) => {
event.waitUntil(
Promise.all([
caches.keys().then((keys) =>
Promise.all(
keys
.filter((key) => key.startsWith('epds-patient-') && key !== SHELL_CACHE)
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

if (request.mode === 'navigate' || request.headers.has('X-Inertia')) {
return;
}

if (
url.pathname.startsWith('/build/') ||
/\.(?:css|js|svg|png|jpg|jpeg|webp|woff2?)$/i.test(url.pathname)
) {
event.respondWith(
caches.open(SHELL_CACHE).then(async (cache) => {
const cached = await cache.match(request);
if (cached) return cached;

const response = await fetch(request);
if (response.ok && response.type === 'basic') {
cache.put(request, response.clone());
}
return response;
})
);
}
});

// Inisialisasi Firebase & FCM secara aman tanpa Promise .then()
try {
const firebaseConfig = @json(config('firebase.web'));

if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId) {
if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}

const isMessagingSupported =
typeof firebase.messaging === 'function' &&
(typeof firebase.messaging.isSupported !== 'function' ||
firebase.messaging.isSupported());

if (isMessagingSupported) {
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
if (payload.notification) return;

const title = payload.data?.title ?? 'Notifikasi EPDS';
const body = payload.data?.body ?? '';
const url = new URL(
payload.data?.action_url ?? '/patient-app/home',
self.location.origin
).href;

self.registration.showNotification(title, {
body,
icon: '/pwa-icon.svg',
badge: '/pwa-icon.svg',
requireInteraction: true,
tag:
payload.data?.type === 'schedule'
? `epds-schedule-${payload.data?.baby_id}-${payload.data?.visit_number}`
: undefined,
data: { url },
});
});
}
}
} catch (err) {
console.warn('[SW] Firebase Messaging dilewati:', err);
}

self.addEventListener('notificationclick', (event) => {
event.notification.close();
const url = event.notification.data?.url ?? '/patient-app/home';
event.waitUntil(
clients
.matchAll({ type: 'window', includeUncontrolled: true })
.then((windowClients) => {
const existing = windowClients.find((c) => c.url === url && 'focus' in c);
if (existing) return existing.focus();
return clients.openWindow(url);
})
);
});