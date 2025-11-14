

import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetail({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="text-center text-red-600 p-10">Không tìm thấy sản phẩm!</div>;
  }

  const product = await res.json();

  return <ProductDetailClient product={product} />;
}
