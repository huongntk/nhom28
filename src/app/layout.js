import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CartProvider } from '../context/CartContext'
export const metadata = {
  title: 'Phone Store',
  description: 'Website bán điện thoại trực tuyến',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4">
          <CartProvider>
            {children}
          </CartProvider>
        </main>
        <Footer />
      </body>
    </html>
  )
}

// import "./globals.css";
// import { CartProvider } from "@/context/CartContext";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="vi">
//       <body>
//         <CartProvider>{children}</CartProvider>
//       </body>
//     </html>
//   );
// }

