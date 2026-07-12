import { execSync, exec } from "child_process";
import fs from "fs";
import path from "path";

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

export function getGitRemoteUrl(projectPath: string): string | null {
  try {
    const url = execSync("git remote get-url origin", {
      cwd: projectPath,
      timeout: 3000,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return url.trim();
  } catch {
    return null;
  }
}

export function parseGitHubRepo(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }
  return null;
}

export function getGitHubRepoOfProject(projectPath: string): string | null {
  const remoteUrl = getGitRemoteUrl(projectPath);
  return parseGitHubRepo(remoteUrl);
}

export function cloneGitRepo(gitUrl: string, targetPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const command = `git clone --depth 1 "${gitUrl}" "${targetPath}"`;
    exec(command, { timeout: 60000 }, (error) => {
      if (error) {
        console.error(`[GIT CLONE] Failed to clone ${gitUrl}:`, error.message);
        reject(error);
      } else {
        console.log(`[GIT CLONE] Successfully cloned ${gitUrl} to ${targetPath}`);
        resolve();
      }
    });
  });
}

