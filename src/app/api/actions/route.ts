import { NextResponse } from 'next/server';
import db from '@/backend/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const stmt = db.prepare('SELECT * FROM actions ORDER BY created_at DESC');
    const actions = stmt.all();
    
    return NextResponse.json(actions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, description, target_employee_id } = body;
    
    const stmt = db.prepare(`
      INSERT INTO actions (type, description, target_employee_id, status)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(type, description, target_employee_id, 'Pending');
    
    const newAction = db.prepare('SELECT * FROM actions WHERE id = ?').get(result.lastInsertRowid);
    
    return NextResponse.json(newAction);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
  }
}
