import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, Sparkles, CheckCircle2, 
  Flame, Award, ArrowRight, RefreshCw, Send, HelpCircle, Layers
} from 'lucide-react';
import { api, InterviewSessionData, AnswerEvaluation, Scorecard } from '../api';

export const InterviewArenaView: React.FC = () => {
  const [session, setSession] = useState<InterviewSessionData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedType, setSelectedType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [roleTarget, setRoleTarget] = useState('AI Engineer');
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);

  const startSession = async () => {
    setScorecard(null);
    setEvaluation(null);
    setCandidateAnswer('');
    try {
      const data = await api.startInterview(roleTarget, selectedType, difficulty);
      setSession(data);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. You can type your answer directly into the response box.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    if (!isRecording) {
      recognition.start();
      setIsRecording(true);
      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setCandidateAnswer((prev) => (prev ? prev + ' ' + text : text));
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    } else {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const submitAnswer = async () => {
    if (!session || !candidateAnswer.trim()) return;
    setEvaluating(true);
    try {
      const evalData = await api.submitAnswer(
        session.session_id,
        currentQuestionIndex,
        candidateAnswer,
        undefined,
        15.0
      );
      setEvaluation(evalData);
      setDifficulty(evalData.adaptive_next_difficulty);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = async () => {
    if (!session) return;
    if (currentQuestionIndex + 1 < session.all_questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCandidateAnswer('');
      setEvaluation(null);
    } else {
      // Complete interview
      const card = await api.completeInterview(session.session_id);
      setScorecard(card);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Controls Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Adaptive AI Interviewer & Voice Evaluation
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Interactive AI Mock Interview Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time speech analysis, dynamic difficulty scaling, and instant 7-Day corrective plan synthesis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            disabled={Boolean(session && !scorecard)}
            className="bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 font-semibold px-3 py-2"
          >
            <option value="Technical">Technical Architectural Q&A</option>
            <option value="Behavioral STAR">Behavioral STAR Framework</option>
            <option value="System Design">System Design Interview</option>
          </select>

          <button
            onClick={startSession}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            {session && !scorecard ? 'Restart Simulation' : 'Launch New Interview'}
          </button>
        </div>
      </div>

      {!session ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
            <Mic className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Ready for your simulation?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose your interview type above and click "Launch New Interview" to begin live voice / text testing with dynamic question adaptation.
          </p>
          <button
            onClick={startSession}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Start AI Interviewer
          </button>
        </div>
      ) : scorecard ? (
        /* Final Interview Scorecard & 7-Day Plan */
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-2xl border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-[#0b0f17] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                  Session Completed
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Comprehensive Interview Performance Report</h2>
                <p className="text-xs text-slate-300 mt-1">Holistic breakdown across technical accuracy, communication, and completeness</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center md:w-44">
                <span className="text-xs font-semibold text-slate-400">Overall Score</span>
                <div className="text-4xl font-black text-indigo-400 mt-1">{scorecard.overall_score}%</div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-medium">Technical Accuracy</span>
                <div className="text-xl font-bold text-emerald-400">{scorecard.technical_accuracy}%</div>
              </div>
              <div className="glass-card p-4 rounded-xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-medium">Communication</span>
                <div className="text-xl font-bold text-cyan-400">{scorecard.communication}%</div>
              </div>
              <div className="glass-card p-4 rounded-xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-medium">Completeness</span>
                <div className="text-xl font-bold text-indigo-400">{scorecard.completeness}%</div>
              </div>
              <div className="glass-card p-4 rounded-xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-medium">Confidence</span>
                <div className="text-xl font-bold text-amber-400">{scorecard.confidence}%</div>
              </div>
            </div>

            {/* Strengths & Actionable Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Core Strengths Identified
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {scorecard.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> High-Priority Coach Feedback
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {scorecard.actionable_feedback.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400">→</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7-Day Target Improvement Plan */}
            <div className="glass-panel p-6 rounded-xl space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" /> Synthesized 7-Day Target Improvement Plan
                </h4>
                <p className="text-xs text-slate-400">Turn identified interview weaknesses into daily structured practice</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {scorecard.seven_day_plan.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-600/30 text-indigo-300">
                        {item.day}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-200 mt-1">{item.focus}</p>
                    <p className="text-[11px] text-slate-400">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Start Another Simulation Session
            </button>
          </div>
        </div>
      ) : (
        /* Active Question & Voice Studio */
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300">
                  Question {currentQuestionIndex + 1} of {session.all_questions.length}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300">
                  Adaptive Difficulty: {difficulty}
                </span>
              </div>

              <button
                onClick={() => speakQuestion(session.all_questions[currentQuestionIndex].question)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Read Question
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white leading-relaxed">
                {session.all_questions[currentQuestionIndex].question}
              </h2>
              {session.all_questions[currentQuestionIndex].context_hint && (
                <p className="text-xs text-indigo-300/90 bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 leading-relaxed">
                  💡 <strong>Interviewer Hint:</strong> {session.all_questions[currentQuestionIndex].context_hint}
                </p>
              )}
            </div>

            {/* Answer Box & Voice Trigger */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">Your Response (Voice or Text)</label>
                <button
                  onClick={handleSpeechRecognition}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  {isRecording ? 'Listening (Click to Stop)...' : 'Use Voice Input'}
                </button>
              </div>

              <textarea
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Speak or type your structured technical response here..."
                rows={6}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all leading-relaxed font-sans"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={submitAnswer}
                  disabled={evaluating || !candidateAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> {evaluating ? 'AI Evaluating...' : 'Submit & Analyze Response'}
                </button>
              </div>
            </div>
          </div>

          {/* Instant Evaluation Feedback Card */}
          {evaluation && (
            <div className="glass-panel p-6 rounded-2xl border-indigo-500/30 bg-slate-900/90 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> AI Evaluation Breakdown
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Score:</span>
                  <span className="text-base font-black text-indigo-400">{evaluation.overall_score}%</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-card p-3 rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Accuracy</span>
                  <span className="text-sm font-bold text-emerald-400">{evaluation.technical_accuracy}%</span>
                </div>
                <div className="glass-card p-3 rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Clarity</span>
                  <span className="text-sm font-bold text-cyan-400">{evaluation.communication}%</span>
                </div>
                <div className="glass-card p-3 rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Completeness</span>
                  <span className="text-sm font-bold text-indigo-400">{evaluation.completeness}%</span>
                </div>
                <div className="glass-card p-3 rounded-lg text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Confidence</span>
                  <span className="text-sm font-bold text-amber-400">{evaluation.confidence_indicators}%</span>
                </div>
              </div>

              {/* STAR Framework Validation if Applicable */}
              {evaluation.star_breakdown && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300">STAR Behavioral Components Verified:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(evaluation.star_breakdown).map(([k, v]) => (
                      <div key={k} className={`p-2 rounded text-center text-xs font-bold ${
                        v ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {v ? '✓' : '✗'} {k}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Feedback */}
              <div className="space-y-2 text-xs">
                <p className="text-emerald-300">
                  <strong className="text-emerald-400">Strengths:</strong> {evaluation.positive_feedback}
                </p>
                <p className="text-amber-200">
                  <strong className="text-amber-400">Opportunity for Improvement:</strong> {evaluation.areas_for_improvement}
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                  <strong className="text-indigo-400 block mb-1">Ideal Model Answer:</strong>
                  {evaluation.suggested_ideal_answer}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  {currentQuestionIndex + 1 < session.all_questions.length ? 'Next Question' : 'View Complete Scorecard'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
