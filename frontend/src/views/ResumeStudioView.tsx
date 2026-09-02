import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Sparkles, CheckCircle2, AlertTriangle, 
  Copy, Layers, ArrowRight, Wand2, History
} from 'lucide-react';
import { api, ATSAnalysisResult } from '../api';

export const ResumeStudioView: React.FC = () => {
  const [resumeText, setResumeText] = useState(`ALEX MERCER
Full Stack & AI Engineer | alex.mercer@careerai.dev | Bangalore
GitHub: github.com/alexmercer-dev

SUMMARY:
Software developer with 2.5 years of experience building Python APIs, React interfaces, and backend databases.

EXPERIENCE:
Software Engineer - InnovateTech Labs (2023 - Present)
- Built backend APIs with FastAPI and handled database queries.
- Worked on AI and chatbot projects with vector search.
- Created frontend dashboard components in React and TypeScript.

Associate Developer - CloudByte Systems (2022 - 2023)
- Built responsive UI components and handled internal state management.
- Wrote unit tests for key user workflows.`);

  const [jobDescription, setJobDescription] = useState(`Role: Senior AI Engineer
Requirements:
- 2+ years experience in Python, FastAPI, and asynchronous backend architecture.
- Demonstrated hands-on knowledge of RAG, vector embeddings (pgvector), and LLM orchestration.
- Experience with Docker, CI/CD, and distributed caching (Redis).
- Proven ability to write clean, unit-tested code with quantified performance impact.`);

  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [tailoredResult, setTailoredResult] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const data = await api.analyzeResume(resumeText, jobDescription, targetRole);
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const runTailoring = async () => {
    setTailoring(true);
    try {
      const data = await api.tailorResume(resumeText, targetRole, jobDescription);
      setTailoredResult(data);
      loadVersions();
    } catch (err) {
      console.error(err);
    } finally {
      setTailoring(false);
    }
  };

  const loadVersions = async () => {
    try {
      const v = await api.getResumeVersions();
      setVersions(v);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    runAnalysis();
    loadVersions();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Truthful ATS Intelligence & Version Control
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Advanced ATS Resume Analyzer & Tailor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze semantic match against job descriptions, detect missing evidence, and generate role-specific versions without fabricating experience.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            {analyzing ? 'Scanning ATS...' : 'Re-scan ATS'}
          </button>
          <button
            onClick={runTailoring}
            disabled={tailoring}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Wand2 className="w-4 h-4" /> {tailoring ? 'Tailoring...' : 'Generate Tailored Resume'}
          </button>
        </div>
      </div>

      {/* Editor & JD Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Current Resume Text
            </label>
            <span className="text-[11px] text-slate-400 font-mono">{resumeText.length} chars</span>
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={10}
            className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition-all leading-relaxed"
          />
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Target Job Description (JD)
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-indigo-300 font-semibold px-2 py-1 focus:outline-none"
            >
              <option value="AI Engineer">AI Engineer</option>
              <option value="Python Backend Developer">Python Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
            </select>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition-all leading-relaxed"
          />
        </div>
      </div>

      {/* ATS Intelligence Results Breakdown */}
      {analysis && (
        <div className="space-y-6">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border-indigo-500/30 space-y-2">
              <span className="text-xs font-semibold text-slate-400">ATS Match Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-400">{analysis.ats_score}%</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {analysis.verdict}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                  style={{ width: `${analysis.ats_score}%` }}
                />
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-2">
              <span className="text-xs font-semibold text-slate-400">Keyword Coverage</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">
                  {analysis.keyword_matches.length} <span className="text-xs text-slate-400 font-normal">matched</span>
                </span>
                <span className="text-xs text-rose-400 font-semibold">
                  {analysis.missing_keywords.length} missing
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Key terms identified directly from target JD</p>
            </div>

            <div className="glass-card p-5 rounded-2xl space-y-2">
              <span className="text-xs font-semibold text-slate-400">Experience Alignment</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-cyan-400">{analysis.experience_match_score}%</span>
              </div>
              <p className="text-[11px] text-slate-400">Seniority & technical stack correlation</p>
            </div>
          </div>

          {/* Keywords & Missing Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Matched & Missing Keywords</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-emerald-400 font-semibold block mb-1">Found in Resume:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.keyword_matches.map((kw, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-rose-400 font-semibold block mb-1">Missing from Resume:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missing_keywords.map((kw, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-300">
                        ✗ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" /> AI Missing Evidence Diagnoses
              </h3>
              <div className="space-y-2">
                {analysis.missing_evidence_notes.map((note, i) => (
                  <div key={i} className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Truthful Bullet Upgrades */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Truthful Bullet Improvements (No False Claims)
              </h3>
              <p className="text-xs text-slate-400">Rewriting your actual achievements with quantifiable metric impact</p>
            </div>

            <div className="space-y-3">
              {analysis.tailored_bullet_recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-slate-400 line-through">
                    <span className="font-semibold text-rose-400 shrink-0">Before:</span>
                    <span>{rec.original}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-emerald-300 font-medium">
                    <span className="font-bold text-emerald-400 shrink-0">Upgraded:</span>
                    <span>{rec.improved}</span>
                  </div>
                  <p className="text-[10px] text-indigo-300/80 italic pl-14">
                    Rationale: {rec.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tailored Full Version Output */}
      {tailoredResult && (
        <div className="glass-panel p-6 rounded-2xl border-emerald-500/30 bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tailored Resume Generated ({tailoredResult.version_tag})
            </h3>
            <button
              onClick={() => navigator.clipboard.writeText(tailoredResult.tailored_text)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-600/30 transition-all"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Markdown
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {tailoredResult.tailored_text}
          </pre>
        </div>
      )}

      {/* Resume Version Control & Performance Tracker */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" /> Resume Version Control & Analytics
            </h3>
            <p className="text-xs text-slate-400">Track which resume version converts into the most interview calls</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Version Tag</th>
                <th className="p-3">Role Target</th>
                <th className="p-3">ATS Score</th>
                <th className="p-3">Applications</th>
                <th className="p-3">Interviews</th>
                <th className="p-3">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {versions.map((v, i) => {
                const conv = ((v.interviews_count / (v.applications_count || 1)) * 100).toFixed(1);
                return (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="p-3 text-indigo-300 font-mono font-bold">{v.version_tag}</td>
                    <td className="p-3 text-slate-200">{v.title}</td>
                    <td className="p-3 text-emerald-400 font-bold">{v.ats_score}%</td>
                    <td className="p-3 text-slate-300">{v.applications_count}</td>
                    <td className="p-3 text-cyan-300 font-bold">{v.interviews_count}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                        {conv}% Call Rate
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
