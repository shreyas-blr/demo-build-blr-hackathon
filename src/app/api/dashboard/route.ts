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
    const employeesStmt = db.prepare(query);
    const employees = employeesStmt.all(...params) as any[];
    
    const totalEmployees = employees.length;
    const highRisk = employees.filter(e => e.risk_level === 'High').length;
    
    const candidatesStmt = db.prepare("SELECT count(*) as count FROM candidates WHERE status != 'Rejected'");
    const candidatesResult = candidatesStmt.get() as any;
    
    const jobsQuery = department && department !== 'All' 
      ? 'SELECT sum(openings) as count FROM job_postings WHERE department = ?'
      : 'SELECT sum(openings) as count FROM job_postings';
    const jobsStmt = db.prepare(jobsQuery);
    const jobsResult = department && department !== 'All' ? jobsStmt.get(department) as any : jobsStmt.get() as any;

    const avgPerformance = employees.reduce((acc, curr) => acc + curr.performance_score, 0) / totalEmployees || 0;

    // Chart Data (Mock trends)
    const attritionTrend = [
      { name: 'Jan', rate: 2 },
      { name: 'Feb', rate: 3 },
      { name: 'Mar', rate: 2 },
      { name: 'Apr', rate: 4 },
      { name: 'May', rate: 3 },
      { name: 'Jun', rate: 5 },
      { name: 'Jul', rate: 3 },
      { name: 'Aug', rate: 2 },
      { name: 'Sep', rate: Math.round((highRisk/totalEmployees)*100) || 5 },
    ];
    
    const departmentDistribution = [
      { name: 'Engineering', count: employees.filter(e => e.department === 'Engineering').length },
      { name: 'Product', count: employees.filter(e => e.department === 'Product').length },
      { name: 'Design', count: employees.filter(e => e.department === 'Design').length },
      { name: 'Data', count: employees.filter(e => e.department === 'Data').length },
      { name: 'Marketing', count: employees.filter(e => e.department === 'Marketing').length },
      { name: 'Sales', count: employees.filter(e => e.department === 'Sales').length },
    ].filter(d => d.count > 0);

    return NextResponse.json({
      totalEmployees,
      highRisk,
      openPositions: jobsResult.count || 0,
      activeCandidates: candidatesResult.count || 0,
      avgPerformance: Math.round(avgPerformance),
      attritionTrend,
      departmentDistribution
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
