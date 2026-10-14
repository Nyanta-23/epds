import { router } from '@inertiajs/react';
import { Activity, Baby, ClipboardList, Home, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';

type PatientAppSection =
    | 'home'
    | 'baby'
    | 'screening'
    | 'history'
    | 'profile'
    | 'notifications';

const navigationItems: {
    section: PatientAppSection;
    label: string;
    icon: ReactNode;
    href: string;
}[] = [
    {
        section: 'home',
        label: 'Beranda',
        icon: <Home size={20} />,
        href: '/patient-app/home',
    },
    {
        section: 'baby',
        label: 'Bayi',
        icon: <Baby size={20} />,
        href: '/patient-app/baby',
    },
    {
        section: 'screening',
        label: 'Skrining',
        icon: <ClipboardList size={20} />,
        href: '/patient-app/screening',
    },
    {
        section: 'history',
        label: 'Riwayat',
        icon: <Activity size={20} />,
        href: '/patient-app/history',
    },
    {
        section: 'profile',
        label: 'Profil',
        icon: <UserRound size={20} />,
        href: '/patient-app/profile',
    },
];

export function PatientAppNavbar({
    active,
    onNavigate,
}: {
    active: PatientAppSection;
    onNavigate?: (section: PatientAppSection, href: string) => void;
}) {
    return (
        <nav
            aria-label="Navigasi aplikasi pasien"
            className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-xl justify-around border-t border-rose-100 bg-white/95 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur"
        >
            {navigationItems.map((item) => (
                <button
                    key={item.section}
                    type="button"
                    aria-current={active === item.section ? 'page' : undefined}
                    onClick={() => {
                        if (onNavigate) {
                            onNavigate(item.section, item.href);
                            return;
                        }

                        router.visit(item.href);
                    }}
                    className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold ${active === item.section ? 'text-rose-500' : 'text-slate-400'}`}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </nav>
    );
}
