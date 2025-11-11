// import sql from "@/lib/mssql";

// export async function GET(req, context) {
//   // ✅ Giải quyết lỗi bằng cách await params
//   const { id } = await context.params;

//   try {
//     const pool = await sql.connect();
//     const result = await pool
//       .request()
//       .input("MaSP", sql.Int, id)
//       .query("SELECT * FROM SanPham WHERE MaSP = @MaSP");

//     if (result.recordset.length === 0) {
//       return Response.json({ message: "Không tìm thấy sản phẩm" }, { status: 404 });
//     }

//     return Response.json(result.recordset[0], { status: 200 });
//   } catch (error) {
//     console.error("Lỗi API /products/[id]:", error);
//     return Response.json({ error: "Lỗi server" }, { status: 500 });
//   }
// }

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