# Multi-tenant RBAC, Organization, AI Coach, Billing & Analytics Models
import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True)
    org_type = Column(String(50), default="institution") # "institution" | "recruiter" | "enterprise"
    plan = Column(String(50), default="INSTITUTION")
    student_capacity = Column(Integer, default=1500)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), default="candidate") # "candidate" | "recruiter" | "institution_admin" | "admin" | "super_admin"
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    subscription_plan = Column(String(50), default="PRO")
    ai_credits_remaining = Column(Integer, default=500)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AIChatMessage(Base):
    __tablename__ = "ai_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    sender = Column(String(20), default="user") # "user" | "coach"
    message = Column(Text, nullable=False)
    context_tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AIEvaluationRun(Base):
    __tablename__ = "ai_evaluation_runs"

    id = Column(Integer, primary_key=True, index=True)
    feature = Column(String(100), default="ATS_ANALYSIS") # ATS_ANALYSIS | INTERVIEW_EVAL | JOB_MATCH
    model_used = Column(String(100), default="llama-3.3-70b-versatile")
    test_cases_count = Column(Integer, default=50)
    accuracy_score = Column(Float, default=94.2)
    relevance_score = Column(Float, default=96.0)
    hallucination_rate = Column(Float, default=0.2)
    avg_latency_ms = Column(Integer, default=280)
    cost_estimate = Column(String(50), default="$0.002 / run")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
