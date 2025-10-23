"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 🔹 Load giỏ hàng từ localStorage khi khởi động
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // 🔹 Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🔹 Thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.MaSP === product.MaSP);
      if (existing) {
        return prev.map((p) =>
          p.MaSP === product.MaSP ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 🔹 Xóa sản phẩm
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.MaSP !== id));
  };

  // 🔹 Cập nhật số lượng (BẮT BUỘC CÓ HÀM NÀY)
  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((p) =>
        p.MaSP === id ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    );
  };

  // 🔹 Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + item.DonGia * item.quantity, 0);

  // 🔹 ✅ Quan trọng: phải truyền `updateQuantity` vào Provider
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook tiện dùng
export const useCart = () => useContext(CartContext);
