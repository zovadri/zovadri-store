import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import "dotenv/config";

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import cartRoutes from "./routes/cart";
import checkoutRoutes from "./routes/checkout";
import orderRoutes from "./routes/orders";
import sellerRoutes from "./routes/seller";
import adminRoutes from "./routes/admin";
import reviewRoutes from "./routes/reviews";
import wishlistRoutes from "./routes/wishlist";
import couponRoutes from "./routes/coupons";
import settingsRoutes from "./routes/settings";

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));

fs.mkdirSync(path.join(process.cwd(), "uploads"), { recursive: true });
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "zovadri-api", time: new Date().toISOString() })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/settings", settingsRoutes);

app.use((_req, res) => res.status(404).json({ error: "الوجهة غير موجودة" }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("API error:", err);
  res.status(500).json({ error: "حدث خطأ غير متوقع" });
});

const PORT = Number(process.env.PORT) || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Zovadri API running on http://localhost:${PORT}`);
  });
}

export default app;