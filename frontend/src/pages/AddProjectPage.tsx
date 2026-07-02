import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddProject } from "../hooks/useProjects";
import { IconChevronLeft, IconAdd } from "../components/icons";

export default function AddProjectPage() {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const navigate = useNavigate();
  const addMutation = useAddProject();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await addMutation.mutateAsync({ name, path });
      navigate("/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Failed to add project.";
      setError(message || "Failed to add project.");
      setShakeKey((k) => k + 1);
    }
  };

  return (
    <div className="max-w-lg mx-auto page-enter">
      <div className="mb-6">
        <Link
          to="/"
          className="btn-ghost inline-flex items-center gap-1.5"
        >
          <IconChevronLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div
        key={shakeKey}
        className={`card p-6 ${error ? "shake" : ""}`}
      >
        <div className="flex items-center gap-3 mb-1">
          <IconAdd size={22} className="text-pulse-green" />
          <h1 className="font-mono font-bold text-xl sm:text-2xl text-text-primary">
            Add Project
          </h1>
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Point DevPulse to a project directory to start monitoring its health.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="label">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input-field ${error ? "input-error" : ""}`}
              placeholder="e.g., my-awesome-app"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="path" className="label">
              Absolute Path
            </label>
            <input
              id="path"
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className={`input-field font-mono text-sm ${error ? "input-error" : ""}`}
              placeholder="e.g., /Users/you/projects/my-app"
              required
            />
            <p className="text-xs text-text-secondary mt-1.5">
              Full filesystem path to the project directory.
            </p>
          </div>

          {error && (
            <p className="text-pulse-red text-sm font-medium flex items-center gap-2">
              <span>!</span>
              <span>{error}</span>
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="btn-primary flex items-center gap-2"
            >
              {addMutation.isPending && (
                <span className="w-4 h-4 rounded-full border-2 border-pulse-green/30 border-t-pulse-green animate-spin" />
              )}
              {addMutation.isPending ? "Adding..." : "Add Project"}
            </button>
            <Link
              to="/"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
