import { IconClose } from "./icons";

interface Vulnerability {
  id: string;
  packageName: string;
  currentVersion: string;
  severity: string;
  title: string;
  cve: string | null;
  fixedIn: string | null;
}

interface Scan {
  id: string;
  scannedAt: string;
  totalDeps: number;
  vulnerabilities: Vulnerability[];
}

interface Project {
  id: string;
  name: string;
  path: string;
  techStack: string;
  gitStatus: string | null;
  healthScore: number | null;
  githubRepo: string | null;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  latestScan: Scan | null;
}

export default function ReportModal({
  isOpen,
  onClose,
  project,
  latestScan,
}: ReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getSeverityColor = (sev: string) => {
    switch (sev.toLowerCase()) {
      case "critical":
        return "text-pulse-red";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-pulse-amber";
      default:
        return "text-text-primary";
    }
  };

  const criticalCount = latestScan?.vulnerabilities.filter((v) => v.severity === "critical").length || 0;
  const highCount = latestScan?.vulnerabilities.filter((v) => v.severity === "high").length || 0;
  const mediumCount = latestScan?.vulnerabilities.filter((v) => v.severity === "medium").length || 0;
  const lowCount = latestScan?.vulnerabilities.filter((v) => v.severity === "low").length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/85 backdrop-blur-sm transition-opacity duration-300">
      {/* Printable Container: Styled for print, previewed inside the dialog */}
      <div className="w-full max-w-3xl max-h-[85vh] card shadow-2xl relative bg-surface-card border border-surface-border/60 flex flex-col overflow-hidden modal-enter">
        
        {/* Dialog Header (no-print) */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border/60 no-print">
          <h2 className="font-mono font-bold text-base text-text-primary">
            Export Security Report
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-1 focus-visible:ring-pulse-green"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Report Preview / Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 print-report-container">
          
          {/* Document Title Header */}
          <div className="border-b-2 border-pulse-green pb-4">
            <h1 className="font-mono font-bold text-xl sm:text-2xl text-text-primary uppercase tracking-wide">
              DevPulse Audit Report
            </h1>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Generated on {new Date().toLocaleString()} &bull; Project Health Scan
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface/30 p-4 border border-surface-border/40 rounded-lg">
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold font-mono">Project Name</span>
              <span className="text-sm font-medium text-text-primary font-mono">{project.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold font-mono">Tech Stack</span>
              <span className="text-sm font-medium text-text-primary uppercase font-mono">{project.techStack}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold font-mono">Local Repository Path</span>
              <span className="text-xs font-medium text-text-primary font-mono break-all">{project.path}</span>
            </div>
            {project.githubRepo && (
              <div>
                <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold font-mono">Linked GitHub Repo</span>
                <span className="text-sm font-medium text-pulse-green font-mono">{project.githubRepo}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold font-mono">Git Status</span>
              <span className="text-sm font-medium text-text-primary capitalize font-mono">{project.gitStatus || "Unknown"}</span>
            </div>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="border border-surface-border/50 rounded-lg p-3 text-center">
              <span className="text-[10px] text-text-secondary uppercase block font-semibold mb-1">Health Score</span>
              <span className="text-lg font-mono font-bold text-pulse-green">
                {project.healthScore !== null ? `${Math.round(project.healthScore)}%` : "N/A"}
              </span>
            </div>
            <div className="border border-surface-border/50 rounded-lg p-3 text-center">
              <span className="text-[10px] text-pulse-red uppercase block font-semibold mb-1">Critical</span>
              <span className="text-lg font-mono font-bold text-pulse-red">{criticalCount}</span>
            </div>
            <div className="border border-surface-border/50 rounded-lg p-3 text-center">
              <span className="text-[10px] text-orange-400 uppercase block font-semibold mb-1">High</span>
              <span className="text-lg font-mono font-bold text-orange-400">{highCount}</span>
            </div>
            <div className="border border-surface-border/50 rounded-lg p-3 text-center">
              <span className="text-[10px] text-pulse-amber uppercase block font-semibold mb-1">Medium</span>
              <span className="text-lg font-mono font-bold text-pulse-amber">{mediumCount}</span>
            </div>
            <div className="border border-surface-border/50 rounded-lg p-3 text-center">
              <span className="text-[10px] text-text-secondary uppercase block font-semibold mb-1">Total Dependencies</span>
              <span className="text-lg font-mono font-bold text-text-primary">{latestScan?.totalDeps || 0}</span>
            </div>
          </div>

          {/* Vulnerability details */}
          <div>
            <h3 className="font-mono font-bold text-sm text-text-primary uppercase mb-3">
              Scan Details
            </h3>
            {latestScan?.vulnerabilities && latestScan.vulnerabilities.length > 0 ? (
              <div className="border border-surface-border/50 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface/50 border-b border-surface-border font-mono text-[10px] text-text-secondary uppercase">
                      <th className="py-2.5 px-3">Package</th>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">Vulnerability Title</th>
                      <th className="py-2.5 px-3">CVE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/30 text-xs font-mono">
                    {latestScan.vulnerabilities.map((v) => (
                      <tr key={v.id} className="hover:bg-surface/20">
                        <td className="py-2 px-3 text-text-primary font-bold">{v.packageName}</td>
                        <td className="py-2 px-3 text-text-secondary">{v.currentVersion}</td>
                        <td className={`py-2 px-3 font-bold uppercase ${getSeverityColor(v.severity)}`}>
                          {v.severity}
                        </td>
                        <td className="py-2 px-3 text-text-secondary max-w-xs truncate" title={v.title}>
                          {v.title}
                        </td>
                        <td className="py-2 px-3 text-text-secondary">{v.cve || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="border border-surface-border/50 rounded-lg p-8 text-center bg-surface/10">
                <p className="text-xs text-text-secondary font-mono">
                  No vulnerabilities detected in this project.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dialog Footer (no-print) */}
        <div className="flex gap-3 p-4 border-t border-surface-border/60 bg-surface/50 no-print">
          <button
            onClick={handlePrint}
            className="btn-primary flex-1 py-2 font-mono font-semibold"
          >
            Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="btn-ghost flex-1 py-2 font-mono font-semibold text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
