import { NextResponse } from 'next/server';
import db from '@/backend/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department');
  
  try {
    let query = 'SELECT * FROM employees';
    let params: any[] = [];
    
    if (department && department !== 'All') {
      query += ' WHERE department = ?';
      params.push(department);
    }
    
    const stmt = db.prepare(query);
    const employees = stmt.all(...params);
    
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}
