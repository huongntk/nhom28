import { getConnection } from "@/lib/mssql";
import { NextResponse } from "next/server";
import sql from "mssql";

 const splitFullName = (fullName) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 1) {
        return {
            Ho: parts.slice(0, parts.length - 1).join(' '), // Các từ đầu là Họ (bao gồm tên đệm)
            Ten: parts[parts.length - 1] // Từ cuối là Tên
        };
    }
    return { Ho: '', Ten: fullName };
};
// 1. LẤY DANH SÁCH ĐƠN HÀNG
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
  let transaction;
  try {
    const { name, address, phone, cart, total } = await request.json();

    if (!name || !address || !phone || !cart || cart.length === 0) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin đơn hàng" },
        { status: 400 }
      );
    }

    pool = await getConnection();
    transaction = pool.transaction();

    await transaction.begin();

    try {
      let MaKH;
      const { Ho, Ten } = splitFullName(name);
      
      // === BƯỚC 1: KIỂM TRA & TẠO MỚI KHÁCH HÀNG (KhachHang) ===
      
      // Tìm kiếm khách hàng bằng Số điện thoại
      const checkCustomerRequest = new sql.Request(transaction);
      checkCustomerRequest.input('SDT', phone);
      
      const customerResult = await checkCustomerRequest.query(`
          SELECT MaKH FROM KhachHang 
          WHERE SoDienThoai = @SDT
      `); //

      if (customerResult.recordset.length > 0) {
          // Khách hàng đã tồn tại
          MaKH = customerResult.recordset[0].MaKH;
          
         await new sql.Request(transaction)
            .input('MaKH', MaKH)
            .input('DiaChi', address)
            .query(`UPDATE KhachHang SET DiaChi = @DiaChi WHERE MaKH = @MaKH`);
          
      } else {
          // Khách hàng chưa tồn tại -> Thêm mới
          const insertCustomerRequest = new sql.Request(transaction);
          insertCustomerRequest.input('Ho', Ho);
          insertCustomerRequest.input('Ten', Ten);
          insertCustomerRequest.input('DiaChi', sql.NVarChar, address);
          insertCustomerRequest.input('SDT', phone);
          
          // Giả định các cột khác (GioiTinh, TongChiTieu, TinhTrang) có giá trị mặc định/NULL
          const newCustomerResult = await insertCustomerRequest.query(`
              INSERT INTO KhachHang (Ho, Ten, DiaChi, SoDienThoai, TongChiTieu, TinhTrang) 
              OUTPUT INSERTED.MaKH
              VALUES (@Ho, @Ten, @DiaChi, @SDT, 0, Null)
          `); //
          MaKH = newCustomerResult.recordset[0].MaKH;
      }

      // === BƯỚC 2: TẠO MỚI ĐƠN HÀNG VÀ CHI TIẾT ĐƠN HÀNG ===
      // 1. Tạo hóa đơn
      
      const hdResult = await transaction
        .request()
        .input("MaKH", MaKH) // THÊM MÃ KHÁCH HÀNG
        .input("TongTien", total)
        .input("TrangThai", "Chờ xử lý")
        .query(`
          INSERT INTO HoaDon (MaKH, TongTien, TrangThai, NgayLap) 
          OUTPUT INSERTED.MaHD
          VALUES (@MaKH, @TongTien, @TrangThai, GETDATE())
        `); //

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

          // CẬP NHẬT TỒN KHO 
          await transaction
            .request()
            .input("MaSP", item.MaSP)
            .input("SoLuongBan", item.quantity)
            .query(`
              UPDATE SanPham SET SoLuong = SoLuong - @SoLuongBan WHERE MaSP = @MaSP
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
  } catch (innerError) {
      // IN CHI TIẾT LỖI GỐC ĐỂ ĐIỀU TRA
      console.error("⛔ LỖI GỐC GÂY HỦY TRANSACTION:", innerError);
      
      // Bỏ qua lỗi EABORT khi gọi rollback
      if (innerError.code !== 'EABORT') {
         await transaction.rollback();
      }
      
      // Lỗi này phải được ném ra để khối catch bên ngoài bắt được
      throw innerError;
    }finally {
    if (pool) await pool.close();
  }
}
