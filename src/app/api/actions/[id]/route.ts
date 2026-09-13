import { NextResponse } from 'next/server';
import db from '@/backend/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    
    const stmt = db.prepare('UPDATE actions SET status = ? WHERE id = ?');
    stmt.run(status, id);
    
    const updatedAction = db.prepare('SELECT * FROM actions WHERE id = ?').get(id);
    
    return NextResponse.json(updatedAction);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
  }
}
