import ChartLineScreening from '@/components/chart-line-screening';
import ChartPieFollowUp from '@/components/chart-pie-followup';
import ChartPieRisk from '@/components/chart-pie-risk';
import DashboardFilter, {
    type DashboardFilters,
} from '@/components/dashboard-filter';
import DashboardStats from '@/components/dashboard-stats';
import DashboardTableNewData from '@/components/dashboard-table-new-data';
import { type StatCardData } from '@/components/stat-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface LatestPostpartumItem {
    id: number;
    number_patient: string;
    name: string;
    date_filled: string;
    risk: string;
}

interface DashboardProps {
    screenings: any;
    followups: any;
    risk_distributions: any;
    latest_postpartum_datas: LatestPostpartumItem[];
    stats: StatCardData[];
    filters: DashboardFilters;
    unreadNotifications?: number;
}

export default function Dashboard({
    screenings,
    followups,
    risk_distributions,
    latest_postpartum_datas,
    stats,
    filters,
    unreadNotifications = 0,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-3 overflow-x-auto p-3 md:p-0">
                {/* ── Unread Notifications Alert ──────────────────────── */}
                {unreadNotifications > 0 && (
                    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
                        <Bell className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-900 dark:text-amber-100">
                            Notifikasi Pengingat EPDS
                        </AlertTitle>
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                            Anda memiliki {unreadNotifications} notifikasi
                            jadwal pengisian kuesioner EPDS yang terlewat.
                            <Link href={route('notifications.index')}>
                                <Button
                                    variant="link"
                                    className="h-auto p-0 pl-2 text-amber-700 underline dark:text-amber-300"
                                >
                                    Lihat detail
                                </Button>
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}

                {/* ── Filter bar ──────────────────────────────────────── */}
                <DashboardFilter filters={filters} />

                {/* ── Stat cards row ──────────────────────────────────── */}
                <DashboardStats stats={stats} />
                {/* ── Full-width latest data table ─────────────────────── */}
                <DashboardTableNewData latest_data={latest_postpartum_datas} />
                {/* ── Charts row (2 pie charts only) ─────────────────── */}
                <div className="grid auto-rows-min gap-3 md:grid-cols-2">
                    <div className="relative aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartPieRisk
                            risk_distributions={risk_distributions}
                            filters={filters}
                        />
                    </div>
                    <div className="relative aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartPieFollowUp
                            followups={followups}
                            filters={filters}
                        />
                    </div>
                </div>

                {/* ── Area chart ──────────────────────────────────────── */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <ChartLineScreening
                        screening_days={screenings.screening_days}
                        screening_months={screenings.screening_months}
                        screening_weeks={screenings.screening_weeks}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
