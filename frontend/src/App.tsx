import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AddProjectPage from "./pages/AddProjectPage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import ToastContainer from "./components/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
  },
});

function RootRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? (
    <ProtectedRoute>
      <Layout>
        <DashboardPage />
      </Layout>
    </ProtectedRoute>
  ) : (
    <LandingPage />
  );
}

function AppContent() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
    const theme = localStorage.getItem("devpulse-theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [initialize]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={<RootRoute />}
      />
      <Route
        path="/projects/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddProjectPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
