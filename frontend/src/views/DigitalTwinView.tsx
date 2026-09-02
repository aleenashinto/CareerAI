import React, { useState } from 'react';
import { 
  Layers, MapPin, 
  ShieldCheck, Save
} from 'lucide-react';
import type { CandidateProfile } from '../api';
import { api } from '../api';

interface DigitalTwinViewProps {
  profile: CandidateProfile | null;
  onRefresh: () => void;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({ profile, onRefresh }) => {
  const [name, setName] = useState(profile?.name || 'Alex Mercer');
  const [title, setTitle] = useState(profile?.title || 'Full Stack & AI Engineer');
  const [bio, setBio] = useState(profile?.bio || 'Software engineer specializing in Python, FastAPI, React, and Applied LLM agents.');
  const [saving, setSaving] = useState(false);

  const skills = profile?.skills || {
    "Python": 90, "FastAPI": 85, "React": 82, "TypeScript": 78,
    "SQL": 84, "PostgreSQL": 82, "Docker": 65, "RAG": 78,
    "LLMs": 80, "Redis": 70, "System Design": 62, "Kubernetes": 42
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ name, title, bio });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" /> Structured Career Digital Twin
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Career Profile & Digital Representation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic knowledge graph of all verified engineering capabilities, work history, and project evidence.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>

      {/* Main Two Column Twin View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Bio Card */}
        <div className="glass-panel p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20">
              AM
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{name}</h2>
              <p className="text-xs text-indigo-400 font-semibold">{title}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3" /> Bangalore / Remote
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Primary Target Role</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Executive Summary</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Skills Vector Breakdown */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Engineering Vectors
              </h3>
              <p className="text-xs text-slate-400">Continuous proficiency assessment derived from mock interviews & projects</p>
            </div>
            <span className="text-xs font-bold text-indigo-400 font-mono">12 Verified Areas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(skills).map(([skill, score]) => (
              <div key={skill} className="glass-card p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{skill}</span>
                  <span className="font-mono font-bold text-indigo-300">{score}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Work History Highlights */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Demonstrated Experience Records</h4>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Software Engineer • InnovateTech Labs</span>
                  <span className="text-slate-400 text-[11px]">2023 – Present</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Architected FastAPI microservices handling 50k+ daily API requests. Built pgvector semantic retrieval pipelines.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Associate Developer • CloudByte Systems</span>
                  <span className="text-slate-400 text-[11px]">2022 – 2023</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Built real-time telemetry dashboards in Next.js/TypeScript. Authored automated pytest suites with 92% coverage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
