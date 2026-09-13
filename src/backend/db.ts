import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'hr_demo.db');

// Ensure database file exists or is created
let db: Database.Database;

try {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
} catch (err) {
  console.error("Failed to connect to database:", err);
  throw err;
}

export function initDb() {
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
      avatar TEXT
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

export default db;
