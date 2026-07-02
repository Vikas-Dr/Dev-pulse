import { create } from "zustand";

export interface ProjectSummary {
  id: string;
  name: string;
  path: string;
  techStack: string;
  addedAt: string;
  lastScanned: string | null;
  gitStatus: string | null;
  lastCommit: string | null;
  healthScore: number | null;
  latestScan: {
    id: string;
    scannedAt: string;
    totalDeps: number;
    vulnerabilities: {
      critical: number;
      high: number;
      medium: number;
      low: number;
      total: number;
    };
  } | null;
}

interface ProjectState {
  projects: ProjectSummary[];
  selectedProjectId: string | null;
  setProjects: (projects: ProjectSummary[]) => void;
  setSelectedProjectId: (id: string | null) => void;
  addProject: (project: ProjectSummary) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<ProjectSummary>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProjectId: null,

  setProjects: (projects) => set({ projects }),

  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
}));
