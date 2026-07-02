import { useAuthStore } from "../stores/authStore";
import { IconShield, IconSecure } from "../components/icons";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div>
        <h1 className="font-mono font-bold text-xl sm:text-2xl text-text-primary">
          Settings
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Account information
        </p>
      </div>

      <div className="card p-6">
        <h2 className="font-mono font-semibold text-text-primary mb-4 flex items-center gap-2">
          <IconShield size={16} className="text-pulse-green" />
          Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <p className="font-mono text-text-primary">{user?.name || "—"}</p>
          </div>

          <div>
            <label className="label">Email</label>
            <p className="font-mono text-text-primary">{user?.email || "—"}</p>
          </div>

          <div>
            <label className="label">Account Created</label>
            <p className="font-mono text-text-primary text-sm">
              {user?.id ? "Active" : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-mono font-semibold text-text-primary mb-4 flex items-center gap-2">
          <IconShield size={16} className="text-pulse-green" />
          About DevPulse
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          DevPulse is a self-hosted project health dashboard for indie developers
          and solo engineers. It monitors your local projects for dependency
          vulnerabilities, tracks git status, and provides one-click patching.
        </p>
        <p className="text-sm text-text-secondary mt-3 leading-relaxed">
          No data leaves your machine. All scanning and patching happens locally.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="font-mono font-semibold text-text-primary mb-4 flex items-center gap-2">
          <IconSecure size={16} className="text-pulse-green" />
          Demo Credentials
        </h2>
        <div className="text-sm text-text-secondary space-y-1">
          <p>
            Email:{" "}
            <span className="font-mono text-text-primary">
              demo@devpulse.local
            </span>
          </p>
          <p>
            Password:{" "}
            <span className="font-mono text-text-primary">Demo@123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
