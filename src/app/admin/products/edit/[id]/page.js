
import EditProductClient from "./EditProductClient";

// Server Component để fetch dữ liệu sản phẩm
export default async function EditProductPage({ params }) {
  const { id } = await params;

  // Gọi API Route GET để lấy thông tin sản phẩm hiện tại
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: 'no-store', // Luôn fetch dữ liệu mới nhất
  });

  if (!res.ok) {
    return (
      <div className="p-8 text-center text-red-600 bg-white shadow-lg rounded-lg">
        Lỗi: Không tìm thấy sản phẩm có Mã SP: {id}
      </div>
    );
  }

  const productData = await res.json();

  // Truyền dữ liệu sản phẩm hiện tại xuống Client Component để hiển thị và chỉnh sửa
  return <EditProductClient initialProduct={productData} productId={id} />;
}