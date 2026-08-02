import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@zovadri/db";
import { JWT_SECRET } from "../config";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const sign = (userId: string) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "كل الحقول مطلوبة" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "كلمة السر 6 أحرف على الأقل" });
    }
    const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (exists) {
      return res.status(400).json({ error: "الإيميل أو الرقم مستخدم من قبل" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash, role: "ADMIN" },
    });
    return res.json({ token: sign(user.id), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    console.error("register:", e);
    return res.status(500).json({ error: "حدث خطأ في التسجيل" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "الإيميل وكلمة السر مطلوبين" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }
    return res.json({ token: sign(user.id), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    console.error("login:", e);
    return res.status(500).json({ error: "حدث خطأ في الدخول" });
  }
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(401).json({ error: "المستخدم غير موجود" });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    console.error("me:", e);
    return res.status(500).json({ error: "حدث خطأ" });
  }
});

export { router as authRouter };