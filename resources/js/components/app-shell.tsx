import { SessionExpiredBanner } from '@/components/session-expired-banner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useFcm } from '@/hooks/use-fcm';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    /* Register this browser for Firebase push notifications */
    useFcm();

    if (variant === 'header') {
        return (
            <>
                <SessionExpiredBanner />
                <div className="flex min-h-screen w-full flex-col">
                    {children}
                </div>
            </>
        );
    }

    return (
        <>
            <SessionExpiredBanner />
            <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>
        </>
    );
}
