import { useState, useEffect } from "react";
import { IconGitHub, IconExternalLink, IconSettings, IconShield, IconAlert } from "./icons";

interface GitHubPanelProps {
  repo: string | null;
  onEditClick: () => void;
}

interface RepoData {
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  subscribers: number;
  defaultBranch: string;
  isPrivate: boolean;
  htmlUrl: string;
}

export default function GitHubPanel({ repo, onEditClick }: GitHubPanelProps) {
  const [data, setData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pat, setPat] = useState(() => localStorage.getItem("devpulse-github-pat") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!repo) {
      setData(null);
      setError(null);
      return;
    }

    const fetchRepoDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers: HeadersInit = {
          Accept: "application/vnd.github.v3+json",
        };
        if (pat.trim()) {
          headers["Authorization"] = `token ${pat.trim()}`;
        }

        const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
        if (res.status === 404) {
          throw new Error("Repository not found. If it is private, make sure your Personal Access Token is configured.");
        }
        if (res.status === 403) {
          const rateLimitReset = res.headers.get("X-RateLimit-Reset");
          const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : "later";
          throw new Error(`API rate limit exceeded or access forbidden. Try adding a Personal Access Token or wait until ${resetTime}.`);
        }
        if (!res.ok) {
          throw new Error(`GitHub API returned status ${res.status}`);
        }

        const json = await res.json();
        setData({
          description: json.description,
          stars: json.stargazers_count,
          forks: json.forks_count,
          openIssues: json.open_issues_count,
          subscribers: json.subscribers_count,
          defaultBranch: json.default_branch,
          isPrivate: json.private,
          htmlUrl: json.html_url,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load repository details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [repo, pat]);

  const handleSavePat = (e: React.FormEvent) => {
    e.preventDefault();
    if (pat.trim()) {
      localStorage.setItem("devpulse-github-pat", pat.trim());
    } else {
      localStorage.removeItem("devpulse-github-pat");
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  if (!repo) {
    return (
      <div className="card p-6 border-dashed border-surface-border flex flex-col items-center text-center justify-center min-h-[160px]">
        <div className="p-3 bg-surface-card rounded-full border border-surface-border text-text-secondary/60 mb-3">
          <IconGitHub size={32} />
        </div>
        <h3 className="font-mono text-sm font-semibold text-text-primary mb-1">
          GitHub Integration Not Linked
        </h3>
        <p className="text-xs text-text-secondary max-w-sm mb-4">
          Connect this project to a GitHub repository (e.g., <code>custom GitHub guidelines</code> or <code>Vikas-Dr/Dev-pulse</code>) to track pull requests, commits, and workflow runs.
        </p>
        <button onClick={onEditClick} className="btn-primary text-xs py-1.5 px-3">
          Configure Repository
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6 bg-surface-card border border-surface-border/50 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pulse-green/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-surface-border/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <IconGitHub size={22} className="text-pulse-green flex-shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sm text-text-primary truncate">
                {repo}
              </span>
              {data?.isPrivate && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-pulse-amber/15 text-pulse-amber font-medium">
                  Private
                </span>
              )}
            </div>
            {data?.description && (
              <p className="text-xs text-text-secondary truncate mt-0.5 max-w-lg">
                {data.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg border transition-colors ${
              showSettings
                ? "bg-pulse-green/10 text-pulse-green border-pulse-green/30"
                : "border-surface-border text-text-secondary hover:text-text-primary hover:bg-surface-border/20"
            }`}
            title="GitHub Settings"
          >
            <IconSettings size={16} />
          </button>
          {data?.htmlUrl && (
            <a
              href={data.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-surface-border text-text-secondary hover:text-text-primary hover:bg-surface-border/20 transition-colors"
              title="Open in GitHub"
            >
              <IconExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <form
          onSubmit={handleSavePat}
          className="mb-5 p-4 bg-surface/50 border border-surface-border rounded-lg space-y-3"
        >
          <h4 className="text-xs font-mono font-bold text-text-primary flex items-center gap-1.5">
            <IconShield size={14} className="text-pulse-green" /> GitHub Auth Token (PAT)
          </h4>
          <p className="text-[11px] text-text-secondary">
            Provide a GitHub Personal Access Token to view private repository details or to bypass public rate limits (60/hr).
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              className="input-field text-xs flex-1 py-1.5 font-mono"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
            <button type="submit" className="btn-primary text-xs py-1.5 px-4">
              {saveSuccess ? "Saved!" : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 skeleton rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-pulse-red/5 border border-pulse-red/20 rounded-lg flex items-start gap-3">
          <IconAlert size={20} className="text-pulse-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono font-bold text-text-primary">Failed to load metadata</p>
            <p className="text-xs text-text-secondary mt-1">{error}</p>
          </div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-surface/30 border border-surface-border/40 rounded-lg p-3 hover:border-surface-border transition-colors">
            <span className="text-[10px] text-text-secondary block font-medium uppercase tracking-wider mb-1">
              Stars
            </span>
            <span className="font-mono text-base font-bold text-text-primary">
              {data.stars.toLocaleString()}
            </span>
          </div>

          <div className="bg-surface/30 border border-surface-border/40 rounded-lg p-3 hover:border-surface-border transition-colors">
            <span className="text-[10px] text-text-secondary block font-medium uppercase tracking-wider mb-1">
              Forks
            </span>
            <span className="font-mono text-base font-bold text-text-primary">
              {data.forks.toLocaleString()}
            </span>
          </div>

          <div className="bg-surface/30 border border-surface-border/40 rounded-lg p-3 hover:border-surface-border transition-colors">
            <span className="text-[10px] text-text-secondary block font-medium uppercase tracking-wider mb-1">
              Open Issues
            </span>
            <span
              className={`font-mono text-base font-bold ${
                data.openIssues > 0 ? "text-pulse-amber" : "text-text-primary"
              }`}
            >
              {data.openIssues.toLocaleString()}
            </span>
          </div>

          <div className="bg-surface/30 border border-surface-border/40 rounded-lg p-3 hover:border-surface-border transition-colors">
            <span className="text-[10px] text-text-secondary block font-medium uppercase tracking-wider mb-1">
              Watchers
            </span>
            <span className="font-mono text-base font-bold text-text-primary">
              {data.subscribers.toLocaleString()}
            </span>
          </div>

          <div className="bg-surface/30 border border-surface-border/40 rounded-lg p-3 hover:border-surface-border transition-colors col-span-2 sm:col-span-1">
            <span className="text-[10px] text-text-secondary block font-medium uppercase tracking-wider mb-1">
              Branch
            </span>
            <span className="font-mono text-sm font-bold text-pulse-green truncate block">
              {data.defaultBranch}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
