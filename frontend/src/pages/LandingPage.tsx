import { Link } from "react-router-dom";
import DevPulseLogo from "../components/Logo";
import { IconShield, IconScan, IconGitHub, IconEmptyScan, IconChevronRight } from "../components/icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col text-text-primary transition-colors duration-200 overflow-hidden relative selection:bg-pulse-green/30">
      
      {/* Background neon glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-pulse-green/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-pulse-green/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-border transition-colors duration-150 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DevPulseLogo size={32} showText={true} textSize="sm" />
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-mono text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary py-1.5 px-4 font-mono font-bold text-xs"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pulse-green/5 border border-pulse-green/20 text-pulse-green font-mono text-[11px] font-medium tracking-wide mb-6 animate-pulse">
          <IconShield size={12} /> Live Dependency Vulnerability Scanning
        </div>

        <h1 className="font-mono font-bold text-4xl sm:text-6xl text-text-primary tracking-tight leading-[1.1] mb-6 max-w-4xl">
          Automate Your Codebase <br />
          <span className="bg-gradient-to-r from-pulse-green via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Security Audits
          </span>
        </h1>

        <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed mb-8">
          DevPulse continuously scans your local project folders and linked GitHub repositories, providing instant alerts, patch fixes, and printable security reports.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm">
          <Link
            to="/register"
            className="btn-primary w-full py-3 font-mono font-bold text-sm flex items-center justify-center gap-2 group"
          >
            Start Free Scan <IconChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/Vikas-Dr/Dev-pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost w-full py-3 font-mono font-semibold text-sm border border-surface-border hover:border-text-secondary/40 flex items-center justify-center gap-2"
          >
            <IconGitHub size={16} /> View on GitHub
          </a>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-16 pt-12 border-t border-surface-border/50">
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-bold font-mono text-pulse-green">100%</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold mt-1">Automated scans</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-bold font-mono text-pulse-green">&lt; 1.5s</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold mt-1">Scan Latency</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-bold font-mono text-pulse-green">Zero</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold mt-1">Setup required</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-bold font-mono text-pulse-green">PDF</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold mt-1">Printable audits</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-surface-card/30 border-t border-b border-surface-border/50 py-16 px-4 no-print">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-mono font-bold text-2xl text-center text-text-primary mb-12">
            Engineered for Security
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="card-hover bg-surface-card p-6 border border-surface-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-pulse-green/5 border border-pulse-green/20 flex items-center justify-center text-pulse-green mb-4">
                <IconScan size={20} />
              </div>
              <h3 className="font-mono font-bold text-base text-text-primary mb-2">
                Instant Local Scanning
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Connect absolute directory paths from your workspace. DevPulse performs direct package audit scans without exposing source code.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-hover bg-surface-card p-6 border border-surface-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-pulse-green/5 border border-pulse-green/20 flex items-center justify-center text-pulse-green mb-4">
                <IconGitHub size={20} />
              </div>
              <h3 className="font-mono font-bold text-base text-text-primary mb-2">
                GitHub Pipeline Audits
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Paste any remote repository clone URL. DevPulse will securely pull commits, watch pull requests, and audit pipeline workflows.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-hover bg-surface-card p-6 border border-surface-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-pulse-green/5 border border-pulse-green/20 flex items-center justify-center text-pulse-green mb-4">
                <IconEmptyScan size={20} />
              </div>
              <h3 className="font-mono font-bold text-base text-text-primary mb-2">
                Printable PDF Exports
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Generate clean, professional security report summaries. Uses native print layout formatting for quick downloads.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-text-secondary border-t border-surface-border/30 mt-auto font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} DevPulse Security. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-text-primary">Privacy</a>
            <a href="#" className="hover:text-text-primary">Terms</a>
            <a href="https://github.com/Vikas-Dr/Dev-pulse" className="hover:text-text-primary">Docs</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
