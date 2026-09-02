import React from 'react';
import { 
  Building2, Users, CheckCircle2, Trophy, 
  ArrowUpRight, BarChart3, GraduationCap, Download
} from 'lucide-react';

export const InstitutionPortalView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-emerald-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" /> Institution & College SaaS Suite
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Apex Engineering University - Placement Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregate student readiness telemetry, batch placement pipelines, and automated drive assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all">
            <Download className="w-3.5 h-3.5" /> Export Placement Report
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all">
            <GraduationCap className="w-4 h-4" /> Schedule Placement Drive
          </button>
        </div>
      </div>

      {/* High-Level Institutional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Total Enrolled</span>
          <div className="text-2xl font-black text-white mt-1">1,250</div>
          <span className="text-[10px] text-slate-400">2026 Graduating Batch</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Profiles Complete</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">982</div>
          <span className="text-[10px] text-indigo-300 font-medium">78.5% Completion</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Resume Ready</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">814</div>
          <span className="text-[10px] text-cyan-300 font-medium">ATS &gt; 80%</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Interview Ready</span>
          <div className="text-2xl font-black text-amber-400 mt-1">623</div>
          <span className="text-[10px] text-amber-300 font-medium">Cleared 3+ Mocks</span>
        </div>

        <div className="glass-card p-4 rounded-xl border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-400">Placement Cleared</span>
          <div className="text-2xl font-black text-emerald-300 mt-1">481</div>
          <span className="text-[10px] text-emerald-400 font-medium">Offers Generated</span>
        </div>
      </div>

      {/* Cohort Performance Tracks */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Engineering Stream Readiness Tracks
          </h2>
          <span className="text-xs font-bold text-slate-400 font-mono">Avg Cohort Readiness: 79.4%</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-white">AI & Data Engineering Track</h3>
              <p className="text-[11px] text-slate-400">420 Students • Core: Python, RAG, pgvector, FastAPI</p>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Avg ATS Score</span>
                <span className="font-bold text-emerald-400">89.2%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Placement Rate</span>
                <span className="font-bold text-indigo-400">88.0% (370 Placed)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-white">Full Stack / Cloud Development Track</h3>
              <p className="text-[11px] text-slate-400">510 Students • Core: React, TypeScript, Next.js, Docker</p>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Avg ATS Score</span>
                <span className="font-bold text-emerald-400">84.5%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Placement Rate</span>
                <span className="font-bold text-indigo-400">82.0% (418 Placed)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
