const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(process.cwd(), 'hr_demo.db');

// Ensure database file exists or is created
let db;
try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
} catch (err) {
  console.error("Failed to connect to database:", err);
  process.exit(1);
}

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      performance_score INTEGER NOT NULL,
      attendance REAL NOT NULL,
      risk_level TEXT NOT NULL,
      risk_reason TEXT,
      skills TEXT NOT NULL,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      match_score INTEGER NOT NULL,
      status TEXT NOT NULL,
      skills TEXT NOT NULL,
      missing_skills TEXT,
      feedback TEXT,
      avatar TEXT,
      job_posting_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      target_employee_id INTEGER,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS job_postings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      description TEXT NOT NULL,
      required_skills TEXT NOT NULL,
      openings INTEGER NOT NULL
    );
  `);
}

function seedDb() {
  const insertEmployee = db.prepare(`
    INSERT INTO employees (name, role, department, performance_score, attendance, risk_level, risk_reason, skills, avatar)
    VALUES (@name, @role, @department, @performance_score, @attendance, @risk_level, @risk_reason, @skills, @avatar)
  `);
  
  const employees = [
    { name: 'Alice Smith', role: 'Frontend Developer', department: 'Engineering', performance_score: 95, attendance: 98, risk_level: 'Low', risk_reason: '', skills: 'React, TypeScript, CSS', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { name: 'Bob Jones', role: 'Data Scientist', department: 'Data', performance_score: 92, attendance: 95, risk_level: 'Low', risk_reason: '', skills: 'Python, SQL', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { name: 'Charlie Davis', role: 'Product Manager', department: 'Product', performance_score: 85, attendance: 92, risk_level: 'High', risk_reason: 'Burnout risk, low engagement', skills: 'Agile, Jira, Strategy', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    { name: 'Diana Evans', role: 'UX Designer', department: 'Design', performance_score: 95, attendance: 95, risk_level: 'Low', risk_reason: '', skills: 'Figma, User Research, Prototyping', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
    { name: 'Evan Frank', role: 'Marketing Lead', department: 'Marketing', performance_score: 93, attendance: 90, risk_level: 'Medium', risk_reason: 'Pending role transition', skills: 'SEO, Content, Campaigns', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
  ];

  const insertJob = db.prepare(`
    INSERT INTO job_postings (title, department, description, required_skills, openings)
    VALUES (@title, @department, @description, @required_skills, @openings)
  `);

  const jobs = [
    { title: 'Senior React Developer', department: 'Engineering', description: 'Looking for a senior developer to lead our frontend team.', required_skills: 'React, TypeScript, Next.js, GraphQL', openings: 1 },
    { title: 'Data Scientist', department: 'Data', description: 'Seeking a data scientist for predictive modeling.', required_skills: 'Python, SQL, Machine Learning, TensorFlow', openings: 1 }
  ];

  const insertCandidate = db.prepare(`
    INSERT INTO candidates (name, role, match_score, status, skills, missing_skills, feedback, avatar, job_posting_id)
    VALUES (@name, @role, @match_score, @status, @skills, @missing_skills, @feedback, @avatar, @job_posting_id)
  `);

  const candidates = [
    { name: 'Fiona Grace', role: 'Senior React Developer', match_score: 85, status: 'Under Review', skills: 'React, TypeScript', missing_skills: 'GraphQL', feedback: 'Strong React skills, needs training on GraphQL.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d', job_posting_id: 1 },
    { name: 'George Harris', role: 'Data Scientist', match_score: 92, status: 'Shortlisted', skills: 'Python, SQL, Machine Learning', missing_skills: 'TensorFlow', feedback: 'Excellent analytical background.', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', job_posting_id: 2 }
  ];

  const insertAction = db.prepare(`
    INSERT INTO actions (type, description, target_employee_id, status)
    VALUES (@type, @description, @target_employee_id, @status)
  `);

  const actions = [
    { type: 'Training', description: 'Schedule React training for backend team.', target_employee_id: 2, status: 'Pending' },
    { type: 'Retention', description: '1-on-1 with Charlie regarding performance.', target_employee_id: 3, status: 'Pending' }
  ];

  // Clear existing
  db.exec("DELETE FROM employees; DELETE FROM job_postings; DELETE FROM candidates; DELETE FROM actions;");
  
  db.transaction(() => {
    for (const emp of employees) insertEmployee.run(emp);
    for (const job of jobs) insertJob.run(job);
    for (const cand of candidates) insertCandidate.run(cand);
    for (const act of actions) insertAction.run(act);
  })();

  console.log("Database seeded successfully!");
}

initDb();
seedDb();
