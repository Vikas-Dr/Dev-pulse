import { useDashboardStats } from "../hooks/useProjects";

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: string;
}

function StatCard({ label, value, accent = "text-text-primary" }: StatCardProps) {
  return (
    <div
      className="card px-4 sm:px-5 py-4 flex flex-col gap-0.5 min-w-[120px] flex-1 sm:flex-none
        hover:border-pulse-green/20 transition-all duration-200
        active:scale-[0.98] cursor-default stat-enter"
    >
      <span className={`text-xl sm:text-2xl font-mono font-semibold truncate ${accent}`}>
        {value}
      </span>
      <span className="text-[11px] sm:text-xs text-text-secondary font-medium truncate">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex gap-3 sm:gap-4 flex-wrap">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="card px-5 py-4 min-w-[120px] flex-1 sm:flex-none animate-pulse"
          >
            <div className="h-6 sm:h-7 w-16 bg-surface-border/50 rounded mb-2" />
            <div className="h-3 w-20 bg-surface-border/30 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card px-5 py-4">
        <p className="text-text-secondary text-sm">
          Could not load dashboard stats
        </p>
      </div>
    );
  }

  const lastScanLabel = data.lastScanTime
    ? new Date(data.lastScanTime).toLocaleString()
    : "Never";

  return (
    <div className="flex gap-3 sm:gap-4 flex-wrap">
      <StatCard
        label="Total Projects"
        value={data.totalProjects}
      />
      <StatCard
        label="Critical"
        value={data.criticalCount}
        accent="text-pulse-red"
      />
      <StatCard
        label="High"
        value={data.highCount}
        accent="text-orange-400"
      />
      <StatCard
        label="Healthy"
        value={data.healthyProjects}
        accent="text-pulse-green"
      />
      <StatCard
        label="Last Scan"
        value={lastScanLabel}
      />
    </div>
  );
}
