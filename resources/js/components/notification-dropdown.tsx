import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { requestFcmPermission } from '@/hooks/use-fcm';
import { PageProps } from '@inertiajs/core';
import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    BellOff,
    Calendar,
    CheckCheck,
    Info,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    user: { id: string; name: string; email: string };
    notifications: NotificationItem[];
    unreadCount: number;
}

interface SharedProps extends PageProps {
    auth: AuthProps;
}

/* ── tiny Web Audio beep — no external file needed ─────────────────── */
function playNotificationSound() {
    try {
        const ctx = new AudioContext();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(880, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.4);
    } catch (_) {
        /* silently ignore if AudioContext not available */
    }
}

function NotifIcon({ type, icon }: { type: string; icon?: string }) {
    if (type === 'danger')
        return <AlertTriangle size={15} className="text-rose-600" />;
    if (icon === 'calendar' || type === 'warning')
        return <Calendar size={15} className="text-violet-600" />;
    return <Info size={15} className="text-primary" />;
}

function notifIconBg(type: string, icon?: string) {
    if (type === 'danger') return 'bg-rose-100';
    if (type === 'warning' || icon === 'calendar') return 'bg-violet-100';
    return 'bg-primary/10';
}

export default function NotificationDropdown() {
    const { auth } = usePage<SharedProps>().props;
    const [open, setOpen] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const prevUnread = useRef(auth.unreadCount);

    /* ── Poll every 30s ─────────────────────────────────────────────── */
    useEffect(() => {
        const id = setInterval(() => router.reload({ only: ['auth'] }), 30_000);
        return () => clearInterval(id);
    }, []);

    /* ── Sound + reload on foreground FCM push ──────────────────────── */
    useEffect(() => {
        const handler = () => {
            playNotificationSound();
            router.reload({ only: ['auth'] });
        };
        window.addEventListener('fcm:foreground', handler);
        return () => window.removeEventListener('fcm:foreground', handler);
    }, []);

    /* ── Sound when unread count grows (e.g. from polling) ─────────── */
    useEffect(() => {
        if (auth.unreadCount > prevUnread.current) {
            playNotificationSound();
        }
        prevUnread.current = auth.unreadCount;
    }, [auth.unreadCount]);

    /* ── Bell click: request FCM permission ─────────────────────────── */
    const handleBellClick = async () => {
        const perm =
            'Notification' in window ? Notification.permission : 'denied';
        if (perm === 'denied') {
            setBlocked(true);
            return;
        }
        setBlocked(false);
        await requestFcmPermission();
    };

    const markAsRead = (id: string, url?: string) => {
        router.post(
            route('notifications.read', id),
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
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={handleBellClick}
                >
                    <Bell size={20} />
                    {auth.unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] leading-none font-bold text-white ring-2 ring-background">
                            {auth.unreadCount > 99 ? '99+' : auth.unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={8}
                className="flex max-h-[500px] w-80 flex-col p-0 shadow-lg"
            >
                {/* ── Header ─────────────────────────────────────────── */}
                <div className="flex flex-shrink-0 items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Bell size={15} className="text-primary" />
                        <span className="text-sm font-semibold">
                            Notifikasi
                        </span>
                        {auth.unreadCount > 0 && (
                            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                {auth.unreadCount}
                            </span>
                        )}
                    </div>
                    {auth.unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-primary"
                            onClick={markAllRead}
                        >
                            <CheckCheck size={13} />
                            Baca semua
                        </Button>
                    )}
                </div>

                <Separator className="flex-shrink-0" />

                {/* ── Push blocked warning ────────────────────────────── */}
                {blocked && (
                    <>
                        <div className="flex flex-shrink-0 items-start gap-2.5 bg-amber-50 px-4 py-3">
                            <BellOff
                                size={15}
                                className="mt-0.5 shrink-0 text-amber-600"
                            />
                            <p className="text-xs leading-relaxed text-amber-800">
                                Notifikasi push <strong>diblokir</strong>{' '}
                                browser. Buka Pengaturan Situs → Notifikasi →
                                ubah ke <em>Izinkan</em>, lalu muat ulang.
                            </p>
                        </div>
                        <Separator className="flex-shrink-0" />
                    </>
                )}

                {/* ── List ─────────────────────────────────────────────── */}
                <ScrollArea className="flex-1 overflow-hidden">
                    {auth.notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Bell
                                    size={20}
                                    className="text-muted-foreground/50"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Tidak ada notifikasi baru
                            </p>
                        </div>
                    ) : (
                        auth.notifications.map((notif, i) => (
                            <div key={notif.id} className="min-w-0">
                                <button
                                    onClick={() =>
                                        markAsRead(
                                            notif.id,
                                            notif.data.action_url,
                                        )
                                    }
                                    className={`relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/60 ${!notif.read_at ? 'bg-primary/5' : ''}`}
                                >
                                    {/* unread bar */}
                                    {!notif.read_at && (
                                        <span className="absolute top-0 bottom-0 left-0 w-0.5 flex-shrink-0 rounded-r bg-primary" />
                                    )}

                                    {/* icon */}
                                    <div
                                        className={`mt-0.5 shrink-0 rounded-full p-1.5 ${notifIconBg(notif.data.type, notif.data.icon)}`}
                                    >
                                        <NotifIcon
                                            type={notif.data.type}
                                            icon={notif.data.icon}
                                        />
                                    </div>

                                    {/* text */}
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`text-sm leading-snug break-words ${!notif.read_at ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}
                                        >
                                            {notif.data.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-3 text-xs break-words text-muted-foreground">
                                            {notif.data.body}
                                        </p>
                                        <p className="mt-1.5 flex-shrink-0 font-mono text-[10px] text-muted-foreground/60">
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

                                    {/* unread dot */}
                                    {!notif.read_at && (
                                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                    )}
                                </button>
                                {i < auth.notifications.length - 1 && (
                                    <Separator className="mx-4 w-auto flex-shrink-0" />
                                )}
                            </div>
                        ))
                    )}
                </ScrollArea>

                {/* ── Footer ───────────────────────────────────────────── */}
                <Separator className="flex-shrink-0" />
                <div className="flex-shrink-0 px-4 py-2.5">
                    <Link
                        href="/notifications"
                        className="block w-full rounded-md py-1.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                        onClick={() => setOpen(false)}
                    >
                        Lihat semua riwayat →
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
