import { Router } from "express";
import { prisma } from "@zovadri/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.json({ site: map });
  } catch (e) {
    console.error("site:", e);
    return res.status(500).json({ error: "حدث خطأ" });
  }
});

export { router as siteRouter };