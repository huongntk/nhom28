
"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
     
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 p-4 flex flex-col items-center">
      <Link
        key={product.MaSP}
        href={`/product/${product.MaSP}`}
        
      >
      <div className="w-full flex justify-center">
                     
      <Image
          src={product.HinhAnh}
          alt={product.TenSP}
          width={225}
          height={225}
          className="object-contain rounded-xl  hover:scale-105 transition duration-300"
        />
      </div>
      <h2 className="text-lg font-semibold text-center text-gray-800 hover:text-blue-600 transition-colors
                     line-clamp-2 min-h-12 flex items-center justify-center" style={{ lineHeight: '1.5rem' }}>{product.TenSP}</h2>
      </Link>
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










