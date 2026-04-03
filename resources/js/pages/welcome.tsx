import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bell,
    ClipboardList,
    HeartPulse,
    LayoutDashboard,
    ShieldCheck,
    Users,
} from 'lucide-react';

const features = [
    {
        icon: ClipboardList,
        title: 'Skrining EPDS',
        description:
            'Formulir Edinburgh Postnatal Depression Scale (EPDS) digital untuk mendeteksi risiko depresi pasca persalinan secara cepat dan terstandar.',
    },
    {
        icon: HeartPulse,
        title: 'Monitoring Risiko',
        description:
            'Pantau skor dan kategori risiko setiap pasien secara real-time. Identifikasi pasien berisiko tinggi sebelum kondisi memburuk.',
    },
    {
        icon: Activity,
        title: 'Tindak Lanjut',
        description:
            'Catat dan kelola tindak lanjut (follow-up) untuk setiap pasien yang membutuhkan perhatian klinis lebih lanjut.',
    },
    {
        icon: Bell,
        title: 'Notifikasi Otomatis',
        description:
            'Bidan menerima notifikasi push otomatis ketika ada hasil skrining baru atau jadwal kunjungan nifas yang mendekat.',
    },
    {
        icon: Users,
        title: 'Manajemen Pasien',
        description:
            'Kelola data ibu, bayi, dan riwayat kunjungan nifas dalam satu sistem terpadu yang mudah diakses dari mana saja.',
    },
    {
        icon: LayoutDashboard,
        title: 'Dashboard Analitik',
        description:
            'Visualisasi distribusi risiko dan statistik tindak lanjut untuk mendukung pengambilan keputusan berbasis data.',
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Selamat Datang — SIMPONI" />

            <div className="min-h-screen bg-background text-foreground">
                {/* ── Navbar ─────────────────────────────────────────── */}
                <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                <AppLogoIcon className="size-5 fill-current text-white" />
                            </div>
                            <span className="text-sm font-bold tracking-wide text-primary">
                                SIMPONI
                            </span>
                        </div>

                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard().url}>
                                        <LayoutDashboard className="mr-1.5 size-4" />
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <Button asChild size="sm">
                                    <Link href={login().url}>Masuk</Link>
                                </Button>
                            )}
                        </nav>
                    </div>
                </header>

                {/* ── Hero ───────────────────────────────────────────── */}
                <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center md:py-28">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                        <ShieldCheck className="size-3.5" />
                        Sistem Monitoring Psikologis Ibu Nifas
                    </div>

                    <h1 className="mb-5 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
                        Deteksi Dini Depresi{' '}
                        <span className="text-primary">Pasca Persalinan</span>{' '}
                        Lebih Mudah
                    </h1>

                    <p className="mb-8 max-w-xl text-base text-muted-foreground">
                        SIMPONI membantu tenaga kesehatan melakukan skrining
                        EPDS, memantau risiko pasien, dan mengelola tindak
                        lanjut — semuanya dalam satu platform digital.
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        {auth.user ? (
                            <Button asChild size="lg">
                                <Link href={dashboard().url}>
                                    <LayoutDashboard className="mr-2 size-5" />
                                    Buka Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild size="lg">
                                <Link href={login().url}>Masuk ke Sistem</Link>
                            </Button>
                        )}
                    </div>
                </section>

                {/* ── Divider ────────────────────────────────────────── */}
                <div className="mx-auto max-w-5xl px-6">
                    <div className="border-t border-border/50" />
                </div>

                {/* ── Features ───────────────────────────────────────── */}
                <section className="mx-auto max-w-5xl px-6 py-16">
                    <div className="mb-10 text-center">
                        <h2 className="mb-2 text-2xl font-bold tracking-tight">
                            Fitur Utama
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Semua yang dibutuhkan untuk monitoring kesehatan ibu
                            pasca persalinan
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <f.icon
                                        className="size-5"
                                        strokeWidth={1.75}
                                    />
                                </div>
                                <h3 className="mb-1.5 text-sm font-semibold">
                                    {f.title}
                                </h3>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    {f.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Footer ─────────────────────────────────────────── */}
                <footer className="border-t bg-muted/30">
                    <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-3.5 fill-current text-white" />
                            </div>
                            <span className="font-semibold text-primary">
                                SIMPONI
                            </span>
                        </div>
                        <span>
                            Sistem Monitoring Psikologis Ibu Nifas &copy;{' '}
                            {new Date().getFullYear()}
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
}
