import { Router } from "express";
import { prisma } from "@zovadri/db";

const router = Router();

const productSelect = {
  id: true,
  slug: true,
  sku: true,
  title: true,
  price: true,
  compareAtPrice: true,
  images: true,
  stock: true,
  status: true,
  isFeatured: true,
  rating: true,
  ratingCount: true,
  soldCount: true,
  createdAt: true,
  Category: { select: { id: true, name: true, slug: true } },
  Seller: { select: { id: true, storeName: true, rating: true } },
};

const productsSelectBase = {
  ...productSelect,
  description: true,
  costPrice: true,
  weight: true,
  isZovadriFulfilled: true,
  Review: { select: { id: true, rating: true, comment: true, createdAt: true, User: { select: { name: true } } } },
};

function buildProduct(q: Record<string, any>) {
  const where: any = { status: "ACTIVE" };
  if (q.query) {
    where.title = { contains: q.query, mode: "insensitive" };
  }
  if (q.category) {
    where.categoryId = q.category;
  }
  if (q.min || q.max) {
    where.price = {};
    if (q.min) where.price.gte = Number(q.min);
    if (q.max) where.price.lte = Number(q.max);
  }
  if (q.seller) {
    where.sellerId = q.seller;
  }
  return where;
}

router.get("/", async (req, res) => {
  try {
    const q: any = req.query;
    const page = Math.max(1, Number(q.page) || 1);
    const pageSize = Math.min(48, Number(q.pageSize) || 12);
    const where = buildProduct(q);

    const sortArgs: any =
      q.sort === "price_asc"
        ? { price: "asc" }
        : q.sort === "price_desc"
        ? { price: "desc" }
        : q.sort === "newest"
        ? { createdAt: "desc" }
        : { soldCount: "desc" };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: productSelect,
        orderBy: sortArgs,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ items, total, page, pageSize, pages: Math.ceil(total / pageSize) });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/featured", async (_req, res) => {
  try {
    const items = await prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      select: productSelect,
      take: 8,
      orderBy: { soldCount: "desc" },
    });
    res.json({ items });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug as string },
      select: productsSelectBase,
    });
    if (!product) return res.status(404).json({ error: "المنتج غير موجود" });

    const related = await prisma.product.findMany({
      where: { status: "ACTIVE", categoryId: product.Category.id, id: { not: product.id } },
      select: productSelect,
      take: 4,
    });

    res.json({ product, related });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;