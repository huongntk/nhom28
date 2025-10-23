"use client";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 text-center flex flex-col justify-between h-[380px]">
      <img src={product.HinhAnh} alt={product.TenSP} className="w-full h-48 object-cover rounded-xl" />
      <h2 className="text-lg font-semibold mt-2">{product.TenSP}</h2>
      <p className="text-red-600 font-bold">
        {Number(product.DonGia).toLocaleString()} ₫</p>
      <button
        onClick={() => addToCart({...product, DonGia: Number(product.DonGia)})}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Thêm vào giỏ
      </button>
    </div>
  );
}










