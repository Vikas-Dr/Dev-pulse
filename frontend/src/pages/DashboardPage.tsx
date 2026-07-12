import { Link } from "react-router-dom";
import StatsBar from "../components/StatsBar";
import ProjectCard from "../components/ProjectCard";
import { useProjects } from "../hooks/useProjects";
import { useProjectStore } from "../stores/projectStore";
import { IconEmptyProjects, IconAdd, IconShield } from "../components/icons";

export default function DashboardPage() {
  const { isLoading, isError } = useProjects();
  const projects = useProjectStore((s) => s.projects);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-mono font-bold text-xl sm:text-2xl text-text-primary flex items-center gap-3">
            <IconShield size={24} className="text-pulse-green" />
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Overview of your project health
          </p>
        </div>
        <Link to="/projects/add" className="btn-primary inline-flex items-center gap-1.5 self-start">
          <IconAdd size={16} /> Add Project
        </Link>
      </div>

      <StatsBar />

      {/* Project grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <IconShield size={16} className="text-pulse-green/60" />
          <h2 className="font-mono font-semibold text-text-primary">
            Projects
          </h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-shimmer p-5 border border-surface-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-surface-border/40 rounded-full skeleton" />
                    <div>
                      <div className="h-4 w-32 skeleton rounded mb-1.5" />
                      <div className="h-3 w-24 skeleton rounded" />
                    </div>
                  </div>
                </div>
                <div className="h-3 w-40 skeleton rounded mb-3" />
                <div className="h-3 w-28 skeleton rounded" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="card p-8 text-center">
            <p className="text-pulse-red font-mono text-sm">
              Failed to load projects. Make sure the backend is running.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-4 inline-flex"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <div className="card p-8 sm:p-12 text-center">
            <div className="mb-5 flex justify-center">
              <IconEmptyProjects size={56} className="text-text-secondary/20" />
            </div>
            <h3 className="font-mono font-semibold text-text-primary mb-2">
              No projects added yet
            </h3>
            <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto leading-relaxed">
              Add your first project directory to start monitoring dependencies,
              vulnerabilities, and health across all your local projects.
            </p>
            <Link to="/projects/add" className="btn-primary inline-flex items-center gap-1.5">
              <IconAdd size={16} /> Add your first project
            </Link>
          </div>
        )}

        {!isLoading && !isError && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
