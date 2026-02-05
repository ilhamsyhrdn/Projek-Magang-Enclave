import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';
import { verifyToken } from '@/lib/jwt';

interface User {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  division_id: number | null;
  department_id: number | null;
  role: string;
  tenant_name: string;
}

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json(
        { error: 'Unauthorized: Tenant not found' },
        { status: 401 }
      );
    }

    // Get user dari token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Token not found' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Get user data untuk mendapatkan division_id
    const userQuery = `
      SELECT id, employee_id, full_name, email, division_id, department_id, role, tenant_name
      FROM users
      WHERE id = $1
    `;
    const users = await queryWithTenant<User>(tenantName, userQuery, [decoded.userId]);
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentUser = users[0];

    const { search, status } = Object.fromEntries(request.nextUrl.searchParams);

    let query = `
      SELECT
          om.id,
          om.mail_number as no_surat,
          om.sent_date as tanggal_surat,
          om.sent_date as diterima_tanggal,
          om.subject as perihal,
          om.priority,
          om.recipient_organization as instansi_penerima,
          u.full_name as pengguna_surat_keluar,
          om.status as status_surat,
          om.is_read,
          om.notes as content,
          c.name as category_name,
          ot.name as template_name
      FROM outgoing_mails om
      LEFT JOIN users u ON om.created_by = u.id
      LEFT JOIN categories c ON om.category_id = c.id
      LEFT JOIN outgoing_templates ot ON om.template_id = ot.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filter by user's division (via category)
    if (currentUser.division_id) {
      query += ` AND c.division_id = $${paramIndex}`;
      params.push(currentUser.division_id);
      paramIndex++;
    }

    // Filter by status
    if (status && status !== 'all') {
      query += ` AND om.status = $${paramIndex}`;
      params.push(status.toLowerCase());
      paramIndex++;
    }

    // Search filter
    if (search) {
      query += ` AND (
        om.mail_number ILIKE $${paramIndex} OR
        om.recipient_organization ILIKE $${paramIndex} OR
        om.subject ILIKE $${paramIndex} OR
        u.full_name ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY om.created_at DESC`;

    const result = await queryWithTenant(tenantName, query, params);

    // Transform data to match frontend interface
    const transformedData = result.map((item: any) => ({
      ...item,
      // Map priority values
      priority: item.priority?.toUpperCase() || 'LOW',
      // Map status values
      status_surat: item.status_surat?.toUpperCase() || 'DRAFT',
    }));

    return NextResponse.json({
      success: true,
      data: transformedData || []
    });
  } catch (error: any) {
    console.error('Error fetching outgoing mails:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch outgoing mails' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json(
        { error: 'Unauthorized: Tenant not found' },
        { status: 401 }
      );
    }

    // Get user dari token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Token not found' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Get user data
    const userQuery = `
      SELECT id, employee_id, full_name, email, division_id, department_id, role, tenant_name
      FROM users
      WHERE id = $1
    `;
    const users = await queryWithTenant<User>(tenantName, userQuery, [decoded.userId]);
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const currentUser = users[0];

    // Validate user has division
    if (!currentUser.division_id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User tidak memiliki divisi. Silakan hubungi administrator.' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      instansi_penerima,      // recipient_organization
      tanggal_dibuat,         // sent_date
      perihal,                // subject
      category_id,
      template_id,
      content,                // notes
      priority,
      lampiran,
      notes
    } = body;

    // Validation
    if (!instansi_penerima || !tanggal_dibuat || !perihal || !category_id || !content) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Instansi Penerima, Tanggal, Perihal, Kategori, dan Konten wajib diisi!' 
        },
        { status: 400 }
      );
    }

    // Validate category belongs to user's division
    const categoryCheck = await queryWithTenant(
      tenantName,
      `SELECT id, division_id FROM categories WHERE id = $1`,
      [parseInt(category_id)]
    );

    if (!categoryCheck || categoryCheck.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Kategori tidak ditemukan' 
        },
        { status: 400 }
      );
    }

    if (categoryCheck[0].division_id !== currentUser.division_id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Anda tidak memiliki akses ke kategori ini' 
        },
        { status: 403 }
      );
    }

    // Generate nomor surat
    const mail_number = null;//await generateMailNumber(tenantName);

    // Map priority to lowercase (normal, high, low)
    const priorityMap: Record<string, string> = {
      'HIGH': 'high',
      'MEDIUM': 'normal',
      'LOW': 'low'
    };
    const priorityValue = priorityMap[priority?.toUpperCase()] || 'normal';

    // Insert surat keluar dengan draft status
    const result = await queryWithTenant(
      tenantName,
      `INSERT INTO outgoing_mails (
        mail_number,
        template_id,
        category_id,
        subject,
        recipient_name,
        recipient_organization,
        priority,
        status,
        sent_date,
        notes,
        is_read,
        created_by,
        current_approval_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', $8, $9, false, $10, 0)
      RETURNING *`,
      [
        mail_number,
        template_id ? parseInt(template_id) : null,
        parseInt(category_id),
        perihal,
        instansi_penerima, // Sementara gunakan instansi sebagai recipient_name
        instansi_penerima,
        priorityValue,
        tanggal_dibuat,
        content, // Content masuk ke notes
        currentUser.id
      ]
    );

    // Transform response to match frontend expectations
    const transformedResult = {
      id: result[0].id,
      no_surat: result[0].mail_number,
      tanggal_surat: result[0].sent_date,
      perihal: result[0].subject,
      instansi_penerima: result[0].recipient_organization,
      pengguna_surat_keluar: currentUser.full_name,
      status_surat: result[0].status.toUpperCase(),
      priority: result[0].priority.toUpperCase(),
      content: result[0].notes,
      is_read: result[0].is_read
    };

    return NextResponse.json({
      success: true,
      data: transformedResult,
      message: 'Surat keluar berhasil dibuat'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating outgoing mail:', error);
    
    // Better error handling
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: isDevelopment 
          ? errorMessage 
          : 'Gagal membuat surat keluar. Silakan coba lagi.'
      },
      { status: 500 }
    );
  }
}

// Helper function to generate Mail Number
// async function generateMailNumber(tenant: string): Promise<string> {
//   const currentYear = new Date().getFullYear();
//   const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

//   try {
//     // Get count of outgoing mails this year
//     const result = await queryWithTenant(
//       tenant,
//       `SELECT COUNT(*) as count
//        FROM outgoing_mails
//        WHERE EXTRACT(YEAR FROM created_at) = $1`,
//       [currentYear]
//     );

//     const count = parseInt(result[0]?.count || '0') + 1;
//     const paddedCount = count.toString().padStart(4, '0');

//     // Format: YYYY/XXXX/MM/YYYY
//     return `${currentYear}/${paddedCount}/${currentMonth}/${currentYear}`;
//   } catch (error) {
//     console.error('Error generating mail_number:', error);
//     // Fallback format
//     return `${currentYear}/0001/${currentMonth}/${currentYear}`;
//   }
// }