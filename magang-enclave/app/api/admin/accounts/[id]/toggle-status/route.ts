import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const urlPath = request.nextUrl.pathname;
    const pathSegments = urlPath.split('/');
    const id = pathSegments[pathSegments.length - 2];
    
    console.log('Extracted ID for toggle:', id);

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: 'Invalid account ID format' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT is_active FROM superadmin.admins WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      );
    }

    const currentStatus = result.rows[0].is_active;
    const newStatus = !currentStatus;

    await pool.query(
      'UPDATE superadmin.admins SET is_active = $1 WHERE id = $2',
      [newStatus, id]
    );

    return NextResponse.json({
      message: `Account ${newStatus ? 'activated' : 'deactivated'} successfully`,
      status: newStatus
    });
  } catch (error) {
    console.error('Status toggle error:', error);
    return NextResponse.json(
      { message: 'Failed to toggle account status' },
      { status: 500 }
    );
  }
}