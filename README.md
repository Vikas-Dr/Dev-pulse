# DevPulse — Project Health Dashboard

A self-hosted dashboard for indie developers and solo engineers who manage multiple local projects. Scans project directories for dependency vulnerabilities, tracks git status, and provides one-click patching.

> Built for the Full Stack Developer role at Exposys Data Labs — demonstrating React, Node.js, PostgreSQL, TypeScript, Docker, JWT auth, and real-world problem-solving.

## Architecture

```
┌──────────┐       ┌──────────┐       ┌────────────┐
│ Frontend │ ───→  │ Backend  │ ───→  │ PostgreSQL │
│  :3000   │ ←───  │  :4000   │ ←───  │    :5432   │
│ React    │  REST  │ Express  │ Prisma │            │
│ Tailwind │  API   │ TypeScript│      │            │
│ Zustand  │  JWT   │ Scanner  │       │            │
└──────────┘       └──────────┘       └────────────┘
                          │
                          ↓
                   Local Project Dirs
                   (npm audit, git status)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Recharts |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens), bcrypt |
| DevOps | Docker Compose |
| UI Fonts | JetBrains Mono (monospace headings), Inter (body) |

## Features

- **Dashboard Overview** — At-a-glance stats: total projects, critical/high/medium vulnerabilities, healthy project count
- **Project Scanning** — Add any local project directory, DevPulse detects the tech stack and runs `npm audit`
- **Vulnerability Table** — Sortable, filterable view of all vulnerabilities with CVE identifiers and fix versions
- **One-Click Patching** — Patch individual packages or all critical vulnerabilities at once
- **Pulse Indicator** — Animated ring on each project card showing health state at a glance (green=healthy, amber=warning, red=critical)
- **Scan History** — Timeline of all scans with vulnerability counts
- **Patch History** — Audit log of all patching activity
- **Git Status** — Shows clean/dirty/no-repo status per project
- **Health Score** — Computed score based on vulnerability severity counts

## Quick Start

```bash
# Clone and start everything
git clone <repo-url> && cd DevPulse
docker compose up --build
```

Then visit **http://localhost:3000**

### Demo Credentials

- **Email:** `demo@devpulse.local`
- **Password:** `Demo@123`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Current user profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Add a project |
| GET | `/api/projects/:id` | Project details |
| DELETE | `/api/projects/:id` | Remove project |
| POST | `/api/projects/:id/scan` | Trigger vulnerability scan |
| POST | `/api/projects/:id/patch` | Patch packages |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Aggregate statistics |
| GET | `/api/scans/:projectId` | Scan history |
| GET | `/api/vulnerabilities/:scanId` | Vulnerability list |
| GET | `/api/patches/:projectId` | Patch history |
| GET | `/api/health` | Server health check |

## Local Development (without Docker)

### Backend
```bash
cd backend
cp .env.example .env   # Edit with your PostgreSQL URL
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
DevPulse/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/schema.prisma
│   └── src/
│       ├── index.ts
│       ├── config.ts
│       ├── middleware/     (auth, errorHandler)
│       ├── routes/         (auth, projects, dashboard, health)
│       ├── services/       (scanner, patcher, gitCheck)
│       └── utils/          (jwt, password)
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── App.tsx
│       ├── api/client.ts
│       ├── stores/         (authStore, projectStore)
│       ├── hooks/          (useAuth, useProjects)
│       ├── components/     (PulseIndicator, ProjectCard, etc.)
│       └── pages/          (Login, Dashboard, ProjectDetail, etc.)
```

## Screenshots

*(Add screenshots here)*

## License

MIT
