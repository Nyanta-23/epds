import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    // two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface FlashProps {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}


export interface Meta {
    path: string;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    per_page: number;
    total: number;
    links: MetaLink[];
}

export interface Link {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
}

export interface MetaLink {
    active: boolean;
    label?: string;
    page?: number;
    url?: string;
}

export interface PageProp {
    page: string;
    filter: Filter;
}

export interface Filter {
    search?: string | null;
    only_trash?: boolean | null;
    filter_list?: FilterList;
}

export interface FilterList {
    select_filter?: SelectFilter;
    checkbox_filter?: ChecbockFilter;
    [key: string]: any;
}

export interface SelectFilter {
    role?: string | null;
    [key: string]: any | undefined;
}

export interface ChecbockFilter {
    [key: string]: any;
}

export type Extra<T = any> = Record<string, { data: T[] }>;


// export interface DataTemplate {
//     meta: Meta;
//     data: Data;
// }

// export interface Meta {
//     pagination: Pagination;
// }

// export interface Data {
//     extraData: ExtraData;
//     pageProp: PageProp;

//     [key: string]: any;
// }

// export interface ExtraData {

// }

// export interface PageProp {

// }


enum MarriedStatus {
    Married = "married",
    Not_Married = "not_married",
    Divorced = "divorced"
}