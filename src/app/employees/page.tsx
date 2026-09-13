"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Sparkles, X, ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setFilteredEmployees(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = employees;
    if (selectedDept !== 'All') {
      filtered = filtered.filter(e => e.department === selectedDept);
    }
    if (search) {
      filtered = filtered.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredEmployees(filtered);
  }, [search, selectedDept, employees]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/employees/${selectedEmp.id}/analyze`, { method: 'POST' });
      const data = await res.json();
      setAnalysis(data);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTakeAction = async () => {
    if (!analysis) return;
    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: analysis.actionType,
        description: analysis.recommendation,
        target_employee_id: selectedEmp.id
      })
    });
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      setAnalysis(null);
    }, 2000);
  };

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="flex h-full flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
          <p className="text-slate-500">Manage and analyze your workforce</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Employee</th>
              <th className="px-6 py-4 font-medium text-slate-500">Role</th>
              <th className="px-6 py-4 font-medium text-slate-500">Performance</th>
              <th className="px-6 py-4 font-medium text-slate-500">Risk Level</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map(emp => (
              <tr 
                key={emp.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => { setSelectedEmp(emp); setAnalysis(null); }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-slate-900">{emp.name}</p>
                      <p className="text-sm text-slate-500">{emp.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700">{emp.role}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                      <div 
                        className={`h-2 rounded-full ${emp.performance_score > 80 ? 'bg-emerald-500' : emp.performance_score > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        style={{ width: `${emp.performance_score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600">{emp.performance_score}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    emp.risk_level === 'High' ? 'bg-rose-100 text-rose-700' :
                    emp.risk_level === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  )}>
                    {emp.risk_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="w-5 h-5 text-slate-400 inline" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Profile Drawer */}
      <div className={clsx(
        "fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-l border-slate-200 flex flex-col",
        selectedEmp ? "translate-x-0" : "translate-x-full"
      )}>
        {selectedEmp && (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold">Profile</h2>
              <button onClick={() => setSelectedEmp(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex flex-col items-center mb-6">
                <img src={selectedEmp.avatar} alt={selectedEmp.name} className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md" />
                <h3 className="text-2xl font-bold text-slate-900">{selectedEmp.name}</h3>
                <p className="text-slate-500">{selectedEmp.role}</p>
                <span className="mt-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">{selectedEmp.department}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Performance</span>
                  <span className="font-semibold text-slate-900">{selectedEmp.performance_score}/100</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Attendance</span>
                  <span className="font-semibold text-slate-900">{selectedEmp.attendance}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Skills</span>
                  <span className="font-medium text-slate-900 text-right">{selectedEmp.skills}</span>
                </div>
              </div>

              {analysis ? (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-indigo-900">AI Analysis</h4>
                  </div>
                  <p className="text-sm text-indigo-800 mb-3">{analysis.analysis}</p>
                  <p className="text-sm font-medium text-indigo-900 mb-4">Recommendation: {analysis.recommendation}</p>
                  
                  {actionSuccess ? (
                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg text-center text-sm font-medium">
                      Action logged successfully!
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleTakeAction} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                        Take Action
                      </button>
                      <button onClick={() => setAnalysis(null)} className="flex-1 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-medium transition-colors">
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25"
                >
                  <Sparkles className="w-5 h-5" />
                  {analyzing ? 'Analyzing Data...' : 'Analyze with AI'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Overlay */}
      {selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={() => setSelectedEmp(null)} />
      )}
    </div>
  );
}
