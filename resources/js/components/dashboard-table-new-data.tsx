import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Eye, MoreHorizontal, User } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';

/* ── Data shape ──────────────────────────────────────────────────────── */
interface LatestPostpartumItem {
    id: number;
    number_patient: string;
    name: string;
    date_filled: string;
    risk: string;
}

interface DashboardTableNewDataProps {
    latest_data: LatestPostpartumItem[];
}

/* ── Risk config ─────────────────────────────────────────────────────── */
interface RiskConfig {
    dot: string;
    badge: string;
    label: string;
}

function getRiskConfig(risk: string): RiskConfig {
    const lower = risk.toLowerCase();

    if (lower.includes('high'))
        return {
            dot: 'bg-rose-500',
            badge: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/30',
            label: 'Risiko Tinggi',
        };

    if (lower.includes('low'))
        return {
            dot: 'bg-amber-500',
            badge: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/30',
            label: 'Risiko Rendah',
        };

    if (lower.includes('normal'))
        return {
            dot: 'bg-emerald-500',
            badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/30',
            label: 'Normal',
        };

    return {
        dot: 'bg-muted-foreground/40',
        badge: 'bg-muted text-muted-foreground ring-border',
        label: risk,
    };
}

/* ── Status Badge with dot indicator ────────────────────────────────── */
function RiskBadge({ risk }: { risk: string }) {
    const cfg = getRiskConfig(risk);
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5',
                'text-[11px] font-semibold ring-1 ring-inset',
                cfg.badge,
            )}
        >
            <span
                className={cn('size-1.5 rounded-full', cfg.dot)}
                aria-hidden="true"
            />
            {cfg.label}
        </span>
    );
}

/* ── Action buttons ──────────────────────────────────────────────────── */
function DesktopActions({ id }: { id: number }) {
    return (
        /* Ghost icon-only buttons — visible md+ */
        <div className="hidden items-center justify-end gap-0.5 md:flex">
            <Link
                href={route('postpartum.show', id)}
                className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg',
                    'text-muted-foreground transition-colors',
                    'hover:bg-primary/10 hover:text-primary',
                )}
                title="Lihat detail"
            >
                <Eye className="size-[14px]" />
            </Link>
        </div>
    );
}

function MobileActions({ id }: { id: number }) {
    return (
        /* Three-dot dropdown — visible below md */
        <div className="flex items-center justify-end md:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-lg',
                            'text-muted-foreground transition-colors',
                            'hover:bg-primary/10 hover:text-primary',
                        )}
                        aria-label="Aksi"
                    >
                        <MoreHorizontal className="size-[14px]" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-40 rounded-xl text-sm"
                >
                    <DropdownMenuItem asChild>
                        <Link
                            href={route('postpartum.show', id)}
                            className="flex items-center gap-2"
                        >
                            <Eye className="size-3.5 text-muted-foreground" />
                            Lihat Detail
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

/* ── Mobile compact card ─────────────────────────────────────────────── */
function MobileCard({ item }: { item: LatestPostpartumItem }) {
    const cfg = getRiskConfig(item.risk);
    return (
        <div className="flex flex-col gap-2 border-b border-border/60 px-4 py-3 last:border-0">
            {/* Card header row: name + three-dot menu */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <span
                        className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-full',
                            'bg-primary/10 text-primary',
                        )}
                    >
                        <User className="size-3.5" />
                    </span>
                    <span className="min-w-0 truncate text-[13px] font-semibold text-foreground">
                        {item.name}
                    </span>
                </div>
                <MobileActions id={item.id} />
            </div>

            {/* 2-column metric grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-9">
                <div>
                    <p className="text-[10px] font-medium tracking-wider text-muted-foreground/60 uppercase">
                        No. Pasien
                    </p>
                    <p className="font-mono text-[12px] font-medium text-foreground">
                        {item.number_patient}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] font-medium tracking-wider text-muted-foreground/60 uppercase">
                        Tanggal
                    </p>
                    <p className="text-[12px] text-foreground">
                        {item.date_filled}
                    </p>
                </div>
                <div className="col-span-2 mt-0.5">
                    <RiskBadge risk={item.risk} />
                </div>
            </div>
        </div>
    );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function DashboardTableNewData({
    latest_data,
}: DashboardTableNewDataProps) {
    const isEmpty = latest_data.length === 0;

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="border-b border-border/60 px-4 py-3 md:px-5">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-semibold">
                            Data Terbaru
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-[11px]">
                            {latest_data.length} entri skrining postpartum
                            terkini
                        </CardDescription>
                    </div>
                    <Link
                        href={route('postpartum')}
                        className="text-[11px] font-medium text-primary hover:underline"
                    >
                        Lihat semua →
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isEmpty ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                        Belum ada data skrining.
                    </p>
                ) : (
                    <>
                        {/* ── Desktop Table (md+) ───────────────────────── */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-primary/[0.03]">
                                        <TableHead className="w-[150px] py-2 pl-5 text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                            No. Pasien
                                        </TableHead>
                                        <TableHead className="py-2 text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                            Nama
                                        </TableHead>
                                        <TableHead className="py-2 text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                            Tanggal Diisi
                                        </TableHead>
                                        <TableHead className="py-2 text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-[60px] py-2 pr-4 text-right text-[11px] font-semibold tracking-wider text-primary/70 uppercase">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {latest_data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="group transition-colors hover:bg-primary/5"
                                        >
                                            <TableCell className="py-2 pl-5">
                                                <span className="font-mono text-[13px] font-medium text-foreground">
                                                    {item.number_patient}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <span className="text-[13px] font-medium text-foreground">
                                                    {item.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <span className="text-[13px] text-muted-foreground">
                                                    {item.date_filled}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-2">
                                                <RiskBadge risk={item.risk} />
                                            </TableCell>
                                            <TableCell className="py-2 pr-4">
                                                <DesktopActions id={item.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* ── Mobile Cards (< md) ───────────────────────── */}
                        <div className="md:hidden">
                            {latest_data.map((item) => (
                                <MobileCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
