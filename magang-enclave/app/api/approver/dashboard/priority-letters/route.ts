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

    // Query untuk mendapatkan surat prioritas tinggi yang perlu diapprove
    const query = `
      WITH high_priority_items AS (
        -- Surat Masuk yang perlu di-approve
        SELECT 
          'incoming_mail' as type,
          im.id,
          im.mail_number as nomor,
          im.subject as title,
          u.full_name as pembuat,
          c.name as category,
          im.received_date as tanggal,
          approver.full_name as approver_name,
          im.priority,
          ima.status,
          im.created_at,
          CASE 
            WHEN ima.status = 'pending' THEN EXTRACT(DAY FROM (CURRENT_TIMESTAMP - im.created_at))
            ELSE 0
          END as days_pending
        FROM incoming_mails im
        LEFT JOIN users u ON im.created_by = u.id
        LEFT JOIN categories c ON im.category_id = c.id
        LEFT JOIN incoming_mail_approvals ima ON im.id = ima.incoming_mail_id AND ima.approver_id = $1
        LEFT JOIN users approver ON ima.approver_id = approver.id
        WHERE im.is_active = true 
          AND im.priority = 'high'
          AND ima.approver_id = $1
        
        UNION ALL
        
        -- Surat Keluar yang perlu di-approve
        SELECT 
          'outgoing_mail' as type,
          om.id,
          om.mail_number as nomor,
          om.subject as title,
          u.full_name as pembuat,
          c.name as category,
          om.mail_date as tanggal,
          approver.full_name as approver_name,
          om.priority,
          oma.status,
          om.created_at,
          CASE 
            WHEN oma.status = 'pending' THEN EXTRACT(DAY FROM (CURRENT_TIMESTAMP - om.created_at))
            ELSE 0
          END as days_pending
        FROM outgoing_mails om
        LEFT JOIN users u ON om.created_by = u.id
        LEFT JOIN categories c ON om.category_id = c.id
        LEFT JOIN outgoing_mail_approvals oma ON om.id = oma.outgoing_mail_id AND oma.approver_id = $1
        LEFT JOIN users approver ON oma.approver_id = approver.id
        WHERE om.is_active = true 
          AND om.priority = 'high'
          AND oma.approver_id = $1
        
        UNION ALL
        
        -- Memo yang perlu di-approve
        SELECT 
          'memo' as type,
          m.id,
          m.memo_number as nomor,
          m.subject as title,
          u.full_name as pembuat,
          'Memo' as category,
          m.memo_date as tanggal,
          approver.full_name as approver_name,
          m.priority,
          maf.status,
          m.created_at,
          CASE 
            WHEN maf.status = 'pending' THEN EXTRACT(DAY FROM (CURRENT_TIMESTAMP - m.created_at))
            ELSE 0
          END as days_pending
        FROM memos m
        LEFT JOIN users u ON m.created_by = u.id
        LEFT JOIN memo_approval_flows maf ON m.id = maf.memo_id AND maf.approver_id = $1
        LEFT JOIN users approver ON maf.approver_id = approver.id
        WHERE m.is_active = true 
          AND m.priority = 'high'
          AND maf.approver_id = $1
      )
      SELECT *
      FROM high_priority_items
      WHERE status = 'pending' AND days_pending >= 3
      ORDER BY days_pending DESC, created_at DESC
      LIMIT 20
    `;

    const results = await queryWithTenant(tenantName, query, [userId]);

    const formattedResults = results.map((item: any) => ({
      id: item.id,
      type: item.type,
      nomor: item.nomor || '-',
      title: item.title || '-',
      pembuat: item.pembuat || '-',
      category: item.category || '-',
      tanggal: item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric' 
      }) : '-',
      approver: item.approver_name || '-',
      status: item.days_pending >= 3 ? `Tertunda ${Math.floor(item.days_pending)} hari` : 'Pending',
      priority: item.priority
    }));

    return NextResponse.json({
      success: true,
      data: formattedResults
    });
  } catch (error) {
    console.error('Error fetching high priority letters:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch high priority letters' },
      { status: 500 }
    );
  }
}
