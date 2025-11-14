import { NextResponse } from "next/server";
import { getConnection } from "@/lib/mssql";

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM SanPham");
    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const { TenSP, DonGia, MoTa, HinhAnh, SoLuong } = await req.json();

    if (!TenSP || !DonGia) {
      return NextResponse.json({ error: "Thiếu dữ liệu bắt buộc (Tên SP, Đơn Giá)" }, { status: 400 });
    }

    const pool = await getConnection();
    
    // Câu lệnh INSERT: Đảm bảo tên cột khớp với bảng SanPham của bạn
    const query = `
      INSERT INTO SanPham (TenSP, DonGia, MoTa, HinhAnh, SoLuong, TrangThai, MaLoai, MaNCC) 
      OUTPUT INSERTED.MaSP 
      VALUES (@TenSP, @DonGia, @MoTa, @HinhAnh, @SoLuong, @TrangThai, @MaLoai, @MaNCC);
    `;

    const result = await pool
      .request()
      .input('TenSP', TenSP)
      .input('DonGia', DonGia)
      .input('MoTa', MoTa)
      .input('HinhAnh', HinhAnh)
      .input('SoLuong', SoLuong)
      // Thiết lập giá trị mặc định cho các trường còn thiếu trong form
      .input('TrangThai', 1) 
      .input('MaLoai', 1) // Giả sử MaLoai mặc định là 1 (Điện thoại)
      .input('MaNCC', 1)  // Giả sử MaNCC mặc định là 1
      .query(query);

    const newProductId = result.recordset[0].MaSP;

    return NextResponse.json({ success: true, MaSP: newProductId }, { status: 201 }); // 201 Created
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: "Lỗi máy chủ khi thêm sản phẩm" }, { status: 500 });
  }
}