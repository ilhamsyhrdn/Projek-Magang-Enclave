import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request){
    try {

    const query = `
      SELECT * FROM himatif.dispositions
    ORDER BY id ASC 
    `;
    
    const result = await pool.query(query);
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}