"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();

  if (!product) {
    return <div className="text-center text-red-600 p-10">Dữ liệu sản phẩm không hợp lệ!</div>;
  }

  const handleAddToCart = () => {
    addToCart({ ...product, DonGia: Number(product.DonGia) });
    toast.success(`Đã thêm ${product.TenSP} vào giỏ hàng!`);
  };

  return (
    <div className="p-8 flex flex-col md:flex-row gap-8 items-start max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-center w-full md:w-1/2">
        <Image
          src={product.HinhAnh || "/fallback-image.jpg"}
          alt={product.TenSP || "Sản phẩm"}
          width={400}
          height={400}
          className="object-contain rounded-lg transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-3">{product.TenSP}</h1>
        <p className="text-red-600 text-2xl font-semibold mb-4">
          {Number(product.DonGia).toLocaleString()} ₫
        </p>
        <p className="text-gray-700 mb-4">
          {product.MoTa || "Chưa có mô tả chi tiết."}
        </p>

        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}
