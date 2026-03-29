import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  // 1. Ambil parameter user_id dari URL (contoh: /api/arsip?user_id=4)
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  // Validasi: Pastikan user_id dikirimkan
  if (!userId) {
    return NextResponse.json(
      { error: 'Parameter user_id wajib disertakan untuk melihat arsip.' }, 
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    // 2. Query SQL untuk memfilter data berdasarkan archived_by
    // Kita lakukan JOIN dengan tabel users untuk mengambil nama yang mengarsipkan (opsional, tapi bagus untuk UI)
    const query = `
      SELECT 
        a.id,
        a.document_type,
        a.document_number,
        a.title,
        a.document_date,
        a.archived_date,
        a.file_url,
        a.archived_by,
        u.full_name as archiver_name
      FROM himatif.archived_documents a
      LEFT JOIN himatif.users u ON a.archived_by = CAST(u.id AS INTEGER)
      WHERE a.archived_by = $1
      ORDER BY a.archived_date DESC
    `;

    // Pastikan userId dikirim sebagai parameter binding ($1)
    const result = await client.query(query, [userId]);

    // 3. Kembalikan response
    return NextResponse.json({ 
      message: 'Berhasil mengambil data arsip',
      total_data: result.rows.length,
      data: result.rows 
    });

  } catch (error: any) {
    console.error('Error fetching arsip:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data arsip dari server.' }, 
      { status: 500 }
    );
  } finally {
    client.release();
  }
}