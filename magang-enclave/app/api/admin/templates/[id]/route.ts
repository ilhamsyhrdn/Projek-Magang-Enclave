import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const moduleType = searchParams.get('module_type');
    const id = params.id;

    if (!moduleType) {
      return NextResponse.json(
        { error: 'module_type parameter is required' },
        { status: 400 }
      );
    }

    // Map module type to table name
    const tableMap: Record<string, string> = {
      'surat-keluar': 'outgoing_templates',
      'memo': 'memo_templates',
      'notulensi': 'notulensi_templates',
    };

    const tableName = tableMap[moduleType];
    if (!tableName) {
      return NextResponse.json(
        { error: 'Invalid module_type' },
        { status: 400 }
      );
    }

    const result = await queryWithTenant(
      tenantName,
      `SELECT
        t.id,
        t.name,
        t.description,
        t.category_id,
        t.content,
        t.division_id,
        t.created_at,
        t.updated_at,
        c.name as category_name
      FROM ${tableName} t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1`,
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error: any) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();
    const {
      name,
      description,
      module_type,
      category_id,
      division_id,
      content
    } = body;

    if (!module_type) {
      return NextResponse.json(
        { error: 'module_type parameter is required' },
        { status: 400 }
      );
    }

    // Validate module_type
    const validModuleTypes = ['surat-keluar', 'memo', 'notulensi'];
    if (!validModuleTypes.includes(module_type)) {
      return NextResponse.json(
        { error: 'Invalid module_type. Must be one of: surat-keluar, memo, notulensi' },
        { status: 400 }
      );
    }

    // Map module type to table name
    const tableMap: Record<string, string> = {
      'surat-keluar': 'outgoing_templates',
      'memo': 'memo_templates',
      'notulensi': 'notulensi_templates',
    };

    const tableName = tableMap[module_type];

    // Check if template exists
    const existing = await queryWithTenant(
      tenantName,
      `SELECT id FROM ${tableName} WHERE id = $1`,
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Check if category exists if provided
    if (category_id) {
      const categoryCheck = await queryWithTenant(
        tenantName,
        'SELECT id FROM categories WHERE id = $1',
        [category_id]
      );

      if (categoryCheck.length === 0) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(description);
      paramIndex++;
    }

    if (category_id !== undefined) {
      updates.push(`category_id = $${paramIndex}`);
      values.push(category_id);
      paramIndex++;
    }

    if (division_id !== undefined) {
      updates.push(`division_id = $${paramIndex}`);
      values.push(division_id);
      paramIndex++;
    }

    if (content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      values.push(content);
      paramIndex++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE ${tableName}
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await queryWithTenant(tenantName, query, values);

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error: any) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const moduleType = searchParams.get('module_type');
    const id = params.id;

    if (!moduleType) {
      return NextResponse.json(
        { error: 'module_type parameter is required' },
        { status: 400 }
      );
    }

    // Map module type to table name
    const tableMap: Record<string, string> = {
      'surat-keluar': 'outgoing_templates',
      'memo': 'memo_templates',
      'notulensi': 'notulensi_templates',
    };

    const tableName = tableMap[moduleType];

    // Check if template exists
    const existing = await queryWithTenant(
      tenantName,
      `SELECT id FROM ${tableName} WHERE id = $1`,
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Delete template
    await queryWithTenant(
      tenantName,
      `DELETE FROM ${tableName} WHERE id = $1`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete template' },
      { status: 500 }
    );
  }
}
