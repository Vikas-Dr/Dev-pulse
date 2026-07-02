import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: process.env.DATABASE_URL || "postgresql://devpulse:devpulse@localhost:5432/devpulse",
  jwtSecret: process.env.JWT_SECRET || "devpulse-jwt-secret-change-in-production",
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
};
