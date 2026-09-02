const API_BASE = 'http://localhost:8000/api/v1';

export interface CandidateProfile {
  id: number;
  name: string;
  email: string;
  title: string;
  experience_years: number;
  bio: string;
  github_url: string;
  linkedin_url: string;
  location: string;
  skills: Record<string, number>;
  skill_categories: Record<string, string[]>;
  experience_list: any[];
  projects_list: any[];
  readiness_score: number;
}

export interface ATSAnalysisResult {
  ats_score: number;
  keyword_matches: string[];
  missing_keywords: string[];
  experience_match_score: number;
  missing_evidence_notes: string[];
  tailored_bullet_recommendations: Array<{
    original: string;
    improved: string;
    rationale: string;
  }>;
  verdict: string;
}

export interface JobMatchResult {
  title: string;
  company: string;
  experience_level: string;
  salary_range: string;
  required_skills: string[];
  preferred_skills: string[];
  match_score: number;
  technical_match: number;
  experience_match: number;
  recommendation: 'APPLY' | 'APPLY (STRETCH)' | 'UPSKILL FIRST';
  strong_matches: string[];
  partial_matches: string[];
  critical_missing: string[];
  ai_reasoning: string;
}

export interface CareerRoadmap {
  target_role: string;
  current_readiness: number;
  gap_skills: Array<{
    skill: string;
    required_level: number;
    current_level: number;
    gap: number;
    priority: 'HIGH' | 'MEDIUM' | 'MASTERED';
  }>;
  milestones: Array<{
    week_range: string;
    topic: string;
    description: string;
    core_skills: string[];
    recommended_project?: {
      name: string;
      github_template: string;
    };
    resources: string[];
  }>;
  capstone_project: {
    title: string;
    overview: string;
    database_schema: string[];
    api_endpoints: string[];
    resume_bullets: string[];
  };
}

export interface InterviewSessionData {
  session_id: number;
  interview_type: string;
  difficulty: string;
  total_questions: number;
  first_question: any;
  all_questions: any[];
}

export interface AnswerEvaluation {
  overall_score: number;
  technical_accuracy: number;
  communication: number;
  completeness: number;
  confidence_indicators: number;
  star_breakdown?: {
    Situation: boolean;
    Task: boolean;
    Action: boolean;
    Result: boolean;
  };
  positive_feedback: string;
  areas_for_improvement: string;
  suggested_ideal_answer: string;
  adaptive_next_difficulty: string;
}

export interface Scorecard {
  session_id: number;
  overall_score: number;
  technical_accuracy: number;
  communication: number;
  completeness: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  actionable_feedback: string[];
  seven_day_plan: Array<{
    day: string;
    focus: string;
    action: string;
  }>;
}

export interface JobApplicationItem {
  id: number;
  job_title: string;
  company: string;
  location: string;
  salary: string;
  status: string;
  resume_version_used: string;
  match_score: number;
  notes: string;
  updated_at: string;
}

export const api = {
  getProfile: async (): Promise<CandidateProfile> => {
    const res = await fetch(`${API_BASE}/profile`);
    return res.json();
  },
  updateProfile: async (data: Partial<CandidateProfile>): Promise<CandidateProfile> => {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  analyzeResume: async (resume_text: string, job_description: string, target_role = 'AI Engineer'): Promise<ATSAnalysisResult> => {
    const res = await fetch(`${API_BASE}/resume/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text, job_description, target_role })
    });
    return res.json();
  },
  tailorResume: async (resume_text: string, target_role: string, job_description = '') => {
    const res = await fetch(`${API_BASE}/resume/tailor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text, target_role, job_description })
    });
    return res.json();
  },
  getResumeVersions: async () => {
    const res = await fetch(`${API_BASE}/resume/versions`);
    return res.json();
  },
  analyzeJob: async (job_description: string, title = '', company = ''): Promise<JobMatchResult> => {
    const res = await fetch(`${API_BASE}/jobs/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description, title, company })
    });
    return res.json();
  },
  getRoadmap: async (target_role = 'AI Engineer'): Promise<CareerRoadmap> => {
    const res = await fetch(`${API_BASE}/career/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_role, target_timeline_weeks: 12 })
    });
    return res.json();
  },
  startInterview: async (role_target = 'AI Engineer', interview_type = 'Technical', difficulty = 'Medium'): Promise<InterviewSessionData> => {
    const res = await fetch(`${API_BASE}/interviews/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role_target, interview_type, difficulty, questions_count: 5 })
    });
    return res.json();
  },
  submitAnswer: async (session_id: number, question_index: number, candidate_answer: string, code_submission?: string, audio_duration_seconds = 0): Promise<AnswerEvaluation> => {
    const res = await fetch(`${API_BASE}/interviews/submit-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id, question_index, candidate_answer, code_submission, audio_duration_seconds })
    });
    return res.json();
  },
  completeInterview: async (session_id: number): Promise<Scorecard> => {
    const res = await fetch(`${API_BASE}/interviews/${session_id}/complete`, {
      method: 'POST'
    });
    return res.json();
  },
  getApplications: async (): Promise<JobApplicationItem[]> => {
    const res = await fetch(`${API_BASE}/applications`);
    return res.json();
  },
  createApplication: async (data: Partial<JobApplicationItem>): Promise<JobApplicationItem> => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateApplicationStatus: async (id: number, status: string): Promise<JobApplicationItem> => {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  }
};
