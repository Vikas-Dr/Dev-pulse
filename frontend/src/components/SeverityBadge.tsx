interface SeverityBadgeProps {
  severity: string;
}

const severityConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  critical: {
    bg: "bg-pulse-red/15",
    text: "text-pulse-red",
    label: "CRITICAL",
  },
  high: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    label: "HIGH",
  },
  medium: {
    bg: "bg-pulse-amber/15",
    text: "text-pulse-amber",
    label: "MEDIUM",
  },
  low: {
    bg: "bg-pulse-green/15",
    text: "text-pulse-green",
    label: "LOW",
  },
};

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity.toLowerCase()] || {
    bg: "bg-text-secondary/10",
    text: "text-text-secondary",
    label: severity.toUpperCase(),
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
