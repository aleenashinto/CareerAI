from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

# Profile schemas
class SkillDetail(BaseModel):
    name: str
    proficiency: int = Field(ge=0, le=100) # 0-100%
    category: str # Frontend, Backend, AI/ML, DevOps, Database, Soft Skills
    years_experience: Optional[float] = 1.0

class ExperienceItem(BaseModel):
    role: str
    company: str
    period: str
    highlights: List[str] = []

class ProjectItem(BaseModel):
    title: str
    tech_stack: List[str] = []
    description: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    impact_metrics: Optional[str] = None

class CandidateProfileBase(BaseModel):
    name: str = "Alex Mercer"
    email: str = "alex.mercer@careerai.dev"
    title: str = "Full Stack & AI Engineer"
    experience_years: float = 2.5
    bio: str = ""
    github_url: Optional[str] = ""
    linkedin_url: Optional[str] = ""
    location: str = "Bangalore / Remote"
    skills: Dict[str, int] = {}
    skill_categories: Dict[str, List[str]] = {}
    experience_list: List[Dict[str, Any]] = []
    projects_list: List[Dict[str, Any]] = []
    readiness_score: float = 82.0

class CandidateProfileResponse(CandidateProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ATS and Resume schemas
class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str
    target_role: Optional[str] = "AI Engineer"

class ResumeAnalyzeResponse(BaseModel):
    ats_score: float
    keyword_matches: List[str]
    missing_keywords: List[str]
    experience_match_score: float
    missing_evidence_notes: List[str]
    tailored_bullet_recommendations: List[Dict[str, str]]
    verdict: str

class ResumeTailorRequest(BaseModel):
    resume_text: str
    target_role: str
    job_description: Optional[str] = ""

class ResumeTailorResponse(BaseModel):
    version_tag: str
    tailored_text: str
    tailored_bullets: List[Dict[str, str]]
    improvements_made: List[str]
    ats_score_estimate: float

# Job Intelligence & "Should I Apply?" schemas
class JobParseRequest(BaseModel):
    job_description: str
    title: Optional[str] = ""
    company: Optional[str] = ""

class JobAnalysisResponse(BaseModel):
    title: str
    company: str
    experience_level: str
    salary_range: str
    required_skills: List[str]
    preferred_skills: List[str]
    match_score: float
    technical_match: float
    experience_match: float
    recommendation: str # 'APPLY' | 'UPSKILL FIRST' | 'STRETCH'
    strong_matches: List[str]
    partial_matches: List[str]
    critical_missing: List[str]
    ai_reasoning: str

# Career Path & Skill Gap schemas
class CareerRoadmapRequest(BaseModel):
    target_role: str = "AI Engineer"
    target_timeline_weeks: int = 12

class RoadmapMilestone(BaseModel):
    week_range: str
    topic: str
    description: str
    core_skills: List[str]
    recommended_project: Optional[Dict[str, Any]] = None
    resources: List[str] = []

class CareerRoadmapResponse(BaseModel):
    target_role: str
    current_readiness: float
    gap_skills: List[Dict[str, Any]]
    milestones: List[RoadmapMilestone]
    capstone_project: Dict[str, Any]

# Interview Engine schemas
class InterviewStartRequest(BaseModel):
    role_target: str = "AI Engineer"
    interview_type: str = "Technical" # Technical, Voice, Live Coding, System Design, Behavioral STAR
    difficulty: str = "Medium"
    questions_count: int = 5

class InterviewQuestion(BaseModel):
    question_id: int
    question: str
    context_hint: Optional[str] = None
    code_starter: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None
    evaluation_criteria: List[str] = []

class InterviewAnswerSubmitRequest(BaseModel):
    session_id: int
    question_index: int
    candidate_answer: str
    audio_duration_seconds: Optional[float] = 0.0
    code_submission: Optional[str] = None

class AnswerEvaluation(BaseModel):
    overall_score: float
    technical_accuracy: float
    communication: float
    completeness: float
    confidence_indicators: float
    star_breakdown: Optional[Dict[str, bool]] = None # Situation, Task, Action, Result
    positive_feedback: str
    areas_for_improvement: str
    suggested_ideal_answer: str
    adaptive_next_difficulty: str

class InterviewCompleteResponse(BaseModel):
    session_id: int
    overall_score: float
    technical_accuracy: float
    communication: float
    completeness: float
    confidence: float
    strengths: List[str]
    weaknesses: List[str]
    actionable_feedback: List[str]
    seven_day_plan: List[Dict[str, str]]

# Application CRM schemas
class JobApplicationCreate(BaseModel):
    job_title: str
    company: str
    location: Optional[str] = "Remote"
    salary: Optional[str] = "?15 LPA"
    status: Optional[str] = "Applied"
    resume_version_used: Optional[str] = "v1_master"
    match_score: Optional[float] = 85.0
    notes: Optional[str] = ""

class JobApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    match_score: Optional[float] = None
    salary: Optional[str] = None
