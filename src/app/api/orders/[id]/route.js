import { getConnection } from "@/lib/mssql";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  let pool;
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID đơn hàng" },
        { status: 400 }
      );
    }
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
      const items = result.recordset || [];

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy chi tiết đơn hàng" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: items },
      { status: 200 }
    );
    // return Response.json(result.recordset || [], { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết đơn hàng:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
    // return Response.json({ error: "Lỗi server" }, { status: 500 });
  }finally {
    if (pool) await pool.close();
  }
}


