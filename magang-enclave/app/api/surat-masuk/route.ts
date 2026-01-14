import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. GET: Ambil Daftar Surat Masuk
export async function GET(request: Request) {
  try {

    const query = `
      SELECT 
        m.id, m.mail_number, m.mail_date, m.sender_name, m.subject, m.status, 
        u.full_name as receiver_name
      FROM himatif.incoming_mails m
      LEFT JOIN himatif.users u ON m.received_by = u.id
      ORDER BY m.created_at DESC
    `;
    
    const result = await pool.query(query);
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

// 2. POST: Buat Surat Masuk Baru (ADK)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mail_number, mail_date, sender_name, subject, file_url, user_id } = body;
    const client = await pool.connect();

    const countQuery = `SELECT MAX(CAST(id AS INTEGER)) as max_id FROM himatif.incoming_mails`;
    const maxResult = await client.query(countQuery);

    const currentMaxId = maxResult.rows[0].max_id !== null ? Number(maxResult.rows[0].max_id) : 0;
    const nextId = currentMaxId + 1;
    
    const status = 'PENDING_REVIEW'; 

    const query = `
      INSERT INTO himatif.incoming_mails 
      (id, mail_number, mail_date, sender_name, subject, mail_path, received_by, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;

    const values = [nextId, mail_number, mail_date, sender_name, subject, file_url, user_id, status];
    
    const result = await pool.query(query, values);

    return NextResponse.json({ 
      message: 'Surat berhasil dicatat', 
      data: result.rows[0] 
    }, { status: 201 });
  } catch (error) {
    console.error('Error insert:', error);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  }
}