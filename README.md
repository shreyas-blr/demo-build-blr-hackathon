# WorkForce AI - Intelligent HR Platform

**Build Bengaluru Hackathon - Track 1: Human Resources**

WorkForce AI is a next-generation, AI-driven workforce management platform designed to help HR leaders move beyond static spreadsheets. It provides dynamic, interactive insights into employee performance, retention risks, skill gaps, and AI-assisted recruitment.

---

## 🌟 Key Features

### 1. Interactive HR Dashboard
A centralized hub for HR Directors to monitor organizational health. 
- **Dynamic KPIs**: Track total employees, open positions, active candidates, and average performance.
- **Attrition Trends**: Visual charts (built with Recharts) mapping out attrition over time.
- **Department Filters**: Instantly recalculates all metrics and charts based on the selected department.

### 2. AI-Assisted Recruitment Pipeline
Streamline the hiring process with simulated AI resume parsing.
- Upload candidate resumes (simulated).
- The AI automatically extracts skills, identifies missing requirements, and generates a match score against open job postings.
- Candidates are placed in a visual pipeline based on their match score.

### 3. Workforce Risk & Retention Management
Proactively identify employees at risk of leaving or burning out.
- High-risk employees are flagged automatically based on performance drops and attendance.
- Provides actionable "AI Insights" (e.g., schedule 1-on-1s, offer training).

### 4. Skill Gap Analysis
Identify organizational vulnerabilities before they become problems.
- Visual mapping of required skills vs. actual workforce capabilities.
- Automatically suggests training programs for employees who need upskilling.

---

## 🛠️ Technology Stack

This project was built using modern web development practices with a focus on a premium, interactive user experience:

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **UI Libraries**: Framer Motion (animations), Recharts (data visualization), Lucide React (icons)
- **Backend API**: Next.js Route Handlers
- **Database**: SQLite (via `better-sqlite3`)
- **Architecture**: Segregated Logical Monolith (code split cleanly into `src/frontend` and `src/backend`)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize the Database
The project uses a local SQLite database (`hr_demo.db`). We have provided a seed script to generate realistic mock data.
```bash
node scripts/seed.js
```
*This will create the database file and populate it with employees, job postings, and candidates.*

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open the Application
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

We have logically separated the frontend and backend to keep the codebase clean and maintainable:

```text
├── public/                 # Static assets (logos, etc.)
├── scripts/
│   └── seed.js             # Database initialization script
├── src/
│   ├── app/                # Next.js Routing Layer (Pages & API routes)
│   ├── backend/            # Backend Services & Database Connection (db.ts)
│   └── frontend/           # React Components, UI, and Hooks
└── hr_demo.db              # SQLite Database (generated)
```

---

## 💡 Using the Application

1. **Dashboard Filtering**: On the home page, use the dropdown in the top right to filter metrics by department. Watch the charts and numbers animate!
2. **AI Recruitment**: Navigate to the "Recruitment" tab. Select an open position and click "Simulate Upload & Analyze". The system will mimic an AI parsing a resume and add a new candidate to the pipeline in real-time.
3. **Employees List**: Navigate to the "Employees" tab to see a complete directory, including risk indicators and skill sets.
