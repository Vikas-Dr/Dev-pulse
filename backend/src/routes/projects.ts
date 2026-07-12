import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { authenticate, AuthRequest } from "../middleware/auth";
import { scanProject, detectTechStack } from "../services/scanner";
import { patchPackage } from "../services/patcher";
import { checkGitStatus, getGitHubRepoOfProject, parseGitHubRepo, cloneGitRepo } from "../services/gitCheck";

const router = Router();
const prisma = new PrismaClient();

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  path: z.string().min(1, "Project path is required"),
  destinationPath: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").optional(),
  path: z.string().min(1, "Project path is required").optional(),
  githubRepo: z.string().nullable().optional(),
});

const patchSchema = z.object({
  packages: z.array(z.string()).min(1, "At least one package is required"),
});

// POST /api/projects
router.post("/", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createProjectSchema.parse(req.body);

    const isGitUrl = data.path.includes("github.com") || data.path.startsWith("git@") || data.path.startsWith("http");
    let scanPath = data.path;
    let githubRepo: string | null = null;

    if (isGitUrl) {
      githubRepo = parseGitHubRepo(data.path);
      if (!githubRepo) {
        res.status(400).json({ error: "Invalid GitHub repository URL" });
        return;
      }
      const folderName = githubRepo.replace("/", "-");
      scanPath = data.destinationPath || path.resolve(__dirname, "../../clones", folderName);

      if (!fs.existsSync(scanPath)) {
        console.log(`[PROJECTS] Cloning ${data.path} into ${scanPath}...`);
        try {
          await cloneGitRepo(data.path, scanPath);
        } catch (cloneErr: any) {
          res.status(500).json({ error: `Failed to clone repository: ${cloneErr.message}` });
          return;
        }
      }
    } else {
      githubRepo = getGitHubRepoOfProject(data.path);
    }

    const existing = await prisma.project.findFirst({
      where: { userId: req.user!.userId, path: scanPath },
    });
    if (existing) {
      res.status(409).json({ error: "Project with this source already exists" });
      return;
    }

    const techStack = detectTechStack(scanPath);

    const project = await prisma.project.create({
      data: {
        name: data.name,
        path: scanPath,
        userId: req.user!.userId,
        githubRepo,
        techStack,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error("[PROJECTS] Create error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/projects
router.get("/", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.userId },
      include: {
        scans: {
          take: 1,
          orderBy: { scannedAt: "desc" },
          include: {
            vulnerabilities: true,
          },
        },
      },
      orderBy: { addedAt: "desc" },
    });

    const result = projects.map((p) => {
      const latestScan = p.scans[0] || null;
      const criticalCount = latestScan
        ? latestScan.vulnerabilities.filter((v) => v.severity === "critical").length
        : 0;
      const highCount = latestScan
        ? latestScan.vulnerabilities.filter((v) => v.severity === "high").length
        : 0;
      const mediumCount = latestScan
        ? latestScan.vulnerabilities.filter((v) => v.severity === "medium").length
        : 0;
      const lowCount = latestScan
        ? latestScan.vulnerabilities.filter((v) => v.severity === "low").length
        : 0;

      return {
        id: p.id,
        name: p.name,
        path: p.path,
        techStack: p.techStack,
        addedAt: p.addedAt,
        lastScanned: p.lastScanned,
        gitStatus: p.gitStatus,
        lastCommit: p.lastCommit,
        healthScore: p.healthScore,
        githubRepo: p.githubRepo,
        latestScan: latestScan
          ? {
              id: latestScan.id,
              scannedAt: latestScan.scannedAt,
              totalDeps: latestScan.totalDeps,
              vulnerabilities: {
                critical: criticalCount,
                high: highCount,
                medium: mediumCount,
                low: lowCount,
                total: latestScan.vulnerabilities.length,
              },
            }
          : null,
      };
    });

    res.json({ projects: result });
  } catch (error) {
    console.error("[PROJECTS] List error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/projects/:id
router.get("/:id", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const projectId = (req.params.id as string) as string;
  try {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user!.userId },
      include: {
        scans: {
          orderBy: { scannedAt: "desc" },
          include: {
            vulnerabilities: true,
          },
        },
        patches: {
          orderBy: { patchedAt: "desc" },
          take: 50,
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.json({ project });
  } catch (error) {
    console.error("[PROJECTS] Get error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: (req.params.id as string), userId: req.user!.userId },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    await prisma.project.delete({ where: { id: (req.params.id as string) } });
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("[PROJECTS] Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/projects/:id/scan
router.post("/:id/scan", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: (req.params.id as string), userId: req.user!.userId },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    // Run scan
    const scanResult = scanProject(project.path);
    const gitInfo = checkGitStatus(project.path);
    const githubRepo = getGitHubRepoOfProject(project.path);

    // Create scan record
    const scan = await prisma.scan.create({
      data: {
        projectId: project.id,
        totalDeps: scanResult.totalDeps,
        vulnerabilities: {
          create: scanResult.vulnerabilities.map((v) => ({
            packageName: v.packageName,
            currentVersion: v.currentVersion,
            severity: v.severity,
            title: v.title,
            cve: v.cve,
            fixedIn: v.fixedIn,
          })),
        },
      },
      include: { vulnerabilities: true },
    });

    // Update project info
    const criticalCount = scanResult.vulnerabilities.filter((v) => v.severity === "critical").length;
    const highCount = scanResult.vulnerabilities.filter((v) => v.severity === "high").length;
    const healthScore = Math.max(0, 100 - criticalCount * 20 - highCount * 10);

    await prisma.project.update({
      where: { id: project.id },
      data: {
        lastScanned: new Date(),
        techStack: scanResult.techStack,
        gitStatus: gitInfo.gitStatus,
        lastCommit: gitInfo.lastCommit,
        healthScore,
        githubRepo: githubRepo || project.githubRepo,
      },
    });

    res.json({ scan });
  } catch (error) {
    console.error("[PROJECTS] Scan error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/projects/:id/patch
router.post("/:id/patch", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = patchSchema.parse(req.body);
    const project = await prisma.project.findFirst({
      where: { id: (req.params.id as string), userId: req.user!.userId },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const results = [];
    for (const pkg of data.packages) {
      const patchResult = patchPackage(project.path, pkg);
      const patch = await prisma.patch.create({
        data: {
          projectId: project.id,
          packageName: pkg,
          fromVersion: patchResult.fromVersion,
          toVersion: patchResult.toVersion,
          status: patchResult.status,
          output: patchResult.output,
        },
      });
      results.push(patch);
    }

    res.json({ patches: results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error("[PROJECTS] Patch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/projects/:id
router.put("/:id", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = updateProjectSchema.parse(req.body);
    const projectId = req.params.id as string;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user!.userId },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    let githubRepo = data.githubRepo;
    if (githubRepo) {
      if (githubRepo.includes("github.com")) {
        const parsed = parseGitHubRepo(githubRepo);
        if (parsed) {
          githubRepo = parsed;
        }
      }
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name ?? undefined,
        path: data.path ?? undefined,
        githubRepo: data.githubRepo !== undefined ? githubRepo : undefined,
      },
    });

    res.json({ project: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error("[PROJECTS] Update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

