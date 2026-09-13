import { NextResponse } from 'next/server';
import db from '@/backend/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;
    const lowerMessage = message.toLowerCase();

    let reply = "I'm your HR Assistant. I can help you find high-risk employees, review recent candidates, or suggest actions.";
    let data = null;

    if (lowerMessage.includes('risk') || lowerMessage.includes('attrition')) {
      const stmt = db.prepare("SELECT name, department, risk_level, risk_reason FROM employees WHERE risk_level = 'High'");
      const riskEmployees = stmt.all();
      reply = `I found ${riskEmployees.length} employees with high risk of attrition.`;
      data = { type: 'employees', records: riskEmployees };
    } 
    else if (lowerMessage.includes('action') || lowerMessage.includes('pending')) {
      const stmt = db.prepare("SELECT * FROM actions WHERE status = 'Pending'");
      const pendingActions = stmt.all();
      reply = `There are ${pendingActions.length} pending actions that require your attention.`;
      data = { type: 'actions', records: pendingActions };
    }
    else if (lowerMessage.includes('candidate') || lowerMessage.includes('hiring') || lowerMessage.includes('recruitment')) {
      const stmt = db.prepare("SELECT name, role, match_score, status FROM candidates WHERE status != 'Rejected'");
      const candidates = stmt.all();
      reply = `We currently have ${candidates.length} active candidates in the pipeline.`;
      data = { type: 'candidates', records: candidates };
    }
    else if (lowerMessage.includes('performance') || lowerMessage.includes('top')) {
      const stmt = db.prepare("SELECT name, role, department, performance_score FROM employees ORDER BY performance_score DESC LIMIT 3");
      const topPerformers = stmt.all();
      reply = "Here are our top 3 performers based on recent scores.";
      data = { type: 'employees', records: topPerformers };
    }

    return NextResponse.json({ reply, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
