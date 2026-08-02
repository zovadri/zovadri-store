import { DEMO_SLUGS } from "./demo-list";

export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(p: string): string {
  if (!p) return p;
  if (p.startsWith("http") || p.startsWith("data:")) return p;
  if (BASE && p.startsWith("/")) return `${BASE}${p}`;
  return p;
}

export interface DemoPageItem {
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: string | null;
  pages?: { name: string; icon?: string; sections?: string[] }[];
  featured?: boolean;
}

export function findBySlug(slug: string, data: Ref): Item | undefined {
  return data.portfolio.find((p) => p.link === `/demo/${slug}`);
}

export interface RefSite {
  whatsapp?: string;
  phoneDisplay?: string;
  facebook?: string;
  tagline?: string;
}

export interface Item {
  link: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: string | null;
  featured?: boolean;
  pages?: { name: string; icon?: string; sections?: string[] }[];
}

export interface Ref {
  site: RefSite;
  portfolio: Item[];
}

export function defaultRef(): Ref {
  return {
    site: {},
    portfolio: [],
  };
}

export function withFallbackData(slug?: string): { demoSlugs: string[]; demoItem?: Item } {
  const demoSlugs = [...DEMO_SLUGS];
  return { demoSlugs };
}

export { DEMO_SLUGS };