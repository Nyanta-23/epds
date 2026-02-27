import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({
    variant = 'header',
    children,
    className,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset className={cn('bg-background', className)} {...props}>
                {children}
            </SidebarInset>
        );
    }

    return (
        /*
         * Edge-to-edge on mobile (no horizontal padding at root),
         * comfortable 6-unit (24 px) gutters from md upward.
         */
        <main
            className={cn(
                'mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4',
                'px-0 md:px-6',
                className,
            )}
            {...props}
        >
            {children}
        </main>
    );
}
