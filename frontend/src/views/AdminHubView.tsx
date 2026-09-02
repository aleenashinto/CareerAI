import React from 'react';
import { 
  ShieldAlert, Server, Cpu, Activity, 
  DollarSign, Sparkles, CheckCircle2, RefreshCw
} from 'lucide-react';

export const AdminHubView: React.FC = () => {
  const evaluations = [
    { feature: "ATS Semantic Keyword Matcher", accuracy: "95.4%", hallucination: "0.1%", latency: "220ms", cost: "$0.0018" },
    { feature: "Adaptive Interview Evaluator (STAR)", accuracy: "93.8%", hallucination: "0.3%", latency: "380ms", cost: "$0.0035" },
    { feature: "Job Fit Decision Recommender", accuracy: "96.2%", hallucination: "0.0%", latency: "180ms", cost: "$0.0012" }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Platform Admin & Model Operations (LLMOps)
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">CareerAI SaaS & AI Evaluation Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inference costs, model router telemetry, and automated prompt evaluation benchmarks.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Trigger AI Benchmark Test
        </button>
      </div>

      {/* Admin SaaS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Total SaaS Users</span>
          <div className="text-2xl font-black text-white mt-1">24,832</div>
          <span className="text-[10px] text-emerald-400 font-medium">+18% MoM</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Active Today</span>
          <div className="text-2xl font-black text-amber-400 mt-1">8,492</div>
          <span className="text-[10px] text-slate-400">3,821 Pro/Enterprise</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Monthly Recurring (MRR)</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹18.4 Lakhs</div>
          <span className="text-[10px] text-emerald-400 font-medium">B2B + Pro Subs</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400">Model Router Status</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">100% Up</div>
          <span className="text-[10px] text-cyan-300 font-medium">Auto-fallback Active</span>
        </div>
      </div>

      {/* Automated AI Feature Evaluation & Latency Benchmarks */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" /> Automated AI Evaluation Test Suite (100 Cases / Benchmark)
          </h2>
          <span className="text-xs font-mono font-bold text-slate-400">Model: Llama 3.3 70B & Gemini Router</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">AI Pipeline Feature</th>
                <th className="p-3">Accuracy Score</th>
                <th className="p-3">Hallucination Rate</th>
                <th className="p-3">Average Latency</th>
                <th className="p-3">Est. Cost / Run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {evaluations.map((ev, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="p-3 text-white font-semibold">{ev.feature}</td>
                  <td className="p-3 text-emerald-400 font-bold">{ev.accuracy}</td>
                  <td className="p-3 text-indigo-300 font-mono">{ev.hallucination}</td>
                  <td className="p-3 text-slate-300 font-mono">{ev.latency}</td>
                  <td className="p-3 text-amber-400 font-mono font-bold">{ev.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
