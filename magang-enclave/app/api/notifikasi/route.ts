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
    console.error('Error GET Surat Masuk:', error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}

// 2. POST: Buat Surat Masuk Baru (ADK)
export async function POST(request: Request) {
  const client = await pool.connect(); // 1. Buka koneksi manual untuk Transaksi

  try {
    const body = await request.json();
    const { 
      mail_number, mail_date, sender_name, sender_address, 
      sender_organization, received_date, subject, file_url, user_id 
    } = body;
    
    await client.query('BEGIN'); // 2. Mulai Transaksi

    // Cari ID Terbesar untuk auto-increment manual
    const countQuery = `SELECT MAX(CAST(id AS INTEGER)) as max_id FROM himatif.incoming_mails`;
    const maxResult = await client.query(countQuery);
    const currentMaxId = maxResult.rows[0].max_id !== null ? Number(maxResult.rows[0].max_id) : 0;
    const nextId = currentMaxId + 1;
    
    const status = 'PENDING_REVIEW'; 

    // 3. Insert Surat Masuk
    const query = `
      INSERT INTO himatif.incoming_mails 
      (id, mail_number, mail_date, sender_name, sender_address, sender_organization, received_date, subject, mail_path, received_by, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `;
    const values = [
      nextId, mail_number, mail_date, sender_name, sender_address, 
      sender_organization, received_date, subject, file_url, user_id, status
    ];
    
    const result = await client.query(query, values);

    // 4. Tambahkan notifikasi ke semua user dengan role 'leader' (Ketua/Ilham)
    try {
      // Rangkai string pesan di JavaScript agar PostgreSQL tidak bingung
      const pesanNotifikasi = `Surat masuk baru: ${mail_number} - ${subject}`;

      const notifyQuery = `
        INSERT INTO himatif.notifications (user_id, title, message, reference_type, reference_id, created_at)
        SELECT id, 'Surat Masuk Baru', CAST($2 AS TEXT), 'SURAT_MASUK', CAST($1 AS INTEGER), NOW()
        FROM himatif.users
        WHERE role = 'leader' 
      `;
      
      // Kirim parameter yang sudah dirangkai
      await client.query(notifyQuery, [nextId, pesanNotifikasi]);
    } catch (notifyError) {
      // Gagal notifikasi tidak membatalkan insert surat, jadi biarkan jalan terus
      console.error('Error insert notification:', notifyError);
    }

    await client.query('COMMIT'); // 5. Simpan permanen ke database

    return NextResponse.json({ 
      message: 'Surat berhasil dicatat dan notifikasi dikirim', 
      data: result.rows[0] 
    }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK'); // 6. Batalkan semua jika ada error utama
    console.error('Error insert Surat Masuk:', error);
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 });
  } finally {
    client.release(); // 7. SANGAT PENTING: Kembalikan koneksi ke pool agar tidak memory leak
  }
}