# DevPulse Production Deployment Guide

This guide provides a comprehensive step-by-step workflow to deploy DevPulse in a production environment (such as Render, Vercel, Railway, Vps, or Docker).

---

## 1. Architecture Overview

In production, the application is divided into three components:
1. **Frontend**: Static React assets served over CDN (Vercel, Netlify, or Firebase Hosting).
2. **Backend**: Node.js Express server running on a container service (Render, Railway, or VPS).
3. **Database**: Managed PostgreSQL instance (Supabase, Neon, or AWS RDS).

---

## 2. Database Provisioning (e.g., Supabase / Neon)

1. Provision a PostgreSQL database instance on **Supabase** (https://supabase.com) or **Neon** (https://neon.tech).
2. Retrieve the **Transaction Connection String** (Prisma requires a pooler for serverless deployments like Render).
3. Set the connection string format:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
   ```

---

## 3. Backend Deployment (e.g., Render)

1. Connect your GitHub repository (e.g., `Vikas-Dr/Dev-pulse`) to **Render** (https://render.com).
2. Select **New Web Service** pointing to the repository.
3. Configure the service settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma db push && npm start`
4. Set the **Environment Variables** in the Render settings dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `PORT`: `4000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: A secure random 32-character string.
   - `JWT_ACCESS_EXPIRY`: `15m`
   - `JWT_REFRESH_EXPIRY`: `7d`
5. Configure the **Health Check Path** to `/api/health` to enable zero-downtime rolls.

---

## 4. Frontend Deployment (e.g., Vercel)

1. Create a new project on **Vercel** (https://vercel.com) and link the repository root.
2. Configure the settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure **API Proxying**:
   Since Vite proxies api requests locally, in production Vercel requires a `vercel.json` routing configuration to forward `/api` requests to the backend Render server.
   
   Create a `vercel.json` file in `/Users/viki/DevPulse/frontend/vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-render-url.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

---

## 5. Self-Hosting via Docker Compose (VPS Deployment)

If deploying to a single virtual private server (VPS like AWS EC2, DigitalOcean, Linode):

1. Create a `docker-compose.prod.yml` in the project root:
   ```yaml
   services:
     db:
       image: postgres:16-alpine
       environment:
         POSTGRES_USER: devpulse
         POSTGRES_PASSWORD: secure_production_password_here
         POSTGRES_DB: devpulse
       volumes:
         - pgdata:/var/lib/postgresql/data
       restart: always

     backend:
       build: ./backend
       ports:
         - "4000:4000"
       environment:
         DATABASE_URL: postgresql://devpulse:secure_production_password_here@db:5432/devpulse
         JWT_SECRET: production-super-secure-key-here
         PORT: 4000
         NODE_ENV: production
       depends_on:
         - db
       restart: always

     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
       restart: always

   volumes:
     pgdata:
   ```

2. Run the deployment command:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

---

## 6. CI/CD Workflow (GitHub Actions)

Add a GitHub Actions workflow `.github/workflows/deploy.yml` to automate testing and builds:

```yaml
name: Production Deployment

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install & Test Backend
        run: |
          cd backend
          npm ci
          npm run build

      - name: Install & Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
```
