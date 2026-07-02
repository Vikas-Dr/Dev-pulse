interface ScanSummary {
  id: string;
  scannedAt: string;
  totalDeps: number;
  _count?: { vulnerabilities: number };
  vulnerabilities?: Array<unknown>;
}

interface ScanTimelineProps {
  scans: ScanSummary[];
  onSelectScan?: (scanId: string) => void;
  selectedScanId?: string;
}

export default function ScanTimeline({
  scans,
  onSelectScan,
  selectedScanId,
}: ScanTimelineProps) {
  if (scans.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-text-secondary font-mono text-sm">
          No scans completed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-pulse-green/20 via-surface-border to-surface-border" />

      <div className="space-y-3">
        {scans.map((scan, i) => {
          const isSelected = scan.id === selectedScanId;
          const time = new Date(scan.scannedAt).toLocaleString();

          return (
            <button
              key={scan.id}
              onClick={() => onSelectScan?.(scan.id)}
              className={`relative flex items-start gap-4 w-full text-left p-4 rounded-lg
                transition-all duration-200 ease-out
                active:scale-[0.99]
                ${isSelected
                  ? "bg-pulse-green/8 border border-pulse-green/25 shadow-[0_0_16px_rgba(74,222,128,0.06)]"
                  : "hover:bg-surface-card/60 border border-transparent"
                }`}
              style={{
                animation: `statFadeIn 0.25s ease-out ${i * 0.04}s forwards`,
                opacity: 0,
              }}
            >
              {/* Dot on timeline */}
              <span
                className={`absolute left-4 w-2.5 h-2.5 rounded-full -translate-x-[4px] mt-1.5
                  transition-all duration-300
                  ${isSelected
                    ? "bg-pulse-green shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                    : "bg-surface-border"
                  }`}
              />

              {/* Content */}
              <div className="ml-8 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs sm:text-sm text-text-primary truncate">
                    {time}
                  </span>
                  <span className="font-mono text-xs text-text-secondary flex-shrink-0">
                    {scan.totalDeps} deps
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {scan._count?.vulnerabilities ?? scan.vulnerabilities?.length ?? 0} vulnerabilities found
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
