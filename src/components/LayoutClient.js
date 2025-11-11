"use client";

import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import Footer from '../components/Footer'
export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    
    <CartProvider>
        {/* Chỉ hiển thị header khi không phải trang admin */}
        {!isAdminRoute && <Header />}
          <main className="flex-grow container mx-auto p-4">
              {children}
            <Toaster
            position="top-right"
            toastOptions={{
              duration: 2000,
              style: { background: "#333", color: "#fff" },
            }}
          />
          </main>
        </CartProvider>
    );
}
