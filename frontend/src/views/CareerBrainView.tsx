import React, { useState } from 'react';
import { 
  Brain, Zap, TrendingUp, Target, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck
} from 'lucide-react';

interface CareerBrainViewProps {
  onNavigate: (tab: string) => void;
}

export const CareerBrainView: React.FC<CareerBrainViewProps> = ({ onNavigate }) => {
  const [roleA, setRoleA] = useState("Python Backend Developer");
  const [roleB, setRoleB] = useState("AI Engineer");
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>({
    comparison: [
      {
        role: "Python Backend Developer",
        current_match: 91.5,
        missing_skills_count: 2,
        estimated_prep_time: "3-4 weeks",
        interview_difficulty: "Medium",
        avg_market_salary: "₹16L - ₹24L",
        missing_skills: ["Celery Task Queues", "Advanced SQL Indexing"],
        feasibility: "IMMEDIATE APPLY"
      },
      {
        role: "AI Engineer",
        current_match: 74.0,
        missing_skills_count: 6,
        estimated_prep_time: "8-12 weeks",
        interview_difficulty: "High",
        avg_market_salary: "₹22L - ₹35L",
        missing_skills: ["pgvector Hybrid Search", "Autonomous Agents", "RAG Triad Evals", "Vector DBs"],
        feasibility: "RECOMMENDED STRATEGIC TRANSITION"
      }
    ],
    ai_recommendation: "Strategic Pathway: Your foundation in Python Backend is immediately hireable (91.5% match). We recommend submitting Python applications now while completing the 12-Week AI Engineer roadmap to step into Senior AI roles for a 40%+ salary bump."
  });

  const categories = [
    { label: "Technical Skills", score: 88, color: "text-emerald-400" },
    { label: "Resume Quality", score: 92, color: "text-indigo-400" },
    { label: "Projects & Evidence", score: 78, color: "text-cyan-400" },
    { label: "Interview Performance", score: 74, color: "text-amber-400" },
    { label: "Communication Clarity", score: 81, color: "text-cyan-300" },
    { label: "Job Match Alignment", score: 86, color: "text-emerald-300" },
    { label: "Professional Profile", score: 90, color: "text-indigo-300" }
  ];

  const boosters = [
    { action: "Complete 2 timed coding assessments", boost: "+3 pts", tab: "coding_sandbox" },
    { action: "Add quantifiable throughput impact metrics to resume", boost: "+4 pts", tab: "resume_studio" },
    { action: "Complete 1 System Design simulation (Caching/Sharding)", boost: "+5 pts", tab: "interview_arena" },
    { action: "Deploy RAG capstone project with live verified evidence", boost: "+3 pts", tab: "roadmap" }
  ];

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/brain/path-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_a: roleA, role_b: roleB })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-[#0b0f17] border border-indigo-500/20 p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-3">
            <Brain className="w-3.5 h-3.5" /> Central AI Career Brain Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Career Readiness Index: <span className="gradient-text">84.5 / 100</span>
          </h1>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Continuous synthesis across verified coding submissions, ATS resume version conversions, and adaptive interview scores.
          </p>
        </div>
      </div>

      {/* 7-Category Breakdown & Action Boosters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Breakdown */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Multi-Dimensional Readiness Decomposition
            </h2>
            <span className="text-xs font-bold text-emerald-400 font-mono">Top 8% Candidate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {categories.map((c, i) => (
              <div key={i} className="glass-card p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{c.label}</span>
                  <span className={`font-mono font-bold ${c.color}`}>{c.score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Boosters */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> "What Will Increase My Score?"
            </h2>
            <p className="text-xs text-slate-400">High-leverage tasks to reach 95%+ Readiness</p>

            <div className="space-y-2.5 mt-2">
              {boosters.map((b, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onNavigate(b.tab)}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="text-xs text-slate-200 font-medium leading-snug">{b.action}</div>
                  <span className="shrink-0 text-xs font-black text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    {b.boost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Career Path Simulator */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
              <Target className="w-3.5 h-3.5" /> Career Path Decision Simulator
            </div>
            <h2 className="text-lg font-black text-white">Compare Alternative Career Trajectories</h2>
          </div>

          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            {simulating ? 'Simulating...' : 'Run Path Comparison'}
          </button>
        </div>

        {/* Comparison Cards */}
        {simulationResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {simulationResult.comparison.map((item: any, idx: number) => (
                <div key={idx} className="glass-card p-5 rounded-2xl space-y-3 border-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white">{item.role}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.feasibility}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Match Score</span>
                      <span className="text-base font-black text-emerald-400">{item.current_match}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Prep Timeline</span>
                      <span className="text-xs font-bold text-slate-200 mt-1 block">{item.estimated_prep_time}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Avg Package</span>
                      <span className="text-xs font-mono font-bold text-cyan-300 mt-1 block">{item.avg_market_salary}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1">Key Gaps to Close:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.missing_skills.map((s: string, i: number) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
              💡 <strong>AI Strategic Recommendation:</strong> {simulationResult.ai_recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
