import StatCard, { type StatCardData } from '@/components/stat-card';

interface DashboardStatsProps {
    stats: StatCardData[];
}

/**
 * 4-column stat-card grid.
 *   • 2 columns on mobile (edge-to-edge, no extra padding needed)
 *   • 4 columns from md upward
 */
export default function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {stats.map((stat) => (
                <StatCard key={stat.key} stat={stat} />
            ))}
        </div>
    );
}
