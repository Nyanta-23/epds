import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />

            {/*
             * overflow-x-hidden prevents horizontal scroll bleed.
             * The page body gets edge-to-edge padding on mobile (px-0)
             * and comfortable gutters on desktop (handled inside AppContent).
             */}
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                {/*
                 * Inner wrapper adds the desktop gutters and
                 * bottom padding so content never hides under a nav bar.
                 */}
                <div className="flex flex-1 flex-col gap-3 px-0 py-3 md:px-4 md:py-4">
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
