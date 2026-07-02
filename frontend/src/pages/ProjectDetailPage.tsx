import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PulseIndicator from "../components/PulseIndicator";
import SeverityBadge from "../components/SeverityBadge";
import VulnerabilityTable from "../components/VulnerabilityTable";
import ScanTimeline from "../components/ScanTimeline";
import {
  useProject,
  useScanProject,
  usePatchProject,
  useDeleteProject,
} from "../hooks/useProjects";
import { IconScan, IconPatch, IconDelete, IconChevronLeft, IconEmptyScan, IconShield } from "../components/icons";

function getSeverity(
  healthScore: number | null
): "healthy" | "warning" | "critical" | "none" {
  if (healthScore === null) return "none";
  if (healthScore >= 80) return "healthy";
  if (healthScore >= 40) return "warning";
  return "critical";
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProject(id);
  const scanMutation = useScanProject();
  const patchMutation = usePatchProject();
  const deleteMutation = useDeleteProject();
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl page-enter">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 rounded-full bg-surface-border/50 skeleton" />
            <div>
              <div className="h-7 w-48 skeleton rounded mb-2" />
              <div className="h-4 w-64 skeleton rounded" />
            </div>
          </div>
          <div className="h-20 skeleton rounded-lg" />
          <div className="h-48 skeleton rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card p-8 text-center page-enter">
        <p className="text-pulse-red font-mono text-sm">
          Failed to load project details.
        </p>
        <Link to="/" className="btn-primary mt-4 inline-flex">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { project } = data;
  const severity = getSeverity(project.healthScore);
  const latestScan = project.scans?.[0] || null;
  const selectedScan = selectedScanId
    ? project.scans?.find((s: { id: string }) => s.id === selectedScanId)
    : latestScan;

  const handleScan = () => {
    if (id) {
      scanMutation.mutate(id);
    }
  };

  const handlePatch = (packages: string[]) => {
    if (id) {
      patchMutation.mutate({ projectId: id, packages });
    }
  };

  const handlePatchAllCritical = () => {
    if (!selectedScan?.vulnerabilities) return;
    const criticalPkgs = selectedScan.vulnerabilities
      .filter((v: { severity: string }) => v.severity === "critical")
      .map((v: { packageName: string }) => v.packageName);
    const uniquePkgs = [...new Set<string>(criticalPkgs)];
    if (uniquePkgs.length > 0) {
      handlePatch(uniquePkgs);
    }
  };

  const handleDelete = () => {
    if (id && confirm("Delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  const criticalCount = selectedScan?.vulnerabilities?.filter(
    (v: { severity: string }) => v.severity === "critical"
  ).length || 0;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl page-enter">
      {/* Breadcrumb */}
      <Link to="/" className="btn-ghost inline-flex items-center gap-1.5 text-xs">
        <IconChevronLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0">
            <PulseIndicator severity={severity} size="lg" />
          </div>
          <div className="min-w-0">
            <h1 className="font-mono font-bold text-xl sm:text-2xl text-text-primary truncate">
              {project.name}
            </h1>
            <p className="font-mono text-sm text-text-secondary mt-0.5 truncate">
              {project.path}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleScan}
            disabled={scanMutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {scanMutation.isPending ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-pulse-green/30 border-t-pulse-green animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <IconScan size={16} /> Scan Now
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="btn-danger flex items-center gap-2"
          >
            <IconDelete size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Scan progress indicator */}
      {scanMutation.isPending && (
        <div className="card px-4 py-3 flex items-center gap-3">
          <span className="w-4 h-4 rounded-full border-2 border-pulse-green/30 border-t-pulse-green animate-spin flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary font-medium">Scan in progress</p>
            <p className="text-xs text-text-secondary">Auditing dependencies for vulnerabilities...</p>
          </div>
          <div className="w-24">
            <div className="scan-progress">
              <div className="scan-progress-bar" />
            </div>
          </div>
        </div>
      )}

      {/* Health info */}
      <div className="flex gap-3 flex-wrap">
        <div className="card px-4 py-3 flex-1 min-w-[120px]">
          <span className="text-[11px] text-text-secondary block mb-0.5 font-medium">
            Tech Stack
          </span>
          <span className="font-mono text-sm text-text-primary uppercase">
            {project.techStack}
          </span>
        </div>
        <div className="card px-4 py-3 flex-1 min-w-[120px]">
          <span className="text-[11px] text-text-secondary block mb-0.5 font-medium flex items-center gap-1.5">
            <IconShield size={12} className="text-pulse-green/60" /> Health Score
          </span>
          <span className="font-mono text-sm text-text-primary">
            {project.healthScore !== null
              ? `${Math.round(project.healthScore)}%`
              : "—"}
          </span>
        </div>
        <div className="card px-4 py-3 flex-1 min-w-[120px]">
          <span className="text-[11px] text-text-secondary block mb-0.5 font-medium">
            Git Status
          </span>
          <span className="font-mono text-sm text-text-primary capitalize">
            {project.gitStatus || "—"}
          </span>
        </div>
        <div className="card px-4 py-3 flex-1 min-w-[120px]">
          <span className="text-[11px] text-text-secondary block mb-0.5 font-medium">
            Last Scanned
          </span>
          <span className="font-mono text-sm text-text-primary">
            {project.lastScanned
              ? new Date(project.lastScanned).toLocaleString()
              : "Never"}
          </span>
        </div>
      </div>

      {/* Vulnerabilities Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-mono font-semibold text-text-primary">
            Vulnerabilities
          </h2>
          {criticalCount > 0 && (
            <button
              onClick={handlePatchAllCritical}
              disabled={patchMutation.isPending}
              className="btn-primary text-xs self-start flex items-center gap-1.5"
            >
              {patchMutation.isPending ? (
                "Patching..."
              ) : (
                <><IconPatch size={14} /> Patch All Critical ({criticalCount})</>
              )}
            </button>
          )}
        </div>

        {selectedScan?.vulnerabilities ? (
          <div className="card overflow-hidden">
            <VulnerabilityTable
              vulnerabilities={selectedScan.vulnerabilities}
              onPatch={handlePatch}
              patching={patchMutation.isPending}
            />
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="mb-4 flex justify-center">
              <IconShield size={40} className="text-text-secondary/20" />
            </div>
            <p className="text-text-secondary font-mono text-sm">
              No vulnerabilities data available. Run a scan to see results.
            </p>
          </div>
        )}
      </div>

      {/* Scan History */}
      <div>
        <h2 className="font-mono font-semibold text-text-primary mb-4">
          Scan History
        </h2>
        {project.scans?.length > 0 ? (
          <ScanTimeline
            scans={project.scans || []}
            onSelectScan={setSelectedScanId}
            selectedScanId={selectedScanId || undefined}
          />
        ) : (
          <div className="card p-8 text-center">
            <div className="mb-4 flex justify-center">
              <IconEmptyScan size={40} className="text-text-secondary/20" />
            </div>
            <p className="text-text-secondary font-mono text-sm">
              No scans completed yet.
            </p>
          </div>
        )}
      </div>

      {/* Patch History */}
      {project.patches && project.patches.length > 0 && (
        <div>
          <h2 className="font-mono font-semibold text-text-primary mb-4">
            Patch History
          </h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:-mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left py-3 px-3 sm:px-4 text-text-secondary text-xs uppercase tracking-wider font-medium whitespace-nowrap">Package</th>
                      <th className="text-left py-3 px-3 sm:px-4 text-text-secondary text-xs uppercase tracking-wider font-medium whitespace-nowrap">From</th>
                      <th className="text-left py-3 px-3 sm:px-4 text-text-secondary text-xs uppercase tracking-wider font-medium whitespace-nowrap">To</th>
                      <th className="text-left py-3 px-3 sm:px-4 text-text-secondary text-xs uppercase tracking-wider font-medium whitespace-nowrap">Status</th>
                      <th className="text-left py-3 px-3 sm:px-4 text-text-secondary text-xs uppercase tracking-wider font-medium whitespace-nowrap">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.patches.map((patch: {
                      id: string;
                      packageName: string;
                      fromVersion: string;
                      toVersion: string;
                      status: string;
                      patchedAt: string;
                    }) => (
                      <tr
                        key={patch.id}
                        className="border-b border-surface-border/50 hover:bg-surface-card/80 active:bg-surface-card transition-colors duration-150"
                      >
                        <td className="py-3 px-3 sm:px-4 font-mono text-text-primary text-xs sm:text-sm whitespace-nowrap">{patch.packageName}</td>
                        <td className="py-3 px-3 sm:px-4 font-mono text-text-secondary text-xs sm:text-sm whitespace-nowrap">{patch.fromVersion}</td>
                        <td className="py-3 px-3 sm:px-4 font-mono text-pulse-green text-xs sm:text-sm whitespace-nowrap">{patch.toVersion}</td>
                        <td className="py-3 px-3 sm:px-4">
                          <SeverityBadge
                            severity={patch.status === "success" ? "low" : "critical"}
                          />
                        </td>
                        <td className="py-3 px-3 sm:px-4 font-mono text-text-secondary text-[11px] sm:text-xs whitespace-nowrap">
                          {new Date(patch.patchedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
