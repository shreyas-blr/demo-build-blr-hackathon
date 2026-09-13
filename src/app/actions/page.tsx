"use client";

import { useEffect, useState } from "react";
import { CheckSquare, Clock, CheckCircle, ArrowRight } from "lucide-react";
import clsx from "clsx";

export default function ActionCenter() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActions = () => {
    fetch('/api/actions')
      .then(res => res.json())
      .then(data => {
        setActions(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/actions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchActions();
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  const pending = actions.filter(a => a.status === 'Pending');
  const inProgress = actions.filter(a => a.status === 'In Progress');
  const completed = actions.filter(a => a.status === 'Completed');

  const Column = ({ title, items, nextStatus, icon: Icon }: any) => (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Icon className="w-5 h-5 text-slate-500" />
        <h2 className="font-bold text-slate-900">{title} <span className="text-slate-400 font-normal ml-2">({items.length})</span></h2>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 pb-4">
        {items.length === 0 ? (
          <div className="text-center text-slate-400 py-6 text-sm">No tasks</div>
        ) : (
          items.map((item: any) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3 group">
              <div className="flex justify-between items-start">
                <span className={clsx(
                  "px-2.5 py-1 rounded-md text-xs font-medium",
                  item.type === 'Training' ? 'bg-blue-100 text-blue-700' :
                  item.type === 'Retention' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                )}>
                  {item.type}
                </span>
                <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm font-medium text-slate-900 leading-snug">{item.description}</p>
              
              {nextStatus && (
                <div className="mt-2 pt-3 border-t border-slate-100 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => updateStatus(item.id, nextStatus)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Move to {nextStatus} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Action Center</h1>
        <p className="text-slate-500">Track and execute AI-recommended HR actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 pb-6">
        <Column title="Pending" items={pending} nextStatus="In Progress" icon={Clock} />
        <Column title="In Progress" items={inProgress} nextStatus="Completed" icon={CheckSquare} />
        <Column title="Completed" items={completed} nextStatus={null} icon={CheckCircle} />
      </div>
    </div>
  );
}
