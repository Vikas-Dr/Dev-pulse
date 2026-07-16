import { useState, FormEvent, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAddProject } from "../hooks/useProjects";
import { IconChevronLeft, IconAdd, IconProjects } from "../components/icons";

type ProjectMode = null | "local" | "remote";

export default function AddProjectPage() {
  const [mode, setMode] = useState<ProjectMode>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [cloneRepo, setCloneRepo] = useState(true);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const navigate = useNavigate();
  const addMutation = useAddProject();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handlePathChange = (val: string) => {
    setPath(val);
    if (mode === "remote") {
      const cleanUrl = val.replace(/\.git$/, "");
      const parts = cleanUrl.split("/");
      const repoName = parts[parts.length - 1] || "cloned-repo";
      setDestinationPath(`/Users/${repoName}`);
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
      setError(mode === "remote" ? "GitHub URL is required." : "Folder path is required.");
      setShakeKey((k) => k + 1);
      return;
    }

    try {
      await addMutation.mutateAsync({
        name,
        path,
        destinationPath: (mode === "remote" && cloneRepo) ? destinationPath : undefined,
        cloneRepo: mode === "remote" ? cloneRepo : undefined,
      } as any);
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
      const relativePath = files[0].webkitRelativePath;
      const folderName = relativePath.split("/")[0];
      setName(folderName);
      setPath(`/Users/viki/${folderName}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto page-enter">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/" className="btn-ghost inline-flex items-center gap-1.5">
          <IconChevronLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-pulse-green/10 border border-pulse-green/20 flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.12)]">
            <IconAdd size={20} className="text-pulse-green" />
          </div>
          <h1 className="font-mono font-bold text-2xl text-text-primary">Add Project</h1>
        </div>
        <p className="text-sm text-text-secondary ml-[52px]">
          Choose how you want to add your project below.
        </p>
      </div>

      {/* Mode selector — shown when no mode chosen */}
      {mode === null && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2" style={{ perspective: "1000px" }}>
            {/* Local Device Card */}
            <button
              type="button"
              onClick={() => setMode("local")}
              className="card-3d-enter group relative overflow-hidden text-left rounded-2xl border border-surface-border bg-surface-card
                p-6 transition-all duration-300 ease-out
                hover:border-pulse-green/40 hover:-translate-y-1
                hover:shadow-[0_16px_40px_-12px_rgba(74,222,128,0.18),0_0_0_1px_rgba(74,222,128,0.08)]
                active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-pulse-green/50 outline-none
                cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* 3D depth layer */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pulse-green/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pulse-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-pulse-green/8 border border-pulse-green/15 flex items-center justify-center mb-4
                group-hover:shadow-[0_0_24px_rgba(74,222,128,0.2)] group-hover:bg-pulse-green/12
                transition-all duration-300">
                <svg className="w-6 h-6 text-pulse-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              </div>

              <h2 className="font-mono font-bold text-base text-text-primary mb-1.5 group-hover:text-pulse-green transition-colors duration-200">
                Local Device
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Point to a folder already on your machine. DevPulse will scan it directly.
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-pulse-green/60 font-mono group-hover:text-pulse-green transition-colors duration-200">
                <span>Select folder</span>
                <svg className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>

            {/* Remote / GitHub Card */}
            <button
              type="button"
              onClick={() => setMode("remote")}
              className="card-3d-enter group relative overflow-hidden text-left rounded-2xl border border-surface-border bg-surface-card
                p-6 transition-all duration-300 ease-out
                hover:border-pulse-green/40 hover:-translate-y-1
                hover:shadow-[0_16px_40px_-12px_rgba(74,222,128,0.18),0_0_0_1px_rgba(74,222,128,0.08)]
                active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-pulse-green/50 outline-none
                cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pulse-green/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pulse-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-pulse-green/8 border border-pulse-green/15 flex items-center justify-center mb-4
                group-hover:shadow-[0_0_24px_rgba(74,222,128,0.2)] group-hover:bg-pulse-green/12
                transition-all duration-300">
                <svg className="w-6 h-6 text-pulse-green" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </div>

              <h2 className="font-mono font-bold text-base text-text-primary mb-1.5 group-hover:text-pulse-green transition-colors duration-200">
                GitHub / Remote
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Paste a GitHub clone URL. DevPulse will clone it and monitor automatically.
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-pulse-green/60 font-mono group-hover:text-pulse-green transition-colors duration-200">
                <span>Clone repo</span>
                <svg className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="text-xs text-pulse-green hover:underline flex items-center gap-1.5 font-mono cursor-pointer transition-all duration-150 py-2.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              {showGuidelines ? "Hide custom GitHub guidelines" : "Do you want to clone it to local machine or localhost or want to download to local?"}
            </button>

            {showGuidelines && (
              <div className="w-full mt-4 p-5 rounded-2xl border border-pulse-green/20 bg-pulse-green/5 text-xs text-text-secondary space-y-3 font-mono modal-enter">
                <h4 className="font-semibold text-text-primary flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-pulse-green animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Custom GitHub Guidelines
                </h4>
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Follow these guidelines to set up your GitHub repository locally:
                  </p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>
                      <strong>Clone via HTTPS:</strong> Open your terminal and run:<br />
                      <code className="block bg-surface-card p-2 rounded text-pulse-green border border-surface-border/50 mt-1 my-1 select-all">git clone https://github.com/username/repo.git</code>
                    </li>
                    <li>
                      <strong>Clone via SSH:</strong> If you have SSH keys set up, run:<br />
                      <code className="block bg-surface-card p-2 rounded text-pulse-green border border-surface-border/50 mt-1 my-1 select-all">git clone git@github.com:username/repo.git</code>
                    </li>
                    <li>
                      <strong>Download ZIP:</strong> Visit the repository on GitHub, click <strong>Code</strong>, and select <strong>Download ZIP</strong>. Extract the files on your local machine.
                    </li>
                    <li>
                      <strong>Importing to DevPulse:</strong> Once downloaded or cloned, click <strong>Local Device</strong> above and select/paste the path to the project directory.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form — shown after mode is selected */}
      {mode !== null && (
        <div
          key={shakeKey}
          className={`relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card p-6
            shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),0_0_0_1px_rgba(74,222,128,0.04)]
            ${error ? "shake" : "modal-enter"}`}
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-pulse-green/40 to-transparent" />

          {/* Mode badge + back to selector */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border
                ${mode === "local"
                  ? "bg-pulse-green/10 border-pulse-green/25 text-pulse-green"
                  : "bg-blue-500/10 border-blue-500/25 text-blue-400"}`}>
                {mode === "local" ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                )}
                {mode === "local" ? "Local Device" : "GitHub / Remote"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => { setMode(null); setName(""); setPath(""); setDestinationPath(""); setError(""); }}
              className="text-xs text-text-secondary hover:text-text-primary font-mono flex items-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Change
            </button>
          </div>

          {/* Hidden folder input */}
          <input
            type="file"
            ref={folderInputRef}
            onChange={handleFolderSelect}
            className="hidden"
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            multiple
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Project Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="name" className="label mb-0 flex items-center gap-1">
                  Project Name
                  <span className="text-text-secondary/50 font-normal text-[10px]">(friendly identifier)</span>
                </label>
                {mode === "local" && (
                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="text-xs text-pulse-green/70 hover:text-pulse-green flex items-center gap-1 transition-colors font-mono"
                  >
                    <IconProjects size={12} /> Auto-detect
                  </button>
                )}
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`input-field ${error && !name ? "input-error" : ""}`}
                placeholder={mode === "local" ? "e.g., my-awesome-app" : "e.g., Dev-pulse"}
                required
                autoFocus
              />
              <p className="text-[10px] text-text-secondary mt-1 font-mono">
                Give your project a friendly name to identify it easily on the main dashboard.
              </p>
            </div>

            {/* Local path */}
            {mode === "local" && (
              <div>
                <label htmlFor="path" className="label">Absolute Folder Path</label>
                <input
                  id="path"
                  type="text"
                  value={path}
                  onChange={(e) => handlePathChange(e.target.value)}
                  className={`input-field font-mono text-xs ${error && !path ? "input-error" : ""}`}
                  placeholder="e.g., /Users/username/projects/my-app"
                  required
                />
                <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed font-mono">
                  The full absolute path to the directory on this machine (e.g., <code className="text-pulse-green">/Users/viki/DevPulse</code>).
                </p>
              </div>
            )}

            {/* Remote URL + destination */}
            {mode === "remote" && (
              <>
                <div>
                  <label htmlFor="path" className="label">GitHub Repository URL</label>
                  <input
                    id="path"
                    type="text"
                    value={path}
                    onChange={(e) => handlePathChange(e.target.value)}
                    className={`input-field font-mono text-xs ${error && !path ? "input-error" : ""}`}
                    placeholder="https://github.com/username/repo.git"
                    required
                  />
                  <p className="text-[10px] text-text-secondary mt-1.5 leading-relaxed font-mono">
                    Enter the git URL to clone or link (e.g. <code className="text-pulse-green">https://github.com/username/project.git</code>).
                  </p>
                </div>

                <div className="flex items-center gap-2 py-1 select-none">
                  <input
                    id="cloneRepo"
                    type="checkbox"
                    checked={cloneRepo}
                    onChange={(e) => setCloneRepo(e.target.checked)}
                    className="w-4 h-4 rounded border-surface-border text-pulse-green focus:ring-pulse-green/50 cursor-pointer"
                  />
                  <label htmlFor="cloneRepo" className="text-xs text-text-primary font-mono cursor-pointer font-semibold">
                    Clone repository to local computer/server for vulnerability scanning
                  </label>
                </div>

                {cloneRepo ? (
                  <div className="pl-6 border-l-2 border-pulse-green/20 space-y-2 py-1 modal-enter">
                    <label htmlFor="destinationPath" className="label">
                      Clone Destination on Server
                      <span className="text-pulse-green/60 ml-1 font-normal">(auto-filled)</span>
                    </label>
                    <input
                      id="destinationPath"
                      type="text"
                      value={destinationPath}
                      onChange={(e) => setDestinationPath(e.target.value)}
                      className="input-field font-mono text-xs border-pulse-green/30 focus:border-pulse-green/60"
                      placeholder="e.g., /Users/projects/my-repo"
                      required
                    />
                    <p className="text-[10px] text-pulse-green/60 mt-1 leading-relaxed font-mono">
                      Where the remote code repository will be saved on your machine.
                    </p>
                  </div>
                ) : (
                  <div className="pl-6 border-l-2 border-surface-border/30 py-1 modal-enter">
                    <p className="text-[10px] text-text-secondary leading-relaxed font-mono">
                      💡 <strong>Linking only:</strong> Repository will not be cloned. Tech stack detection and vulnerability scanning will be disabled.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-pulse-red/8 border border-pulse-red/20">
                <span className="text-pulse-red font-bold text-sm flex-shrink-0">!</span>
                <p className="text-pulse-red text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="btn-primary flex items-center gap-2 shadow-[0_4px_16px_-4px_rgba(74,222,128,0.25)] hover:shadow-[0_8px_24px_-6px_rgba(74,222,128,0.35)] transition-shadow"
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
      )}
    </div>
  );
}
