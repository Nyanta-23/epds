import ChartLineScreening from '@/components/chart-line-screening';
import ChartPieFollowUp from '@/components/chart-pie-followup';
import ChartPieRisk from '@/components/chart-pie-risk';
import DashboardFilter, {
    type DashboardFilters,
} from '@/components/dashboard-filter';
import DashboardStats from '@/components/dashboard-stats';
import DashboardTableNewData from '@/components/dashboard-table-new-data';
import { type StatCardData } from '@/components/stat-card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

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
}

export default function Dashboard({
    screenings,
    followups,
    risk_distributions,
    latest_postpartum_datas,
    stats,
    filters,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-3 overflow-x-auto p-3 md:p-0">
                {/* ── Filter bar ──────────────────────────────────────── */}
                <DashboardFilter filters={filters} />

                {/* ── Stat cards row ──────────────────────────────────── */}
                <DashboardStats stats={stats} />
                {/* ── Full-width latest data table ─────────────────────── */}
                <DashboardTableNewData latest_data={latest_postpartum_datas} />
                {/* ── Charts row (2 pie charts only) ─────────────────── */}
                <div className="grid auto-rows-min gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartPieRisk
                            risk_distributions={risk_distributions}
                            filters={filters}
                        />
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartPieFollowUp followups={followups} />
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
