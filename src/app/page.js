"use client";
import { useMemo, useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      // .then(setProducts)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải sản phẩm:", err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
        setCurrentPage(1);
    }
  }, [products, currentPage]);
  // Tính toán các giá trị liên quan đến phân trang
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // Lấy danh sách sản phẩm cho trang hiện tại
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  // Hàm xử lý chuyển trang
  const handlePageChange = (page) => {
    // Đảm bảo trang nằm trong phạm vi hợp lệ
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: Cuộn lên đầu trang sau khi chuyển trang
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Đang tải sản phẩm...
        </h2>
        
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Sản phẩm nổi bật
      </h2>
        
      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
      >
        {currentProducts.map((p) => (
          <ProductCard key={p.MaSP} product={p} />
        ))}
      </div>
      {/* Component Phân trang */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
