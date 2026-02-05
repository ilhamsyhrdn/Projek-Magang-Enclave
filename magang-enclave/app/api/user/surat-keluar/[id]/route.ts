import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';
import { getTenantFromRequest } from '@/lib/server-auth';

// Mark surat as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json(
        { error: 'Unauthorized: Tenant not found' },
        { status: 401 }
      );
    }

    const { id } = params;
    const url = request.nextUrl.pathname;

    // Check if this is a read operation
    if (url.endsWith('/read')) {
      const result = await queryWithTenant(
        tenantName,
        `UPDATE outgoing_mails 
         SET is_read = true, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [parseInt(id)]
      );

      if (result.length === 0) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Surat not found' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result[0],
        message: 'Surat marked as read'
      });
    }

    // Default status update
    const body = await request.json();
    const { status } = body;

    const result = await queryWithTenant(
      tenantName,
      `UPDATE outgoing_mails 
       SET status_surat = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status?.toUpperCase() || 'PENDING', parseInt(id)]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Surat not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Surat status updated'
    });

  } catch (error: any) {
    console.error('Error updating outgoing mail:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to update outgoing mail' 
      },
      { status: 500 }
    );
  }
}

// Delete surat
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantName = await getTenantFromRequest(request);
    if (!tenantName) {
      return NextResponse.json(
        { error: 'Unauthorized: Tenant not found' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if surat exists and status is DRAFT
    const checkResult = await queryWithTenant(
      tenantName,
      `SELECT id, status_surat FROM outgoing_mails WHERE id = $1`,
      [parseInt(id)]
    );

    if (checkResult.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Surat not found' 
        },
        { status: 404 }
      );
    }

    // Only allow delete if status is DRAFT
    if (checkResult[0].status_surat !== 'DRAFT') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Hanya surat dengan status DRAFT yang dapat dihapus' 
        },
        { status: 400 }
      );
    }

    // Delete surat
    await queryWithTenant(
      tenantName,
      `DELETE FROM outgoing_mails WHERE id = $1`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      message: 'Surat berhasil dihapus'
    });

  } catch (error: any) {
    console.error('Error deleting outgoing mail:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to delete outgoing mail' 
      },
      { status: 500 }
    );
  }
}