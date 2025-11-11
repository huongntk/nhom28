"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  
  const [orders, setOrders] = useState([]); // luôn khởi tạo mảng
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("⚠️ Dữ liệu không phải mảng:", data);
          setOrders([]); // tránh crash
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi tải đơn hàng:", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Đang tải đơn hàng...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-6">🧾 Quản lý đơn hàng</h1>

      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="border p-2">Mã HĐ</th>
            <th className="border p-2">Khách hàng</th>
            <th className="border p-2">Ngày lập</th>
            <th className="border p-2">Tổng tiền</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                Không có đơn hàng nào.
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o.MaHD} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{o.MaHD}</td>
                <td className="border p-2">{o.TenKH}</td>
                <td className="border p-2 text-center">
                  {new Date(o.NgayLap).toLocaleString("vi-VN")}
                </td>
                <td className="border p-2 text-right">
                  {Number(o.TongTien).toLocaleString()} ₫
                </td>
                <td className="border p-2 text-center">{o.TrangThai}</td>
                <td className="border p-2 text-center space-x-2">
                  <Link href={`/admin/orders/${o.MaHD}`}>
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    Xem
                  </button>
                  </Link>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
