import axios from 'axios';
import { getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';

/* ── Firebase config from Vite env ─────────────────────────────────── */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env
        .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
const LS_TOKEN_KEY = 'epds_fcm_token';

function getFirebaseMessaging() {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    return getMessaging(app);
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    const reg = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        {
            scope: '/',
        },
    );

    /* Wait until the SW is active — getToken() requires an active SW */
    if (reg.active) return reg;

    return new Promise<ServiceWorkerRegistration>((resolve, reject) => {
        const sw = reg.installing ?? reg.waiting;
        if (!sw) {
            resolve(reg);
            return;
        }

        sw.addEventListener('statechange', function handler() {
            if (sw.state === 'activated') {
                sw.removeEventListener('statechange', handler);
                resolve(reg);
            } else if (sw.state === 'redundant') {
                sw.removeEventListener('statechange', handler);
                reject(
                    new Error(
                        '[FCM] Service Worker became redundant before activating.',
                    ),
                );
            }
        });
    });
}

async function saveTokenToBackend(token: string): Promise<void> {
    const cached = localStorage.getItem(LS_TOKEN_KEY);
    if (cached === token) return; // already saved, skip round-trip

    /* Web route — session/cookie auth, XSRF handled by axios automatically */
    await axios.post('/fcm-token', { fcm_token: token });
    localStorage.setItem(LS_TOKEN_KEY, token);
    console.info('[useFcm] FCM token saved to backend.');
}

/* ────────────────────────────────────────────────────────────────────
 * requestFcmPermission()
 *
 * MUST be called from a user-gesture handler (e.g. button onClick).
 * Browsers block Notification.requestPermission() that is triggered
 * automatically on page load — a click event bypasses that restriction.
 *
 * Returns true if permission was granted (or was already granted).
 * ──────────────────────────────────────────────────────────────────── */
export async function requestFcmPermission(): Promise<boolean> {
    console.log(
        '[FCM] requestFcmPermission called — current permission:',
        Notification.permission,
    );

    if (
        !('Notification' in window) ||
        !('serviceWorker' in navigator) ||
        !VAPID_KEY
    ) {
        console.warn('[FCM] Notifications not supported or VAPID key missing.');
        return false;
    }

    /* Already granted — just refresh the token silently */
    if (Notification.permission === 'granted') {
        try {
            const sw = await registerServiceWorker();
            const token = await getToken(getFirebaseMessaging(), {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: sw,
            });
            if (token) await saveTokenToBackend(token);
        } catch (e) {
            console.error('[useFcm] Token refresh failed:', e);
        }
        return true;
    }

    /* Already denied — cannot ask again programmatically */
    if (Notification.permission === 'denied') {
        console.warn('[useFcm] Notification permission was denied by user.');
        return false;
    }

    /* default — show the browser prompt (requires user gesture to work) */
    const result = await Notification.requestPermission();
    if (result !== 'granted') {
        console.info(
            '[useFcm] User dismissed or denied notification permission.',
        );
        return false;
    }

    /* Permission just granted — register SW and obtain token */
    try {
        const sw = await registerServiceWorker();
        const token = await getToken(getFirebaseMessaging(), {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: sw,
        });
        if (token) await saveTokenToBackend(token);
    } catch (e) {
        console.error(
            '[useFcm] Error obtaining FCM token after permission grant:',
            e,
        );
    }

    return true;
}

/* ────────────────────────────────────────────────────────────────────
 * useFcm()
 *
 * Mount-time hook. ONLY wires up the foreground push listener.
 *
 * Token registration is handled exclusively by requestFcmPermission()
 * (called from a user gesture). This hook never touches the backend.
 * ──────────────────────────────────────────────────────────────────── */
export function useFcm(): void {
    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !('serviceWorker' in navigator) ||
            !('Notification' in window) ||
            !VAPID_KEY
        ) {
            return;
        }

        /* Only set up the listener if permission is already granted */
        if (Notification.permission !== 'granted') return;

        let unsubscribe: (() => void) | undefined;

        (async () => {
            try {
                /* Register SW so getMessaging() can attach to it */
                await registerServiceWorker();

                /* Foreground push listener — tab is active, browser won't show
                 * native notification, so we dispatch a custom event instead   */
                unsubscribe = onMessage(getFirebaseMessaging(), (payload) => {
                    console.info('[useFcm] Foreground message:', payload);
                    window.dispatchEvent(
                        new CustomEvent('fcm:foreground', { detail: payload }),
                    );
                });
            } catch (err) {
                console.error(
                    '[useFcm] Error initialising FCM foreground listener:',
                    err,
                );
            }
        })();

        return () => unsubscribe?.();
    }, []);
}
