import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const forcedUrl =
  process.env.DATABASE_URL_OVERRIDE ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.includes("zovadri_app")
    ? process.env.DATABASE_URL
    : "postgresql://postgres@localhost:5432/zovadri_app");

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: forcedUrl } },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";