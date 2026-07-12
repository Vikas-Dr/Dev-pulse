import { useState, FormEvent, useEffect } from "react";
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
  const loginGoogle = useAuthStore((s) => s.loginGoogle);

  const handleGoogleRedirect = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback";
    
    const options = {
      redirect_uri: redirectUri,
      client_id: clientId,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ].join(" ")
    };
    const qs = new URLSearchParams(options);
    window.location.href = `${rootUrl}?${qs.toString()}`;
  };

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

          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border/50"></div>
            </div>
            <span className="relative px-3 text-[10px] uppercase font-mono text-text-secondary bg-surface-card">
              or
            </span>
          </div>

          <div className="flex justify-center w-full min-h-[40px] mb-4">
            <button
              type="button"
              onClick={handleGoogleRedirect}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-full border border-surface-border bg-surface-card hover:bg-surface-border/20 text-text-primary font-mono text-xs font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-pulse-green"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

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
