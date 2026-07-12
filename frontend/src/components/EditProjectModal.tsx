import { useState, FormEvent, useEffect } from "react";
import { useUpdateProject } from "../hooks/useProjects";
import { IconClose } from "./icons";

interface Project {
  id: string;
  name: string;
  path: string;
  githubRepo: string | null;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  project,
}: EditProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [path, setPath] = useState(project.path);
  const [githubRepo, setGithubRepo] = useState(project.githubRepo || "");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const updateMutation = useUpdateProject();

  useEffect(() => {
    setName(project.name);
    setPath(project.path);
    setGithubRepo(project.githubRepo || "");
    setError("");
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      triggerShake();
      return;
    }
    if (!path.trim()) {
      setError("Project path is required.");
      triggerShake();
      return;
    }

    try {
      await updateMutation.mutateAsync({
        projectId: project.id,
        data: {
          name,
          path,
          githubRepo: githubRepo.trim() ? githubRepo.trim() : null,
        },
      });
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.error || "Failed to update project.";
      setError(message);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm transition-opacity duration-300">
      <div
        className={`w-full max-w-md card p-6 shadow-2xl relative bg-surface-card border border-surface-border/60 backdrop-blur-md transition-all duration-300 transform scale-100 ${
          shake ? "shake" : ""
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-1 focus-visible:ring-pulse-green"
          aria-label="Close modal"
        >
          <IconClose size={20} />
        </button>

        <h2 className="font-mono font-bold text-lg text-text-primary mb-1">
          Edit Project
        </h2>
        <p className="text-xs text-text-secondary mb-5">
          Update the name, local path, or GitHub connection for this project.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="label text-xs">
              Project Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-path" className="label text-xs">
              Absolute Local Path
            </label>
            <input
              id="edit-path"
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="input-field font-mono text-xs"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-repo" className="label text-xs">
              GitHub Repository (Optional)
            </label>
            <input
              id="edit-repo"
              type="text"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="input-field font-mono text-xs"
              placeholder="e.g., owner/repo or custom GitHub guidelines"
            />
            <p className="text-[10px] text-text-secondary mt-1">
              Provide the repository slug format: <code>owner/repo</code> (e.g., <code>Vikas-Dr/Dev-pulse</code> or <code>custom GitHub guidelines</code>)
            </p>
          </div>

          {error && (
            <p className="text-pulse-red text-xs font-mono font-medium">
              Error: {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary flex items-center justify-center gap-2 flex-1 py-2"
            >
              {updateMutation.isPending && (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-pulse-green/30 border-t-pulse-green animate-spin" />
              )}
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1 py-2 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
