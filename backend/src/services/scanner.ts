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

export function detectTechStack(projectPath: string): string {
  if (fs.existsSync(path.join(projectPath, "package.json"))) return "node";
  if (fs.existsSync(path.join(projectPath, "requirements.txt"))) return "python";
  if (fs.existsSync(path.join(projectPath, "Cargo.toml"))) return "rust";
  if (fs.existsSync(path.join(projectPath, "go.mod"))) return "go";

  // Check subdirectories (one level deep)
  try {
    const files = fs.readdirSync(projectPath);
    for (const file of files) {
      const fullPath = path.join(projectPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (fs.existsSync(path.join(fullPath, "package.json"))) return "node";
        if (fs.existsSync(path.join(fullPath, "requirements.txt"))) return "python";
        if (fs.existsSync(path.join(fullPath, "Cargo.toml"))) return "rust";
        if (fs.existsSync(path.join(fullPath, "go.mod"))) return "go";
      }
    }
  } catch {}

  return "unknown";
}

export function getTechStackPath(projectPath: string): string {
  if (fs.existsSync(path.join(projectPath, "package.json"))) return projectPath;
  if (fs.existsSync(path.join(projectPath, "requirements.txt"))) return projectPath;
  if (fs.existsSync(path.join(projectPath, "Cargo.toml"))) return projectPath;
  if (fs.existsSync(path.join(projectPath, "go.mod"))) return projectPath;

  try {
    const files = fs.readdirSync(projectPath);
    for (const file of files) {
      const fullPath = path.join(projectPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (fs.existsSync(path.join(fullPath, "package.json"))) return fullPath;
        if (fs.existsSync(path.join(fullPath, "requirements.txt"))) return fullPath;
        if (fs.existsSync(path.join(fullPath, "Cargo.toml"))) return fullPath;
        if (fs.existsSync(path.join(fullPath, "go.mod"))) return fullPath;
      }
    }
  } catch {}

  return projectPath;
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
