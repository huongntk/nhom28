"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, total } = useCart();

  const increaseQuantity = (id, current) => {
    updateQuantity(id, current + 1);
  };

  const decreaseQuantity = (id, current) => {
    if (current > 1) updateQuantity(id, current - 1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Giỏ hàng</h1>

      {cart.length === 0 ? (
        <p>Giỏ hàng trống.</p>
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
                  className="rounded-md"
                />
                <div>
                  <h2 className="font-semibold">{item.TenSP}</h2>
                  <p className="text-red-500 font-bold">
                    {item.DonGia.toLocaleString()} ₫
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(item.MaSP, item.quantity)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>

                <input
                  type="number"
                  min="1"
                  value={item.quantity ?? ""} // tránh undefined
                  onChange={(e) => {
                    const value = e.target.value;

                    // Nếu người dùng đang xóa (chuỗi rỗng) thì cho phép hiển thị rỗng
                    if (value === "") {
                      updateQuantity(item.MaSP, ""); // tạm thời lưu chuỗi rỗng
                      return;
                    }

                    const newQuantity = parseInt(value, 10);
                    if (!isNaN(newQuantity) && newQuantity > 0) {
                      updateQuantity(item.MaSP, newQuantity);
                    }
                  }}
                  onBlur={(e) => {
                    // Khi người dùng rời khỏi ô, nếu bỏ trống thì reset về 1
                    if (e.target.value === "") {
                      updateQuantity(item.MaSP, 1);
                    }
                  }}
                  className="w-12 text-center border rounded"
                />


                <button
                  onClick={() => increaseQuantity(item.MaSP, item.quantity)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.MaSP)}
                className="text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <h2 className="text-xl font-bold">
              Tổng cộng: {total.toLocaleString()} ₫
            </h2>
          </div>
          
          {/* Nút chuyển sang trang thanh toán */}
      <div className="text-center mt-6">
        <Link
          href="/checkout"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Tiến hành thanh toán
        </Link>
      </div>
        </div>
      )}
    </div>
  );
}

