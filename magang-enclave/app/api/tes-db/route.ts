import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM himatif.users");
    return NextResponse.json({
      success: true,
      total_data: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
