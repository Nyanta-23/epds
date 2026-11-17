import axios from 'axios';
import { getApps, initializeApp } from 'firebase/app';
import {
    getMessaging,
    getToken,
    isSupported,
    onMessage,
} from 'firebase/messaging';
import { useEffect } from 'react';

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

function isNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
}

function getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (!isNotificationSupported()) {
        return 'unsupported';
    }

    return window.Notification.permission;
}

interface FcmRegistrationOptions {
    endpoint?: string;
    apiToken?: string;
    userId?: string;
    throwOnError?: boolean;
}

async function getFirebaseMessagingSafe() {
    if (!(await isSupported())) return null;
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

async function saveTokenToBackend(
    token: string,
    options: FcmRegistrationOptions = {},
): Promise<void> {
    const endpoint = options.endpoint ?? '/fcm-token';
    const storageKey = options.userId
        ? `${LS_TOKEN_KEY}:${endpoint}:${options.userId}`
        : LS_TOKEN_KEY;
    const cached = localStorage.getItem(storageKey);
    if (cached === token) return; // already saved, skip round-trip

    if (options.apiToken) {
        await axios.post(
            endpoint,
            { token },
            { headers: { Authorization: `Bearer ${options.apiToken}` } },
        );
    } else {
        await axios.post(endpoint, { fcm_token: token });
    }
    localStorage.setItem(storageKey, token);
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
export async function requestFcmPermission(
    options: FcmRegistrationOptions = {},
): Promise<boolean> {
    // 1. Cek dukungan browser DULU sebelum menyentuh Notification.permission
    if (
        typeof window === 'undefined' ||
        !isNotificationSupported() ||
        !('serviceWorker' in navigator) ||
        !VAPID_KEY
    ) {
        console.warn('[FCM] Notifications not supported or VAPID key missing.');
        if (options.throwOnError) {
            throw new Error(
                'Notifikasi web belum tersedia. Di iPhone, pastikan aplikasi sudah ditambahkan ke Layar Utama (Add to Home Screen) dan izinkan notifikasi dari browser.',
            );
        }
        return false;
    }

    const messaging = await getFirebaseMessagingSafe();
    if (!messaging) {
        if (options.throwOnError) {
            throw new Error(
                'Browser/perangkat ini tidak mendukung Firebase Messaging.',
            );
        }
        return false;
    }

    const permission = getNotificationPermission();
    console.log('[FCM] Current permission:', permission);

    if (permission === 'granted') {
        try {
            const sw = await registerServiceWorker();
            const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: sw,
            });
            if (token) await saveTokenToBackend(token, options);
            else if (options.throwOnError) {
                throw new Error('Token notifikasi tidak berhasil dibuat.');
            }
        } catch (e) {
            console.error('[useFcm] Token refresh failed:', e);
            if (options.throwOnError) throw e;
        }
        return true;
    }

    if (permission === 'denied') {
        if (options.throwOnError) {
            throw new Error(
                'Izin notifikasi diblokir. Aktifkan melalui pengaturan browser atau situs.',
            );
        }
        return false;
    }

    const result = await window.Notification.requestPermission();
    if (result !== 'granted') return false;

    try {
        const sw = await registerServiceWorker();
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: sw,
        });
        if (token) await saveTokenToBackend(token, options);
        else if (options.throwOnError) {
            throw new Error('Token notifikasi tidak berhasil dibuat.');
        }
    } catch (e) {
        console.error('[useFcm] Error obtaining FCM token:', e);
        if (options.throwOnError) throw e;
    }

    return true;
}

export function useFcm(): void {
    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !('serviceWorker' in navigator) ||
            !isNotificationSupported() ||
            !VAPID_KEY ||
            getNotificationPermission() !== 'granted'
        ) {
            return;
        }

        let unsubscribe: (() => void) | undefined;

        (async () => {
            try {
                const messaging = await getFirebaseMessagingSafe();
                if (!messaging) return;

                await registerServiceWorker();

                unsubscribe = onMessage(messaging, (payload) => {
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
