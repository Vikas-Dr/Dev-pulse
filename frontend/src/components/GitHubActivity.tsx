import { useState, useEffect } from "react";
import { IconExternalLink, IconAlert, IconCheck } from "./icons";

interface GitHubActivityProps {
  repo: string | null;
}

interface Commit {
  sha: string;
  message: string;
  authorName: string;
  authorAvatarUrl: string;
  date: string;
  htmlUrl: string;
}

interface ActionRun {
  id: number;
  name: string;
  runNumber: number;
  event: string;
  status: string;
  conclusion: string | null;
  date: string;
  htmlUrl: string;
}

export default function GitHubActivity({ repo }: GitHubActivityProps) {
  const [activeTab, setActiveTab] = useState<"commits" | "actions">("commits");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [actions, setActions] = useState<ActionRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;

    const fetchActivity = async () => {
      setLoading(true);
      setError(null);
      try {
        const pat = localStorage.getItem("devpulse-github-pat") || "";
        const headers: HeadersInit = {
          Accept: "application/vnd.github.v3+json",
        };
        if (pat.trim()) {
          headers["Authorization"] = `token ${pat.trim()}`;
        }

        // Fetch Commits
        const commitsRes = await fetch(
          `https://api.github.com/repos/${repo}/commits?per_page=5`,
          { headers }
        );
        let fetchedCommits: Commit[] = [];
        if (commitsRes.ok) {
          const commitsJson = await commitsRes.json();
          fetchedCommits = commitsJson.map((c: any) => ({
            sha: c.sha,
            message: c.commit.message.split("\n")[0],
            authorName: c.commit.author.name,
            authorAvatarUrl: c.author?.avatar_url || "https://github.com/identicons/git.png",
            date: c.commit.author.date,
            htmlUrl: c.html_url,
          }));
        }

        // Fetch Workflow Runs
        const actionsRes = await fetch(
          `https://api.github.com/repos/${repo}/actions/runs?per_page=5`,
          { headers }
        );
        let fetchedActions: ActionRun[] = [];
        if (actionsRes.ok) {
          const actionsJson = await actionsRes.json();
          fetchedActions = (actionsJson.workflow_runs || []).map((run: any) => ({
            id: run.id,
            name: run.name,
            runNumber: run.run_number,
            event: run.event,
            status: run.status,
            conclusion: run.conclusion,
            date: run.updated_at || run.created_at,
            htmlUrl: run.html_url,
          }));
        }

        setCommits(fetchedCommits);
        setActions(fetchedActions);
      } catch (err: any) {
        setError(err.message || "Failed to load GitHub activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [repo]);

  if (!repo) return null;

  return (
    <div className="card bg-surface-card border border-surface-border/50 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-surface-border/50">
        <button
          onClick={() => setActiveTab("commits")}
          className={`flex-1 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase transition-colors duration-150 relative ${
            activeTab === "commits"
              ? "text-pulse-green"
              : "text-text-secondary hover:text-text-primary hover:bg-surface/10"
          }`}
        >
          Latest Commits
          {activeTab === "commits" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pulse-green" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("actions")}
          className={`flex-1 py-3 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase transition-colors duration-150 relative ${
            activeTab === "actions"
              ? "text-pulse-green"
              : "text-text-secondary hover:text-text-primary hover:bg-surface/10"
          }`}
        >
          CI/CD Actions
          {activeTab === "actions" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pulse-green" />
          )}
        </button>
      </div>

      {/* Tab Panel */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full skeleton flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 skeleton rounded" />
                  <div className="h-3 w-1/3 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-pulse-red/5 border border-pulse-red/20 rounded-lg flex items-center gap-3">
            <IconAlert size={20} className="text-pulse-red flex-shrink-0" />
            <span className="text-xs text-text-secondary font-mono">{error}</span>
          </div>
        ) : activeTab === "commits" ? (
          commits.length > 0 ? (
            <div className="relative pl-4 border-l border-surface-border/60 space-y-6">
              {commits.map((commit, idx) => (
                <div key={commit.sha} className="relative row-enter" style={{ animationDelay: `${idx * 0.05}s` }}>
                  {/* Timeline point */}
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface-card border-2 border-pulse-green pulse-glow" />

                  <div className="flex items-start gap-3">
                    <img
                      src={commit.authorAvatarUrl}
                      alt={commit.authorName}
                      className="w-7 h-7 rounded-full border border-surface-border flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://github.com/identicons/git.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <a
                          href={commit.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-xs sm:text-sm text-text-primary hover:text-pulse-green transition-colors line-clamp-1 flex items-center gap-1"
                        >
                          {commit.message}
                          <IconExternalLink size={12} className="opacity-40" />
                        </a>
                        <span className="font-mono text-[10px] text-text-secondary bg-surface-border/40 px-1.5 py-0.5 rounded self-start sm:self-center">
                          {commit.sha.substring(0, 7)}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-text-secondary mt-1">
                        By <span className="font-medium text-text-primary">{commit.authorName}</span> &bull; {new Date(commit.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-text-secondary font-mono py-4">No commits found.</p>
          )
        ) : actions.length > 0 ? (
          <div className="space-y-4">
            {actions.map((run, idx) => {
              const isCompleted = run.status === "completed";
              const isSuccess = run.conclusion === "success";
              const isFailure = run.conclusion === "failure" || run.conclusion === "cancelled";
              const isInProgress = run.status === "in_progress" || run.status === "queued";

              return (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-3.5 bg-surface/20 border border-surface-border/40 hover:border-surface-border rounded-lg transition-all duration-200 row-enter"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Status circle */}
                    <div className="flex-shrink-0">
                      {isCompleted && isSuccess && (
                        <div className="w-5 h-5 rounded-full bg-pulse-green/15 text-pulse-green flex items-center justify-center">
                          <IconCheck size={12} />
                        </div>
                      )}
                      {isCompleted && isFailure && (
                        <div className="w-5 h-5 rounded-full bg-pulse-red/15 text-pulse-red flex items-center justify-center">
                          <IconAlert size={12} />
                        </div>
                      )}
                      {isInProgress && (
                        <div className="w-5 h-5 rounded-full border-2 border-pulse-green/20 border-t-pulse-green animate-spin" />
                      )}
                      {!isSuccess && !isFailure && !isInProgress && (
                        <div className="w-5 h-5 rounded-full bg-pulse-amber/15 text-pulse-amber flex items-center justify-center">
                          <span className="text-[10px] font-bold">!</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-sm text-text-primary truncate">
                          {run.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-border/40 text-text-secondary uppercase">
                          {run.event}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5">
                        Run #{run.runNumber} &bull; {new Date(run.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <a
                    href={run.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-surface-border/60 text-text-secondary hover:text-text-primary hover:bg-surface-border/30 transition-all active:scale-[0.95]"
                  >
                    <IconExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-xs text-text-secondary font-mono py-4">No actions workflow runs found.</p>
        )}
      </div>
    </div>
  );
}
