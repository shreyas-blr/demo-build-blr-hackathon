import { NextResponse } from 'next/server';
import db from '@/backend/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const stmtJobs = db.prepare('SELECT * FROM job_postings');
    const jobs = stmtJobs.all();
    
    const stmtCandidates = db.prepare('SELECT * FROM candidates');
    const candidates = stmtCandidates.all();
    
    return NextResponse.json({ jobs, candidates });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recruitment data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const job_posting_id = formData.get('job_posting_id') as string;
    
    // Mock AI Analysis of uploaded resume
    const match_score = Math.floor(Math.random() * (98 - 60 + 1) + 60);
    const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'Figma', 'AWS'].sort(() => 0.5 - Math.random()).slice(0, 3).join(', ');
    const missing_skills = ['GraphQL', 'Docker', 'Kubernetes'].sort(() => 0.5 - Math.random()).slice(0, 1).join(', ');
    const feedback = `Candidate shows strong potential in ${skills.split(', ')[0]} but might need ramp-up on ${missing_skills}.`;
    
    const stmt = db.prepare(`
      INSERT INTO candidates (name, role, match_score, status, skills, missing_skills, feedback, avatar, job_posting_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      name || 'New Candidate',
      role || 'Applicant',
      match_score,
      'Under Review',
      skills,
      missing_skills,
      feedback,
      'https://i.pravatar.cc/150?u=' + Math.random().toString(36).substring(7),
      job_posting_id || 1
    );
    
    const newCandidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(result.lastInsertRowid);
    
    return NextResponse.json(newCandidate);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process recruitment upload' }, { status: 500 });
  }
}
