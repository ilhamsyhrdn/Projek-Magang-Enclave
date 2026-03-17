import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const tenantName = await getTenantFromRequest(request);

    if (!tenantName) {
      return NextResponse.json(
        { message: 'Unauthorized: Tenant not found' },
        { status: 401 }
      );
    }

    const { 
      user_id, 
      position_id, 
      division_id, 
      department_id, 
      parent_id 
    } = await request.json();

    const query = `
      UPDATE organization_structure
      SET
        user_id = $1,
        position_id = $2,
        division_id = $3,
        department_id = $4,
        parent_id = $5
      WHERE id = $6
      RETURNING *
    `;

    const result = await queryWithTenant(
      tenantName,
      query,
      [user_id, position_id, division_id, department_id, parent_id, id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Node not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });

  } catch (error: any) {
    console.error('Error updating:', error);
    return NextResponse.json(
      { success: false, message: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const tenantName = await getTenantFromRequest(request);

    if (!tenantName) {
      return NextResponse.json(
        { message: 'Unauthorized: Tenant not found' },
        { status: 401 }
      );
    }

    console.log('Deleting organization structure:', id);

    const childrenCheck = await queryWithTenant(
      tenantName,
      'SELECT id FROM organization_structure WHERE parent_id = $1 AND is_active = true',
      [id]
    );

    if (childrenCheck.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete node with children"
        },
        { status: 400 }
      );
    }

    const query = `
      UPDATE organization_structure
      SET is_active = false
      WHERE id = $1
      RETURNING *
    `;

    const result = await queryWithTenant(
      tenantName,
      query,
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Node not found" },
        { status: 404 }
      );
    }

    console.log('Deleted successfully');

    return NextResponse.json({
      success: true,
      message: "Organization structure deleted"
    });

  } catch (error: any) {
    console.error('Error deleting:', error);
    return NextResponse.json(
      { success: false, message: "Failed to delete" },
      { status: 500 }
    );
  }
}