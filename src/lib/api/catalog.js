export function getFallbackCatalogData() {
  return {
    hero: {
      title: "FIND YOUR\nDAILY JOYLOG",
      ctaLabel: "BROWSE COLLECTION",
      accentColor: "#7ACCC0"
    },
    products: [
      { badge: "[DAILY JOY]", name: "Socks", slug: "socks", count: 2588, tone: "#7ACCC0", imageUrl: "https://images.unsplash.com/photo-1586350977772-b0b48b4fb841?w=360&h=360&fit=crop&q=80", price: 12, description: "Cozy socks featuring our custom cherry print.\nPerfect for a happy life log." },
      { badge: "[COZY HOME]", name: "Home", slug: "home", count: 692, tone: "#C8E8C0", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=360&h=360&fit=crop&q=80", price: 34, description: "Soft home picks curated for warm moments." },
      { badge: "[HAPPY SNACKS]", name: "Snacks", slug: "snacks", count: 1081, tone: "#F5D8B0", imageUrl: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=360&h=360&fit=crop&q=80", price: 8, description: "Colorful snack collection for cozy breaks." },
      { badge: "[SPEEZANE]", name: "Speezane", slug: "speezane", count: 1601, tone: "#E8A898", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=360&h=360&fit=crop&q=80", price: 22, description: "Playful fashion accents for daily styling." },
      { badge: "[POUCH]", name: "Pouch", slug: "pouch", count: 332, tone: "#D8E8F0", imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=360&h=360&fit=crop&q=80", price: 16, description: "Simple pouches for your tiny essentials." },
      { badge: "[SNACKS]", name: "Snacks", slug: "snacks-plus", count: 831, tone: "#F0D8A8", imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=360&h=360&fit=crop&q=80", price: 10, description: "Extra snack line with cheerful flavors." }
    ]
  };
}

function publicApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export async function getCatalogData(category) {
  const fallback = getFallbackCatalogData();
  const base = publicApiBase();

  if (!base) {
    return category
      ? { ...fallback, products: fallback.products.filter((p) => p.slug === category || p.name.toLowerCase() === category.toLowerCase()) }
      : fallback;
  }

  try {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetch(`${base}/api/v1/products${query}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`products ${res.status}`);
    const json = await res.json();
    const products = Array.isArray(json?.products) ? json.products : fallback.products;
    const hero = json?.hero && typeof json.hero === "object" ? json.hero : fallback.hero;

    return { hero, products };
  } catch {
    return category
      ? { ...fallback, products: fallback.products.filter((p) => p.slug === category || p.name.toLowerCase() === category.toLowerCase()) }
      : fallback;
  }
}

export async function getProductDetail(slug) {
  const fallback = getFallbackCatalogData();
  const fallbackItem = fallback.products.find((p) => p.slug === slug) ?? fallback.products[0];
  const base = publicApiBase();

  if (!base) return fallbackItem;

  try {
    const res = await fetch(`${base}/api/v1/products/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`product ${res.status}`);
    const json = await res.json();
    return {
      ...fallbackItem,
      ...json,
      slug: typeof json?.slug === "string" ? json.slug : fallbackItem.slug,
    };
  } catch {
    return fallbackItem;
  }
}
