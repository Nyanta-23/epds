import { RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

/**
 * SessionExpiredBanner
 *
 * Muncul sebagai fixed overlay kecil di tengah layar ketika session
 * atau CSRF token kadaluarsa (HTTP 419 Page Expired).
 *
 * Cara memicu dari mana saja:
 *   window.dispatchEvent(new Event('session:expired'));
 */
export function SessionExpiredBanner() {
    const [visible, setVisible] = useState(false);
    const [reloading, setReloading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const show = () => {
            setVisible(true);
            // Auto-reload setelah 30 detik jika user tidak merespons
            timerRef.current = setTimeout(() => handleReload(), 30_000);
        };

        window.addEventListener('session:expired', show);
        return () => {
            window.removeEventListener('session:expired', show);
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleReload = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setReloading(true);
        // Hard reload agar session + CSRF cookie di-refresh dari server
        window.location.reload();
    };

    if (!visible) return null;

    return (
        /* Backdrop semi-transparan */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-sm animate-in rounded-2xl border border-border bg-background p-6 shadow-2xl duration-200 zoom-in-95 fade-in">
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-amber-100 p-3">
                        <RefreshCw size={24} className="text-amber-600" />
                    </div>
                </div>

                {/* Teks */}
                <div className="mb-5 text-center">
                    <h2 className="text-base font-semibold text-foreground">
                        Sesi Kadaluarsa
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        Halaman ini sudah tidak aktif cukup lama. Muat ulang
                        untuk melanjutkan.
                    </p>
                </div>

                {/* Tombol */}
                <Button
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleReload}
                    disabled={reloading}
                >
                    {reloading ? (
                        <>
                            <RefreshCw size={15} className="animate-spin" />
                            Memuat ulang…
                        </>
                    ) : (
                        <>
                            <RefreshCw size={15} />
                            Muat Ulang Halaman
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
