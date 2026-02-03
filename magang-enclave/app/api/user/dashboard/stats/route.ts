import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    // Verify token and get user info
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;

    // Query untuk menghitung total surat masuk (yang dibuat oleh user)
    const suratMasukQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE created_by = $1) as created_count,
        COUNT(*) as total_count
      FROM incoming_mails
      WHERE is_active = true
    `;
    const suratMasukResult = await queryWithTenant(tenantName, suratMasukQuery, [userId]);
    
    // Query untuk menghitung total surat keluar (yang dibuat oleh user)
    const suratKeluarQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE created_by = $1) as created_count,
        COUNT(*) as total_count
      FROM outgoing_mails
      WHERE is_active = true
    `;
    const suratKeluarResult = await queryWithTenant(tenantName, suratKeluarQuery, [userId]);
    
    // Query untuk menghitung total memo (yang dibuat oleh user)
    const memoQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE created_by = $1) as created_count,
        COUNT(*) as total_count
      FROM memos
      WHERE is_active = true
    `;
    const memoResult = await queryWithTenant(tenantName, memoQuery, [userId]);
    
    // Query untuk menghitung total notulensi (yang dibuat oleh user)
    const notulensiQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE created_by = $1) as created_count,
        COUNT(*) as total_count
      FROM notulensi
      WHERE is_active = true
    `;
    const notulensiResult = await queryWithTenant(tenantName, notulensiQuery, [userId]);

    const stats = {
      suratMasuk: {
        created: parseInt(suratMasukResult[0]?.created_count || '0'),
        total: parseInt(suratMasukResult[0]?.total_count || '0'),
      },
      suratKeluar: {
        created: parseInt(suratKeluarResult[0]?.created_count || '0'),
        total: parseInt(suratKeluarResult[0]?.total_count || '0'),
      },
      memo: {
        created: parseInt(memoResult[0]?.created_count || '0'),
        total: parseInt(memoResult[0]?.total_count || '0'),
      },
      notulensi: {
        created: parseInt(notulensiResult[0]?.created_count || '0'),
        total: parseInt(notulensiResult[0]?.total_count || '0'),
      },
    };

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
