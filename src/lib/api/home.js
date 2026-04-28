/**
 * 홈 화면용 백엔드 계약은 `docs/backend-api-integration.md` 참고.
 */

function publicApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export function getFallbackHomeData() {
  return {
    hero: {
      slides: [
        {
          tag: "✦",
          title: "SHOP DAILY JOY,\nTHE MATJZING WAY",
          subtitle: "Handpicked curations for\na happy life log.",
          ctaLabel: "BROWSE COLLECTION",
          ctaHref: "/media",
          imageUrl:
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=440&h=480&fit=crop&q=80",
        },
        {
          tag: "✦",
          title: "NEW ARRIVALS\nEVERY WEEK",
          subtitle: "Fresh picks for your\neveryday joy.",
          ctaLabel: "SEE WHAT'S NEW",
          ctaHref: "/new",
          imageUrl:
            "https://images.unsplash.com/photo-1607082348824-0a96f2a48b16?w=440&h=480&fit=crop&q=80",
        },
        {
          tag: "✦",
          title: "COZY FINDS\nFOR EVERY HOME",
          subtitle: "Warm textures,\nsoft tones.",
          ctaLabel: "SHOP HOME",
          ctaHref: "/popular",
          imageUrl:
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=440&h=480&fit=crop&q=80",
        },
      ],
    },
    categories: [
      {
        badge: "[DAILY JOY]",
        name: "Socks",
        slug: "socks",
        productCount: 2588,
        imageUrl:
          "https://images.unsplash.com/photo-1586350977772-b0b48b4fb841?w=360&h=360&fit=crop&q=80",
      },
      {
        badge: "[COZY HOME]",
        name: "Home",
        slug: "home",
        productCount: 692,
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=360&h=360&fit=crop&q=80",
      },
      {
        badge: "[HAPPY SNACKS]",
        name: "Snacks",
        slug: "snacks",
        productCount: 1081,
        imageUrl:
          "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=360&h=360&fit=crop&q=80",
      },
    ],
  };
}

/**
 * 서버에서 홈 데이터를 가져옵니다. 실패 시 로컬 폴백(디자인 시안과 동일 카피)을 사용합니다.
 */
export async function getHomePageData() {
  const base = publicApiBase();
  if (!base) {
    return getFallbackHomeData();
  }

  try {
    const res = await fetch(`${base}/api/v1/home`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`home ${res.status}`);
    }

    const json = await res.json();
    return normalizeHomePayload(json);
  } catch {
    return getFallbackHomeData();
  }
}

/**
 * 백엔드 응답을 프론트에서 쓰기 좋은 형태로 보정합니다.
 * @param {unknown} raw
 */
function normalizeHomePayload(raw) {
  const fallback = getFallbackHomeData();
  if (!raw || typeof raw !== "object") return fallback;

  const hero = raw.hero && typeof raw.hero === "object" ? raw.hero : {};
  const slidesIn = Array.isArray(hero.slides) ? hero.slides : [];
  const slides =
    slidesIn.length > 0
      ? slidesIn.map((s, i) => ({
          tag: typeof s?.tag === "string" ? s.tag : fallback.hero.slides[i]?.tag ?? "✦",
          title: typeof s?.title === "string" ? s.title : fallback.hero.slides[i]?.title ?? "",
          subtitle:
            typeof s?.subtitle === "string"
              ? s.subtitle
              : fallback.hero.slides[i]?.subtitle ?? "",
          ctaLabel:
            typeof s?.ctaLabel === "string"
              ? s.ctaLabel
              : fallback.hero.slides[i]?.ctaLabel ?? "BROWSE COLLECTION",
          ctaHref:
            typeof s?.ctaHref === "string"
              ? s.ctaHref
              : fallback.hero.slides[i]?.ctaHref ?? "/media",
          imageUrl:
            typeof s?.imageUrl === "string"
              ? s.imageUrl
              : fallback.hero.slides[i]?.imageUrl ?? "",
        }))
      : fallback.hero.slides;

  const categoriesIn = Array.isArray(raw.categories) ? raw.categories : [];
  const categories =
    categoriesIn.length > 0
      ? categoriesIn.map((c, i) => ({
          badge: typeof c?.badge === "string" ? c.badge : fallback.categories[i]?.badge ?? "",
          name: typeof c?.name === "string" ? c.name : fallback.categories[i]?.name ?? "",
          slug: typeof c?.slug === "string" ? c.slug : fallback.categories[i]?.slug ?? "",
          productCount:
            typeof c?.productCount === "number"
              ? c.productCount
              : fallback.categories[i]?.productCount ?? 0,
          imageUrl:
            typeof c?.imageUrl === "string"
              ? c.imageUrl
              : fallback.categories[i]?.imageUrl ?? "",
        }))
      : fallback.categories;

  return { hero: { slides }, categories };
}
