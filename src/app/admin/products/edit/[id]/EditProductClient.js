
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProductClient({ initialProduct, productId }) {
  const [formData, setFormData] = useState({
    ...initialProduct,
    // Đảm bảo DonGia là number để form hiển thị đúng
    DonGia: Number(initialProduct.DonGia), 
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT", // Sử dụng PUT/PATCH cho cập nhật
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`✅ Cập nhật sản phẩm ${productId} thành công!`);
        router.push("/admin/products");
      } else {
        // === KHẮC PHỤC LỖI SYNTAXERROR TẠI ĐÂY ===
        let errorData = { error: 'Cập nhật thất bại' };
        
        try {
            // 1. Đọc body dưới dạng text trước
            const text = await res.text(); 
            if (text) {
                // 2. Nếu có body, thử parse JSON
                errorData = JSON.parse(text); 
            } else {
                // 3. Nếu body trống, lấy thông báo từ status text
                errorData.error = res.statusText || 'Lỗi không xác định từ máy chủ.';
            }
        } catch (e) {
            // Lỗi xảy ra khi parse (dù đã kiểm tra), dùng status text
            console.error("Lỗi khi đọc JSON response:", e);
            errorData.error = res.statusText || 'Lỗi không xác định từ máy chủ.';
        }
        
        toast.error(`❌ Lỗi: ${errorData.error || 'Cập nhật thất bại'}`);
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
      <h1 className="text-3xl font-bold mb-8 text-blue-700">✍️ Sửa Sản phẩm: {productId}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trường Mã SP không cho chỉnh sửa */}
        <div className="bg-gray-100 p-3 rounded">
            <label className="block text-sm font-medium text-gray-700">Mã SP</label>
            <p className="text-lg font-bold">{productId}</p>
        </div>

        {/* Các trường chỉnh sửa */}
        {/* Tên sản phẩm */}
        <div>
          <label htmlFor="TenSP" className="block text-sm font-medium text-gray-700">Tên Sản phẩm</label>
          <input
            type="text"
            id="TenSP"
            name="TenSP"
            value={formData.TenSP || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
          />
        </div>
        
        {/* ... Thêm các input cho HinhAnh, MoTa, SoLuong tương tự ... */}
        
        {/* Nút Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-lg font-medium text-white transition ${
            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Đang cập nhật...' : '💾 Cập nhật Sản phẩm'}
        </button>
      </form>
    </div>
  );
}