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

    if (action === 'REPLY' || action === 'ARCHIVE') {
      
      const defaultNote = action === 'ARCHIVE' ? "Surat diarsipkan tanpa balasan." : null;
      const finalNote = notes || defaultNote;

      // 1. Selesaikan tugas disposisi user
      const updateDispQuery = `
        UPDATE himatif.dispositions
        SET status = 'COMPLETED', notes = $3, completed_at = NOW()
        WHERE incoming_mail_id = $1 AND to_user_id = $2
        RETURNING id
      `;
      const resultDisp = await client.query(updateDispQuery, [mailId, user_id, finalNote]);

      if (resultDisp.rowCount === 0) {
        throw new Error("Disposisi tidak ditemukan atau bukan milik user ini");
      }

      // 2. Update Status Surat Utama jadi ARSIP & Ambil Datanya (RETURNING)
      const updateMailQuery = `
        UPDATE himatif.incoming_mails
        SET status = 'ARSIP', updated_at = NOW()
        WHERE id = $1
        RETURNING mail_number, subject, mail_date, mail_path
      `;
      const resultMail = await client.query(updateMailQuery, [mailId]);

      // 3. Masukkan ke tabel archived_documents jika surat berhasil diupdate
      if (resultMail.rows.length > 0) {
        const mailData = resultMail.rows[0];

        // Cari ID terbesar di archived_documents untuk increment
        const maxArchQuery = `SELECT MAX(id) as max_id FROM himatif.archived_documents`;
        const maxArchResult = await client.query(maxArchQuery);
        const nextArchId = (maxArchResult.rows[0].max_id !== null ? Number(maxArchResult.rows[0].max_id) : 0) + 1;

        // Insert Data Arsip
        const insertArchiveQuery = `
          INSERT INTO himatif.archived_documents (
            id, document_id, document_type, document_number, title, 
            document_date, archived_date, file_url, archived_by, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, NOW(), NOW())
        `;
        
        await client.query(insertArchiveQuery, [
          nextArchId,                  // $1: id urut baru
          mailId,                      // $2: referensi ID surat masuk
          'SURAT_MASUK',               // $3: tipe dokumen
          mailData.mail_number,        // $4: nomor surat dari data RETURNING
          mailData.subject,            // $5: perihal/judul
          mailData.mail_date,          // $6: tanggal surat
          mailData.mail_path || null,  // $7: URL file surat
          user_id                      // $8: ID user yang mengarsipkan
        ]);
      }
    } else {
      throw new Error("Action tidak valid. Hanya 'REPLY' atau 'ARCHIVE' yang diperbolehkan.");
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: `Status berhasil diperbarui menjadi ${action} dan surat masuk ke Arsip.` });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error tindak lanjut:', error);
    return NextResponse.json({ 
      error: error.message || 'Gagal memproses tindak lanjut' 
    }, { status: 500 });
  } finally {
    client.release();
  }
}