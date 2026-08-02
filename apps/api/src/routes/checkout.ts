import { Router } from "express";
import { prisma } from "@zovadri/db";
import { authMiddleware } from "../middleware/auth";
import { getSettings, computeShipping } from "../settings";

const router = Router();

router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const {
      governorate,
      city,
      district,
      street,
      building,
      floor,
      apartment,
      landmark,
      fullName,
      phone,
      paymentMethod,
      couponCode,
      walletPhone,
      paymentReference,
      notes,
    } = req.body || {};

    if (!governorate || !fullName || !phone || !paymentMethod) {
      return res.status(400).json({ error: "بيانات الشحن أو الدفع ناقصة" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        CartItem: {
          include: {
            Product: { include: { Seller: { select: { id: true, storeName: true } } } },
          },
        },
      },
    });
    const rows = cart?.CartItem ?? [];
    if (rows.length === 0) {
      return res.status(400).json({ error: "السلة فارغة" });
    }

    const items = rows.map((row: any) => ({ quantity: row.quantity, product: row.Product }));

    for (const item of items) {
      if (!item.product || item.product.status !== "ACTIVE") {
        return res.status(400).json({ error: "أحد المنتجات غير متاح" });
      }
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ error: `كمية غير متوفرة لـ"${item.product.title}"` });
      }
    }

    const settings = await getSettings();
    const subtotal = items.reduce((s: number, it: any) => s + Number(it.product.price) * it.quantity, 0);

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: String(couponCode).toUpperCase().trim() } });
      const valid =
        coupon &&
        coupon.active &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
        subtotal >= Number(coupon.minOrder);
      if (valid) {
        const value =
          coupon!.discountType === "PERCENT"
            ? (subtotal * Number(coupon!.value)) / 100
            : Number(coupon!.value);
        discount = Math.min(value, Number(coupon!.maxDiscount ?? value), subtotal);
        await prisma.coupon.update({ where: { id: coupon!.id }, data: { usedCount: { increment: 1 } } });
      } else {
        return res.status(400).json({ error: "الكوبون غير صالح أو منتهي" });
      }
    }

    const shippingFee = computeShipping(settings, subtotal - discount, governorate);
    const codFee = paymentMethod === "CASH_ON_DELIVERY" ? settings.codFee : 0;
    const total = subtotal - discount + shippingFee + codFee;

    if (paymentMethod === "VODAFONE_CASH" && !walletPhone) {
      return res.status(400).json({ error: "أدخل رقم محفظة فودافون كاش للمرسل" });
    }

    const paymentStatus = (() => {
      if (paymentMethod === "VODAFONE_CASH") return "PENDING_VERIFICATION";
      if (paymentMethod === "CARD") return "PAID";
      return "UNPAID";
    })();

    const orderCount = await prisma.order.count();
    const orderNumber = `ZVD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(5, "0")}`;

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        orderNumber,
        subtotal,
        shippingFee,
        codFee,
        discount,
        total,
        paymentMethod,
        paymentStatus,
        shippingAddress: { fullName, phone, governorate, city, district, street, building, floor, apartment, landmark },
        notes,
        walletPhone: paymentMethod === "VODAFONE_CASH" ? walletPhone : null,
        paymentReference: paymentMethod === "VODAFONE_CASH" ? paymentReference || null : null,
        OrderItem: {
          create: items.map((it: any) => ({
            productId: it.product.id,
            sellerId: it.product.sellerId,
            title: it.product.title,
            price: Number(it.product.price),
            quantity: it.quantity,
            total: Number(it.product.price) * it.quantity,
            sellerName: it.product.Seller?.storeName ?? "",
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart!.id } });
    for (const it of items) {
      await prisma.product.update({
        where: { id: it.product.id },
        data: { stock: { decrement: it.quantity }, soldCount: { increment: it.quantity } },
      });
    }

    res.status(201).json({
      order: {
        ...order,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        codFee: Number(order.codFee),
        discount: Number(order.discount),
      },
      totals: {
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        shippingFee,
        codFee,
        total: Math.round(total * 100) / 100,
      },
      vodafoneWallet: settings.vodafoneWallet,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;