// import ProductCard from "../components/ProductCard";

// const sampleProducts = [
//   { id: 1, name: "iPhone 16 Pro", price: 29990000, image: "/images/iphone-16-pro-max-sa-mac-thumb.jpg" },
//   { id: 2, name: "iPhone 17 Pro", price: 34990000, image: "/images/iphone-17-pro-cam-thumb.jpg" },
//   { id: 3, name: "Samsung Galaxy S25", price: 18990000, image: "/images/samsung-galaxy-s25-fe-blue-thumbai.jpg" },
//   { id: 4, name: "Xixaomi", price: 18990000, image: "/images/xiaomi-15t-pro-rose-gold-thumb.jpg" },
//   // { id: 5, name: "iPhone 16 Pro", price: 29990000, image: "/images/iphone-16-pro-max-sa-mac-thumb.jpg" },
//   // { id: 6, name: "iPhone 17 Pro", price: 34990000, image: "/images/iphone-17-pro-cam-thumb.jpg" },
//   // { id: 7, name: "Samsung Galaxy S25", price: 18990000, image: "/images/samsung-galaxy-s25-fe-blue-thumbai.jpg" },
//   // { id: 8, name: "Xixaomi", price: 18990000, image: "/images/xiaomi-15t-pro-rose-gold-thumb.jpg" },
// ];

// export default function HomePage() {
//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6 text-center">Sản phẩm nổi bật</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
//         {sampleProducts.map((p) => (
//           <ProductCard key={p.id} product={p} />
//         ))}
//       </div>
//     </div>
//   );
// }
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
    <main className="p-8 grid grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.MaSP} product={p} />
      ))}
    </main>
  );
}
