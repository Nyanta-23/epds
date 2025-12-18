import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    Calendar,
    CheckCheck,
    Clock,
    Info,
} from 'lucide-react';
import { ReactNode } from 'react';

interface NotificationData {
    id: string;
    title: string;
    body: string;
    action_url: string | null;
    type: 'danger' | 'warning' | 'info' | string;
    icon?: string;
    created_at_human: string;
    created_at: string;
    read_at: string | null;
}

interface NotificationItem {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at_human: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData {
    data: NotificationData[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

interface PageProps {
    auth: { user: any };
    notifications: PaginationData;
}

export default function NotificationIndex({ auth, notifications }: PageProps) {
    const handleRead = (id: string, url: string | null) => {
      let targetUrl = url;
        
        if (targetUrl) {
            try {
                if (targetUrl.startsWith('http')) {
                    const urlObj = new URL(targetUrl);
                    targetUrl = urlObj.pathname + urlObj.search;
                }
            } catch (e) {
                console.warn("URL parse error, using raw:", targetUrl);
            }
        }
        router.post(
            route('notifications.read', id),
            { url: targetUrl },
            {
                preserveScroll: true,
            },
        );
    };

    const handleMarkAllRead = () => {
        if (confirm('Tandai semua notifikasi sebagai sudah dibaca?')) {
            router.post(
                route('notifications.readAll'),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {},
                },
            );
        }
    };

    const getIcon = (type: string, iconName?: string): ReactNode => {
        if (type === 'danger')
            return <AlertTriangle className="h-6 w-6 text-red-600" />;
        if (type === 'warning')
            return <Calendar className="h-6 w-6 text-orange-600" />;
        if (iconName === 'calendar')
            return <Calendar className="h-6 w-6 text-purple-600" />;
        return <Info className="h-6 w-6 text-blue-600" />;
    };

    const getIconBg = (type: string) => {
        if (type === 'danger') return 'bg-red-100';
        if (type === 'warning') return 'bg-orange-100';
        return 'bg-blue-100';
    };

    return (
        <AppLayout>
            <Head title="Semua Notifikasi" />

            <div className="py-3">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* CARD CONTAINER */}
                    <div className="overflow-hidden border border-gray-200 bg-white shadow-sm sm:rounded-lg">
                        {/* HEADER TOOLBAR */}
                        <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 bg-gray-50 px-6 py-5 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <Bell className="h-5 w-5 text-gray-500" />
                                    Riwayat Notifikasi
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Menampilkan {notifications.from}-
                                    {notifications.to} dari total{' '}
                                    {notifications.total} notifikasi.
                                </p>
                            </div>

                            {notifications.total > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase shadow-sm transition duration-150 ease-in-out hover:bg-gray-100 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                >
                                    <CheckCheck className="mr-2 h-4 w-4 text-green-600" />
                                    Tandai Semua Dibaca
                                </button>
                            )}
                        </div>

                        {/* NOTIFICATION LIST */}
                        <div className="divide-y divide-gray-100">
                            {notifications.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-16 text-center text-gray-400">
                                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                                        <Bell className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Belum ada notifikasi
                                    </h3>
                                    <p className="mt-1">
                                        Semua aktivitas penting akan muncul di
                                        sini.
                                    </p>
                                </div>
                            ) : (
                                notifications.data.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() =>
                                            handleRead(
                                                notif.id,
                                                notif.action_url,
                                            )
                                        }
                                        className={`group relative flex cursor-pointer gap-4 p-6 transition-all duration-200 hover:bg-gray-50 ${
                                            !notif.read_at
                                                ? 'border-l-4 border-l-blue-500 bg-blue-50/40'
                                                : 'border-l-4 border-l-transparent bg-white'
                                        }`}
                                    >
                                        {/* ICON BADGE */}
                                        <div
                                            className={`flex-shrink-0 rounded-full p-3 ${getIconBg(notif.type)}`}
                                        >
                                            {getIcon(notif.type, notif.icon)}
                                        </div>

                                        {/* TEXT CONTENT */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p
                                                    className={`text-sm ${!notif.read_at ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}
                                                >
                                                    {notif.title}
                                                </p>
                                                <span className="flex items-center text-xs whitespace-nowrap text-gray-400">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {notif.created_at_human}
                                                </span>
                                            </div>

                                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                                                {notif.body}
                                            </p>

                                            <p className="mt-2 font-mono text-xs text-gray-400">
                                                {notif.created_at}
                                            </p>
                                        </div>

                                        {/* UNREAD INDICATOR */}
                                        {!notif.read_at && (
                                            <div className="absolute top-1/2 right-4 -translate-y-1/2">
                                                <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm ring-2 ring-white"></div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* PAGINATION FOOTER */}
                        {notifications.last_page > 1 && (
                            <div className="flex items-center justify-center border-t border-gray-200 bg-gray-50 px-6 py-4">
                                <div className="flex flex-wrap justify-center gap-1">
                                    {notifications.links.map((link, index) => {
                                        const label = link.label
                                            .replace('&laquo;', '«')
                                            .replace('&raquo;', '»');
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveScroll
                                                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                                                    link.active
                                                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''} `}
                                            >
                                                {label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
      
                    
                </div>
            </div>
        </AppLayout>
    );
}
