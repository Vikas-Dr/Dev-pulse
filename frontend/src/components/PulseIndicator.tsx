type Severity = "healthy" | "warning" | "critical" | "none";

interface PulseIndicatorProps {
  severity: Severity;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const severityConfig: Record<
  Severity,
  { color: string; animation: string }
> = {
  healthy: {
    color: "border-pulse-green",
    animation: "animate-pulse-slow",
  },
  warning: {
    color: "border-pulse-amber",
    animation: "animate-pulse-medium",
  },
  critical: {
    color: "border-pulse-red",
    animation: "animate-pulse-fast",
  },
  none: {
    color: "border-surface-border",
    animation: "",
  },
};

export default function PulseIndicator({
  severity,
  size = "md",
}: PulseIndicatorProps) {
  const config = severityConfig[severity];
  const baseColor =
    severity === "healthy"
      ? "bg-pulse-green/20"
      : severity === "warning"
        ? "bg-pulse-amber/20"
        : severity === "critical"
          ? "bg-pulse-red/20"
          : "bg-surface-border/30";

  return (
    <span className={`relative inline-flex ${sizeMap[size]}`}>
      <span
        className={`absolute inset-0 rounded-full border ${config.color} ${config.animation}`}
      />
      <span
        className={`absolute inset-1 rounded-full ${baseColor}`}
      />
    </span>
  );
}
