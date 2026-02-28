import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import axios from 'axios';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

/* ── Axios global config for Laravel Sanctum SPA auth ─────────────── */
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
/*
 * Force all axios requests to go to the Laravel server (port 8000),
 * not the Vite dev server (port 5173). Without this, relative URLs
 * like /api/v1/fcm-token resolve against the wrong origin and
 * Sanctum can't match the session cookie → 401.
 * Gunakan window.location.origin (runtime) bukan VITE_APP_URL (baked at build time).
 */
axios.defaults.baseURL = window.location.origin;

/* ── 419 Page Expired handler ─────────────────────────────────────── */

/**
 * Fires `session:expired` event. The `SessionExpiredBanner` component
 * listens for this and shows a friendly "reload" dialog.
 */
function notifySessionExpired() {
    window.dispatchEvent(new Event('session:expired'));
}

/**
 * Axios interceptor — catches 419 from manual axios calls (e.g. FCM
 * token save). Attempts one CSRF refresh + retry; shows banner on failure.
 */
let csrfRefreshing = false;
axios.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error?.response?.status;
        if (status === 419 && !csrfRefreshing) {
            csrfRefreshing = true;
            try {
                // Refresh the CSRF cookie
                await axios.get('/sanctum/csrf-cookie');
                csrfRefreshing = false;
                // Retry the original request once
                return axios(error.config);
            } catch {
                csrfRefreshing = false;
                notifySessionExpired();
            }
        }
        if (status === 419) {
            notifySessionExpired();
        }
        return Promise.reject(error);
    },
);

/**
 * Inertia router listener — catches 419 from Inertia navigations /
 * form submissions. The `invalid` event fires when the server returns
 * a non-Inertia response; `error` fires for validation/HTTP errors.
 */
router.on('invalid', (event) => {
    if (
        (event.detail.response as unknown as { status: number })?.status === 419
    ) {
        event.preventDefault(); // suppress default Inertia error page
        notifySessionExpired();
    }
});

router.on('error', (event) => {
    // event.detail.errors is a Record<string,string> from Inertia form
    // validation; real HTTP errors come through `invalid`.
    // Nothing extra needed here — kept for completeness.
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
