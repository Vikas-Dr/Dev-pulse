import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import DevPulseLogo from "../components/Logo";
import { IconShield, IconSecure } from "../components/icons";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(email, password, name);
      navigate("/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : "Registration failed. Please try again.";
      setError(message || "Registration failed. Please try again.");
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
            Create account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`input-field ${error ? "input-error" : ""}`}
                placeholder="Your name"
                required
                autoFocus
              />
            </div>

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
                placeholder="At least 6 characters"
                required
                minLength={6}
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
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-pulse-green/30 border-t-pulse-green animate-spin" />
              )}
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pulse-green hover:text-pulse-green/80 hover:underline font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>

          <div className="mt-5 pt-4 border-t border-surface-border border-dashed">
            <p className="text-xs text-text-secondary flex items-center gap-1.5 justify-center">
              <IconSecure size={14} className="flex-shrink-0" />
              Secure registration — all data stays on your machine
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
