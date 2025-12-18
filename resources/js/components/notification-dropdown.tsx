import { PageProps } from '@inertiajs/core';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Calendar, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotificationData {
    title: string;
    body: string;
    action_url: string;
    type: 'danger' | 'info' | string;
    icon?: string; 
}

interface NotificationItem {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
    notifications: NotificationItem[];
    unreadCount: number;
}

interface SharedProps extends PageProps {
    auth: AuthProps;
}

export default function NotificationDropdown() {
    const { auth } = usePage<SharedProps>().props;
    const [isOpen, setIsOpen] = useState<boolean>(false);


    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['auth'] });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = (id: string, url?: string) => {
        const endpoint = route('notifications.read', id);

        router.post(
            endpoint,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (url) window.location.href = url;
                },
            },
        );
    };

    const markAllRead = () => {
        router.post(
            route('notifications.readAll'),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100 focus:ring-2 focus:ring-pink-300 focus:outline-none"
            >
                <Bell size={24} />
                {auth.unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex translate-x-1/4 -translate-y-1/4 transform animate-pulse items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs leading-none font-bold text-red-100">
                        {auth.unreadCount > 99 ? '99+' : auth.unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl ring-1 ring-black ring-opacity-5">
                        <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
                            <span className="text-sm font-semibold text-gray-700">
                                Notifikasi
                            </span>
                            {auth.unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>

                        <div className="scrollbar-thin scrollbar-thumb-gray-200 max-h-96 overflow-y-auto">
                            {auth.notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                                    <Bell
                                        size={32}
                                        className="mb-2 opacity-20"
                                    />
                                    <span className="text-sm">
                                        Tidak ada notifikasi baru.
                                    </span>
                                </div>
                            ) : (
                                auth.notifications.map((notif) => {
                                    let IconComponent = CheckCircle;
                                    let iconColorClass = "text-blue-600";
                                    let bgIconClass = "bg-blue-100";

                                    if (notif.data.type === 'danger') {
                                        IconComponent = AlertTriangle;
                                        iconColorClass = "text-red-600";
                                        bgIconClass = "bg-red-100";
                                    } 
                                    else if (notif.data.icon === 'calendar') {
                                        IconComponent = Calendar;
                                        iconColorClass = "text-purple-600";
                                        bgIconClass = "bg-purple-100";
                                    }
                                    else {
                                        IconComponent = Info;
                                    }

                                    return (
                                        <div
                                            key={notif.id}
                                            onClick={() =>
                                                markAsRead(
                                                    notif.id,
                                                    notif.data.action_url,
                                                )
                                            }
                                            className={`flex cursor-pointer items-start gap-3 border-b p-4 transition-colors duration-200 hover:bg-gray-50 ${
                                                notif.read_at
                                                    ? 'bg-white opacity-60'
                                                    : 'bg-blue-50/10'
                                            }`}
                                        >
                                            <div className={`flex-shrink-0 rounded-full p-2 ${bgIconClass}`}>
                                                <IconComponent size={16} className={iconColorClass} />
                                            </div>

                                            <div className="flex-1">
                                                <p
                                                    className={`text-sm ${!notif.read_at ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}
                                                >
                                                    {notif.data.title}
                                                </p>
                                                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                                    {notif.data.body}
                                                </p>
                                                <p className="mt-2 font-mono text-[10px] text-gray-400">
                                                    {new Date(
                                                        notif.created_at,
                                                    ).toLocaleString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            
                                            {!notif.read_at && (
                                                <div className="mt-2 h-2 w-2 rounded-full bg-blue-600"></div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="border-t bg-gray-50 px-4 py-2 text-center">
                            <Link
                                href="/notifications"
                                className="block w-full py-1 text-xs font-medium text-gray-600 hover:text-gray-900"
                            >
                                Lihat Semua Riwayat
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}