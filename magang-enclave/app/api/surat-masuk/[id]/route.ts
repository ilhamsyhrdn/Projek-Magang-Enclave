import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> } // Mengambil ID dari URL
) {
  const params = await props.params; 
  const mailId = params.id;

  try {
    const client = await pool.connect();

    try {
      // 1. Ambil Data Utama Surat
      const mailQuery = `
        SELECT 
          m.*, 
          u.full_name as receiver_name,
          u.role as receiver_role
        FROM himatif.incoming_mails m
        LEFT JOIN himatif.users u ON m.received_by = u.id
        WHERE m.id = $1
      `;
      
      const mailResult = await client.query(mailQuery, [mailId.trim()]);

      // Cek jika surat tidak ditemukan
      if (mailResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Surat tidak ditemukan' }, 
          { status: 404 }
        );
      }

      const mailData = mailResult.rows[0];

      // Ambil Riwayat Disposisi surat ini
      // untuk fitur review
      const dispositionQuery = `
        SELECT 
          d.*,
          sender.full_name as sender_name,
          recipient.full_name as recipient_name
        FROM himatif.dispositions d
        LEFT JOIN himatif.users sender ON d.from_user_id = sender.id
        LEFT JOIN himatif.users recipient ON d.to_user_id = recipient.id
        WHERE d.incoming_mail_id = $1
        ORDER BY d.created_at ASC
      `;
      
      const dispositionResult = await client.query(dispositionQuery, [mailId]);

      // Gabungkan data surat dan disposisinya
      const responseData = {
        ...mailData,
        history_disposisi: dispositionResult.rows
      };

      return NextResponse.json({ data: responseData });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error fetching detail:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const mailId = params.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Mulai Transaksi

    // 1. Hapus dulu data Disposisi yang terkait dengan surat ini
    // (Penting agar tidak error Foreign Key Constraint)
    const deleteDisposisiQuery = `
      DELETE FROM himatif.dispositions 
      WHERE incoming_mail_id = $1
    `;
    await client.query(deleteDisposisiQuery, [mailId]);

    // 2. Hapus Surat Masuk-nya
    const deleteMailQuery = `
      DELETE FROM himatif.incoming_mails 
      WHERE id = $1
      RETURNING *
    `;
    const result = await client.query(deleteMailQuery, [mailId]);

    await client.query('COMMIT'); // Simpan perubahan permanen

    // Cek apakah ada data yang terhapus
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Data berhasil dihapus', 
      deleted_data: result.rows[0] 
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Batalkan jika ada error
    console.error('Error delete:', error);
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const mailId = params.id;

  try {
    const body = await request.json();
    const { mail_number, mail_date, sender_name, subject, file_url } = body;

    const client = await pool.connect();

    try {
      // Query Update
      // COALESCE($5, mail_path) artinya: Jika $5 (file_url) null/kosong, pakai mail_path yang lama.
      const query = `
        UPDATE himatif.incoming_mails
        SET 
          mail_number = $1,
          mail_date = $2,
          sender_name = $3,
          subject = $4,
          mail_path = COALESCE($5, mail_path), 
          updated_at = NOW()
        WHERE id = $6
        RETURNING *
      `;

      const values = [
        mail_number, 
        mail_date, 
        sender_name, 
        subject, 
        file_url || null, // Jika tidak ada file_url, kirim null agar COALESCE bekerja
        mailId
      ];

      const result = await client.query(query, values);

      // Cek apakah ada data yang diupdate (jika ID salah/tidak ketemu)
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
      }

      return NextResponse.json({ 
        message: 'Data berhasil diperbarui', 
        data: result.rows[0] 
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error update:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data' }, { status: 500 });
  }
}