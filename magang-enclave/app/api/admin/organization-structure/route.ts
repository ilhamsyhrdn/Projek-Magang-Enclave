import { NextRequest, NextResponse } from "next/server";
import { queryWithTenant } from "@/lib/db";
import { getTenantFromRequest } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);

    if (!tenantName) {
      return NextResponse.json(
        { message: 'Unauthorized: Tenant not found' },
        { status: 401 }
      );
    }

    const query = `
      SELECT
        os.id,
        u.full_name as name,
        p.name as position_name,
        d.name as division_name,
        dept.name as department_name,
        os.parent_id,
        os.user_id,
        os.position_id,
        os.division_id,
        os.department_id
      FROM organization_structure os
      LEFT JOIN users u ON os.user_id = u.id
      LEFT JOIN positions p ON os.position_id = p.id
      LEFT JOIN divisions d ON os.division_id = d.id
      LEFT JOIN departments dept ON os.department_id = dept.id
      WHERE os.is_active = true
      ORDER BY os.id
    `;

    const result = await queryWithTenant(tenantName, query);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Error fetching organization structure:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch organization structure"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantName = await getTenantFromRequest(request);

    if (!tenantName) {
      return NextResponse.json(
        { message: "Unauthorized: Tenant not found" },
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

    if (!user_id || !position_id) {
      return NextResponse.json(
        {
          success: false,
          message: "user_id and position_id are required"
        },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO organization_structure
      (
        user_id,
        position_id,
        division_id,
        department_id,
        parent_id,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING *
    `;

    const result = await queryWithTenant(
      tenantName,
      query,
      [
        user_id,
        position_id,
        division_id,
        department_id,
        parent_id
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Organization structure created",
        data: result[0]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating organization structure:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create organization structure"
      },
      { status: 500 }
    );
  }
}