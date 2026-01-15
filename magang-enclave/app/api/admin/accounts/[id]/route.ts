import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const urlPath = request.nextUrl.pathname;
    const pathSegments = urlPath.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: 'Invalid account ID format' },
        { status: 400 }
      );
    }

    const { name, email, password, company_name } = await request.json();

    if (!name || !email || !company_name) {
      return NextResponse.json(
        { message: 'Name, email, and company name are required' },
        { status: 400 }
      );
    }

    let query = `
      UPDATE superadmin.admins 
      SET name = $1, email = $2, company_name = $3
    `;
    const queryParams = [name, email, company_name];

    if (password) {
      query += `, password = $4 WHERE id = $5 RETURNING id, name, email, company_name, is_active, created_at`;
      queryParams.push(password, id);
    } else {
      query += ` WHERE id = $4 RETURNING id, name, email, company_name, is_active, created_at`;
      queryParams.push(id);
    }

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      );
    }

    const updatedAccount = result.rows[0];

    return NextResponse.json({
      message: 'Account updated successfully',
      account: {
        id: updatedAccount.id,
        name: updatedAccount.name,
        email: updatedAccount.email,
        company_name: updatedAccount.company_name,
        status: updatedAccount.is_active,
        tanggalDibuat: new Date(updatedAccount.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      }
    });
  } catch (error) {
    console.error('Account update error:', error);
    return NextResponse.json(
      { message: 'Failed to update account' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const urlPath = request.nextUrl.pathname;
    const pathSegments = urlPath.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: 'Invalid account ID format' },
        { status: 400 }
      );
    }

    const accountResult = await pool.query(
      'SELECT tenant_name FROM superadmin.admins WHERE id = $1',
      [id]
    );

    if (accountResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      );
    }

    const tenantName = accountResult.rows[0].tenant_name;
    await pool.query('DELETE FROM superadmin.admins WHERE id = $1', [id]);

    return NextResponse.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { message: 'Failed to delete account' },
      { status: 500 }
    );
  }
}