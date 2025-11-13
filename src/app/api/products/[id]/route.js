
import { getConnection } from "@/lib/mssql";

export async function GET(req, { params }) {
  const { id } = params;
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