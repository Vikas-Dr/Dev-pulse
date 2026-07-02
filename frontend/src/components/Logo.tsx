interface LogoProps {
  size?: number;
  animated?: boolean;
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
  className?: string;
}

const textSizeMap = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export default function DevPulseLogo({
  size = 36,
  animated = true,
  showText = false,
  textSize = "md",
  className = "",
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Logo mark — shield + pulse line */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="DevPulse"
        >
          {/* Shield background */}
          <path
            d="M18 2L5 8v7c0 6.5 4.5 12.5 13 17 8.5-4.5 13-10.5 13-17V8L18 2z"
            fill="url(#logo-gradient)"
            fillOpacity="0.12"
            stroke="#4ADE80"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Inner shield accent */}
          <path
            d="M18 5L8 10v5.5c0 5.2 3.6 10 10 13.6 6.4-3.6 10-8.4 10-13.6V10L18 5z"
            fill="url(#logo-gradient)"
            fillOpacity="0.08"
            stroke="#4ADE80"
            strokeWidth="0.75"
            strokeOpacity="0.3"
            strokeLinejoin="round"
          />
          {/* Pulse/heartbeat line */}
          <path
            d="M8 19.5h4l2-4 3 7 2.5-5 2 3.5 2.5-2.5 2 1"
            stroke="#4ADE80"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? "animate-pulse-slow" : ""}
            opacity="0.9"
          />
          {/* Pulse dot at the end */}
          <circle
            cx="26"
            cy="19.5"
            r="1.5"
            fill="#4ADE80"
            className={animated ? "animate-pulse-medium" : ""}
            opacity="0.7"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="logo-gradient" x1="18" y1="2" x2="18" y2="32">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient glow ring — only when animated */}
        {animated && (
          <span
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(74,222,128,0.3) 0%, transparent 70%)",
              animation: "pulse-ring 3s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Text */}
      {showText && (
        <div>
          <h1 className={`font-mono font-bold text-text-primary ${textSizeMap[textSize]} leading-tight`}>
            DevPulse
          </h1>
          {textSize !== "sm" && (
            <p className="font-mono text-[9px] sm:text-[10px] text-text-secondary tracking-[0.2em] uppercase">
              Health Dashboard
            </p>
          )}
        </div>
      )}
    </div>
  );
}
