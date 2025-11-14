async function getDashboardData() {
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  try {
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      cache: 'no-store', 
    });
    
    if (!res.ok) {
      // Nếu có lỗi, trả về giá trị mặc định để tránh crash
      console.error("Failed to fetch dashboard data:", res.statusText);
      return { totalProducts: 'N/A', totalOrders: 'N/A', totalCustomers: 'N/A' };
    }
    
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { totalProducts: 'N/A', totalOrders: 'N/A', totalCustomers: 'N/A' };
  }
}
export default async function AdminDashboard() {
  const { totalProducts, totalOrders, totalCustomers } = await getDashboardData();
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📊 Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Tổng sản phẩm</h2>
          <p className="text-2xl text-blue-600 font-bold mt-2">{totalProducts.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Tổng đơn hàng</h2>
          <p className="text-2xl text-green-600 font-bold mt-2">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Tổng khách hàng</h2>
          <p className="text-2xl text-orange-600 font-bold mt-2">{totalCustomers.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
