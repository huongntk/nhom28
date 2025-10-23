import Link from "next/link";
<Link href="/cart" className="bg-cyan-500 text-white px-4 py-2 rounded">
  Giỏ hàng
</Link>
export default function Header() {
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
        <button className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
          {/* 🛒 Giỏ hàng */}
          <Link href="/cart">Giỏ hàng</Link>
        </button>
      </div>
    </header>
  );
}
