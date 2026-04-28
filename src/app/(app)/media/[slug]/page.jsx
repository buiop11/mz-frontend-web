import { Suspense } from "react";
import PropTypes from "prop-types";

import { getProductDetail } from "@/lib/api/catalog";

import DetailContents from "./comp";

export const revalidate = 60;

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  return (
    <Suspense fallback={<div className="body4 p-10 text-center">로딩</div>}>
      <DetailContents product={product} />
    </Suspense>
  );
}

ProductDetailPage.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
};
