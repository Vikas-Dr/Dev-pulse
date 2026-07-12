import { useState, FormEvent, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddProject } from "../hooks/useProjects";
import { IconChevronLeft, IconAdd, IconProjects } from "../components/icons";

export default function AddProjectPage() {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [isGitUrl, setIsGitUrl] = useState(false);
  const [destinationPath, setDestinationPath] = useState("");
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const navigate = useNavigate();
  const addMutation = useAddProject();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handlePathChange = (val: string) => {
    setPath(val);
    const isGit = val.includes("github.com") || val.startsWith("git@") || val.startsWith("http://") || val.startsWith("https://");
    setIsGitUrl(isGit);
    
    if (isGit) {
      const cleanUrl = val.replace(/\.git$/, "");
      const parts = cleanUrl.split("/");
      const repoName = parts[parts.length - 1] || "cloned-repo";
      setDestinationPath(`/Users/viki/projects/${repoName}`);
    } else {
      setDestinationPath("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      setShakeKey((k) => k + 1);
      return;
    }
    if (!path.trim()) {
      setError("Project source path or Git URL is required.");
      setShakeKey((k) => k + 1);
      return;
    }

    try {
      await addMutation.mutateAsync({ 
        name, 
        path, 
        destinationPath: isGitUrl ? destinationPath : undefined 
      });
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

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Get first file's webkitRelativePath (e.g., "my-folder/package.json")
      const relativePath = files[0].webkitRelativePath;
      const folderName = relativePath.split("/")[0];
      
      // Auto-populate Project Name
      setName(folderName);
      
      // Note: Browsers do not expose absolute local path due to security restrictions.
      // We fill with folderName as a starting reference, but advise them to type the full path or check.
      // Wait, we can suggest a default absolute path prefix like `/Users/viki/DevPulse` or similar!
      setPath(`/Users/viki/${folderName}`);
    }
  };

  const triggerFolderPicker = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
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
          Add a local folder path to monitor directly, or paste a Git clone URL to clone it.
        </p>

        {/* Hidden Directory Selection Input */}
        <input
          type="file"
          ref={folderInputRef}
          onChange={handleFolderSelect}
          className="hidden"
          // @ts-ignore - directory attributes are non-standard but widely supported
          webkitdirectory="true"
          directory="true"
          multiple
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="name" className="label mb-0">
                Project Name
              </label>
              <button
                type="button"
                onClick={triggerFolderPicker}
                className="text-xs text-pulse-green hover:underline flex items-center gap-1"
              >
                <IconProjects size={12} /> Detect Name from Local Folder
              </button>
            </div>
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
              Project Source Path or Git URL
            </label>
            <input
              id="path"
              type="text"
              value={path}
              onChange={(e) => handlePathChange(e.target.value)}
              className={`input-field font-mono text-xs ${error ? "input-error" : ""}`}
              placeholder="e.g., /Users/viki/projects/app OR https://github.com/Vikas-Dr/Dev-pulse.git or custom GitHub guidelines"
              required
            />
            <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">
              Paste either the **absolute filesystem path** of a local project directory OR a **GitHub Clone URL / Git report URL** (e.g. <code>custom GitHub guidelines</code> repository link). Remote Git repositories will be cloned automatically by the backend.
            </p>
          </div>

          {isGitUrl && (
            <div className="space-y-1.5 page-enter">
              <label htmlFor="destinationPath" className="label text-pulse-green font-semibold">
                Clone Destination Path on Local Computer
              </label>
              <input
                id="destinationPath"
                type="text"
                value={destinationPath}
                onChange={(e) => setDestinationPath(e.target.value)}
                className="input-field font-mono text-xs border-pulse-green/40 focus:border-pulse-green focus:ring-2 focus:ring-pulse-green/20"
                placeholder="e.g., /Users/viki/projects/my-app"
                required
              />
              <p className="text-[10px] text-pulse-green/80 leading-normal">
                The repository will be cloned directly into this folder on your computer.
              </p>
            </div>
          )}

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
