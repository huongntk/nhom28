
// import Image from "next/image";

// export default async function ProductDetail({ params }) {
//   const { id } = params;
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//   console.log("Base URL:", baseUrl, "Product ID:", id);

//   try {
//     const res = await fetch(`${baseUrl}/api/products/${id}`, {
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       console.error(`Fetch error: ${res.status} - ${res.statusText}`);
//       return (
//         <div className="text-center text-red-600 p-10">
//           Không tìm thấy sản phẩm! (Lỗi: {res.status})
//         </div>
//       );
//     }

//     const product = await res.json();

//     if (!product || !product.MaSP || !product.TenSP || !product.DonGia || !product.HinhAnh) {
//       return (
//         <div className="text-center text-red-600 p-10">
//           Dữ liệu sản phẩm không hợp lệ!
//         </div>
//       );
//     }

//     return (
//       <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
//         <Image
//           src={product.HinhAnh || "/fallback-image.jpg"}
//           alt={product.TenSP || "Sản phẩm"}
//           width={400}
//           height={400}
//           className="w-full md:w-1/3 h-auto object-contain rounded-lg transition-transform duration-300 hover:scale-105"
//         />
//         <div>
//           <h1 className="text-3xl font-bold mb-3">{product.TenSP}</h1>
//           <p className="text-red-600 text-2xl font-semibold mb-4">
//             {isNaN(Number(product.DonGia)) ? "Giá không hợp lệ" : Number(product.DonGia).toLocaleString()} ₫
//           </p>
//           <p className="text-gray-700 mb-4">{product.MoTa || "Chưa có mô tả chi tiết."}</p>

//           <button
//         onClick={() => addToCart({...product, DonGia: Number(product.DonGia)})}
//         className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//             Thêm vào giỏ
//         </button>
//         </div>
//       </div>
//     );
//   } catch (err) {
//     console.error("Error loading product:", err.message, err.stack);
//     return (
//       <div className="text-center text-red-600 p-10">
//         Lỗi khi tải sản phẩm: {err.message}
//       </div>
//     );
//   }
// }

import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetail({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="text-center text-red-600 p-10">Không tìm thấy sản phẩm!</div>;
  }

  const product = await res.json();

  return <ProductDetailClient product={product} />;
}
