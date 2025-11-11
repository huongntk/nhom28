"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
<Link href="/cart" className="bg-cyan-500 text-white px-4 py-2 rounded">
  Giỏ hàng
</Link>
export default function Header() {
  const { totalQuantity } = useCart();
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-cyan-600">
          📱 THREE H
        </Link>

        {/* Menu */}
        <nav className="space-x-6">
          <Link href="/" className="hover:text-cyan-500">Trang chủ</Link>
          <Link href="/products" className="hover:text-cyan-500">Sản phẩm</Link>
          <Link href="/about" className="hover:text-cyan-500">Giới thiệu</Link>
          <Link href="/contact" className="hover:text-cyan-500">Liên hệ</Link>
        </nav>

        {/* Nút giỏ hàng */}

        <Link href="/cart" className="relative hover:text-yellow-300">
          <ShoppingCart size={26} />
          {/* ✅ hiển thị badge số lượng */}
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-bold rounded-full px-2 py-0.5">
              {totalQuantity}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
