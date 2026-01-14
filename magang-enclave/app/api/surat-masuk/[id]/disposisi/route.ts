import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> } 
) {
  const params = await props.params;
  const mailId = params.id;

  const client = await pool.connect(); 
  
  try {
    const body = await request.json();

    const { 
      ketua_id,             // from_user_id
      target_user_id,       // to_user_id
      target_division_id,   // to_division_id
      target_department_id, // to_department_id (opsional)
      instruction, 
      notes,
      priority,             // (opsional, default: Normal)
      due_date              // (opsional)
    } = body;

    // 1. Mulai Transaksi
    await client.query('BEGIN');

    // 2. Generate ID Baru (MAX + 1) -> Agar jadi Integer, bukan UUID
    const maxQuery = `SELECT MAX(id) as max_id FROM himatif.dispositions`;
    const maxResult = await client.query(maxQuery);
    const currentMaxId = maxResult.rows[0].max_id !== null ? Number(maxResult.rows[0].max_id) : 0;
    const nextId = currentMaxId + 1;

    // 3. Update Status Surat Masuk -> 'DISPOSISI'
    const updateMailQuery = `
      UPDATE himatif.incoming_mails 
      SET status = 'DISPOSISI', updated_at = NOW()
      WHERE id = $1
    `;
    await client.query(updateMailQuery, [mailId]);

    // 4. Insert ke Tabel Disposisi
    const insertDispQuery = `
      INSERT INTO himatif.dispositions 
      (
        id, incoming_mail_id, from_user_id, to_user_id, 
        to_division_id, to_department_id, 
        instruction, notes, priority, due_date, 
        status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING', NOW())
      RETURNING id
    `;

    // Pastikan urutan values sama dengan kolom di atas
    await client.query(insertDispQuery, [
      nextId,                     // $1: id (Integer)
      mailId,                     // $2: incoming_mail_id
      ketua_id,                   // $3: from_user_id
      target_user_id,             // $4: to_user_id
      target_division_id || null, // $5: to_division_id (boleh null)
      target_department_id || null,// $6: to_department_id (boleh null)
      instruction,                // $7: instruction
      notes || null,              // $8: notes
      priority || 'Normal',       // $9: priority (Default Normal)
      due_date || null            // $10: due_date
    ]);

    // 5. Commit Transaksi
    await client.query('COMMIT');

    return NextResponse.json({ message: 'Disposisi berhasil dikirim', disposisi_id: nextId });

  } catch (error) {
    // 6. Rollback jika ada error
    await client.query('ROLLBACK');
    console.error('Error disposisi:', error);
    return NextResponse.json({ error: 'Gagal memproses disposisi' }, { status: 500 });
  } finally {
    client.release(); // Lepas koneksi
  }
}