export default async function ProductDetail({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`);
  const product = await res.json();

  return (
    <div className="p-8">
      <img src={product.HinhAnh} alt={product.TenSP} className="w-64 h-64 object-cover" />
      <h1 className="text-2xl font-bold mt-4">{product.TenSP}</h1>
      <p className="text-red-600 font-semibold text-xl">{product.DonGia.toLocaleString()} ₫</p>
      <p className="mt-2">{product.MoTa}</p>
    </div>
  );
}
