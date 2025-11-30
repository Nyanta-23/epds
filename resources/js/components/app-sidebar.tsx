import { NavFooter } from '@/components/nav-footer';
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
import { Link } from '@inertiajs/react';
import { Award, Baby, BookOpen, FileQuestion, FileText, Folder, LayoutGrid, ScanHeart, UserRoundCog, UserRoundPlus, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User',
        href: '/user',
        icon: Users,
    },
    {
        title: 'Role',
        href: '/role',
        icon: UserRoundCog,
    },
    {
        title: 'Patient',
        href: '/patient',
        icon: UserRoundPlus,
    },
    {
        title: 'Patient Baby Management',
        href: '/baby',
        icon: Baby,
    },
    {
        title: 'Question',
        href: '/question',
        icon: FileQuestion,
    },
    {
        title: 'Pospartum Screening',
        href: '/postpartum',
        icon: ScanHeart,
    },
    {
        title: 'Recomendation Rule',
        href: '/recomendation/rule',
        icon: Award,
    },
    {
        title: 'Recomendation Variation',
        href: '/recomendation/variation',
        icon: FileText,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
