import { Router } from "express";
import { prisma } from "@zovadri/db";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, service, budget, details } = req.body || {};
    if (!name || !phone || !service || !details) {
      return res.status(400).json({ error: "كل الحقول مطلوبة" });
    }
    const count = await prisma.projectOrder.count();
    const order = await prisma.projectOrder.create({
      data: {
        orderNumber: `ZV-${String(count + 1).padStart(3, "0")}`,
        name,
        phone,
        service,
        budget: budget || null,
        details,
      },
    });
    return res.status(201).json({ order });
  } catch (e) {
    console.error("create order:", e);
    return res.status(500).json({ error: "حدث خطأ في إرسال الطلب" });
  }
});

export { router as ordersRouter };