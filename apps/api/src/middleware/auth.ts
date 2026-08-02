import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@zovadri/db";
import { JWT_SECRET } from "../config";

export interface AuthRequest extends Request {
  userId?: string;
}

function getToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7);
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: "سجل الدخول أولاً" });
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: "المستخدم غير موجود" });
    req.userId = user.id;
    next();
  } catch {
    return res.status(401).json({ error: "الجلسة انتهت، سجل الدخول من جديد" });
  }
}