import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import { useScrollDirection } from '@/hooks/use-scroll-direction';
import { cn } from '@/lib/utils';
import {
    type BreadcrumbItem as BreadcrumbItemType,
    type SharedData,
} from '@/types';
import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useRef, useState } from 'react';
import NotificationDropdown from './notification-dropdown';
import { UserMenuContent } from './user-menu-content';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const scrollDir = useScrollDirection(6);

    /* ── Inline search state ──────────────────────────────────────────── */
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const openSearch = () => {
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    return (
        /*
         * sticky top-0  → stays pinned while scrolling
         * translate-y-0 / -translate-y-full → hide on scroll-down,
         *   slide back in on scroll-up (300 ms ease).
         * z-40 → sits above glassmorphism cards (z-20) but below modals.
         */
        <header
            className={cn(
                'sticky top-0 z-40 flex h-12 shrink-0 items-center justify-between gap-3',
                'border-b border-pink-100/70 dark:border-pink-900/25',
                'bg-background/75 px-2 backdrop-blur-xl',
                'transition-[width,height,transform] duration-300 ease-in-out',
                'group-has-data-[collapsible=icon]/sidebar-wrapper:h-11 md:px-3',
                /* ↓ slide the header out of view when scrolling down */
                scrollDir === 'down' && 'md:-translate-y-full',
            )}
        >
            {/* Left: sidebar trigger + breadcrumbs */}
            <div className="flex min-w-0 items-center gap-1.5">
                {/* 44px touch target wrapper around the 20px icon trigger */}
                <SidebarTrigger className="-ml-1 flex size-11 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-primary/10 hover:text-primary" />

                {/* Breadcrumbs — hidden while search is expanded on small screens */}
                <div
                    className={cn(
                        'min-w-0 transition-all duration-200',
                        searchOpen ? 'hidden sm:block' : 'block',
                    )}
                >
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            {/* Right: search + notifications + user */}
            <div className="flex shrink-0 items-center gap-0.5">
                {/* ── Inline search bar ────────────────────────────────── */}
                <div
                    className={cn(
                        'flex items-center overflow-hidden rounded-xl border',
                        'transition-all duration-300 ease-in-out',
                        searchOpen
                            ? 'w-44 border-pink-200 bg-white/90 shadow-sm sm:w-60 dark:border-pink-800/40 dark:bg-background/80'
                            : 'w-11 border-transparent bg-transparent',
                    )}
                >
                    <button
                        type="button"
                        aria-label="Open search"
                        onClick={openSearch}
                        className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                    >
                        <Search className="size-[15px]" />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Cari..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => {
                            if (!searchQuery) setSearchOpen(false);
                        }}
                        className={cn(
                            'h-9 flex-1 bg-transparent pr-2 text-sm outline-none placeholder:text-muted-foreground/60',
                            !searchOpen && 'pointer-events-none',
                        )}
                    />
                </div>

                {/* Notifications */}
                <NotificationDropdown />

                {/* ── Compact user avatar dropdown ─────────────────────── */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-label="User menu"
                            className={cn(
                                'group flex h-11 w-11 items-center justify-center rounded-full',
                                'ring-2 ring-transparent transition-all duration-150',
                                'hover:ring-primary/40 focus-visible:ring-primary/60 focus-visible:outline-none',
                            )}
                        >
                            <Avatar className="size-7">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary dark:bg-primary/30">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-56 rounded-2xl border-pink-100/60 shadow-lg shadow-pink-500/5 dark:border-pink-900/30"
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
