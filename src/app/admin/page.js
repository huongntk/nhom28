export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📊 Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Tổng sản phẩm</h2>
          <p className="text-2xl text-blue-600 font-bold mt-2">128</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Tổng đơn hàng</h2>
          <p className="text-2xl text-green-600 font-bold mt-2">54</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Tổng khách hàng</h2>
          <p className="text-2xl text-orange-600 font-bold mt-2">76</p>
        </div>
      </div>
    </div>
  );
}
