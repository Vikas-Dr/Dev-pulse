import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../config";

export interface JwtPayload {
  userId: string;
  email: string;
}

function signOpts(expiresIn: string): SignOptions {
  return { expiresIn: expiresIn as SignOptions["expiresIn"] };
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, signOpts(config.jwtAccessExpiry));
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, signOpts(config.jwtRefreshExpiry));
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
