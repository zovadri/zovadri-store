const fs = require("fs");
const path = require("path");

const API = "http://localhost:4000";

async function main() {
  const proj = path.join("C:\\agency", "apps", "web");

  const [siteRes, portRes] = await Promise.all([
    fetch(`${API}/api/site`).then((r) => r.json()),
    fetch(`${API}/api/portfolio`).then((r) => r.json()),
  ]);

  const items = [];
  for (const it of portRes.items || []) {
    let pages = [];
    const slug = it.link ? it.link.replace(/^\/demo\//, "") : null;
    if (slug) {
      try {
        const full = await fetch(`${API}/api/portfolio/by-slug/${slug}`).then((r) => r.json());
        pages = full.item && full.item.pages ? full.item.pages : [];
      } catch {}
    }
    items.push({
      title: it.title,
      description: it.description,
      category: it.category,
      tags: it.tags || [],
      link: it.link,
      featured: it.featured,
      image: it.image,
      pages,
    });
  }

  const snapshot = { site: siteRes.site || {}, portfolio: items };
  fs.writeFileSync(path.join(proj, "data", "snapshot.json"), JSON.stringify(snapshot, null, 2), "utf8");
  console.log(`snapshot written: ${items.length} items`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});