// /app/api/products/route.js

import { NextResponse } from "next/server";
import { getConnection } from "@/lib/mssql"; // Giả định đã có
import path from 'path';
import fs from 'fs/promises';
/**
 * Xử lý yêu cầu GET: Lấy danh sách tất cả sản phẩm
 */
export async function GET() {
  try {
    const pool = await getConnection();
    // Thực hiện truy vấn để lấy tất cả sản phẩm
    const result = await pool.request().query("SELECT * FROM SanPham");
    
    // Trả về dữ liệu JSON
    return NextResponse.json(result.recordset);
    
  } catch (error) {
    console.error("API GET Error (Listing Products):", error.message);
    return NextResponse.json({ error: "Lỗi máy chủ khi lấy danh sách sản phẩm" }, { status: 500 });
  }
}


/**
 * Xử lý yêu cầu POST: Thêm sản phẩm mới và Tải lên ảnh
 */
export async function POST(req) {
  try {
    // 1. Đọc dữ liệu Form Data (bao gồm cả file)
    const formData = await req.formData();
    
    // Lấy file và các trường dữ liệu
    const file = formData.get('file');
    const TenSP = formData.get('TenSP');
    const DonGia = Number(formData.get('DonGia'));
    const MoTa = formData.get('MoTa');
    const SoLuong = Number(formData.get('SoLuong'));

    // 2. Kiểm tra dữ liệu
    if (!TenSP || DonGia === undefined || !file) {
      return NextResponse.json({ error: "Thiếu dữ liệu bắt buộc (Tên SP, Đơn Giá, hoặc File ảnh)" }, { status: 400 });
    }

    let filePathForDB = "";
    
    // ===============================================
    // XỬ LÝ TẢI FILE LÊN SERVER
    // ===============================================
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Tạo tên file duy nhất (để tránh trùng lặp)
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      
      // Đường dẫn lưu trữ vật lý: /public/images/
      const uploadDir = path.join(process.cwd(), 'public', 'images');
      
      // Đảm bảo thư mục tồn tại
      await fs.mkdir(uploadDir, { recursive: true });
      
      const fullPath = path.join(uploadDir, fileName);
      
      // Ghi file
      await fs.writeFile(fullPath, buffer);
      
      // Đường dẫn CSDL phải là đường dẫn công khai (bắt đầu bằng /)
      filePathForDB = `/images/${fileName}`; 
    }
    // ===============================================
    
    
    const pool = await getConnection();
    
    // 3. Thực hiện câu lệnh INSERT
    const query = `
      INSERT INTO SanPham (TenSP, DonGia, MoTa, HinhAnh, SoLuong, TrangThai, MaLoai, MaNCC) 
      OUTPUT INSERTED.MaSP 
      VALUES (@TenSP, @DonGia, @MoTa, @HinhAnh, @SoLuong, @TrangThai, @MaLoai, @MaNCC);
    `;

    const result = await pool
      .request()
      .input('TenSP', TenSP)
      .input('DonGia', DonGia)
      .input('MoTa', MoTa || '')
      .input('HinhAnh', filePathForDB) // LƯU ĐƯỜNG DẪN ĐÃ TẢI VÀO CSDL
      .input('SoLuong', SoLuong || 1)
      .input('TrangThai', 1)
      .input('MaLoai', 1)
      .input('MaNCC', 1)
      .query(query);

    const newProductId = result.recordset[0].MaSP;

    return NextResponse.json({ success: true, MaSP: newProductId, HinhAnh: filePathForDB }, { status: 201 });
    
  } catch (error) {
    console.error("API POST Error (Adding Product with File):", error);
    return NextResponse.json({ error: "Lỗi máy chủ khi thêm sản phẩm và tải ảnh lên" }, { status: 500 });
  }
}