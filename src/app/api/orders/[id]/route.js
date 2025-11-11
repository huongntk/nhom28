import { getConnection } from "@/lib/mssql";

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const pool = await getConnection();
    

    const result = await pool.request()
      .input("MaHD", id)
      .query(`
        SELECT 
          CTHD.MaHD,
          SP.TenSP,
          SP.DonGia,
          CTHD.SoLuong,
          CTHD.ThanhTien
        FROM CTHoaDon CTHD
        JOIN SanPham SP ON CTHD.MaSP = SP.MaSP
        WHERE CTHD.MaHD = @MaHD
      `);

    return Response.json(result.recordset || [], { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết đơn hàng:", error);
    return Response.json({ error: "Lỗi server" }, { status: 500 });
  }
}
