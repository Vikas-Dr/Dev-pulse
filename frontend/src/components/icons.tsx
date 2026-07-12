// DevPulse icon system — all icons are 24x24 viewBox, stroke-based, inherit currentColor
// Each icon accepts className and optional size override

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function createIcon(
  children: React.ReactNode,
  defaultTitle?: string
) {
  return ({ size = 20, className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={!defaultTitle}
      {...props}
    >
      {defaultTitle && <title>{defaultTitle}</title>}
      {children}
    </svg>
  );
}

// ── Navigation ──────────────────────────────────────────────

export const IconDashboard = createIcon(
  <>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </>,
  "Dashboard"
);

export const IconProjects = createIcon(
  <>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </>,
  "Projects"
);

export const IconSettings = createIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>,
  "Settings"
);

// ── Actions ──────────────────────────────────────────────────

export const IconAdd = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </>,
  "Add"
);

export const IconScan = createIcon(
  <>
    <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9" />
  </>,
  "Scan"
);

export const IconPatch = createIcon(
  <>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </>,
  "Patch"
);

export const IconDelete = createIcon(
  <>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>,
  "Delete"
);

export const IconClose = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </>,
  "Close"
);

export const IconChevronLeft = createIcon(
  <path d="M15 18l-6-6 6-6" />,
  "Back"
);

export const IconChevronRight = createIcon(
  <path d="M9 18l6-6-6-6" />,
  "Forward"
);

// ── Status / Alerts ──────────────────────────────────────────

export const IconAlert = createIcon(
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>,
  "Alert"
);

export const IconCheck = createIcon(
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />,
  "Success"
);

// ── Empty States ─────────────────────────────────────────────

export const IconEmptyProjects = createIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 3" opacity="0.4" />
    <path d="M12 8v8M8 12h8" opacity="0.4" />
  </>,
  "No projects"
);

export const IconEmptyScan = createIcon(
  <>
    <circle cx="12" cy="12" r="9" strokeDasharray="4 3" opacity="0.4" />
    <path d="M12 8v4l3 3" opacity="0.4" />
  </>,
  "No scans"
);

export const IconSecure = createIcon(
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>,
  "Secure"
);

export const IconShield = createIcon(
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </>,
  "Shield"
);

// ── Generic ──────────────────────────────────────────────────

export const IconExternalLink = createIcon(
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </>,
  "Open"
);

export const IconSearch = createIcon(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </>,
  "Search"
);

export const IconFilter = createIcon(
  <>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </>,
  "Filter"
);

export const IconMenu = createIcon(
  <>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </>,
  "Menu"
);

export const IconRefresh = createIcon(
  <>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </>,
  "Refresh"
);

// ── Tech Stack Icons (brand colors as fill) ──────────────────

export function TechNode({ size = 20, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#339933"
      className={className}
      aria-label="Node.js"
    >
      <path d="M11.998 24c-.473 0-.95-.122-1.375-.366l-4.38-2.59c-.654-.365-.334-.495-.12-.57.874-.305 1.05-.374 1.983-.907.1-.06.23-.038.333.025l3.364 1.997c.124.07.3.07.412 0l13.12-7.575c.123-.07.2-.21.2-.353V5.35c0-.143-.077-.282-.2-.353L12.47 2.243c-.123-.07-.29-.07-.412 0l-13.12 7.57c-.125.07-.2.207-.2.353v15.135c0 .145.077.283.2.355l3.595 2.074c1.952.975 3.15-.174 3.15-1.33V7.698c0-.208.166-.377.374-.377h1.664c.206 0 .376.167.376.377v16.268c0 2.604-1.42 4.1-3.89 4.1-.76 0-1.36-.083-2.16-.458L2.28 24.906c-.607.353-1.28.54-1.97.54C.133 25.442 0 25.308 0 25.117v-.615c0-.19.133-.346.308-.346.475 0 .947-.124 1.374-.357l4.383-2.536c.362-.206.583-.586.583-1.01V8.963c0-.424-.22-.804-.583-1.01L1.286 5.418C.86 5.186.388 5.062-.088 5.062.133 5.062 0 4.89 0 4.674v-.615c0-.19.133-.346.308-.346.475 0 .947-.124 1.374-.357l4.383-2.536c.723-.418 1.626-.418 2.35 0l13.12 7.57c.715.414 1.16 1.19 1.16 2.02v15.15c0 .827-.445 1.606-1.16 2.02l-13.12 7.57c-.42.24-.896.362-1.37.366z" />
    </svg>
  );
}

export function TechPython({ size = 20, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-label="Python"
    >
      <defs>
        <linearGradient id="py-a" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#387EB8" />
          <stop offset="100%" stopColor="#366E9E" />
        </linearGradient>
        <linearGradient id="py-b" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#FFC836" />
          <stop offset="100%" stopColor="#FFD43B" />
        </linearGradient>
      </defs>
      <path
        fill="url(#py-a)"
        d="M12.148 1.002c-4.345 0-4.076 1.888-4.076 1.888l.005 1.936h4.15v.58H5.863S1 4.993 1 9.42s2.467 4.19 2.467 4.19h1.473v-2.016s-.05-2.402 2.363-2.402h4.072s2.283.036 2.283-2.214V3.167S15.094 1 12.148 1.002zM9.44 2.626a.74.74 0 0 1 .545.75.75.75 0 0 1-.74.745.74.74 0 0 1-.55-.745.74.74 0 0 1 .745-.75z"
      />
      <path
        fill="url(#py-b)"
        d="M11.852 22.998c4.345 0 4.076-1.888 4.076-1.888l-.005-1.936h-4.15v-.58h6.364s4.863.087 4.863-4.336-2.467-4.19-2.467-4.19h-1.473v2.016s.05 2.402-2.363 2.402h-4.072s-2.283-.036-2.283 2.214v3.715s-.358 2.583 2.51 2.583zM14.56 21.374a.74.74 0 0 1-.545-.75.75.75 0 0 1 .74-.745.74.74 0 0 1 .55.745.74.74 0 0 1-.745.75z"
      />
    </svg>
  );
}

export function TechGo({ size = 20, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#00ADD8"
      className={className}
      aria-label="Go"
    >
      <path d="M1.81 10.15c-.1 0-.19-.08-.2-.18l-.28-1.44c-.02-.1.04-.2.13-.23a.2.2 0 0 1 .23.13l.27 1.38c.02.1-.04.2-.14.24zM1.18 8.85c-.05 0-.1-.02-.14-.06l-.91-.93a.16.16 0 0 1 0-.23.16.16 0 0 1 .23 0l.88.91c.06.06.06.17 0 .23-.03.04-.06.05-.1.06zM2.22 11.46a.16.16 0 0 1-.1-.04l-.74-.6a.16.16 0 0 1 .2-.26l.7.57c.07.06.08.17.02.24-.03.04-.07.06-.1.08z" />
      <path
        fillRule="evenodd"
        d="M15.53 7.64c-1.73 0-2.85.9-3.48 1.53l-2.33 2.46-2.78 2.84c-.45.38-1.16.68-1.86.68H1.71c-.4 0-.71.32-.71.71s.32.71.71.71h3.37c.7 0 1.4-.3 1.92-.78l2.72-2.78c.46-.45 1.14-1.08 1.14-1.08s.65-.56 1.42-.56c.7 0 1.25.57 1.25 1.27s-.56 1.27-1.27 1.27H10.3c-.4 0-.71.32-.71.71s.32.71.71.71h2.38c1.5 0 2.7-1.22 2.7-2.7 0-1.48-1.2-2.69-2.7-2.69-1.28 0-2.16.68-2.67 1.25l-1.44 1.52c-.1.1-.23.17-.36.17h-.63l3.3-3.48c.55-.54 1.44-1.24 2.88-1.24 1.46 0 3.1.86 3.58 2.98h1.25c-.54-2.85-2.87-4.18-5.18-4.18z"
      />
      <path
        fillRule="evenodd"
        d="M20.28 15.26h-1.35c-.4 0-.71.32-.71.71s.32.71.71.71h1.36c.4 0 .71-.32.71-.71s-.32-.71-.72-.71zM16.69 15.26h-.8c-.4 0-.71.32-.71.71s.32.71.71.71h.8c.4 0 .71-.32.71-.71s-.32-.71-.71-.71z"
      />
    </svg>
  );
}

export function TechRust({ size = 20, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-label="Rust"
    >
      <path
        fill="#CE412B"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2.2c1.3 0 2.527.265 3.656.74l-.922 1.598-.813-.47-.015-.008-.014.008-.798.47-.928-1.598A8.898 8.898 0 0 0 12 3.2zM9.934 3.54L10.856 5.14l-.813.47a1.89 1.89 0 0 0-.712.396l-.126-1.876a8.884 8.884 0 0 0-.585.268l.615 1.066-1.598.922A8.882 8.882 0 0 0 5.59 8.24l1.598.922-.008.014v.94l-1.598.922a8.937 8.937 0 0 0-.544 1.074l1.718.992v1.845l-1.598.922c.144.38.316.742.516 1.073l1.598-.922.813.47.015.008.014-.008.798-.47.928 1.598c.542.22 1.116.358 1.718.414v1.845a9.04 9.04 0 0 1-2.7-.608l-.615-1.066 1.598-.922-.008-.014v-.94l1.598-.922c.145.376.318.736.516 1.074l-1.598.922v1.845c.544.222 1.116.36 1.718.415L12 20.8l.008 1.844c.602-.056 1.174-.194 1.718-.415v-1.845l-1.598-.922a8.93 8.93 0 0 0 .516-1.074l1.598.922v-.94l-.008-.014 1.598-.922-.615-1.066a9.013 9.013 0 0 1-2.7.608v-1.845c.602-.056 1.176-.194 1.718-.414l.928 1.598.798-.47.014-.008.015.008.813.47 1.598-.922c.2-.33.372-.693.516-1.073l-1.598-.922v-1.845l1.718-.992a8.937 8.937 0 0 0-.544-1.074l-1.598.922v-.94l-.008-.014 1.598-.922A8.882 8.882 0 0 0 17.59 8.24l-1.598.922-.615-1.066a8.884 8.884 0 0 0-.585-.268l-.126 1.876a1.89 1.89 0 0 0-.712-.396l-.813-.47.922-1.598a9.05 9.05 0 0 0-1.106-.368V3.2c.06.002.118.007.178.012V5.15H12.4V3.212A9.047 9.047 0 0 0 12 3.2z"
      />
    </svg>
  );
}

export function TechStackIcon({ stack, size = 20, className }: IconProps & { stack: string }) {
  switch (stack) {
    case "node":
      return <TechNode size={size} className={className} />;
    case "python":
      return <TechPython size={size} className={className} />;
    case "go":
      return <TechGo size={size} className={className} />;
    case "rust":
      return <TechRust size={size} className={className} />;
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={className}
          aria-label={stack}
        >
          <circle cx="12" cy="12" r="10" opacity="0.4" />
          <path d="M12 6v6l4 2" opacity="0.4" />
        </svg>
      );
  }
}

export const IconGitHub = createIcon(
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  "GitHub"
);

export const IconSun = createIcon(
  <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />,
  "Light Mode"
);

export const IconMoon = createIcon(
  <path d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.999z" />,
  "Dark Mode"
);

