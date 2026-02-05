import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
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
        ORDER BY c.created_at DESC
      `
    );

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ message: 'Unauthorized: Tenant not found' }, { status: 401 });
    }

    const { name, code, description, module_type, division_id, department_id } = await request.json();

    // Validasi required fields
    if (!name || !code || !module_type) {
      return NextResponse.json({ message: 'Nama, kode, dan modul wajib diisi' }, { status: 400 });
    }

    // Cek apakah kode sudah ada
    const existingCode = await queryWithTenant(
      tenantName,
      'SELECT id FROM categories WHERE code = $1',
      [code]
    );

    if (existingCode.length > 0) {
      return NextResponse.json({ message: 'Kategori dengan kode ini sudah ada' }, { status: 409 });
    }

    const result = await queryWithTenant(
      tenantName,
      `
        INSERT INTO categories (name, code, description, module_type, division_id, department_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [name, code, description, module_type, division_id || null, department_id || null]
    );

    return NextResponse.json({ 
      message: 'Kategori berhasil ditambahkan', 
      category: result[0] 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}
