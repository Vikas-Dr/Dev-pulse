import { create } from "zustand";
import apiClient from "../api/client";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    const stored = localStorage.getItem("devpulse-auth");
    if (stored) {
      try {
        const { accessToken } = JSON.parse(stored);
        if (accessToken) {
          get().fetchMe();
          return;
        }
      } catch {
        localStorage.removeItem("devpulse-auth");
      }
    }
    set({ isLoading: false });
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem(
      "devpulse-auth",
      JSON.stringify({ accessToken, refreshToken })
    );

    set({ user, isAuthenticated: true });
  },

  register: async (email: string, password: string, name: string) => {
    const response = await apiClient.post("/auth/register", {
      email,
      password,
      name,
    });
    const { user, accessToken, refreshToken } = response.data;

    localStorage.setItem(
      "devpulse-auth",
      JSON.stringify({ accessToken, refreshToken })
    );

    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("devpulse-auth");
    set({ user: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("devpulse-auth");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
