"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const handleDelete = async (maSP) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${maSP} không?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${maSP}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Cập nhật state để xóa sản phẩm khỏi giao diện
        setProducts(products.filter(p => p.MaSP !== maSP));
        console.log(`Đã xóa sản phẩm ${maSP}`);
        // Có thể thêm toast.success tại đây
      } else {
        const error = await res.json();
        console.error('Lỗi khi xóa:', error);
        alert('Không thể xóa sản phẩm: ' + (error.error || 'Lỗi không xác định.'));
      }
    } catch (error) {
      console.error('Lỗi API:', error);
      alert('Lỗi kết nối máy chủ khi xóa sản phẩm.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Danh sách sản phẩm</h1>
        <Link
          href="/admin/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Thêm sản phẩm
        </Link>
      </div>

      <table className="w-full border-collapse bg-white shadow-md rounded">
        <thead className="bg-blue-100">
          <tr>
            <th className="border p-2">Mã SP</th>
            <th className="border p-2">Tên SP</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Hình</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.MaSP}>
              <td className="border p-2 text-center">{p.MaSP}</td>
              <td className="border p-2">{p.TenSP}</td>
              <td className="border p-2 text-right">{Number(p.DonGia).toLocaleString()} ₫</td>
              <td className="border p-2 text-center">
                <img src={p.HinhAnh} alt={p.TenSP} className="w-16 h-16 object-cover mx-auto" />
              </td>
              <td className="border p-2 text-center">
                <Link href={`/admin/products/edit/${p.MaSP}`} className="text-blue-600 hover:underline mr-2">Sửa</Link>
                <button onClick={() => handleDelete(p.MaSP)} className="text-red-600 hover:underline">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
