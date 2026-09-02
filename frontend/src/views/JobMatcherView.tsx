import React, { useState } from 'react';
import { 
  Briefcase, Sparkles, CheckCircle2, AlertTriangle, 
  XCircle, ArrowRight, ShieldCheck, DollarSign
} from 'lucide-react';
import { api, JobMatchResult } from '../api';

export const JobMatcherView: React.FC = () => {
  const [jobDescription, setJobDescription] = useState(`Senior AI & Backend Engineer
Company: TechScale Global
Location: Remote / Bangalore
Salary: ₹18L - ₹28L / annum

About the Role:
We are seeking a senior engineer to lead our distributed LLM backend. You will architect high-performance asynchronous APIs in Python using FastAPI, design vector search indexing with pgvector & PostgreSQL, and manage Docker container deployments.

Requirements:
- 2-4 years experience with Python, FastAPI, and async database drivers.
- Proven knowledge of RAG architecture, vector embeddings, and LLM inference optimization.
- Familiarity with Redis caching and microservice architectures.
- Experience with Kubernetes and cloud infrastructure (AWS/GCP) is preferred.`);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const data = await api.analyzeJob(jobDescription);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Objective Fit Decision Engine
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">"Should I Apply?" AI Job Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">
            Instantly evaluate job descriptions to prevent wasted application hours and prioritize high-conversion listings.
          </p>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Sparkles className="w-4 h-4" /> {loading ? 'Evaluating Fit...' : 'Run "Should I Apply?" Analysis'}
        </button>
      </div>

      {/* Input JD */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
          <span>Paste Job Listing or Raw Requirements</span>
          <span className="text-slate-400 font-normal">Supports full recruiter job specs</span>
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition-all leading-relaxed"
        />
      </div>

      {/* Decision Results */}
      {result && (
        <div className="space-y-6">
          {/* Top Recommendation Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
            result.recommendation === 'APPLY'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : result.recommendation === 'APPLY (STRETCH)'
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Decision Verdict</span>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black">{result.recommendation}</h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-white">
                  Match Score: {result.match_score}%
                </span>
              </div>
              <p className="text-xs text-slate-300 pt-1 max-w-2xl">{result.ai_reasoning}</p>
            </div>

            <div className="shrink-0 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 space-y-1 md:w-64">
              <p className="text-[11px] text-slate-400 font-semibold">{result.company}</p>
              <p className="font-bold text-white text-sm">{result.title}</p>
              <p className="text-emerald-400 font-mono font-semibold pt-1">{result.salary_range}</p>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Strong Matches ({result.strong_matches.length})
              </h3>
              <p className="text-[11px] text-slate-400">Direct proof found in your skills & projects</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {result.strong_matches.map((s, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-medium">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Partial Matches ({result.partial_matches.length})
              </h3>
              <p className="text-[11px] text-slate-400">Foundational knowledge exists, needs light polish</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {result.partial_matches.map((s, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/30 font-medium">
                    ~ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <XCircle className="w-4 h-4" /> Missing / Stretch ({result.critical_missing.length})
              </h3>
              <p className="text-[11px] text-slate-400">Items to study or clarify during interviews</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {result.critical_missing.map((s, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 font-medium">
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
