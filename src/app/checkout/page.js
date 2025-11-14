"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.phone) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cart, total }),
      });

      if (res.ok) {
        toast.success("Đặt hàng thành công!");
        clearCart();
      } else {
        toast.error("Lỗi khi đặt hàng!");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Không thể kết nối máy chủ!");
    }
  };

  if (cart.length === 0) {
    return <div className="text-center p-10 text-gray-600">Giỏ hàng trống!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Thanh toán</h1>

      {/* Hiển thị giỏ hàng */}
      <div className="mb-6 border-b pb-4">
        {cart.map((item) => (
          <div key={item.MaSP} className="flex justify-between py-2 border-b">
            <span>{item.TenSP} x {item.quantity}</span>
            <span>{(item.DonGia * item.quantity).toLocaleString()} ₫</span>
          </div>
        ))}
        <p className="text-right font-semibold mt-4 text-lg">
          Tổng cộng: {total.toLocaleString()} ₫
        </p>
      </div>

      {/* Form đặt hàng */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}
