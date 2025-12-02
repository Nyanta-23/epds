import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
   server: {
        host: '0.0.0.0', 
        hmr: {
            host: '0.0.0.0',
        },
        cors: true,
    },
    //   server: {
    //     host: '0.0.0.0', // Mengizinkan akses dari luar localhost
    //     hmr: {
    //         host: '10.12.244.166', // IP Laptop Anda (SESUAIKAN JIKA IP BERUBAH)
    //     },
    //     cors: {
    //         origin: '*', // Izinkan semua origin
    //     },
    // },
    esbuild: {
        jsx: 'automatic',
    },
});
