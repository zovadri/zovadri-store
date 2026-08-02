import { Router } from "express";
import { prisma } from "@zovadri/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      include: {
        other_Category: {
          orderBy: { name: "asc" },
          include: { _count: { select: { Product: true } } },
        },
        _count: { select: { Product: true } },
      },
    });

    const items = categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      productCount: c._count.Product,
      children: c.other_Category.map((child: any) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        productCount: child._count.Product,
      })),
    }));

    res.json({ items });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;