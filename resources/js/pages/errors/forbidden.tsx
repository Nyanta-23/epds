import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { logout } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ShieldX } from 'lucide-react';

export default function Forbidden() {
    function handleLogout() {
        router.post(logout().url);
    }

    return (
        <>
            <Head title="Akses Ditolak" />

            <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <AppLogoIcon className="size-5 fill-current text-white" />
                    </div>
                    <span className="text-sm font-bold tracking-wide text-primary">SIMPONI</span>
                </div>

                {/* Icon */}
                <div className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
                    <ShieldX className="size-10 text-destructive" strokeWidth={1.5} />
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Akses Ditolak</h1>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Anda tidak memiliki izin untuk mengakses halaman ini. Jika Anda merasa ini
                        adalah kesalahan, hubungi administrator.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <Button variant="outline" asChild>
                        <Link href={window.history.length > 1 ? 'javascript:history.back()' : '/'}>
                            <ArrowLeft className="mr-1.5 size-4" />
                            Kembali
                        </Link>
                    </Button>

                    <Button variant="destructive" onClick={handleLogout}>
                        Keluar &amp; Hapus Sesi
                    </Button>
                </div>
            </div>
        </>
    );
}
