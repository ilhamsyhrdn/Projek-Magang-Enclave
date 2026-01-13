// app/api/auth/register-tenant/route.ts (untuk superadmin)
import { NextRequest, NextResponse } from 'next/server';
import { createTenantSchema } from '@/lib/db';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { tenantName, adminName, adminEmail, adminPassword } = await request.json();

    // Validasi input
    if (!tenantName || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Buat schema tenant baru
    const sanitizedTenant = await createTenantSchema(tenantName);

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Insert admin ke superadmin.admins
    await pool.query(
      `INSERT INTO superadmin.admins (name, email, password, tenant_name, role, is_active)
       VALUES ($1, $2, $3, $4, 'admin', true)`,
      [adminName, adminEmail, hashedPassword, sanitizedTenant]
    );

    return NextResponse.json({
      message: 'Tenant created successfully',
      tenantName: sanitizedTenant,
    });
  } catch (error) {
    console.error('Tenant creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}