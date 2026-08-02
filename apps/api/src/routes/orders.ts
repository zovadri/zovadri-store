import { Router } from "express";
import path from "path";
import fs from "fs";
import { prisma } from "@zovadri/db";
import { authMiddleware } from "../middleware/auth";
import { maxUploadBytes, minUploadBytes } from "../config";
import { getSettings } from "../settings";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: any, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        OrderItem: { select: { title: true, quantity: true, price: true } },
      },
    });
    res.json({
      items: orders.map((o: any) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: Number(o.total),
        status: o.status,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
        items: o.OrderItem,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req: any, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        OrderItem: { include: { Product: { select: { slug: true, images: true } } } },
      },
    });
    if (!order) return res.status(404).json({ error: "الطلب غير موجود" });
    if (order.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "هذا الطلب ليس لك" });
    }
    const settings = await getSettings();
    res.json({ order: { ...order, vodafoneWallet: settings.vodafoneWallet } });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:id/cancel", async (req: any, res) => {
  try {
    const { reason } = req.body || {};
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "الطلب غير موجود" });
    if (order.userId !== req.user.id) return res.status(403).json({ error: "هذا الطلب ليس لك" });
    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return res.status(400).json({ error: "لا يمكن إلغاء الطلب في حالته الحالية" });
    }
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED", cancelledAt: new Date(), cancellationReason: reason || "إلغاء من العميل" },
    });
    res.json({ ok: true, order: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:id/proof", async (req: any, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "الطلب غير موجود" });
    if (order.userId !== req.user.id) return res.status(403).json({ error: "هذا الطلب ليس لك" });
    if (order.paymentMethod !== "VODAFONE_CASH") {
      return res.status(400).json({ error: "هذا الطلب ليس بدفع فودافون كاش" });
    }
    if (order.paymentStatus !== "PENDING_VERIFICATION" && order.paymentStatus !== "FAILED") {
      return res.status(400).json({ error: "لا يمكن رفع صورة التحويل في هذه الحالة" });
    }

    const { image } = req.body || {};
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "الصورة مطلوبة" });
    }
    const match = image.match(/^data:image\/(png|jpeg|webp);base64,(.+)$/s);
    if (!match) return res.status(400).json({ error: "صيغة الصورة غير مدعومة" });

    const buf = Buffer.from(match[2].replace(/\s/g, ""), "base64");
    if (buf.length < minUploadBytes || buf.length > maxUploadBytes) {
      return res.status(400).json({ error: "حجم الصورة غير صالح" });
    }

    const filename = `proof-${order.orderNumber}-${Date.now()}.${match[1]}`;
    fs.writeFileSync(path.join(process.cwd(), "uploads", filename), buf);

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentProof: `/uploads/${filename}`,
        paymentStatus: "PENDING_VERIFICATION",
        paymentRejectReason: null,
      },
    });
    res.json({ ok: true, order: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;