// app/products/page.js (hoặc pages/products.js nếu dùng Pages Router)
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";


const ITEMS_PER_PAGE = 10;

export default function ProductsPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const products = allProducts.slice(start, end);
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  // 404 nếu trang không tồn tại
  if (page < 1 || page > totalPages) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Danh sách sản phẩm</h1>

      {/* Grid sản phẩm */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.MaSP} product={product} />
        ))}
      </div>

      {/* Phân trang */}
      <Pagination currentPage={page} totalPages={totalPages} basePath="/products" />
    </div>
  );
}