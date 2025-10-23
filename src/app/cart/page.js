"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart(); // ✅ đảm bảo có updateQuantity

  const handleChange = (id, e) => {
    const newQuantity = parseInt(e.target.value, 10);
    updateQuantity(id, newQuantity);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>

      {cart.length === 0 ? (
        <p>Chưa có sản phẩm trong giỏ.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.MaSP}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.HinhAnh}
                  alt={item.TenSP}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <div>
                  <h2 className="font-semibold">{item.TenSP}</h2>
                  <p className="text-red-600 font-bold">
                    {item.DonGia.toLocaleString()} ₫
                  </p>
                </div>
              </div>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleChange(item.MaSP, e)}
                className="w-16 text-center border rounded"
              />

              <p className="font-semibold w-24 text-right">
                {(item.DonGia * item.quantity).toLocaleString()} ₫
              </p>

              <button
                onClick={() => removeFromCart(item.MaSP)}
                className="text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
          ))}
          <div className="text-right font-bold text-lg mt-4">
            Tổng cộng: {total.toLocaleString()} ₫
          </div>
        </div>
      )}
    </div>
  );
}
