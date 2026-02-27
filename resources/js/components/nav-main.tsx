import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn, resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-1">
            <SidebarGroupLabel className="mb-1 px-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground/50 uppercase">
                Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    /*
                                     * Base: pill shape, smooth transition.
                                     * h-9 on desktop, min-h-[44px] on touch
                                     * devices for accessibility compliance.
                                     * The `nav-glow` class adds pink drop-shadow on hover.
                                     */
                                    'group h-9 min-h-[44px] rounded-xl px-3 text-sm font-medium',
                                    'transition-all duration-200 ease-out',
                                    'md:min-h-0',
                                    isActive
                                        ? [
                                              // Solid pink pill when active
                                              'bg-primary text-primary-foreground',

                                              'hover:bg-primary/90 hover:text-primary-foreground',
                                              'hover:shadow-pink-500/35',
                                          ]
                                        : [
                                              // Transparent → pink tint on hover
                                              'text-sidebar-foreground/80',
                                              'hover:bg-primary/8 hover:text-primary',
                                          ],
                                )}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <item.icon
                                            className={cn(
                                                'mr-2 size-[15px] shrink-0 transition-transform duration-200',
                                                'group-hover:scale-110',
                                                isActive
                                                    ? 'text-primary-foreground'
                                                    : 'text-muted-foreground group-hover:text-primary',
                                            )}
                                        />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
