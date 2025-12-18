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
        canAccess: ['super_admin', 'admin'],
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
        title: 'Hasil Skrining',
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
            <SidebarHeader>
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

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
