"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      // .then(setProducts)
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, []);

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
        {products.map((p) => (
          <ProductCard key={p.MaSP} product={p} />
        ))}
      </div>
    </main>
  );
}
