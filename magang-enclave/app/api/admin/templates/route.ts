import { NextRequest, NextResponse } from 'next/server';
import { queryWithTenant } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const query = `
      SELECT
        t.id,
        t.name,
        t.description,
        t.category_id,
        t.division_id,
        d.name as division_name
      FROM outgoing_templates t
      LEFT JOIN divisions d ON t.division_id = d.id
      ORDER BY t.name ASC
    `;

    const result = await queryWithTenant('himatif', query);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category_id, division_id, content } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    const result = await queryWithTenant('himatif', `
      INSERT INTO outgoing_templates (name, description, category_id, division_id, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *
    `, [name, description, category_id, division_id, content]);

    return NextResponse.json({
      success: true,
      data: result[0]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create template' },
      { status: 500 }
    );
  }
}
