import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@zovadri/db";
import { JWT_SECRET } from "../config";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export function signToken(payload: { id: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

async function resolveUser(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return;
  const token = header.slice(7);
  const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) return;
  const seller = await prisma.seller.findUnique({ where: { userId: user.id } });
  return { user, seller };
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const ctx = await resolveUser(req);
    if (!ctx) {
      return res.status(401).json({ error: "الجلسة انتهت، سجل الدخول من جديد" });
    }
    (req as any).user = ctx.user;
    (req as any).seller = ctx.seller;
    next();
  } catch {
    return res.status(401).json({ error: "الجلسة انتهت، سجل الدخول من جديد" });
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const ctx = await resolveUser(req);
    if (ctx) {
      (req as any).user = ctx.user;
      (req as any).seller = ctx.seller;
    }
  } catch {
    /* ignore */
  }
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const u = (req as any).user as AuthUser | undefined;
  if (!u) return res.status(401).json({ error: "سجل الدخول أولا" });
  if (u.role !== "ADMIN") return res.status(403).json({ error: "غير مصرح لك بهذا الفعل" });
  next();
}

export async function requireSeller(req: Request, res: Response, next: NextFunction) {
  const u = (req as any).user as AuthUser | undefined;
  if (!u) return res.status(401).json({ error: "سجل الدخول أولا" });
  if (u.role !== "SELLER") return res.status(403).json({ error: "غير مصرح لك بهذا الفعل" });
  next();
}