import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import DevPulseLogo from "./Logo";
import PulseIndicator from "./PulseIndicator";
import { IconMenu, IconSun, IconMoon } from "./icons";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("devpulse-theme") || "dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("devpulse-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-surface-card/90 backdrop-blur-md border-b border-surface-border">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16">
        {/* Left — logo + menu (mobile) */}
        <div className="flex items-center gap-3">
          {/* Hamburger (mobile only) */}
          <button
            onClick={onMenuClick}
            className="btn-ghost p-2 -ml-2 lg:hidden"
            aria-label="Open sidebar"
          >
            <IconMenu size={20} />
          </button>

          {/* Logo (desktop: full with text, mobile: icon only) */}
          <div className="hidden sm:block">
            <DevPulseLogo size={28} showText textSize="sm" />
          </div>
          <div className="sm:hidden">
            <DevPulseLogo size={26} showText textSize="sm" />
          </div>
        </div>

        {/* Right — system status + user */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-surface-border text-text-secondary hover:text-text-primary hover:bg-surface-border/20 transition-all duration-150 active:scale-[0.95] focus-visible:ring-1 focus-visible:ring-pulse-green"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>
          {/* System status */}
          <div className="hidden xs:flex items-center gap-2 px-2.5 py-1 rounded-md bg-pulse-green/5 border border-pulse-green/10">
            <PulseIndicator severity="healthy" size="sm" />
            <span className="font-mono text-[11px] text-pulse-green font-medium">All systems healthy</span>
          </div>

          {/* User info */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right min-w-0">
                <p className="text-sm font-medium text-text-primary truncate max-w-[120px] leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-text-secondary truncate max-w-[120px] leading-tight">
                  {user.email}
                </p>
              </div>

              {/* User avatar */}
              <div className="w-8 h-8 rounded-full bg-pulse-green/10 border border-pulse-green/20 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-sm font-semibold text-pulse-green">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>

              <button
                onClick={logout}
                className="btn-ghost text-xs px-2.5 py-1.5 hidden sm:block"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
