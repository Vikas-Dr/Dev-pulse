import { Link } from "react-router-dom";
import PulseIndicator from "./PulseIndicator";
import type { ProjectSummary } from "../stores/projectStore";
import { TechStackIcon, IconGitHub } from "./icons";

interface ProjectCardProps {
  project: ProjectSummary;
  index?: number;
}

function getSeverity(project: ProjectSummary): "healthy" | "warning" | "critical" | "none" {
  if (!project.latestScan) return "none";
  if (project.latestScan.vulnerabilities.critical > 0) return "critical";
  if (project.latestScan.vulnerabilities.high > 0) return "warning";
  if (project.latestScan.vulnerabilities.total === 0) return "healthy";
  return "warning";
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const severity = getSeverity(project);
  const vuln = project.latestScan?.vulnerabilities;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="card p-5 card-hover group block"
      style={{
        animation: `statFadeIn 0.35s ease-out ${0.05 + index * 0.04}s forwards`,
        opacity: 0,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
            <TechStackIcon stack={project.techStack} size={22} />
          </span>
          <div className="min-w-0">
            <h3 className="font-mono font-semibold text-text-primary truncate group-hover:text-pulse-green transition-colors duration-200">
              {project.name}
            </h3>
            <p className="font-mono text-xs text-text-secondary truncate">
              {project.path}
            </p>
          </div>
        </div>
        <PulseIndicator severity={severity} size="md" />
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider font-mono text-text-secondary bg-surface-border/30 px-2 py-0.5 rounded">
          {project.techStack === "unknown" ? "Unknown Stack" : project.techStack}
        </span>
        {project.gitStatus && (
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              project.gitStatus === "clean"
                ? "text-pulse-green bg-pulse-green/10"
                : project.gitStatus === "dirty"
                  ? "text-pulse-amber bg-pulse-amber/10"
                  : "text-text-secondary bg-surface-border/30"
            }`}
          >
            {project.gitStatus === "no-repo" ? "No Repo" : project.gitStatus}
          </span>
        )}
        {project.healthScore !== null && (
          <span className="text-[10px] font-mono text-text-secondary bg-surface-border/30 px-2 py-0.5 rounded">
            {Math.round(project.healthScore)}%
          </span>
        )}
        {project.githubRepo && (
          <span className="text-[10px] font-mono text-text-secondary bg-surface-border/30 px-2 py-0.5 rounded flex items-center gap-1 max-w-[150px]">
            <IconGitHub size={11} className="text-pulse-green/70" />
            <span className="truncate">{project.githubRepo}</span>
          </span>
        )}
      </div>

      {vuln ? (
        <div className="flex items-center gap-3 flex-wrap">
          {vuln.critical > 0 && (
            <span className="text-xs font-mono text-pulse-red flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pulse-red inline-block" />
              {vuln.critical} critical
            </span>
          )}
          {vuln.high > 0 && (
            <span className="text-xs font-mono text-orange-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
              {vuln.high} high
            </span>
          )}
          {vuln.medium > 0 && (
            <span className="text-xs font-mono text-pulse-amber flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pulse-amber inline-block" />
              {vuln.medium} medium
            </span>
          )}
          {vuln.total === 0 && (
            <span className="text-xs font-mono text-pulse-green">
              No vulnerabilities
            </span>
          )}
          <span className="text-xs text-text-secondary ml-auto">
            {project.latestScan?.totalDeps || 0} deps
          </span>
        </div>
      ) : (
        <p className="text-xs text-text-secondary font-mono">
          Not scanned yet
        </p>
      )}
    </Link>
  );
}
