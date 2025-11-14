
import { getConnection } from "@/lib/mssql";

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const pool = await getConnection(); // Sử dụng getConnection thay vì sql.connect
    const result = await pool
      .request()
      .input("MaSP", id)
      .query("SELECT * FROM SanPham WHERE MaSP = @MaSP");

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: "Sản phẩm không tồn tại" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.recordset[0]), {
      status: 200,
    });
  } catch (err) {
    console.error("API error:", err.message, err.stack);
    return new Response(JSON.stringify({ error: "Lỗi máy chủ" }), {
      status: 500,
    });
  }
}import { NextResponse } from "next/server";

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

export async function PUT(req, { params }) {
  // Fix lỗi Next.js: "params should be awaited before using its properties"
  const { id } = await params;
  
  try {
    // 1. Đọc dữ liệu cập nhật
    const { TenSP, DonGia, MoTa, HinhAnh, SoLuong } = await req.json();
    
    // Kiểm tra dữ liệu
    if (!TenSP || DonGia === undefined) {
      return NextResponse.json({ error: "Thiếu dữ liệu cập nhật bắt buộc" }, { status: 400 });
    }

    const pool = await getConnection();
    
    // 2. Thực hiện câu lệnh UPDATE
    const query = `
      UPDATE SanPham 
      SET TenSP = @TenSP, 
          DonGia = @DonGia, 
          MoTa = @MoTa, 
          HinhAnh = @HinhAnh, 
          SoLuong = @SoLuong
      WHERE MaSP = @MaSP
    `;

    const result = await pool
      .request()
      .input('MaSP', id)
      .input('TenSP', TenSP)
      .input('DonGia', DonGia)
      .input('MoTa', MoTa)
      .input('HinhAnh', HinhAnh)
      .input('SoLuong', SoLuong)
      .query(query);

    if (result.rowsAffected[0] === 0) {
        return NextResponse.json({ error: `Không tìm thấy sản phẩm có Mã SP ${id} để cập nhật` }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Cập nhật sản phẩm ${id} thành công` });
    
  } catch (error) {
    console.error(`API PUT Error (Product ${id}):`, error.message);
    return NextResponse.json({ error: "Lỗi máy chủ khi cập nhật sản phẩm" }, { status: 500 });
  }
}

/**
 * (Tùy chọn) Xử lý yêu cầu DELETE: Xóa sản phẩm theo ID
 */
export async function DELETE(req, { params }) {
  const { id } = await params;
  
  try {
    const pool = await getConnection();
    
    const result = await pool
      .request()
      .input("MaSP", id)
      .query("DELETE FROM SanPham WHERE MaSP = @MaSP");

    if (result.rowsAffected[0] === 0) {
        return NextResponse.json({ error: `Không tìm thấy sản phẩm có Mã SP ${id} để xóa` }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Đã xóa sản phẩm ${id}` });
    
  } catch (error) {
    console.error(`API DELETE Error (Product ${id}):`, error.message);
    return NextResponse.json({ error: "Lỗi máy chủ khi xóa sản phẩm" }, { status: 500 });
  }
}