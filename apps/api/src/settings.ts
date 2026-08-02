import { prisma } from "@zovadri/db";
import {
  EXPORTS_GOVERNORATES,
  FREE_SHIPPING_THRESHOLD,
  COD_FEE,
  DEFAULT_COMMISSION_RATE,
} from "./config";

export interface SiteSettings {
  name: string;
  tagline: string;
  logo: string;
  whatsapp: string;
  phone: string;
  email: string;
  vodafoneWallet: string;
  freeShippingThreshold: number;
  codFee: number;
  commissionRate: number;
  governorates: Record<string, number>;
}

let cache: SiteSettings | null = null;
let cacheAt = 0;
const TTL = 15000;

export async function getSettings(): Promise<SiteSettings> {
  if (cache && Date.now() - cacheAt < TTL) return cache;
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;

  let governorates = EXPORTS_GOVERNORATES;
  try {
    if (map["shipping.governorates"]) {
      const parsed = JSON.parse(map["shipping.governorates"]);
      if (parsed && typeof parsed === "object") governorates = parsed;
    }
  } catch {
    /* fallback to defaults */
  }

  const settings: SiteSettings = {
    name: map["site.name"] || "Zovadri",
    tagline: map["site.tagline"] || "تسوّق كل ما تحتاجه في مكان واحد",
    logo: map["site.logo"] || "",
    whatsapp: map["contact.whatsapp"] || "",
    phone: map["contact.phone"] || "",
    email: map["contact.email"] || "support@zovadri.com",
    vodafoneWallet: map["contact.vodafoneWallet"] || "00000000000",
    freeShippingThreshold: Number(map["shipping.freeThreshold"]) || FREE_SHIPPING_THRESHOLD,
    codFee: Number(map["shipping.codFee"] || COD_FEE),
    commissionRate: Number(map["seller.commissionRate"] || DEFAULT_COMMISSION_RATE),
    governorates,
  };
  cache = settings;
  cacheAt = Date.now();
  return settings;
}

export function invalidateSettingsCache() {
  cache = null;
}

export function computeShipping(settings: SiteSettings, subtotal: number, governorate: string) {
  if (subtotal >= settings.freeShippingThreshold) return 0;
  const fee = settings.governorates[governorate] ?? 0;
  return fee;
}