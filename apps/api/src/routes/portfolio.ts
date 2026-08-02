import { Router } from "express";
import { prisma } from "@zovadri/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const items = await prisma.portfolioItem.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.json({ items });
  } catch (e) {
    console.error("portfolio:", e);
    return res.status(500).json({ error: "حدث خطأ في جلب الأعمال" });
  }
});

router.get("/by-slug/:slug", async (req, res) => {
  try {
    const link = `/demo/${req.params.slug}`;
    const item = await prisma.portfolioItem.findFirst({ where: { link } });
    if (!item) {
      return res.set("Cache-Control", "public, max-age=300").status(404).json({ error: "المشروع غير موجود" });
    }
    const parsed = parsePages(item.pagesJson);
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.json({ item: { ...item, pages: parsed, pagesJson: undefined } });
  } catch (e) {
    console.error("portfolio by-slug:", e);
    return res.status(500).json({ error: "حدث خطأ في جلب المشروع" });
  }
});

function parsePages(json?: string | null): unknown[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export { router as portfolioRouter };