import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

function generateTenantName(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_') 
    .replace(/_+/g, '_')
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, company_name, is_active, created_at FROM superadmin.admins ORDER BY created_at DESC'
    );

    const accounts = result.rows.map(account => ({
      id: account.id,
      name: account.name,
      email: account.email,
      company_name: account.company_name,
      status: account.is_active,
      tanggalDibuat: new Date(account.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { message: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company_name } = await request.json();

    if (!name || !email || !password || !company_name) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const tenantName = generateTenantName(company_name);
    
    const existingTenant = await pool.query(
      'SELECT tenant_name FROM superadmin.admins WHERE tenant_name = $1',
      [tenantName]
    );

    if (existingTenant.rows.length > 0) {
      return NextResponse.json(
        { message: `Tenant with name "${tenantName}" already exists. Please use a different company name.` },
        { status: 409 }
      );
    }

    const { createTenantSchema } = await import('@/lib/db');
    const sanitizedTenant = await createTenantSchema(tenantName);

    const result = await pool.query(
      `INSERT INTO superadmin.admins (name, email, password, company_name, tenant_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, 'admin', true) RETURNING id, name, email, company_name, is_active, created_at`,
      [name, email, password, company_name, sanitizedTenant]
    );

    const newAccount = result.rows[0];

    return NextResponse.json({
      message: 'Account created successfully',
      account: {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        company_name: newAccount.company_name,
        status: newAccount.is_active,
        tanggalDibuat: new Date(newAccount.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      }
    });
  } catch (error) {
    console.error('Account creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create account' },
      { status: 500 }
    );
  }
}