import { getConnection } from "@/lib/mssql";
import { NextResponse } from "next/server";
export async function GET() {
  let pool;
  try {
    pool = await getConnection();

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

    return NextResponse.json(
      { success: true, data: result.recordset },
      { status: 200 }
    );
    // return Response.json(result.recordset || [], { status: 200 });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
    return NextResponse.json(
      { success: false, data: [], message: "Lỗi server" },
      { status: 500 }
    );
    // return Response.json([], { status: 500 });
  } finally {
    if (pool) await pool.close(); // Giải phóng kết nối
  }
}

// 2. TẠO ĐƠN HÀNG MỚI (TỪ CHECKOUT)
export async function POST(request) {
  let pool;
  try {
    const { name, address, phone, cart, total } = await request.json();

    if (!name || !address || !phone || !cart || cart.length === 0) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin đơn hàng" },
        { status: 400 }
      );
    }

    pool = await getConnection();

    // Bắt đầu transaction
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // 1. Tạo hóa đơn
      const hdResult = await transaction
        .request()
        .input("TongTien", total)
        .input("TrangThai", "Chờ xử lý")
        .query(`
          INSERT INTO HoaDon (TongTien, TrangThai, NgayLap)
          OUTPUT INSERTED.MaHD
          VALUES (@TongTien, @TrangThai, GETDATE())
        `);

      const MaHD = hdResult.recordset[0].MaHD;

      // 2. Thêm chi tiết hóa đơn
      for (const item of cart) {
        await transaction
          .request()
          .input("MaHD", MaHD)
          .input("MaSP", item.MaSP)
          .input("SoLuong", item.quantity)
          .input("DonGia", item.DonGia)
          .input("ThanhTien", item.DonGia * item.quantity)
          .query(`
            INSERT INTO CTHoaDon (MaHD, MaSP, SoLuong, DonGia, ThanhTien)
            VALUES (@MaHD, @MaSP, @SoLuong, @DonGia, @ThanhTien)
          `);
      }

      await transaction.commit();

      return NextResponse.json(
        { success: true, message: "Đặt hàng thành công!", orderId: MaHD },
        { status: 200 }
      );
    } catch (innerError) {
      await transaction.rollback();
      throw innerError;
    }
  } catch (error) {
    console.error("Lỗi POST /api/orders:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  } finally {
    if (pool) await pool.close();
  }
}
