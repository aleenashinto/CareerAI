import React, { useState } from 'react';
import { 
  Flame, Clock, CheckCircle2, Play, Trophy, 
  Sparkles, Award, ArrowRight, BookOpen, AlertOctagon
} from 'lucide-react';

export const DailyTrainingView: React.FC = () => {
  const [streak, setStreak] = useState(18);
  const [tasks, setTasks] = useState([
    {
      id: "task_1",
      type: "Technical Architectural Q&A",
      duration: "2 min",
      title: "Async Event Loop & GIL Mechanics",
      prompt: "Explain why asyncio is non-blocking even with Python's GIL during high-throughput I/O requests.",
      completed: true,
      score: 92
    },
    {
      id: "task_2",
      type: "Coding Micro-Problem",
      duration: "3 min",
      title: "O(1) Hash Map Inversion with Collision Handling",
      prompt: "Invert a key-value dictionary and bundle colliding keys into arrays in Python.",
      completed: false,
      score: null
    },
    {
      id: "task_3",
      type: "Behavioral STAR Quick-Fire",
      duration: "2 min",
      title: "Handling Disagreements on Technical Debt",
      prompt: "Give a 45-second structured response on negotiating tech debt refactoring vs product feature deadlines.",
      completed: false,
      score: null
    },
    {
      id: "task_4",
      type: "Micro-Learning Lesson",
      duration: "3 min",
      title: "pgvector Reciprocal Rank Fusion (RRF)",
      prompt: "Learn how dense cosine distance and sparse BM25 scores are combined in production vector search.",
      completed: false,
      score: null
    }
  ]);

  const toggleComplete = (idx: number) => {
    setTasks(prev => {
      const next = [...prev];
      next[idx].completed = !next[idx].completed;
      return next;
    });
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Streak Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5" /> High-Retention Daily Practice
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">10-Minute Daily Career Training</h1>
          <p className="text-xs text-slate-400 mt-1">
            Bite-sized technical, coding, and behavioral drills designed to keep you interview-ready year-round.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 px-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-3">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Active Streak</span>
              <span className="text-lg font-black text-amber-300 font-mono">{streak} Days 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Meter */}
      <div className="glass-panel p-5 rounded-2xl space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">Today's Sprint Progress</span>
          <span className="text-indigo-400">{completedCount} of {tasks.length} Completed ({(completedCount / tasks.length) * 100}%)</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Daily Sprint Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, idx) => (
          <div 
            key={task.id} 
            className={`glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              task.completed ? 'border-emerald-500/30 bg-emerald-950/10' : 'hover:border-indigo-500/40'
            }`}
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {task.duration}
                </span>
                <span className="text-[10px] font-bold text-indigo-400">
                  {task.type}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{task.title}</h3>
              <p className="text-xs text-slate-300">{task.prompt}</p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {task.score && (
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  Score: {task.score}%
                </span>
              )}
              <button
                onClick={() => toggleComplete(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  task.completed
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {task.completed ? 'Completed' : 'Start Task'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
