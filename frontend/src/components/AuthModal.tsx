import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'signup' | 'forgot';
  onClose: () => void;
  onSuccess: () => void;
  onSwitchMode: (mode: 'login' | 'signup' | 'forgot') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  mode, 
  onClose, 
  onSuccess, 
  onSwitchMode 
}) => {
  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@careerai.dev');
  const [password, setPassword] = useState('CareerAI2026!');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'forgot') {
        setResetSent(true);
      } else {
        onSuccess();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full space-y-6 border-indigo-500/30 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-xs font-bold"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back 👋' : mode === 'signup' ? 'Create Your CareerAI Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Access your Career Brain, roadmaps, and mock interviews.'
              : mode === 'signup'
              ? 'Start your AI Career Intelligence journey today.'
              : 'Enter your email to receive a secure password reset link.'}
          </p>
        </div>

        {resetSent ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-300">
              Password reset link has been dispatched to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => { setResetSent(false); onSwitchMode('login'); }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full p-2.5 pl-9 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.mercer@careerai.dev"
                  className="w-full p-2.5 pl-9 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <label className="text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => onSwitchMode('forgot')}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2.5 pl-9 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              {loading
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In to Dashboard'
                : mode === 'signup'
                ? 'Create CareerAI Account'
                : 'Send Reset Link'}
            </button>

            {mode !== 'forgot' && (
              <>
                <div className="text-center text-slate-500 font-semibold text-[10px] uppercase tracking-wider my-2">
                  OR
                </div>

                <button
                  type="button"
                  onClick={() => onSuccess()}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            <div className="text-center pt-2">
              {mode === 'login' ? (
                <p className="text-slate-400 text-[11px]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('signup')}
                    className="text-indigo-400 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p className="text-slate-400 text-[11px]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('login')}
                    className="text-indigo-400 font-bold hover:underline"
                  >
                    Log In
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
