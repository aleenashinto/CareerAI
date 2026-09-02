import React from 'react';
import { 
  Sparkles, ArrowUpRight, CheckCircle2, Target, 
  Flame, Briefcase, Mic, FileText, ChevronRight, TrendingUp
} from 'lucide-react';
import { CandidateProfile, JobApplicationItem } from '../api';

interface DashboardViewProps {
  profile: CandidateProfile | null;
  applications: JobApplicationItem[];
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ profile, applications, onNavigate }) => {
  const readiness = profile?.readiness_score || 84.5;
  const activeApps = applications.length || 4;
  const interviewsScheduled = applications.filter(a => a.status.includes('Interview')).length || 2;
  const offers = applications.filter(a => a.status === 'Offer').length || 1;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-[#0b0f17] border border-indigo-500/20 p-8 shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI Career Intelligence Loop Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Targeting: <span className="gradient-text">{profile?.title || 'AI Engineer'}</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Your profile is optimized for senior technical roles. Your strongest competence is <strong className="text-white">Python & FastAPI Architecture</strong>, and closing the gap in <strong className="text-indigo-300">pgvector Hybrid Search</strong> will elevate your ATS score to 95%+.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('interview_arena')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
            >
              <Mic className="w-4 h-4" /> Start Adaptive Mock Interview
            </button>
            <button
              onClick={() => onNavigate('job_matcher')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Briefcase className="w-4 h-4" /> Evaluate New Job ("Should I Apply?")
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Target className="w-4 h-4" /> 12-Week Roadmap & Skill Gaps
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Career Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{readiness}%</span>
            <span className="text-[11px] text-emerald-400 font-medium">+4.2% this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on 12 interview simulations</p>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Applications</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{activeApps}</span>
            <span className="text-[11px] text-indigo-300 font-medium">Kanban CRM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">3 tailored resume versions active</p>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Interviews Scheduled</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xs">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{interviewsScheduled}</span>
            <span className="text-[11px] text-cyan-400 font-medium">25% response rate</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Technical & HR rounds upcoming</p>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Offers & Wins</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xs">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{offers}</span>
            <span className="text-[11px] text-amber-400 font-medium">₹28 LPA</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Autonomous AI Co. (Reviewing)</p>
        </div>
      </div>

      {/* Main Two-Column Workflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: The Intelligence Loop Pipeline */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Complete Career Intelligence Loop
              </h2>
              <p className="text-xs text-slate-400">End-to-end telemetry from discovery to offer</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30">
              Pipeline Healthy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigate('digital_twin')} 
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">1. Digital Twin & Profile</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-200 font-semibold mt-2">12 Verified Competencies</p>
              <p className="text-[11px] text-slate-400 mt-1">Python (90%), FastAPI (85%), SQL (84%), RAG (78%)</p>
            </div>

            <div 
              onClick={() => onNavigate('roadmap')} 
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">2. Skill Gap Roadmap</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-200 font-semibold mt-2">12-Week AI Engineer Track</p>
              <p className="text-[11px] text-slate-400 mt-1">Focus: pgvector hybrid search & AsyncIO</p>
            </div>

            <div 
              onClick={() => onNavigate('resume_studio')} 
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">3. ATS Resume Intelligence</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-200 font-semibold mt-2">3 Multi-Role Versions</p>
              <p className="text-[11px] text-slate-400 mt-1">AI Eng (92% ATS), Python Dev (88.5%), Fullstack (84%)</p>
            </div>

            <div 
              onClick={() => onNavigate('interview_arena')} 
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">4. Adaptive Interview Engine</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-200 font-semibold mt-2">Voice, Coding & STAR Rubric</p>
              <p className="text-[11px] text-slate-400 mt-1">Adaptive difficulty scaling with live 7-Day Sprint</p>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Hub & Active Applications */}
        <div className="glass-panel p-6 rounded-2xl space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" /> Pipeline Snapshot
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Top in-flight opportunities</p>

            <div className="space-y-3 mt-4">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-200 truncate">{app.job_title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{app.company} • {app.salary}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('crm_tracker')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            Open Full Application CRM <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
