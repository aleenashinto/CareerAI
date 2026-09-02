import React from 'react';
import { 
  Briefcase, Users, CheckCircle2, Search, 
  Filter, Plus, Clock, ArrowUpRight, Sparkles
} from 'lucide-react';

export const RecruiterPortalView: React.FC = () => {
  const jobs = [
    { id: 1, title: "Senior AI / Backend Engineer", applicants: 38, shortlisted: 14, salary: "₹18L - ₹28L", status: "Active" },
    { id: 2, title: "Full Stack Next.js Architect", applicants: 45, shortlisted: 18, salary: "₹16L - ₹24L", status: "Active" },
    { id: 3, title: "Applied ML Systems Developer", applicants: 21, shortlisted: 8, salary: "₹22L - ₹32L", status: "Active" }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-cyan-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" /> B2B Recruiter & Hiring Suite
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">TechScale Global - Recruiter Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            AI candidate matching, verified telemetry screening, and 1-click technical interview scheduling.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all">
          <Plus className="w-4 h-4" /> Post New Job Opening
        </button>
      </div>

      {/* Recruiter Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Open Job Postings</span>
          <div className="text-2xl font-black text-white mt-1">12</div>
          <span className="text-[10px] text-slate-400">Active listings</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Total Applicants</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">842</div>
          <span className="text-[10px] text-cyan-300 font-medium">100% pre-screened</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">AI Shortlisted</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">124</div>
          <span className="text-[10px] text-indigo-300 font-medium">&gt;85% Match Score</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Avg Screening Time</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">1.2 hrs</div>
          <span className="text-[10px] text-emerald-400 font-medium">vs 14 days traditional</span>
        </div>
      </div>

      {/* Active Job Postings */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Active Job Pipelines
          </h2>
          <span className="text-xs font-bold text-slate-400">3 Priority Openings</span>
        </div>

        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">{job.title}</h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    {job.status}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-mono font-semibold mt-0.5">{job.salary}</p>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Applicants</span>
                  <span className="font-bold text-white">{job.applicants}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">AI Matched</span>
                  <span className="font-bold text-cyan-400">{job.shortlisted} Candidates</span>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
                  Review Matches
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
