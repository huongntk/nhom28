"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => setDetails(data))
      .catch(err => console.error("❌ Lỗi tải chi tiết đơn hàng:", err));
  }, [id]);

  const total = details.reduce((sum, item) => sum + item.ThanhTien, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        🧾 Chi tiết đơn hàng #{id}
      </h1>
      <Link href="/admin/orders" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Quay lại danh sách
      </Link>

      <table className="min-w-full border border-gray-300 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Tên sản phẩm</th>
            <th className="border p-2">Đơn giá</th>
            <th className="border p-2">Số lượng</th>
            <th className="border p-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {details.length > 0 ? (
            details.map((item, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="border p-2">{item.TenSP}</td>
                <td className="border p-2">{item.DonGia.toLocaleString()} ₫</td>
                <td className="border p-2">{item.SoLuong}</td>
                <td className="border p-2 text-red-600 font-semibold">
                  {item.ThanhTien.toLocaleString()} ₫
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                Không có sản phẩm trong đơn hàng
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-semibold">
            <td colSpan="3" className="text-right border p-2">
              Tổng cộng:
            </td>
            <td className="border p-2 text-red-600">
              {total.toLocaleString()} ₫
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
