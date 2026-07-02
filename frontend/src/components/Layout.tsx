import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Header from "./Header";
import Footer from "./Footer";
import DevPulseLogo from "./Logo";
import { IconDashboard, IconProjects, IconSettings } from "./icons";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <IconDashboard size={18} /> },
  { label: "Add Project", path: "/projects/add", icon: <IconProjects size={18} /> },
  { label: "Settings", path: "/settings", icon: <IconSettings size={18} /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen min-h-dvh bg-surface flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-surface-card border-r border-surface-border
          transform transition-all duration-300 ease-out
          lg:transform-none
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none"}`}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="px-5 py-5 border-b border-surface-border">
            <Link to="/" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
              <div className="transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                <DevPulseLogo size={30} animated showText={false} />
              </div>
              <div>
                <h1 className="font-mono font-bold text-text-primary text-base leading-tight">
                  DevPulse
                </h1>
                <p className="font-mono text-[9px] text-text-secondary tracking-[0.2em] uppercase">
                  Health Dashboard
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 ease-out
                    active:scale-[0.98]
                    ${isActive
                      ? "bg-pulse-green/10 text-pulse-green border border-pulse-green/20 shadow-[0_0_12px_rgba(74,222,128,0.06)]"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-border/30 border border-transparent"
                    }`}
                >
                  <span className="flex-shrink-0 w-5 flex items-center justify-center">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-surface-border">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="btn-ghost text-xs flex-shrink-0"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto max-w-full">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
