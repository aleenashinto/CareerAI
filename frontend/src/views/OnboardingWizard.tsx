import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, CheckCircle2, User, 
  Briefcase, Code2, Target, Award, Rocket
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [careerStatus, setCareerStatus] = useState('Working Professional');
  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [experienceYears, setExperienceYears] = useState('2.5 years');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'FastAPI', 'React', 'SQL', 'RAG']);
  const [primaryGoal, setPrimaryGoal] = useState('Transition into High-Paying AI / Backend Role');

  const allSkills = [
    'Python', 'FastAPI', 'React', 'TypeScript', 'SQL', 'PostgreSQL', 
    'Docker', 'RAG', 'LLMs', 'pgvector', 'Redis', 'Kubernetes', 'AWS', 'System Design'
  ];

  const toggleSkill = (s: string) => {
    if (selectedSkills.includes(s)) {
      setSelectedSkills(selectedSkills.filter(item => item !== s));
    } else {
      setSelectedSkills([...selectedSkills, s]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center p-6 text-slate-100">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl max-w-2xl w-full space-y-8 border-indigo-500/30 shadow-2xl animate-fadeIn">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Step {step} of 4</span>
            <span className="text-indigo-400">{step === 1 ? 'Career Status' : step === 2 ? 'Target Role & Skills' : step === 3 ? 'Career Goals' : 'AI Analysis Ready'}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Status & Experience */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">What is your current career status?</h2>
              <p className="text-xs text-slate-400 mt-1">This tunes your AI readiness benchmarks and interview difficulty.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Student / Undergraduate',
                'Fresh Graduate (0-1 yrs)',
                'Working Professional (2-5 yrs)',
                'Senior Engineer (5+ yrs)',
                'Career Switcher into Tech'
              ].map((st) => (
                <button
                  key={st}
                  onClick={() => setCareerStatus(st)}
                  className={`p-4 rounded-2xl text-left text-xs font-bold border transition-all ${
                    careerStatus === st
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                Continue to Target Role <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Target Role & Verified Skills */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">What role are you targeting?</h2>
              <p className="text-xs text-slate-400 mt-1">Select your primary direction and current technical skills.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Target Title</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-semibold"
              >
                <option value="AI Engineer">AI Engineer (Applied LLM & RAG)</option>
                <option value="Python Backend Developer">Python Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer (React / Next.js)</option>
                <option value="Data Scientist">Data Scientist / ML Engineer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Select Your Known Skills</label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((s) => {
                  const active = selectedSkills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}{s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                Next: Goals <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Primary Career Goal */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">What is your primary career goal?</h2>
              <p className="text-xs text-slate-400 mt-1">We will optimize your daily practice and roadmap sprints around this.</p>
            </div>

            <div className="space-y-3">
              {[
                'Transition into High-Paying AI / Backend Role',
                'Pass Upcoming Technical Interviews',
                'Optimize Resume for ATS Pass Rate (>90%)',
                'Bridge Critical System Design & Cloud Gaps'
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setPrimaryGoal(goal)}
                  className={`w-full p-4 rounded-2xl text-left text-xs font-bold border transition-all ${
                    primaryGoal === goal
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                Synthesize Profile <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: AI Analysis Generated */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
              <Rocket className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Your AI Career Brain is Configured!</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Initial Career Readiness calculated at <strong className="text-emerald-400 font-mono">84.5%</strong>. We have generated your tailored 12-week roadmap, mock interview bank, and ATS scanner.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Target Track:</span>
                <span className="text-indigo-400">{targetRole}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Verified Skills:</span>
                <span className="text-emerald-400">{selectedSkills.length} Skills Indexed</span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>12-Week Roadmap:</span>
                <span className="text-cyan-300">Generated & Ready</span>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              Enter CareerAI Operating System <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
