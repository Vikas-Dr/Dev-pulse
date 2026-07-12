import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import dashboardRoutes from "./routes/dashboard";
import healthRoutes from "./routes/health";

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/health", healthRoutes);

// Error handler
app.use(errorHandler);

// Start server
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL");


    if (!process.env.VERCEL) {
      app.listen(config.port, () => {
        console.log(`🚀 DevPulse backend running on http://localhost:${config.port}`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
