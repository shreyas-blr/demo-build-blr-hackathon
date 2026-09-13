"use client";

import { useEffect, useState } from "react";
import { 
  Users, UserX, TrendingUp, Briefcase, Target, Filter, ChevronDown
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('All');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard?department=${department}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [department]);

  if (!data && loading) {
    return <div className="flex h-full items-center justify-center text-slate-500">Loading interactive dashboard...</div>;
  }

  const departments = ['All', 'Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Sales'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR Dashboard</h1>
          <p className="text-slate-500">Overview of your workforce metrics</p>
        </div>
        
        <div className="relative inline-flex items-center">
          <Filter className="absolute left-3 w-4 h-4 text-slate-400" />
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={department}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <MetricCard title="Total Employees" value={data?.totalEmployees || 0} icon={Users} color="text-blue-500" bg="bg-blue-100" />
          <MetricCard title="High Risk Employees" value={data?.highRisk || 0} icon={UserX} color="text-rose-500" bg="bg-rose-100" />
          <MetricCard title="Open Positions" value={data?.openPositions || 0} icon={Briefcase} color="text-amber-500" bg="bg-amber-100" />
          <MetricCard title="Avg Performance" value={`${data?.avgPerformance || 0}/100`} icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-100" />
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Attrition Trend (%)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.attritionTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1' }} 
                  activeDot={{ r: 6, fill: '#4f46e5', stroke: 'white', strokeWidth: 2 }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Department Distribution</h2>
            <span className="text-xs text-slate-400">Click a bar to filter</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.departmentDistribution || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1500}
                  onClick={(data: any) => setDepartment(data?.name || 'All')}
                  className="cursor-pointer"
                >
                  {
                    (data?.departmentDistribution || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.name === department ? '#4f46e5' : '#818cf8'} className="hover:opacity-80 transition-opacity" />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
        <h2 className="text-lg font-bold text-indigo-900 mb-4 relative z-10">AI Insights for {department === 'All' ? 'All Departments' : department}</h2>
        <ul className="space-y-4 relative z-10">
          {(data?.highRisk || 0) > 0 ? (
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-indigo-50">
              <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg mt-0.5"><Target className="w-4 h-4" /></div>
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Attrition Risk:</strong> There are <span className="font-bold text-rose-600">{data.highRisk}</span> employees marked as high risk. 
                Recommended action: Schedule 1-on-1s immediately to discuss workload and engagement.
              </p>
            </motion.li>
          ) : (
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-indigo-50">
              <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg mt-0.5"><Target className="w-4 h-4" /></div>
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Attrition Risk:</strong> No high-risk employees detected in this segment. Retention is looking stable.
              </p>
            </motion.li>
          )}
          <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-indigo-50">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg mt-0.5"><TrendingUp className="w-4 h-4" /></div>
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Performance:</strong> Average performance is <span className="font-bold text-indigo-600">{data?.avgPerformance}/100</span>. 
              {data?.avgPerformance > 80 ? ' This is excellent and above the industry benchmark.' : ' This indicates room for targeted upskilling.'}
            </p>
          </motion.li>
        </ul>
      </motion.div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className={`absolute right-0 top-0 w-24 h-24 ${bg} rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-40`}></div>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${bg} transition-transform group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <motion.p 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold text-slate-900"
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}
