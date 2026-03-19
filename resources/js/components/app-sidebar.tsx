import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Baby,
    FileQuestion,
    LayoutGrid,
    ScanHeart,
    UserRoundCog,
    UserRoundPlus,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        canAccess: ['super_admin', 'admin', 'midwife'],
    },
    {
        title: 'Pengguna',
        href: '/user',
        icon: Users,
        canAccess: ['super_admin', 'admin', 'midwife'],
    },
    {
        title: 'Peran',
        href: '/role',
        icon: UserRoundCog,
        canAccess: ['super_admin'],
    },
    {
        title: 'Pasien',
        href: '/patient',
        icon: UserRoundPlus,
        canAccess: ['super_admin', 'admin', 'midwife'],
    },
    {
        title: 'Manajemen Bayi Pasien',
        href: '/baby',
        icon: Baby,
        canAccess: ['super_admin', 'admin', 'midwife'],
    },
    {
        title: 'Pertanyaan Kuesioner',
        href: '/question',
        icon: FileQuestion,
        canAccess: ['super_admin'],
    },
    {
        title: 'Hasil Deteksi Dini',
        href: '/postpartum',
        icon: ScanHeart,
        canAccess: ['super_admin', 'admin', 'midwife'],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;

    const userRole = auth?.user?.role?.slug || 'guest';

    let filteredNavItems = mainNavItems.filter((value) =>
        value.canAccess.includes(userRole),
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/*
             * ── Glass sidebar panel ────────────────────────────────────
             * bg-sidebar/90 + backdrop-blur-xl gives the "frosted glass"
             * feel while border-pink-100 ties into the Medical Pink palette.
             */}
            <SidebarHeader className="relative border-b border-pink-100/60 bg-sidebar/90 pb-3 backdrop-blur-xl dark:border-pink-900/30">
                {/* Thin Medical-Pink top-stripe accent */}
                <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Scrollable nav with pink-tinted scrollbar */}
            <SidebarContent className="bg-sidebar/90 backdrop-blur-xl">
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-pink-100/60 bg-sidebar/90 backdrop-blur-xl dark:border-pink-900/30">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
