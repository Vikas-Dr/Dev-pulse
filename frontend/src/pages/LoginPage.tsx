import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DevPulseLogo from "../components/Logo";
import { IconShield, IconSecure } from "../components/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Login failed. Please try again.";
      setError(message || "Login failed. Please try again.");
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-dvh flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-5">
            <DevPulseLogo size={56} animated showText={false} />
          </div>
          <h1 className="font-mono font-bold text-2xl sm:text-3xl text-text-primary">
            DevPulse
          </h1>
          <p className="font-mono text-xs text-text-secondary mt-1 tracking-[0.2em] uppercase">
            Project Health Dashboard
          </p>
        </div>

        <div
          key={shakeKey}
          className={`card p-6 ${error ? "shake" : ""}`}
        >
          <h2 className="font-mono font-semibold text-text-primary mb-6 flex items-center gap-2">
            <IconShield size={16} className="text-pulse-green" />
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field ${error ? "input-error" : ""}`}
                placeholder="you@example.com"
                required
                autoFocus
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field ${error ? "input-error" : ""}`}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-pulse-red text-sm font-medium flex items-center gap-2">
                <span>!</span>
                <span>{error}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-pulse-green/30 border-t-pulse-green animate-spin" />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pulse-green hover:text-pulse-green/80 hover:underline font-medium transition-colors"
            >
              Register
            </Link>
          </p>

          <div className="mt-5 pt-4 border-t border-surface-border border-dashed">
            <p className="text-xs text-text-secondary flex items-center gap-1.5 justify-center">
              <IconSecure size={14} className="flex-shrink-0" />
              Demo: <span className="font-mono">demo@devpulse.local</span> /{" "}
              <span className="font-mono">Demo@123</span>
            </p>
          </div>
        </div>

        {/* Footer on auth page */}
        <p className="mt-8 text-center font-mono text-[10px] text-text-secondary/40">
          DevPulse &copy; {new Date().getFullYear()} &mdash; Self-hosted project health dashboard
        </p>
      </div>
    </div>
  );
}
