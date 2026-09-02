import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, ArrowRight, CheckCircle2, 
  HelpCircle, MessageSquare, Lightbulb
} from 'lucide-react';

interface AICoachViewProps {
  onNavigate: (tab: string) => void;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: "Hello Alex! I am your dedicated AI Career Coach. I have indexed your authorized Career Digital Twin (Full Stack & AI Engineer, 2.5 yrs exp, 84.5% Readiness). Ask me anything about your skill gaps, application strategies, or why you might be missing interview callbacks."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionItems, setActionItems] = useState<string[]>([
    "Upgrade resume bullets with quantified throughput metrics.",
    "Complete pgvector hybrid search roadmap sprint.",
    "Practice hard-difficulty live technical mock interview."
  ]);
  const [suggestedRoutes, setSuggestedRoutes] = useState<Array<{ label: string; tab: string }>>([
    { label: "Open ATS Resume Studio", tab: "resume_studio" },
    { label: "View 12-Week AI Roadmap", tab: "roadmap" },
    { label: "Launch Adaptive Interviewer", tab: "interview_arena" }
  ]);

  const handleSend = async (customQuery?: string) => {
    const q = customQuery || input;
    if (!q.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    if (!customQuery) setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/ai-coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'coach', text: data.reply }]);
      if (data.action_items) setActionItems(data.action_items);
      if (data.suggested_routes) setSuggestedRoutes(data.suggested_routes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Why am I not getting interviews for Senior AI roles?",
    "What specific skills do I need to become an AI Engineer?",
    "Should I apply for backend roles with Kubernetes requirements?",
    "How can I improve my project description for RAG?"
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" /> Context-Aware Career AI Coach
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Career Coach & Strategy Advisor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Trained directly on your verified profile, application telemetry, and interview weaknesses.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Feed */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[500px] space-y-4">
          <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'coach' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300 font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-xl ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-indigo-400 animate-pulse flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Coach analyzing candidate graph & telemetry...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your AI Career Coach about strategy, skill gaps, or interview tactics..."
                className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Recommended Action Items & Direct Shortcuts */}
        <div className="space-y-6">
          {/* Action Items */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Prescribed Action Items
            </h3>
            <div className="space-y-2">
              {actionItems.map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Recommended Platform Modules
            </h3>
            <div className="space-y-2">
              {suggestedRoutes.map((r, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(r.tab)}
                  className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between transition-all"
                >
                  <span>{r.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
