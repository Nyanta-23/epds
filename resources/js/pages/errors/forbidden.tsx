import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, LogOut, ShieldX } from 'lucide-react';

export default function Forbidden() {
    const { post, processing } = useForm();

    function handleLogout() {
        post('/logout');
    }

    function handleBack() {
        window.history.back();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex flex-col items-center justify-center p-6">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-12">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <AppLogoIcon className="size-5 fill-current text-white" />
                </div>
                <span className="text-lg font-bold tracking-wide text-primary">SIMPONI</span>
            </div>

            {/* Card */}
            <div className="w-full max-w-md bg-card border border-border/60 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center gap-6">

                {/* Icon */}
                <div className="relative">
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-destructive/10">
                        <ShieldX className="size-10 text-destructive" strokeWidth={1.5} />
                    </div>
                    <span className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-white shadow">
                        403
                    </span>
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h1 className="text-xl font-bold text-foreground">
                        Akses Ditolak
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Anda tidak memiliki izin untuk mengakses halaman ini.
                        Silakan kembali atau hubungi administrator jika Anda
                        merasa ini adalah kesalahan.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-border/50" />

                {/* Actions */}
                <div className="flex w-full flex-col gap-3 sm:flex-row">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="size-4" />
                        Kembali
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={handleLogout}
                        disabled={processing}
                    >
                        <LogOut className="size-4" />
                        {processing ? 'Keluar...' : 'Keluar & Hapus Sesi'}
                    </Button>
                </div>
            </div>

            {/* Footer note */}
            <p className="mt-8 text-xs text-muted-foreground/60">
                Sistem Informasi Monitoring Postpartum Nifas · SIMPONI
            </p>
        </div>
    );
}
