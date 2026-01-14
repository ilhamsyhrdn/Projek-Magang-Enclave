import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; 

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  
  const mailId = '1';

  try {
    // Mengambil data surat sekaligus join ke users (receiver) 
    // DAN join ke tabel dispositions beserta sender/recipient-nya dalam SATU query.
    const { data: mailData, error } = await supabaseAdmin
      .from('incoming_mails') // Pastikan client sudah set schema: 'himatif'
      .select(`
        *,
        receiver:users!received_by (full_name, role),
        history_disposisi:dispositions (
          *,
          sender:users!from_user_id (full_name),
          recipient:users!to_user_id (full_name)
        )
      `)
      .eq('id', mailId)
      .single(); // .single() digunakan karena kita mencari berdasarkan ID (1 hasil)

    if (error) {
      // Handle jika data tidak ditemukan (Code PGRST116 adalah error 'Row not found')
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Surat tidak ditemukan' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Supabase otomatis mereturn struktur JSON yang rapi, 
    // namun jika ingin menyesuaikan format persis seperti kode lama:
    const responseData = {
      ...mailData,
      // Mapping receiver (karena hasil join di supabase menjadi object, bukan flat column)
      receiver_name: mailData.receiver?.full_name,
      receiver_role: mailData.receiver?.role,
      // history_disposisi sudah otomatis berupa array berkat relasi di .select()
      history_disposisi: mailData.history_disposisi.map((disp: any) => ({
        ...disp,
        sender_name: disp.sender?.full_name,
        recipient_name: disp.recipient?.full_name
      }))
    };

    return NextResponse.json({ data: responseData });

  } catch (error) {
    console.error('Error fetching detail:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}