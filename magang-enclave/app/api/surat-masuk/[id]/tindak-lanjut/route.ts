import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> } 
) {
  const params = await props.params; 
  const mailId = params.id;

  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { user_id, action, notes } = body; 
    
    // Validasi input
    if (!user_id || !action) {
      return NextResponse.json({ error: 'User ID dan Action wajib diisi' }, { status: 400 });
    }

    await client.query('BEGIN');

    if (action === 'READ') {
      // User membuka surat (Update status disposisi jadi READ/ON_PROGRESS)
      const updateDispQuery = `
        UPDATE himatif.dispositions
        SET status = 'READ', updated_at = NOW()
        WHERE incoming_mail_id = $1 AND to_user_id = $2
        RETURNING id
      `;
      const result = await client.query(updateDispQuery, [mailId, user_id]);
      
      if (result.rowCount === 0) {
        throw new Error("Disposisi tidak ditemukan atau bukan milik user ini");
      }

    } else if (action === 'REPLY') {
      // User menyelesaikan tugas
      const updateDispQuery = `
        UPDATE himatif.dispositions
        SET status = 'COMPLETED', notes = $3, completed_at = NOW()
        WHERE incoming_mail_id = $1 AND to_user_id = $2
        RETURNING id
      `;
      // Gunakan notes || null untuk jaga-jaga jika notes kosong
      const result = await client.query(updateDispQuery, [mailId, user_id, notes || null]);

      if (result.rowCount === 0) {
        throw new Error("Disposisi tidak ditemukan atau bukan milik user ini");
      }

      // Update Status Surat Utama jadi ARSIP
      const updateMailQuery = `
        UPDATE himatif.incoming_mails
        SET status = 'ARSIP', updated_at = NOW()
        WHERE id = $1
      `;
      await client.query(updateMailQuery, [mailId]);
    } else if (action === 'ARCHIVE') {
      
      // Update Disposisi User jadi COMPLETED (Selesai)
      // Jika notes kosong, kita isi default agar informatif
      const defaultNote = notes || "Surat diarsipkan tanpa balasan.";
      
      const updateDispQuery = `
        UPDATE himatif.dispositions
        SET status = 'COMPLETED', notes = $3, completed_at = NOW()
        WHERE incoming_mail_id = $1 AND to_user_id = $2
        RETURNING id
      `;
      const result = await client.query(updateDispQuery, [mailId, user_id, defaultNote]);

      if (result.rowCount === 0) throw new Error("Disposisi tidak valid");

      // Update Surat Utama jadi ARSIP
      const updateMailQuery = `
        UPDATE himatif.incoming_mails
        SET status = 'ARSIP', updated_at = NOW()
        WHERE id = $1
      `;
      await client.query(updateMailQuery, [mailId]);
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: `Status berhasil diperbarui menjadi ${action}` });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error tindak lanjut:', error);
    // Return pesan error 
    return NextResponse.json({ 
      error: error.message || 'Gagal memproses tindak lanjut' 
    }, { status: 500 });
  } finally {
    client.release();
  }
}