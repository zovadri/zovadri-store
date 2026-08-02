import express from "express";
import cors from "cors";
import "dotenv/config";

import { authRouter } from "./routes/auth";
import { portfolioRouter } from "./routes/portfolio";
import { siteRouter } from "./routes/site";
import { ordersRouter } from "./routes/orders";
import { adminRouter } from "./routes/admin";

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "zovadri-api", time: new Date().toISOString() })
);

app.use("/api/auth", authRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/site", siteRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

app.use((_req, res) => res.status(404).json({ error: "المسار غير موجود" }));

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