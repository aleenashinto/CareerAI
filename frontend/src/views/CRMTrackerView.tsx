import React, { useState } from 'react';
import { 
  BarChart3, Plus, Search, Filter, CheckCircle2, 
  Clock, XCircle, ArrowUpRight, DollarSign, Calendar
} from 'lucide-react';
import { api, JobApplicationItem } from '../api';

interface CRMTrackerViewProps {
  applications: JobApplicationItem[];
  onRefresh: () => void;
}

export const CRMTrackerView: React.FC<CRMTrackerViewProps> = ({ applications, onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState('₹18 LPA');
  const [newStatus, setNewStatus] = useState('Applied');

  const columns = [
    { id: 'Wishlist', label: 'Wishlist / Pipeline', color: 'slate' },
    { id: 'Applied', label: 'Applied', color: 'indigo' },
    { id: 'Technical Interview', label: 'Technical Rounds', color: 'cyan' },
    { id: 'HR Interview', label: 'HR / Final Rounds', color: 'amber' },
    { id: 'Offer', label: 'Offers & Won', color: 'emerald' },
  ];

  const handleCreate = async () => {
    if (!newTitle || !newCompany) return;
    try {
      await api.createApplication({
        job_title: newTitle,
        company: newCompany,
        salary: newSalary,
        status: newStatus,
        resume_version_used: 'v_ai_engineer',
        match_score: 88.0,
        notes: 'Target role added via Career Intelligence tracker.'
      });
      setShowAddModal(false);
      setNewTitle('');
      setNewCompany('');
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: number, newStat: string) => {
    try {
      await api.updateApplicationStatus(id, newStat);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> High-Conversion Job CRM
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Job Application Pipeline & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your conversion funnel from cold submission to interview clearances and offer negotiations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold">Total Submissions</span>
          <div className="text-2xl font-black text-white mt-1">{applications.length}</div>
          <span className="text-[11px] text-slate-400">100% targeted resumes</span>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold">Interview Rate</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">50.0%</div>
          <span className="text-[11px] text-emerald-400 font-medium">2.4x market average</span>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold">In Active Stages</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {applications.filter(a => a.status.includes('Interview')).length}
          </div>
          <span className="text-[11px] text-slate-400">Next rounds this week</span>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold">Offers Generated</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {applications.filter(a => a.status === 'Offer').length}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Top offer: ₹28 LPA</span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colApps = applications.filter(a => a.status === col.id);
          return (
            <div key={col.id} className="glass-panel p-4 rounded-2xl flex flex-col justify-between space-y-3 min-h-[420px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-slate-200">{col.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colApps.map((app) => (
                    <div key={app.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white leading-snug">{app.job_title}</h4>
                        <span className="text-[10px] font-bold text-indigo-400">{app.match_score}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{app.company}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span className="font-mono text-emerald-400 font-semibold">{app.salary}</span>
                        <span className="font-mono">{app.resume_version_used}</span>
                      </div>

                      {/* Quick stage mover */}
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="w-full mt-2 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-300 py-1 px-1.5 focus:outline-none"
                      >
                        <option value="Wishlist">Wishlist</option>
                        <option value="Applied">Applied</option>
                        <option value="Technical Interview">Technical Round</option>
                        <option value="HR Interview">HR Round</option>
                        <option value="Offer">Offer</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 border-indigo-500/30">
            <h3 className="text-base font-bold text-white">Add Target Job Application</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Job Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior AI Engineer"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Company</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. OpenAI / Google Partner"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Target Compensation</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Initial Stage</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Technical Interview">Technical Interview</option>
                    <option value="HR Interview">HR Interview</option>
                    <option value="Offer">Offer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
