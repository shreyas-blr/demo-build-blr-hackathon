"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI HR Assistant. You can ask me to "show employees with high risk", "what are the pending actions", or "find top performers".', data: null }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg, data: null }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, data: data.data }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the HR database.', data: null }]);
    } finally {
      setLoading(false);
    }
  };

  const renderDataWidget = (data: any) => {
    if (!data || !data.records || data.records.length === 0) return null;

    if (data.type === 'employees') {
      return (
        <div className="mt-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-slate-500 font-medium">Name</th>
                <th className="px-4 py-2 text-slate-500 font-medium">Department</th>
                <th className="px-4 py-2 text-slate-500 font-medium">Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.records.map((r: any, i: number) => (
                <tr key={i}>
                  <td className="px-4 py-2 font-medium text-slate-900">{r.name}</td>
                  <td className="px-4 py-2 text-slate-600">{r.department}</td>
                  <td className="px-4 py-2">
                    {r.risk_level && <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-xs">{r.risk_level} Risk</span>}
                    {r.performance_score && <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">Score: {r.performance_score}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    if (data.type === 'actions') {
      return (
        <div className="mt-4 space-y-2">
          {data.records.map((r: any, i: number) => (
            <div key={i} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm text-sm">
              <span className="font-semibold text-indigo-600 mr-2">{r.type}</span>
              <span className="text-slate-700">{r.description}</span>
            </div>
          ))}
        </div>
      );
    }

    if (data.type === 'candidates') {
      return (
        <div className="mt-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-slate-500 font-medium">Name</th>
                <th className="px-4 py-2 text-slate-500 font-medium">Match</th>
                <th className="px-4 py-2 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.records.map((r: any, i: number) => (
                <tr key={i}>
                  <td className="px-4 py-2 font-medium text-slate-900">{r.name}</td>
                  <td className="px-4 py-2 text-emerald-600 font-semibold">{r.match_score}%</td>
                  <td className="px-4 py-2 text-slate-600">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
        <p className="text-slate-500">Query your HR data using natural language</p>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={clsx("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-indigo-100 text-indigo-600" : "bg-slate-900 text-white"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={clsx("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                <div className={clsx(
                  "px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                  msg.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
                {msg.data && (
                  <div className="w-full min-w-[400px]">
                    {renderDataWidget(msg.data)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-100 text-slate-800 px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                <span className="text-sm text-slate-500">Analyzing HR Data...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about high risk employees, recent candidates..." 
              className="w-full bg-slate-100 border-none rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
