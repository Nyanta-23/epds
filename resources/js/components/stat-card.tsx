import { cn } from '@/lib/utils';
import {
    Activity,
    AlertTriangle,
    LucideIcon,
    ScanHeart,
    TrendingUp,
    Users,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────────────── */
export interface StatCardData {
    key: string;
    label: string;
    value: number;
    /** 7-point daily trend array, used to draw the sparkline */
    trend: number[];
    icon: 'users' | 'scan-heart' | 'activity' | 'alert-triangle';
}

interface StatCardProps {
    stat: StatCardData;
    className?: string;
}

/* ── Icon map ────────────────────────────────────────────────────────────── */
const ICON_MAP: Record<StatCardData['icon'], LucideIcon> = {
    users: Users,
    'scan-heart': ScanHeart,
    activity: Activity,
    'alert-triangle': AlertTriangle,
};

/* ── Colour map: per-card accent colours ────────────────────────────────── */
const ACCENT: Record<
    StatCardData['icon'],
    { icon: string; sparkStroke: string; badge: string }
> = {
    users: {
        icon: 'bg-primary text-primary-foreground',
        sparkStroke: 'stroke-primary',
        badge: 'text-primary',
    },
    'scan-heart': {
        icon: 'bg-violet-500 text-white',
        sparkStroke: 'stroke-violet-500',
        badge: 'text-violet-600',
    },
    activity: {
        icon: 'bg-emerald-500 text-white',
        sparkStroke: 'stroke-emerald-500',
        badge: 'text-emerald-600',
    },
    'alert-triangle': {
        icon: 'bg-amber-500 text-white',
        sparkStroke: 'stroke-amber-500',
        badge: 'text-amber-600',
    },
};

/* ── Sparkline SVG ──────────────────────────────────────────────────────── */
function Sparkline({
    data,
    strokeClass,
}: {
    data: number[];
    strokeClass: string;
}) {
    if (!data || data.length < 2) return null;

    const W = 80;
    const H = 28;
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const range = max - min || 1;

    /* Map each point to an SVG coordinate */
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / range) * (H - 4) - 2;
        return [x, y] as [number, number];
    });

    /* Build a smooth polyline path using cardinal-spline-like control points */
    const d = pts
        .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
        .join(' ');

    /* Area fill path — close back to baseline */
    const fillD = d + ` L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            className="overflow-visible"
            aria-hidden="true"
        >
            {/* Translucent area under the line */}
            <path
                d={fillD}
                className={cn(strokeClass, 'fill-current opacity-10')}
                strokeWidth="0"
            />
            {/* The sparkline itself */}
            <path
                d={d}
                fill="none"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(strokeClass, 'drop-shadow-sm')}
            />
            {/* Dot on the last data point */}
            <circle
                cx={pts[pts.length - 1][0]}
                cy={pts[pts.length - 1][1]}
                r="2.5"
                className={cn(strokeClass, 'fill-current')}
            />
        </svg>
    );
}

/* ── Trend badge ─────────────────────────────────────────────────────────── */
function TrendBadge({
    trend,
    colorClass,
}: {
    trend: number[];
    colorClass: string;
}) {
    if (!trend || trend.length < 2) return null;
    const last = trend[trend.length - 1];
    const prev = trend[trend.length - 2];
    const delta = last - prev;
    if (delta === 0) return null;

    return (
        <span
            className={cn(
                'flex items-center gap-0.5 text-[10px] font-semibold',
                colorClass,
            )}
        >
            <TrendingUp
                className={cn(
                    'size-3 transition-transform',
                    delta < 0 && 'rotate-180',
                )}
            />
            {Math.abs(delta)}
        </span>
    );
}

/* ── StatCard ────────────────────────────────────────────────────────────── */
export default function StatCard({ stat, className }: StatCardProps) {
    const Icon = ICON_MAP[stat.icon];
    const accent = ACCENT[stat.icon];

    return (
        <article
            className={cn(
                /*
                 * Soft pink→white gradient background.
                 * Glass overlay via bg-white/80 + backdrop-blur
                 * (the pink gradient sits behind via before:pseudo).
                 */
                'group relative overflow-hidden rounded-2xl border border-pink-100/70',
                'bg-gradient-to-br from-white via-white to-pink-50/60',
                'p-3 shadow-sm',
                'dark:border-pink-900/20 dark:from-background dark:via-background dark:to-pink-950/20',
                /* Tactile lift on hover */
                'transition-all duration-200 ease-out',
                'hover:scale-[1.03] hover:shadow-md hover:shadow-pink-500/10',
                className,
            )}
        >
            {/* ── Top row: icon + trend badge ────────────────────────── */}
            <div className="mb-2 flex items-start justify-between">
                {/* Icon badge */}
                <div
                    className={cn(
                        'flex size-8 items-center justify-center rounded-xl shadow-sm',
                        accent.icon,
                    )}
                >
                    <Icon className="size-4" strokeWidth={2} />
                </div>

                {/* Trend badge (last-day delta) */}
                <TrendBadge trend={stat.trend} colorClass={accent.badge} />
            </div>

            {/* ── Main number ───────────────────────────────────────── */}
            <p
                className="mb-0.5 text-xl leading-none font-extrabold tracking-tight text-foreground"
                aria-label={`${stat.label}: ${stat.value}`}
            >
                {stat.value.toLocaleString('id-ID')}
            </p>

            {/* ── Label ─────────────────────────────────────────────── */}
            <p className="text-[10px] font-medium tracking-widest text-muted-foreground/70 uppercase">
                {stat.label}
            </p>

            {/* ── Sparkline — bottom-right ───────────────────────────── */}
            <div className="absolute right-2 bottom-2 opacity-70 transition-opacity duration-200 group-hover:opacity-100">
                <Sparkline data={stat.trend} strokeClass={accent.sparkStroke} />
            </div>

            {/* ── Subtle decorative blob ─────────────────────────────── */}
            <div
                className="pointer-events-none absolute -top-4 -right-4 size-20 rounded-full bg-primary/5 blur-2xl"
                aria-hidden="true"
            />
        </article>
    );
}
