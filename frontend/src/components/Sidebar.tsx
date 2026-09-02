import React, { useState } from 'react';
import { 
  Briefcase, Compass, FileText, Mic, Code2, 
  BarChart3, Sparkles, Layers, ShieldCheck,
  Bot, Building2, UserCheck, ShieldAlert,
  Brain, Flame, AlertOctagon
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  readinessScore?: number;
  currentRole: 'candidate' | 'institution' | 'recruiter' | 'admin';
  setCurrentRole: (role: 'candidate' | 'institution' | 'recruiter' | 'admin') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  readinessScore = 84.5,
  currentRole,
  setCurrentRole
}) => {
  const candidateItems = [
    { id: 'dashboard', label: 'Career Hub', icon: Compass },
    { id: 'career_brain', label: 'AI Career Brain', icon: Brain, badge: 'Score/Sim' },
    { id: 'ai_coach', label: 'AI Career Coach', icon: Bot, badge: 'Live AI' },
    { id: 'daily_training', label: '10-Min Daily Sprint', icon: Flame, badge: '18d 🔥' },
    { id: 'digital_twin', label: 'Career Digital Twin', icon: Layers },
    { id: 'roadmap', label: 'Skill Gap & Roadmap', icon: Sparkles },
    { id: 'resume_studio', label: 'ATS Resume Studio', icon: FileText },
    { id: 'job_matcher', label: '"Should I Apply?" AI', icon: Briefcase },
    { id: 'interview_arena', label: 'Adaptive Interviewer', icon: Mic, badge: 'Voice/STAR' },
    { id: 'coding_sandbox', label: 'Coding Sandbox', icon: Code2 },
    { id: 'crm_tracker', label: 'Application CRM', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#0d131f] border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <div className="p-5 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Career<span className="text-indigo-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Career Operating System</p>
            </div>
          </div>

          {/* RBAC Role Switcher */}
          <div className="mt-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Portal Mode</label>
            <select
              value={currentRole}
              onChange={(e) => {
                const r = e.target.value as any;
                setCurrentRole(r);
                if (r === 'institution') setCurrentTab('institution_portal');
                else if (r === 'recruiter') setCurrentTab('recruiter_portal');
                else if (r === 'admin') setCurrentTab('admin_hub');
                else setCurrentTab('dashboard');
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-semibold text-slate-200 py-1.5 px-2 focus:outline-none"
            >
              <option value="candidate">🎓 Candidate Portal</option>
              <option value="institution">🏛️ College / Institution</option>
              <option value="recruiter">🏢 Recruiter Portal</option>
              <option value="admin">⚡ Platform Admin Hub</option>
            </select>
          </div>
        </div>

        {/* Readiness Meter for Candidate */}
        {currentRole === 'candidate' && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Career Readiness
              </span>
              <span className="font-bold text-indigo-300">{readinessScore}%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" 
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 mt-3">
          {currentRole === 'candidate' ? (
            candidateItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      active ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })
          ) : currentRole === 'institution' ? (
            <div className="space-y-1">
              <button
                onClick={() => setCurrentTab('institution_portal')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600/15 text-emerald-400 border border-emerald-500/30"
              >
                <Building2 className="w-4 h-4" /> Placement & Student Hub
              </button>
            </div>
          ) : currentRole === 'recruiter' ? (
            <div className="space-y-1">
              <button
                onClick={() => setCurrentTab('recruiter_portal')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold bg-cyan-600/15 text-cyan-400 border border-cyan-500/30"
              >
                <Briefcase className="w-4 h-4" /> Recruiter Pipeline & Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => setCurrentTab('admin_hub')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-600/15 text-amber-400 border border-amber-500/30"
              >
                <ShieldAlert className="w-4 h-4" /> SaaS & AI Evaluation Admin
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800/60 bg-slate-900/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
            AM
          </div>
          <div className="truncate">
            <p className="text-[11px] font-bold text-slate-200 truncate">Alex Mercer</p>
            <p className="text-[9px] text-slate-400 truncate">Tier: Enterprise Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
