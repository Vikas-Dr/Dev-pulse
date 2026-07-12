import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /api/dashboard/stats
router.get("/stats", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.userId },
      include: {
        scans: {
          take: 1,
          orderBy: { scannedAt: "desc" },
          include: { vulnerabilities: true },
        },
      },
    });

    const totalProjects = projects.length;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let lastScanTime: string | null = null;

    for (const project of projects) {
      const latestScan = project.scans[0];
      if (latestScan) {
        criticalCount += latestScan.vulnerabilities.filter((v: any) => v.severity === "critical").length;
        highCount += latestScan.vulnerabilities.filter((v: any) => v.severity === "high").length;
        mediumCount += latestScan.vulnerabilities.filter((v: any) => v.severity === "medium").length;
        lowCount += latestScan.vulnerabilities.filter((v: any) => v.severity === "low").length;

        const scanTime = latestScan.scannedAt.toISOString();
        if (!lastScanTime || scanTime > lastScanTime) {
          lastScanTime = scanTime;
        }
      }
    }

    const healthyProjects = projects.filter(
      (p: any) => p.healthScore !== null && p.healthScore >= 80
    ).length;

    res.json({
      totalProjects,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      healthyProjects,
      vulnerableProjects: projects.filter((p: any) => {
        const s = p.scans[0];
        return s && s.vulnerabilities.length > 0;
      }).length,
      lastScanTime,
    });
  } catch (error) {
    console.error("[DASHBOARD] Stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/scans/:projectId
router.get("/scans/:projectId", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const projectId = req.params.projectId as string;
  try {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user!.userId },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const scans = await prisma.scan.findMany({
      where: { projectId },
      orderBy: { scannedAt: "desc" },
      include: {
        _count: { select: { vulnerabilities: true } },
      },
    });

    res.json({ scans });
  } catch (error) {
    console.error("[DASHBOARD] Scans error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/vulnerabilities/:scanId
router.get("/vulnerabilities/:scanId", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const scanId = req.params.scanId as string;
  try {
    // Verify scan belongs to user's project
    const scan = await prisma.scan.findUnique({
      where: { id: scanId },
      include: { project: { select: { userId: true } } },
    });

    if (!scan || scan.project.userId !== req.user!.userId) {
      res.status(404).json({ error: "Scan not found" });
      return;
    }

    const vulnerabilities = await prisma.vulnerability.findMany({
      where: { scanId },
    });

    // Sort by severity: critical > high > medium > low
    const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    vulnerabilities.sort((a: any, b: any) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));

    res.json({ vulnerabilities });
  } catch (error) {
    console.error("[DASHBOARD] Vulnerabilities error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/patches/:projectId
router.get("/patches/:projectId", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const projectId = req.params.projectId as string;
  try {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user!.userId },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const patches = await prisma.patch.findMany({
      where: { projectId },
      orderBy: { patchedAt: "desc" },
      take: 50,
    });

    res.json({ patches });
  } catch (error) {
    console.error("[DASHBOARD] Patches error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
