import { execSync } from "child_process";

export interface PatchResult {
  packageName: string;
  fromVersion: string;
  toVersion: string;
  status: "success" | "failed";
  output: string;
}

export function patchPackage(projectPath: string, packageName: string): PatchResult {
  try {
    // Get current version before patching
    let fromVersion = "unknown";
    try {
      const pkgJson = JSON.parse(
        execSync("cat package.json", {
          cwd: projectPath,
          timeout: 5000,
          encoding: "utf-8",
        })
      );
      fromVersion =
        pkgJson.dependencies?.[packageName] ||
        pkgJson.devDependencies?.[packageName] ||
        "unknown";
    } catch {
      // ignore
    }

    const output = execSync(`npm install ${packageName}@latest`, {
      cwd: projectPath,
      timeout: 60000,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    // Get new version
    let toVersion = "unknown";
    try {
      const updatedPkg = JSON.parse(
        execSync("cat package.json", {
          cwd: projectPath,
          timeout: 5000,
          encoding: "utf-8",
        })
      );
      toVersion =
        updatedPkg.dependencies?.[packageName] ||
        updatedPkg.devDependencies?.[packageName] ||
        "latest";
    } catch {
      toVersion = "latest";
    }

    return {
      packageName,
      fromVersion,
      toVersion,
      status: "success",
      output: output.substring(0, 2000),
    };
  } catch (error: unknown) {
    const execError = error as { stdout?: string; stderr?: string; message?: string };
    return {
      packageName,
      fromVersion: "unknown",
      toVersion: "unknown",
      status: "failed",
      output: execError?.stderr || execError?.message || "Unknown error",
    };
  }
}
