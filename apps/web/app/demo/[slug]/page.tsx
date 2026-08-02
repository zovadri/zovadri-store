import { DEMO_SLUGS } from "@/lib/demo-list";
import snapshot from "@/data/snapshot.json";
import DemoClient from "./DemoClient";

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = new Set<string>([...DEMO_SLUGS]);
  for (const it of snapshot.portfolio) {
    const m = it.link?.match(/^\/demo\/(.+)$/);
    if (m) slugs.add(m[1]);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DemoClient slug={slug} />;
}