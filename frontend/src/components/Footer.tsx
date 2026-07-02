export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-card/50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-10 sm:h-12">
        <p className="font-mono text-[10px] sm:text-xs text-text-secondary/60">
          DevPulse <span className="hidden sm:inline">— Self-hosted project health dashboard</span>
        </p>
        <p className="font-mono text-[10px] sm:text-xs text-text-secondary/40">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
