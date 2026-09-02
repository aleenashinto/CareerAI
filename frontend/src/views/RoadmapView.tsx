import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Target, BookOpen, Layers, CheckCircle2, 
  ArrowRight, Flame, Code, Database, Server, Cpu
} from 'lucide-react';
import { api, CareerRoadmap } from '../api';

export const RoadmapView: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('AI Engineer');
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRoadmap = async (role: string) => {
    setLoading(true);
    try {
      const data = await api.getRoadmap(role);
      setRoadmap(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(selectedRole);
  }, [selectedRole]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Target Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Dynamic AI Gap Analysis
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Career Path & Skill Gap Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare your profile vector against real market requirements to generate an execution roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {['AI Engineer', 'Full Stack Developer', 'Python Backend'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === role
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Generating personalized career matrix...</div>
      ) : roadmap ? (
        <div className="space-y-8">
          {/* Skill Gap Breakdown Cards */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" /> Target Competency Matrix ({roadmap.target_role})
                </h2>
                <p className="text-xs text-slate-400">Current candidate readiness: <strong className="text-indigo-300">{roadmap.current_readiness}%</strong></p>
              </div>
              <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                12-Week Target Sprint
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {roadmap.gap_skills.map((item, idx) => {
                const isHigh = item.priority === 'HIGH';
                const isMastered = item.priority === 'MASTERED';
                return (
                  <div key={idx} className="glass-card p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{item.skill}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isMastered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isHigh
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Current: {item.current_level}%</span>
                        <span>Target: {item.required_level}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isMastered ? 'bg-emerald-500' : isHigh ? 'bg-rose-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, (item.current_level / item.required_level) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 12-Week Structured Roadmap Timeline */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" /> 12-Week Progressive Learning Roadmap
              </h2>
              <p className="text-xs text-slate-400">Step-by-step technical mastery with recommended projects and verified resources</p>
            </div>

            <div className="space-y-4">
              {roadmap.milestones.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/30 transition-all">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                        {m.week_range}
                      </span>
                      <h3 className="text-sm font-bold text-white">{m.topic}</h3>
                    </div>
                    <p className="text-xs text-slate-300">{m.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.core_skills.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {m.recommended_project && (
                    <div className="shrink-0 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs md:w-64">
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Recommended Project</p>
                      <p className="text-slate-200 font-medium mt-0.5 truncate">{m.recommended_project.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* High-Impact Capstone Blueprint */}
          <div className="glass-panel p-6 rounded-2xl border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-[#0b0f17] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 uppercase tracking-wide">
                  Portfolio Differentiator
                </span>
                <h2 className="text-lg font-black text-white mt-1">{roadmap.capstone_project.title}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">{roadmap.capstone_project.overview}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" /> Database Schema Spec
                </p>
                <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg">
                  {roadmap.capstone_project.database_schema.map((schema, i) => (
                    <div key={i} className="text-emerald-400">✓ {schema}</div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Ready-to-Use Resume Bullet Points
                </p>
                <div className="space-y-1 text-[11px] text-slate-300">
                  {roadmap.capstone_project.resume_bullets.map((bullet, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                      "{bullet}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
