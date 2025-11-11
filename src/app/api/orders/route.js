import { getConnection } from "@/lib/mssql";

export async function GET() {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        HD.MaHD, 
        (KH.Ho + ' ' + KH.Ten) AS TenKH,
        HD.NgayLap, 
        HD.TongTien, 
        HD.TrangThai
      FROM HoaDon HD
      JOIN KhachHang KH ON HD.MaKH = KH.MaKH
      ORDER BY HD.NgayLap DESC
    `);

    // ✅ đảm bảo luôn trả về mảng
    return Response.json(result.recordset || [], { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
    // ✅ trả về mảng rỗng nếu có lỗi (để tránh crash phía client)
    return Response.json([], { status: 500 });
  }
}
