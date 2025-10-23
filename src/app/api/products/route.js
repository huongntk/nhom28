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
