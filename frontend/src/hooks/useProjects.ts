import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import { useProjectStore, ProjectSummary } from "../stores/projectStore";
import { toast } from "../stores/toastStore";

interface DashboardStats {
  totalProjects: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  healthyProjects: number;
  vulnerableProjects: number;
  lastScanTime: string | null;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/stats");
      return response.data;
    },
    refetchInterval: 30000,
  });
}

export function useProjects() {
  const setProjects = useProjectStore((s) => s.setProjects);

  return useQuery<{ projects: ProjectSummary[] }>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await apiClient.get("/projects");
      setProjects(response.data.projects);
      return response.data;
    },
    refetchInterval: 15000,
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useScanProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiClient.post(`/projects/${projectId}/scan`);
      return response.data;
    },
    onSuccess: (data, projectId) => {
      toast.success("Scan completed");
      if (data.project) {
        queryClient.setQueryData(["project", projectId], { project: data.project });
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => {
      toast.error("Scan failed");
    },
  });
}

export function usePatchProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      packages,
    }: {
      projectId: string;
      packages: string[];
    }) => {
      const response = await apiClient.post(`/projects/${projectId}/patch`, {
        packages,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Patch applied successfully");
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => {
      toast.error("Patch failed");
    },
  });
}

export function useAddProject() {
  const queryClient = useQueryClient();
  const addProject = useProjectStore((s) => s.addProject);

  return useMutation({
    mutationFn: async (data: { name: string; path: string; destinationPath?: string }) => {
      const response = await apiClient.post("/projects", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Project added successfully");
      addProject(data.project);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => {
      toast.error("Failed to add project");
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const updateProject = useProjectStore((s) => s.updateProject);

  return useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: string;
      data: { name?: string; path?: string; githubRepo?: string | null };
    }) => {
      const response = await apiClient.put(`/projects/${projectId}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Project updated successfully");
      updateProject(data.project.id, data.project);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.project.id] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const removeProject = useProjectStore((s) => s.removeProject);

  return useMutation({
    mutationFn: async (projectId: string) => {
      await apiClient.delete(`/projects/${projectId}`);
      return projectId;
    },
    onSuccess: (projectId) => {
      toast.success("Project deleted");
      removeProject(projectId);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
}
