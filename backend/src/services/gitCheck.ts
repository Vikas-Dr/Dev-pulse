import { execSync } from "child_process";

export interface GitStatusResult {
  gitStatus: "clean" | "dirty" | "no-repo";
  lastCommit: Date | null;
}

export function checkGitStatus(projectPath: string): GitStatusResult {
  try {
    // Check if it's a git repo
    execSync("git rev-parse --git-dir", {
      cwd: projectPath,
      timeout: 5000,
      stdio: "ignore",
    });

    // Check for uncommitted changes
    const statusOutput = execSync("git status --porcelain", {
      cwd: projectPath,
      timeout: 5000,
      encoding: "utf-8",
    });

    const gitStatus = statusOutput.trim().length > 0 ? "dirty" : "clean";

    // Get last commit date
    let lastCommit: Date | null = null;
    try {
      const logOutput = execSync("git log -1 --format=%cI", {
        cwd: projectPath,
        timeout: 5000,
        encoding: "utf-8",
      });
      lastCommit = new Date(logOutput.trim());
    } catch {
      // No commits yet
    }

    return { gitStatus, lastCommit };
  } catch {
    return { gitStatus: "no-repo", lastCommit: null };
  }
}
