"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar trái */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>

        <nav className="flex flex-col gap-2">
          <Link
            href="/admin"
            className={`p-2 rounded ${
              pathname === "/admin" ? "bg-slate-600" : "hover:bg-slate-700"
            }`}
          >
            📊 Dashboard
          </Link>

          <Link
            href="/admin/products"
            className={`p-2 rounded ${
              pathname.includes("/products") ? "bg-slate-600" : "hover:bg-slate-700"
            }`}
          >
            📦 Quản lý sản phẩm
          </Link>

          <Link
            href="/admin/orders"
            className={`p-2 rounded ${
              pathname.includes("/orders") ? "bg-slate-600" : "hover:bg-slate-700"
            }`}
          >
            🧾 Quản lý đơn hàng
          </Link>

          <Link
            href="/admin/customers"
            className={`p-2 rounded ${
              pathname.includes("/customers") ? "bg-slate-600" : "hover:bg-slate-700"
            }`}
          >
            👥 Quản lý khách hàng
          </Link>
        </nav>
      </aside>

      {/* Khu vực nội dung */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
