import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
                console.warn('URL parse error, using raw:', targetUrl);
            }
        }
        router.post(
            route('notifications.read', id),
            { url: targetUrl },
            { preserveScroll: true },
        );
    };

    const handleMarkAllRead = () => {
        router.post(
            route('notifications.readAll'),
            {},
            { preserveScroll: true },
        );
    };

    const getIcon = (type: string, iconName?: string): ReactNode => {
        if (type === 'danger')
            return <AlertTriangle className="h-5 w-5 text-rose-600" />;
        if (type === 'warning' || iconName === 'calendar')
            return <Calendar className="h-5 w-5 text-violet-600" />;
        return <Info className="h-5 w-5 text-primary" />;
    };

    const getIconBg = (type: string, iconName?: string) => {
        if (type === 'danger') return 'bg-rose-100';
        if (type === 'warning' || iconName === 'calendar')
            return 'bg-violet-100';
        return 'bg-primary/10';
    };

    const unreadCount = notifications.data.filter((n) => !n.read_at).length;

    return (
        <AppLayout>
            <Head title="Riwayat Notifikasi" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* ── Page header ──────────────────────────────────── */}
                    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
                                <Bell className="h-5 w-5 text-primary" />
                                Riwayat Notifikasi
                            </h1>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {notifications.total > 0
                                    ? `${notifications.from}–${notifications.to} dari ${notifications.total} notifikasi`
                                    : 'Belum ada notifikasi'}
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 self-start"
                                    >
                                        <CheckCheck className="h-4 w-4 text-primary" />
                                        Tandai Semua Dibaca
                                        <Badge
                                            variant="secondary"
                                            className="ml-0.5 bg-primary/10 text-primary"
                                        >
                                            {unreadCount}
                                        </Badge>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Tandai semua sebagai dibaca?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Semua <strong>{unreadCount}</strong>{' '}
                                            notifikasi yang belum dibaca akan
                                            ditandai sebagai sudah dibaca.
                                            Tindakan ini tidak dapat dibatalkan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleMarkAllRead}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            Ya, tandai semua
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>

                    {/* ── Notification list ─────────────────────────────── */}
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        {notifications.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="mb-4 rounded-full bg-muted p-5">
                                    <Bell className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">
                                    Belum ada notifikasi
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Semua aktivitas penting akan muncul di sini.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-border">
                                {notifications.data.map((notif) => (
                                    <li
                                        key={notif.id}
                                        onClick={() =>
                                            handleRead(
                                                notif.id,
                                                notif.action_url,
                                            )
                                        }
                                        className={`group relative flex cursor-pointer gap-4 px-5 py-4 transition-colors hover:bg-accent/50 ${!notif.read_at ? 'border-l-4 border-l-primary bg-primary/[0.03]' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`mt-0.5 shrink-0 rounded-full p-2.5 ${getIconBg(notif.type, notif.icon)}`}
                                        >
                                            {getIcon(notif.type, notif.icon)}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <p
                                                    className={`text-sm leading-snug ${!notif.read_at ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}
                                                >
                                                    {notif.title}
                                                </p>
                                                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground/70">
                                                    <Clock className="h-3 w-3" />
                                                    {notif.created_at_human}
                                                </span>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                {notif.body}
                                            </p>
                                            <p className="mt-2 font-mono text-[10px] text-muted-foreground/50">
                                                {notif.created_at}
                                            </p>
                                        </div>

                                        {/* Unread dot */}
                                        {!notif.read_at && (
                                            <div className="absolute top-1/2 right-5 -translate-y-1/2">
                                                <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm ring-2 ring-background" />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* ── Pagination ───────────────────────────────────── */}
                    {notifications.last_page > 1 && (
                        <>
                            <Separator className="my-4" />
                            <div className="flex flex-wrap justify-center gap-1.5">
                                {notifications.links.map((link, index) => {
                                    const label = link.label
                                        .replace('&laquo;', '«')
                                        .replace('&raquo;', '»');
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
                                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
