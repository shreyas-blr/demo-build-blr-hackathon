"use client";

import { useEffect, useState } from "react";
import { Upload, Briefcase, FileText, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

export default function Recruitment() {
  const [data, setData] = useState({ jobs: [], candidates: [] });
  const [loading, setLoading] = useState(true);
  
  const [uploading, setUploading] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");

  const fetchData = () => {
    fetch('/api/recruitment')
      .then(res => res.json())
      .then(d => {
        setData(d);
        if (d.jobs.length > 0 && !selectedJob) setSelectedJob(d.jobs[0].id.toString());
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate delay for AI reading resume
    setTimeout(async () => {
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('role', 'Applicant');
      formData.append('job_posting_id', selectedJob);
      
      await fetch('/api/recruitment', {
        method: 'POST',
        body: formData
      });
      
      fetchData();
      setUploading(false);
    }, 2000);
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Recruitment</h1>
        <p className="text-slate-500">Intelligent candidate matching and analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column: Jobs & Upload */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" /> Active Job Postings
            </h2>
            <div className="space-y-3">
              {data.jobs.map((job: any) => (
                <div 
                  key={job.id} 
                  onClick={() => setSelectedJob(job.id.toString())}
                  className={clsx(
                    "p-4 rounded-xl border cursor-pointer transition-colors",
                    selectedJob === job.id.toString() ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.department} • {job.openings} Openings</p>
                  <p className="text-xs text-slate-400 mt-2 truncate">Required: {job.required_skills}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" /> Upload Resume
            </h2>
            <div className="flex-1 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 flex flex-col items-center justify-center p-6 text-center">
              <FileText className="w-12 h-12 text-indigo-300 mb-4" />
              <p className="text-sm font-medium text-slate-700 mb-1">Drag and drop resume here</p>
              <p className="text-xs text-slate-500 mb-4">PDF, DOCX up to 10MB</p>
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {uploading ? 'AI is analyzing...' : 'Simulate Upload & Analyze'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
          <h2 className="text-lg font-bold mb-6">Candidate Pipeline</h2>
          
          <div className="space-y-4">
            {data.candidates.filter((c:any) => c.job_posting_id.toString() === selectedJob).length === 0 ? (
              <div className="text-center text-slate-500 py-10">No candidates for this position yet.</div>
            ) : (
              data.candidates
                .filter((c:any) => c.job_posting_id.toString() === selectedJob)
                .map((cand: any) => (
                <div key={cand.id} className="border border-slate-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img src={cand.avatar} alt={cand.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{cand.name}</h3>
                        <p className="text-slate-500 text-sm">Status: <span className="font-medium text-slate-700">{cand.status}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-emerald-500 bg-emerald-50">
                        <span className="font-bold text-emerald-700">{cand.match_score}</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium mt-1">Match Score</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong>AI Feedback:</strong> {cand.feedback}
                    </p>
                    <div className="mt-3 text-sm">
                      <p><span className="text-emerald-600 font-medium">Found:</span> {cand.skills}</p>
                      {cand.missing_skills && (
                        <p className="mt-1"><span className="text-rose-600 font-medium">Missing:</span> {cand.missing_skills}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium transition-colors">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors">
                      <CheckCircle className="w-4 h-4" /> Shortlist
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
