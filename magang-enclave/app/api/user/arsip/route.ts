import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const tenantName = 'himatif'; // You can get this from session/auth

    const arsipData = await queryWithTenant(
      tenantName,
      `SELECT 
        ad.id,
        ad.document_number as nomer_surat,
        ad.title as perihal_surat,
        u.full_name as pengirim,
        TO_CHAR(ad.document_date, 'DD Mon YY') as tanggal_surat,
        TO_CHAR(ad.archived_date, 'DD Mon YY') as tanggal_dibuat,
        approver.full_name as approver,
        ad.document_type as kategori
      FROM archived_documents ad
      LEFT JOIN users u ON ad.archived_by = u.id
      LEFT JOIN users approver ON ad.archived_by = approver.id
      ORDER BY ad.archived_date DESC`
    );

    // Count items per category for proper numbering
    const categoryCounter: { [key: string]: number } = {
      'Surat Masuk': 0,
      'Surat Keluar': 0,
      'Memo': 0,
      'Notulensi': 0
    };

    // Transform data to match frontend interface
    const transformedData = arsipData.map((item: any) => {
      const kategori = item.kategori || 'Surat Masuk';
      categoryCounter[kategori] = (categoryCounter[kategori] || 0) + 1;
      
      return {
        id: item.id,
        no: categoryCounter[kategori],
        nomerSurat: item.nomer_surat,
        perihalSurat: item.perihal_surat,
        pengirim: item.pengirim || 'Unknown',
        tanggalSurat: item.tanggal_surat,
        tanggalDibuat: item.tanggal_dibuat,
        approver: item.approver || 'Unknown',
        kategori: kategori
      };
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching arsip data:', error);
    // Return empty array instead of error
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = 'himatif'; // You can get this from session/auth
    const body = await request.json();

    const {
      documentId,
      documentType,
      documentNumber,
      title,
      content,
      category,
      divisionId,
      departmentId,
      documentDate,
      archivedBy
    } = body;

    await queryWithTenant(
      tenantName,
      `INSERT INTO archived_documents (
        document_id,
        document_type,
        document_number,
        title,
        content,
        category,
        division_id,
        department_id,
        document_date,
        archived_by,
        archived_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE)`,
      [
        documentId,
        documentType,
        documentNumber,
        title,
        content || '',
        category || '',
        divisionId || null,
        departmentId || null,
        documentDate,
        archivedBy
      ]
    );

    return NextResponse.json({ success: true, message: 'Dokumen berhasil diarsipkan' });
  } catch (error) {
    console.error('Error archiving document:', error);
    return NextResponse.json(
      { error: 'Failed to archive document' },
      { status: 500 }
    );
  }
}
