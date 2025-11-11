import './globals.css'
import LayoutClient from '@/components/LayoutClient';
import Footer from '@/components/Footer';
export const metadata = {
  title: 'Phone Store',
  description: 'Website bán điện thoại trực tuyến',
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <LayoutClient>{children}</LayoutClient>
        <Footer />
      </body>
    </html>
  )
}

