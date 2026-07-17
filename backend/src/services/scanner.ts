import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export interface VulnerabilityResult {
  packageName: string;
  currentVersion: string;
  severity: string;
  title: string;
  cve: string | null;
  fixedIn: string | null;
}

export interface ScanResult {
  totalDeps: number;
  vulnerabilities: VulnerabilityResult[];
  techStack: string;
}

function findTechStackRecursively(currentPath: string, maxDepth: number, currentDepth = 0): { stack: string, path: string } | null {
  if (currentDepth > maxDepth) return null;

  if (fs.existsSync(path.join(currentPath, "package.json"))) return { stack: "node", path: currentPath };
  if (fs.existsSync(path.join(currentPath, "requirements.txt"))) return { stack: "python", path: currentPath };
  if (fs.existsSync(path.join(currentPath, "Cargo.toml"))) return { stack: "rust", path: currentPath };
  if (fs.existsSync(path.join(currentPath, "go.mod"))) return { stack: "go", path: currentPath };

  try {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      // Ignore common directories to speed up search and avoid false positives
      if (file === "node_modules" || file === ".git" || file === "dist" || file === "build" || file === "venv") continue;
      
      const fullPath = path.join(currentPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const result = findTechStackRecursively(fullPath, maxDepth, currentDepth + 1);
        if (result) return result;
      }
    }
  } catch {}

  return null;
}

export function detectTechStack(projectPath: string): string {
  const result = findTechStackRecursively(projectPath, 2);
  return result ? result.stack : "unknown";
}

export function getTechStackPath(projectPath: string): string {
  const result = findTechStackRecursively(projectPath, 2);
  return result ? result.path : projectPath;
}

export function scanProject(projectPath: string): ScanResult {
  const techStack = detectTechStack(projectPath);
  const techPath = getTechStackPath(projectPath);

  if (techStack === "node") {
    return scanNodeProject(techPath);
  }

  // For other stacks, return placeholder
  return {
    totalDeps: 0,
    vulnerabilities: [],
    techStack,
  };
}

function scanNodeProject(projectPath: string): ScanResult {
  try {
    const auditOutput = execSync("npm audit --json", {
      cwd: projectPath,
      timeout: 30000,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    const parsed = JSON.parse(auditOutput);
    const vulnerabilities: VulnerabilityResult[] = [];
    const auditData = parsed?.vulnerabilities || {};

    for (const [pkgName, pkgData] of Object.entries(auditData)) {
      const data = pkgData as Record<string, unknown>;
      const via = (data?.via as Array<Record<string, unknown>>) || [];
      const severity = (data?.severity as string) || "unknown";

      // Check if via entries contain advisory info
      for (const advisory of via) {
        if (typeof advisory === "object" && advisory !== null) {
          vulnerabilities.push({
            packageName: pkgName,
            currentVersion: (data?.findings as Array<{ version: string }>)?.[0]?.version || "unknown",
            severity: severity.toLowerCase(),
            title: (advisory?.title as string) || `Vulnerability in ${pkgName}`,
            cve: (advisory?.cve as string) || null,
            fixedIn: (advisory?.fixed_in as string) || null,
          });
        }
      }

      // If no structured via entries, create a basic entry
      if (via.length === 0) {
        vulnerabilities.push({
          packageName: pkgName,
          currentVersion: "unknown",
          severity: severity.toLowerCase(),
          title: `${pkgName} has vulnerabilities`,
          cve: null,
          fixedIn: null,
        });
      }
    }

    const totalDeps = (parsed?.metadata?.totalDependencies as number) || 0;

    return {
      totalDeps,
      vulnerabilities,
      techStack: "node",
    };
  } catch (error: unknown) {
    // npm audit returns non-zero exit code when vulnerabilities are found
    // So we need to catch and parse the output from the error
    const execError = error as { stdout?: string; stderr?: string; message?: string };
    const output = execError?.stdout || execError?.stderr || "";

    if (output) {
      try {
        const parsed = JSON.parse(output);
        const vulnerabilities: VulnerabilityResult[] = [];
        const auditData = parsed?.vulnerabilities || {};

        for (const [pkgName, pkgData] of Object.entries(auditData)) {
          const data = pkgData as Record<string, unknown>;
          const via = (data?.via as Array<Record<string, unknown>>) || [];
          const severity = (data?.severity as string) || "unknown";

          for (const advisory of via) {
            if (typeof advisory === "object" && advisory !== null) {
              vulnerabilities.push({
                packageName: pkgName,
                currentVersion: (data?.findings as Array<{ version: string }>)?.[0]?.version || "unknown",
                severity: severity.toLowerCase(),
                title: (advisory?.title as string) || `Vulnerability in ${pkgName}`,
                cve: (advisory?.cve as string) || null,
                fixedIn: (advisory?.fixed_in as string) || null,
              });
            }
          }

          if (via.length === 0) {
            vulnerabilities.push({
              packageName: pkgName,
              currentVersion: "unknown",
              severity: severity.toLowerCase(),
              title: `${pkgName} has vulnerabilities`,
              cve: null,
              fixedIn: null,
            });
          }
        }

        const totalDeps = (parsed?.metadata?.totalDependencies as number) || 0;
        return { totalDeps, vulnerabilities, techStack: "node" };
      } catch {
        // If parsing fails, return empty result
        return { totalDeps: 0, vulnerabilities: [], techStack: "node" };
      }
    }

    // If no output, something else failed
    console.error(`[SCANNER] npm audit failed for ${projectPath}:`, (error as Error).message);
    return { totalDeps: 0, vulnerabilities: [], techStack: "node" };
  }
}

export function getOutdatedPackages(projectPath: string): Array<{
  packageName: string;
  current: string;
  wanted: string;
  latest: string;
}> {
  try {
    const output = execSync("npm outdated --json", {
      cwd: projectPath,
      timeout: 15000,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    const parsed = JSON.parse(output);
    const result: Array<{ packageName: string; current: string; wanted: string; latest: string }> = [];

    for (const [pkgName, pkgData] of Object.entries(parsed)) {
      const data = pkgData as { current?: string; wanted?: string; latest?: string };
      result.push({
        packageName: pkgName,
        current: data.current || "unknown",
        wanted: data.wanted || "unknown",
        latest: data.latest || "unknown",
      });
    }

    return result;
  } catch {
    return [];
  }
}
