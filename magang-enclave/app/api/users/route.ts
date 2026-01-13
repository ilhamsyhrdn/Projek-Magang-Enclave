import { NextResponse } from "next/server";
import pool from "@/lib/db"; 

export async function GET() {
  try {
    const query = `
        SELECT id, full_name, email, phone, role, division_id 
        FROM himatif.users 
        ORDER BY id ASC
    `;

    const result = await pool.query(query);

    // Mengembalikan response JSON
    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data users",
        total_data: result.rowCount,
        data: result.rows,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
