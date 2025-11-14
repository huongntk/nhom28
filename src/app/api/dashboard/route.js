// /app/api/dashboard/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/mssql"; // Giả định đã có

export async function GET() {
  try {
    const pool = await getConnection();

    // 1. Lấy tổng Sản phẩm
    const productsResult = await pool
      .request()
      .query("SELECT COUNT(MaSP) AS totalProducts FROM SanPham");

    // 2. Lấy tổng Đơn hàng
    // Giả sử tên bảng đơn hàng là 'DonHang'
    const ordersResult = await pool
      .request()
      .query("SELECT COUNT(MaHD) AS totalOrders FROM HoaDon"); 
      
    // 3. Lấy tổng Khách hàng
    // Giả sử tên bảng khách hàng là 'KhachHang'
    const customersResult = await pool
      .request()
      .query("SELECT COUNT(MaKH) AS totalCustomers FROM KhachHang");

    const data = {
      totalProducts: productsResult.recordset[0].totalProducts,
      totalOrders: ordersResult.recordset[0].totalOrders,
      totalCustomers: customersResult.recordset[0].totalCustomers,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Không thể kết nối hoặc truy vấn CSDL." },
      { status: 500 }
    );
  }
}