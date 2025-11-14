"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders", { cache: "no-store" }) // Tắt cache để luôn mới
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        // ĐÚNG CẤU TRÚC API: { success: true, data: [...] }
        if (json && json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        } else {
          console.warn("Dữ liệu không hợp lệ:", json);
          setOrders([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải đơn hàng:", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-blue-600">Đang tải đơn hàng...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Quản lý đơn hàng
        </h1>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Mã HĐ</th>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">Ngày lập</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                {/* <th className="px-4 py-3 text-center">Hành động</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.MaHD} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-mono text-sm">#{o.MaHD}</td>
                    <td className="px-4 py-3 font-medium">{o.TenKH || "Khách lẻ"}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(o.NgayLap).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      {Number(o.TongTien).toLocaleString()} ₫
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          o.TrangThai === "Đã giao"
                            ? "bg-green-100 text-green-800"
                            : o.TrangThai === "Đang xử lý"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {o.TrangThai}
                      </span>
                    </td>
                    {/* <td className="px-4 py-3 text-center space-x-2">
                      <Link href={`/admin/orders/${o.MaHD}`}>
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                          Xem
                        </button>
                      </Link>
                      <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">
                        Xóa
                      </button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}