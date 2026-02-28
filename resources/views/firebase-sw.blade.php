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

firebase.initializeApp({
apiKey: '{{ env("VITE_FIREBASE_API_KEY") }}',
authDomain: '{{ env("VITE_FIREBASE_AUTH_DOMAIN") }}',
projectId: '{{ env("VITE_FIREBASE_PROJECT_ID") }}',
storageBucket: '{{ env("VITE_FIREBASE_STORAGE_BUCKET") }}',
messagingSenderId: '{{ env("VITE_FIREBASE_MESSAGING_SENDER_ID") }}',
appId: '{{ env("VITE_FIREBASE_APP_ID") }}',
measurementId: '{{ env("VITE_FIREBASE_MEASUREMENT_ID") }}',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
console.log('[firebase-messaging-sw.js] Background message received:', payload);

const title = payload.notification?.title ?? payload.data?.title ?? 'Notifikasi EPDS';
const body = payload.notification?.body ?? payload.data?.body ?? '';
const url = payload.data?.action_url ?? '/dashboard';

self.registration.showNotification(title, {
body,
icon : '/logo.svg',
badge: '/logo.svg',
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