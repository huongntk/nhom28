"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Khai báo giá trị khởi tạo cho form
const initialProductState = {
  TenSP: "",
  DonGia: 0,
  MoTa: "",
  HinhAnh: "",
  SoLuong: 1,
  // Thêm các trường khác nếu cần (MaLoai, MaNCC, TrangThai,...)
};

export default function AddProductPage() {
  const [formData, setFormData] = useState(initialProductState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("✅ Thêm sản phẩm thành công!");
        // Chuyển hướng về trang danh sách sản phẩm sau khi thêm thành công
        router.push("/admin/products"); 
      } else {
        const errorData = await res.json();
        toast.error(`❌ Lỗi: ${errorData.error || 'Thêm sản phẩm thất bại'}`);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      toast.error("❌ Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">➕ Thêm Sản phẩm Mới</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên sản phẩm */}
        <div>
          <label htmlFor="TenSP" className="block text-sm font-medium text-gray-700">Tên Sản phẩm</label>
          <input
            type="text"
            id="TenSP"
            name="TenSP"
            value={formData.TenSP}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Đơn giá */}
        <div>
          <label htmlFor="DonGia" className="block text-sm font-medium text-gray-700">Đơn Giá (₫)</label>
          <input
            type="number"
            id="DonGia"
            name="DonGia"
            value={formData.DonGia}
            onChange={handleChange}
            min="0"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Số lượng */}
        <div>
          <label htmlFor="SoLuong" className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
          <input
            type="number"
            id="SoLuong"
            name="SoLuong"
            value={formData.SoLuong}
            onChange={handleChange}
            min="1"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Link Hình ảnh */}
        <div>
          <label htmlFor="HinhAnh" className="block text-sm font-medium text-gray-700">Link Hình ảnh</label>
          <input
            type="text"
            id="HinhAnh"
            name="HinhAnh"
            value={formData.HinhAnh}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label htmlFor="MoTa" className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            id="MoTa"
            name="MoTa"
            rows="4"
            value={formData.MoTa}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {loading ? 'Đang xử lý...' : '➕ Thêm Sản phẩm'}
        </button>
      </form>
    </div>
  );
}