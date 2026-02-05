import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const categoryId = parseInt(context.params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }

    const categories = await queryWithTenant(
      tenantName,
      `
        SELECT
          c.id,
          c.name,
          c.code,
          c.description,
          c.module_type,
          c.division_id,
          c.department_id,
          d.name as division_name,
          dep.name as department_name,
          c.created_at,
          c.updated_at
        FROM categories c
        LEFT JOIN divisions d ON c.division_id = d.id
        LEFT JOIN departments dep ON c.department_id = dep.id
        WHERE c.id = $1
      `,
      [categoryId]
    );

    if (categories.length === 0) {
      return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ category: categories[0] });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ message: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const categoryId = parseInt(context.params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }

    const { name, code, description, module_type, division_id, department_id } = await request.json();

    // Validasi required fields
    if (!name || !code || !module_type) {
      return NextResponse.json({ message: 'Nama, kode, dan modul wajib diisi' }, { status: 400 });
    }

    // Cek apakah kode sudah ada (selain kategori ini)
    const existingCode = await queryWithTenant(
      tenantName,
      'SELECT id FROM categories WHERE code = $1 AND id != $2',
      [code, categoryId]
    );

    if (existingCode.length > 0) {
      return NextResponse.json({ message: 'Kategori dengan kode ini sudah ada' }, { status: 409 });
    }

    const result = await queryWithTenant(
      tenantName,
      `
        UPDATE categories
        SET name = $1, code = $2, description = $3, module_type = $4, division_id = $5, department_id = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
      `,
      [name, code, description, module_type, division_id || null, department_id || null, categoryId]
    );

    if (result.length === 0) {
      return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Kategori berhasil diperbarui', 
      category: result[0] 
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const categoryId = parseInt(context.params.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ message: 'Invalid category ID' }, { status: 400 });
    }

    const result = await queryWithTenant(
      tenantName,
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [categoryId]
    );

    if (result.length === 0) {
      return NextResponse.json({ message: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Kategori berhasil dihapus' 
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
  }
}
