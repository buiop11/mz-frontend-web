import { Suspense } from "react";

import { getHomePageData } from "@/lib/api/home";

import HomeContents from "./comp";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <Suspense fallback={<div className="body4 p-10 text-center">로딩</div>}>
      <HomeContents data={data} />
    </Suspense>
  );
}
