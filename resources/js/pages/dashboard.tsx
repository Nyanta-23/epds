
import ChartLineScreening from '@/components/chart-line-screening';
import ChartPieFollowUp from '@/components/chart-pie-followup';
import ChartPieRisk from '@/components/chart-pie-risk';
import DashboardTableNewData from '@/components/dashboard-table-new-data';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
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


interface DashboardProps {
    screenings: any;
    followups: any;
    risk_distributions: any;
    latest_postpartum_datas: any;
}

export default function Dashboard({ screenings, followups, risk_distributions, latest_postpartum_datas }: DashboardProps) {

    console.log(latest_postpartum_datas);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <ChartPieRisk risk_distributions={risk_distributions} />
                    </div>
                    <div className="relative aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ChartPieFollowUp followups={followups} />
                    </div>
                    <div className="relative aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        <DashboardTableNewData latest_data={latest_postpartum_datas} />
                    </div>
                </div>
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
