import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "@zovadri/db";
import { authMiddleware, signToken } from "../middleware/auth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role = "CUSTOMER" } = req.body || {};
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }
    const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (exists) return res.status(409).json({ error: "الإيميل أو الهاتف مستخدم من قبل" });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: bcrypt.hashSync(password, 10),
        role: role === "SELLER" ? "SELLER" : "CUSTOMER",
      },
    });
    const token = signToken({ id: user.id, role: user.role });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "أدخل الإيميل وكلمة المرور" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }
    const token = signToken({ id: user.id, role: user.role });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/me", authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { Seller: true },
    });
    if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });
    const { passwordHash, Seller, ...rest } = user;
    res.json({ user: { ...rest, seller: Seller } });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;