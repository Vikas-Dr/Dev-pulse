import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DevPulseLogo from "../components/Logo";

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginGoogle } = useAuth();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const hasExecuted = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("No authorization code returned from Google.");
      setStatus("error");
      return;
    }

    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const redirectUri = (import.meta as any).env.VITE_GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback";

    const exchangeCode = async () => {
      try {
        await loginGoogle(code, redirectUri);
        setStatus("success");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (err: any) {
        console.error("Google OAuth token exchange failed:", err);
        const msg = err?.response?.data?.error || "Google authentication failed. Please try again.";
        setError(msg);
        setStatus("error");
      }
    };

    exchangeCode();
  }, [searchParams, loginGoogle, navigate]);

  if (status === "error") {
    return (
      <div className="min-h-screen min-h-dvh flex items-center justify-center px-4 py-8 bg-surface">
        <div className="w-full max-w-sm card p-6 border border-pulse-red/35 text-center shake">
          <div className="inline-flex items-center justify-center mb-4 text-pulse-red">
            <span className="text-3xl font-bold font-mono">!</span>
          </div>
          <h2 className="font-mono font-bold text-lg text-text-primary mb-2">
            Authentication Error
          </h2>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            {error}
          </p>
          <Link
            to="/login"
            className="btn-primary w-full py-2.5 font-mono font-bold block"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen min-h-dvh flex items-center justify-center px-4 py-8 bg-surface">
        <div className="w-full max-w-sm card p-6 border border-pulse-green/35 text-center modal-enter">
          <div className="inline-flex items-center justify-center mb-4 text-pulse-green">
            <svg className="w-12 h-12 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-mono font-bold text-lg text-text-primary mb-2">
            Success!
          </h2>
          <p className="text-xs text-text-secondary font-mono">
            Successfully authenticated with Google.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="text-[10px] text-pulse-green/75 font-mono animate-pulse">
              Redirecting to dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh flex items-center justify-center px-4 py-8 bg-surface">
      <div className="w-full max-w-sm text-center space-y-5 page-enter">
        <div className="inline-flex items-center justify-center">
          <DevPulseLogo size={56} animated={true} showText={false} />
        </div>
        <div className="space-y-2">
          <h2 className="font-mono font-bold text-lg text-text-primary">
            Authenticating
          </h2>
          <p className="text-xs text-text-secondary font-mono leading-normal">
            Exchanging Google authorization code...
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <span className="w-8 h-8 rounded-full border-3 border-pulse-green/20 border-t-pulse-green animate-spin" />
        </div>
      </div>
    </div>
  );
}
