import React from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, ShieldCheck, 
  Bot, Mic, FileText, Briefcase, Trophy, Flame,
  Star, ChevronRight, Zap, Target, Layers
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onTryInterview: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onLogin, 
  onTryInterview 
}) => {
  const stats = [
    { label: "Verified Career Profiles", value: "24,800+" },
    { label: "ATS Pass Rate Increase", value: "94.2%" },
    { label: "Mock Interviews Completed", value: "140,000+" },
    { label: "Avg Placement Time", value: "18 Days" }
  ];

  const coreFeatures = [
    {
      title: "AI Career Brain",
      desc: "Continuous multi-dimensional readiness indexing across coding, resume, projects, and communication.",
      icon: Sparkles
    },
    {
      title: "ATS Resume Intelligence",
      desc: "Deep keyword matching and truthful STAR bullet upgrades without fabricating qualifications.",
      icon: FileText
    },
    {
      title: "Adaptive Voice Interviewer",
      desc: "Realistic speech recognition, dynamic difficulty scaling, and instant 7-day corrective sprint plans.",
      icon: Mic
    },
    {
      title: '"Should I Apply?" Advisor',
      desc: "Instant job description decomposition with clear APPLY, STRETCH, or UPSKILL FIRST verdicts.",
      icon: Briefcase
    },
    {
      title: "10-Minute Daily Career Drills",
      desc: "Bite-sized habit-forming technical, coding, and behavioral sprints with streak tracking.",
      icon: Flame
    },
    {
      title: "Context-Aware AI Career Coach",
      desc: "Grounded personal coach answering strategic questions based on your real application telemetry.",
      icon: Bot
    }
  ];

  const pricingTiers = [
    {
      name: "Free Starter",
      price: "₹0",
      period: "forever",
      desc: "Essential tools for career discovery and resume building.",
      features: ["1 Master Resume Version", "3 ATS Keyword Scans / mo", "2 AI Mock Interviews", "Basic Job Matching"],
      cta: "Get Started Free",
      highlight: false
    },
    {
      name: "Pro Career",
      price: "₹299",
      period: "/ month",
      desc: "Comprehensive toolkit for active candidates and job seekers.",
      features: ["Unlimited ATS Resume Tailoring", "20 Voice & Adaptive Interviews", "12-Week Custom Learning Roadmaps", "10-Min Daily Training Sprints", "AI Career Coach Access"],
      cta: "Start Pro Free Trial",
      highlight: true
    },
    {
      name: "Enterprise & College",
      price: "Custom",
      period: "/ cohort",
      desc: "Institutional placement platform for universities and bootcamps.",
      features: ["Unlimited Student Seats", "Batch Placement Analytics", "Custom Assessment Drives", "Recruiter Candidate Shortlisting"],
      cta: "Contact Enterprise Sales",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 antialiased selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-[#0d131f]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Career<span className="text-indigo-400">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              Build My Career <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6 border-b border-slate-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Career Operating System
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Your AI Career. <br />
            <span className="gradient-text">Smarter. Faster. Better.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CareerAI doesn't just build resumes. It continuously indexes your engineering capabilities, identifies skill gaps, conducts adaptive voice interviews, and guides you into top-tier roles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              Build My Career Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTryInterview}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4 text-indigo-400" /> Try AI Mock Interview
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((st, i) => (
            <div key={i} className="glass-card p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-black text-white">{st.value}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-b border-slate-800/60 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Features</span>
          <h2 className="text-3xl font-black text-white">Engineered for Maximum Employability</h2>
          <p className="text-xs text-slate-400">Everything needed to transition from candidate to top 1% engineer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel p-6 rounded-2xl space-y-3 hover:border-indigo-500/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto border-b border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pricing Plans</span>
          <h2 className="text-3xl font-black text-white">Transparent Commercial Pricing</h2>
          <p className="text-xs text-slate-400">Choose the plan that fits your career goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((p, i) => (
            <div 
              key={i} 
              className={`glass-panel p-8 rounded-2xl flex flex-col justify-between space-y-6 ${
                p.highlight ? 'border-indigo-500 shadow-xl shadow-indigo-600/10 relative' : ''
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{p.price}</span>
                  <span className="text-xs text-slate-400">{p.period}</span>
                </div>
                <p className="text-xs text-slate-300">{p.desc}</p>

                <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  p.highlight
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>© 2026 CareerAI Technologies Inc. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Security & RBAC</a>
        </div>
      </footer>
    </div>
  );
};
