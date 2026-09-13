"use client";

import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Target, Zap } from "lucide-react";

const data = [
  { subject: 'React/Frontend', current: 85, required: 95, fullMark: 100 },
  { subject: 'Node/Backend', current: 70, required: 90, fullMark: 100 },
  { subject: 'Cloud/DevOps', current: 65, required: 85, fullMark: 100 },
  { subject: 'Data/ML', current: 40, required: 70, fullMark: 100 },
  { subject: 'Leadership', current: 60, required: 80, fullMark: 100 },
  { subject: 'Design/UX', current: 75, required: 75, fullMark: 100 },
];

export default function SkillGap() {
  const [selectedDept, setSelectedDept] = useState("Engineering");

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Skill Gap Analysis</h1>
          <p className="text-slate-500">Visualize current workforce skills vs required organizational skills</p>
        </div>
        <select 
          className="border border-slate-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="Design">Design</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" /> Organizational Capability
          </h2>
          <div className="flex-1 w-full relative min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Current Skills" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Required Skills" dataKey="required" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeDasharray="3 3" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div><span className="text-sm text-slate-600">Current Workforce</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-400 rounded-full"></div><span className="text-sm text-slate-600">Target Requirements</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> AI Recommendations
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <h3 className="font-semibold text-indigo-900 mb-2">Priority: Data/ML Upskilling</h3>
              <p className="text-sm text-indigo-800 leading-relaxed">
                The largest gap is in Data/ML capabilities (40/70). AI suggests allocating training budget for Coursera/Udemy enterprise plans and creating an internal mentorship track.
              </p>
              <button className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                Generate Training Plan Action
              </button>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-2">Hiring Alert: Backend Engineers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Node/Backend skills are currently below the required threshold. Consider opening a new req or reassigning existing frontend engineers with full-stack potential.
              </p>
              <button className="mt-3 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition">
                Create Job Posting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
