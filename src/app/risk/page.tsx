"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Activity, PhoneCall } from "lucide-react";
import clsx from "clsx";

export default function WorkforceRisk() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data.filter((e: any) => e.risk_level === 'High' || e.risk_level === 'Medium'));
        setLoading(false);
      });
  }, []);

  const handleAction = async (empId: number, type: string) => {
    await fetch('/api/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: type,
        description: 'Auto-generated risk mitigation action.',
        target_employee_id: empId
      })
    });
    alert("Action triggered successfully!");
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Workforce Risk</h1>
        <p className="text-slate-500">Monitor and mitigate employee attrition and burnout risks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">No at-risk employees found.</div>
        ) : (
          employees.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col relative overflow-hidden">
              <div className={clsx(
                "absolute top-0 left-0 w-full h-1",
                emp.risk_level === 'High' ? "bg-rose-500" : "bg-amber-500"
              )}></div>
              
              <div className="flex items-center gap-4 mb-5">
                <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-full" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{emp.name}</h3>
                  <p className="text-sm text-slate-500">{emp.role}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-5 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={clsx("w-4 h-4", emp.risk_level === 'High' ? "text-rose-500" : "text-amber-500")} />
                  <span className={clsx("font-semibold", emp.risk_level === 'High' ? "text-rose-700" : "text-amber-700")}>
                    {emp.risk_level} Risk
                  </span>
                </div>
                <p className="text-sm text-slate-700">{emp.risk_reason || 'Underperforming in recent evaluations.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5 text-center">
                <div className="border border-slate-100 rounded-lg p-2">
                  <p className="text-xs text-slate-500">Performance</p>
                  <p className="font-semibold text-slate-900">{emp.performance_score}/100</p>
                </div>
                <div className="border border-slate-100 rounded-lg p-2">
                  <p className="text-xs text-slate-500">Attendance</p>
                  <p className="font-semibold text-slate-900">{emp.attendance}%</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(emp.id, 'Retention')}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <PhoneCall className="w-4 h-4" /> 1-on-1
                </button>
                <button 
                  onClick={() => handleAction(emp.id, 'Training')}
                  className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Activity className="w-4 h-4" /> PIP Plan
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
