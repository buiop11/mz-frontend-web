import { Suspense } from "react";

import { getCatalogData } from "@/lib/api/catalog";

import MediaContents from "./comp";

export const revalidate = 60;

export const metadata = { title: "콘텐츠" };

export default async function MediaPage({ searchParams }) {
  const params = await searchParams;
  const category = typeof params?.category === "string" ? params.category : undefined;
  const data = await getCatalogData(category);

  return (
    <Suspense fallback={<div className="body4 p-10 text-center">로딩</div>}>
      <MediaContents data={data} activeCategory={category} />
    </Suspense>
  );
}
