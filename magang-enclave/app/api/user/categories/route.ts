import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';
import { verifyToken } from '@/lib/jwt';

// Konstanta untuk module types yang diizinkan
const ALLOWED_MODULE_TYPES = ['surat_keluar', 'surat_masuk', 'memo', 'notulensi'] as const;
type ModuleType = typeof ALLOWED_MODULE_TYPES[number];

interface Category {
  id: number;
  code: string;
  name: string;
  description: string | null;
  module_type: string;
  division_id: number | null;
  division_name: string | null;
}

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
    // Get tenant from request
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json(
        { error: 'Unauthorized: Tenant not found' },
        { status: 401 }
      );
    }

    console.log('[Categories API] Tenant:', tenantName);

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

    console.log('[Categories API] User ID from token:', decoded.userId);

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
    console.log('[Categories API] Current User:', {
      id: currentUser.id,
      name: currentUser.full_name,
      division_id: currentUser.division_id,
      role: currentUser.role
    });

    // Get and validate query parameters
    const { searchParams } = request.nextUrl;
    const moduleTypeParam = searchParams.get('module_type') || 'surat_keluar';

    console.log('[Categories API] Module Type:', moduleTypeParam);

    // Validate module_type
    if (!ALLOWED_MODULE_TYPES.includes(moduleTypeParam as ModuleType)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid module_type. Allowed values: ' + ALLOWED_MODULE_TYPES.join(', ')
        },
        { status: 400 }
      );
    }

    // Build query with parameterized values
    const params: (string | number)[] = [];
    let paramIndex = 1;

    let query = `
      SELECT
        c.id,
        c.code,
        c.name,
        c.description,
        c.module_type,
        c.division_id,
        d.name as division_name
      FROM categories c
      LEFT JOIN divisions d ON c.division_id = d.id
      WHERE c.module_type = $${paramIndex}
    `;
    params.push(moduleTypeParam);
    paramIndex++;

    // Filter by user's division_id (hanya jika user memiliki division)
    if (currentUser.division_id) {
      query += ` AND c.division_id = $${paramIndex}`;
      params.push(currentUser.division_id);
      paramIndex++;
    }

    // Order by name
    query += ` ORDER BY c.name ASC`;

    console.log('[Categories API] Query:', query);
    console.log('[Categories API] Params:', params);

    // Execute query
    const categories = await queryWithTenant<Category>(tenantName, query, params);

    console.log('[Categories API] Results count:', categories?.length || 0);
    console.log('[Categories API] Results:', categories);

    return NextResponse.json({
      success: true,
      data: categories || [],
      count: categories?.length || 0,
      debug: {
        user_division_id: currentUser.division_id,
        module_type: moduleTypeParam,
        query: query,
        params: params
      }
    });

  } catch (error) {
    console.error('[Categories API] Error:', error);
    
    // Jangan expose detail error ke client di production
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: isDevelopment 
          ? errorMessage 
          : 'Failed to fetch categories. Please try again later.'
      },
      { status: 500 }
    );
  }
}