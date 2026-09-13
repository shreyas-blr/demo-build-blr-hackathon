import { NextResponse } from 'next/server';
import db from '@/backend/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const stmt = db.prepare('SELECT * FROM employees WHERE id = ?');
    const employee = stmt.get(id) as any;
    
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    
    // Mock AI Analysis
    let analysis = '';
    let recommendation = '';
    let actionType = '';

    if (employee.risk_level === 'High') {
      analysis = `The AI detected a high risk of attrition due to: ${employee.risk_reason || 'low engagement metrics'}. Performance is at ${employee.performance_score}/100.`;
      recommendation = 'Schedule an immediate 1-on-1 to discuss concerns and potential role realignment.';
      actionType = 'Retention';
    } else if (employee.performance_score < 75) {
      analysis = `Performance is below expectations (${employee.performance_score}/100). ${employee.risk_reason ? employee.risk_reason + '.' : ''}`;
      recommendation = 'Enroll in specialized upskilling and set clear 30-day performance goals.';
      actionType = 'Training';
    } else {
      analysis = `Employee is performing well (${employee.performance_score}/100) with good attendance (${employee.attendance}%).`;
      recommendation = 'Consider for upcoming leadership track or special projects to maintain engagement.';
      actionType = 'Promotion';
    }

    return NextResponse.json({
      analysis,
      recommendation,
      actionType
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze employee' }, { status: 500 });
  }
}
