import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), default="Alex Mercer")
    email = Column(String(255), default="alex.mercer@careerai.dev")
    title = Column(String(255), default="Full Stack & AI Engineer")
    experience_years = Column(Float, default=2.5)
    bio = Column(Text, default="Software engineer specializing in Python, React, FastAPI and Applied LLM agents.")
    github_url = Column(String(255), default="https://github.com/alexmercer-dev")
    linkedin_url = Column(String(255), default="https://linkedin.com/in/alexmercer")
    location = Column(String(255), default="Bangalore / Remote")
    
    # Structured JSON data
    skills = Column(JSON, default=dict)
    skill_categories = Column(JSON, default=dict)
    experience_list = Column(JSON, default=list)
    education_list = Column(JSON, default=list)
    projects_list = Column(JSON, default=list)
    
    # Career readiness index
    readiness_score = Column(Float, default=82.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    resumes = relationship("ResumeVersion", back_populates="profile", cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="profile", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="profile", cascade="all, delete-orphan")


class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    version_tag = Column(String(100), default="v1_master")
    title = Column(String(255), default="Master Technical Resume")
    target_role = Column(String(255), default="AI Engineer")
    raw_content = Column(Text, default="")
    structured_content = Column(JSON, default=dict)
    ats_score = Column(Float, default=85.0)
    keyword_matches = Column(JSON, default=list)
    missing_keywords = Column(JSON, default=list)
    bullet_improvements = Column(JSON, default=list)
    is_master = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("CandidateProfile", back_populates="resumes")


class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), default="Remote")
    salary_range = Column(String(100), default="?12L - ?22L")
    experience_required = Column(String(100), default="2-4 years")
    raw_jd = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)
    preferred_skills = Column(JSON, default=list)
    match_score = Column(Float, default=0.0)
    recommendation = Column(String(50), default="APPLY")
    match_breakdown = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    job_title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), default="Remote")
    salary = Column(String(100), default="?15 LPA")
    status = Column(String(50), default="Applied") # Wishlist, Applied, Screening, Technical Interview, HR Interview, Offer, Rejected
    resume_version_used = Column(String(100), default="v1_master")
    match_score = Column(Float, default=82.0)
    notes = Column(Text, default="")
    next_step_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("CandidateProfile", back_populates="applications")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    role_target = Column(String(255), default="AI Engineer")
    interview_type = Column(String(50), default="Technical") # Technical, Voice, Live Coding, System Design, Behavioral STAR
    difficulty = Column(String(50), default="Medium") # Easy, Medium, Hard, Expert
    questions_count = Column(Integer, default=5)
    current_question_index = Column(Integer, default=0)
    status = Column(String(50), default="Active") # Active, Completed
    
    # Full dialog history with questions, candidate answers, and scoring breakdown
    transcript = Column(JSON, default=list)
    
    # Aggregated Scorecard
    overall_score = Column(Float, default=0.0)
    technical_accuracy = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    completeness_score = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    actionable_feedback = Column(JSON, default=list)
    seven_day_plan = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    profile = relationship("CandidateProfile", back_populates="interviews")
