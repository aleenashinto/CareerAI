# CareerAI 2.0: AI Career Brain, Path Simulator, Rejection Analyzer, and 10-Minute Daily Training API
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.core.database import get_db
from app.models.models import CandidateProfile, ResumeVersion, JobApplication, InterviewSession

router = APIRouter()

# 1. Career Brain - Holistic Readiness & Score Booster Engine
@router.get("/brain/readiness-breakdown")
async def get_career_brain_readiness(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    
    return {
        "overall_readiness": 84.5,
        "category_breakdown": {
            "technical_skills": 88,
            "resume_quality": 92,
            "projects_evidence": 78,
            "interview_performance": 74,
            "communication_clarity": 81,
            "job_match_fit": 86,
            "professional_profile": 90
        },
        "score_boosters": [
            {"action": "Complete 2 timed coding assessments", "boost": "+3 pts", "category": "Coding"},
            {"action": "Add quantifiable impact metrics to AWS/Cloud bullets", "boost": "+4 pts", "category": "Resume"},
            {"action": "Complete 1 System Design mock simulation (Caching/Sharding)", "boost": "+5 pts", "category": "Interview"},
            {"action": "Deploy RAG capstone project with live URL & test suite", "boost": "+3 pts", "category": "Projects"}
        ],
        "top_gap_priorities": [
            {"skill": "System Design: Distributed Caching", "priority": "CRITICAL", "current": 45, "target": 80},
            {"skill": "pgvector Hybrid Dense/Sparse Search", "priority": "HIGH", "current": 60, "target": 85},
            {"skill": "Docker & Cloud Orchestration", "priority": "IMPORTANT", "current": 65, "target": 80}
        ]
    }

# 2. Career Path Simulator (e.g. Python Dev vs AI Engineer vs Full Stack)
class PathSimulationRequest(BaseModel):
    role_a: str = "Python Backend Developer"
    role_b: str = "AI Engineer"

@router.post("/brain/path-simulator")
async def simulate_career_paths(req: PathSimulationRequest):
    return {
        "comparison": [
            {
                "role": req.role_a,
                "current_match": 91.5,
                "missing_skills_count": 2,
                "estimated_prep_time": "3–4 weeks",
                "interview_difficulty": "Medium",
                "avg_market_salary": "₹16L – ₹24L",
                "missing_skills": ["Celery Task Queues", "Advanced SQL Indexing"],
                "project_gap": "Low",
                "feasibility": "IMMEDIATE APPLY"
            },
            {
                "role": req.role_b,
                "current_match": 74.0,
                "missing_skills_count": 6,
                "estimated_prep_time": "8–12 weeks",
                "interview_difficulty": "High",
                "avg_market_salary": "₹22L – ₹35L",
                "missing_skills": ["pgvector Hybrid Search", "Autonomous Agents", "RAG Triad Evals", "Fine-Tuning", "Vector DBs", "Async Telemetry"],
                "project_gap": "Moderate",
                "feasibility": "RECOMMENDED STRATEGIC TRANSITION"
            }
        ],
        "ai_recommendation": (
            f"Strategic Pathway: Your foundation in {req.role_a} is immediately hireable (91.5% match). "
            f"We recommend applying to {req.role_a} roles while concurrently completing the 12-Week AI Engineer sprint "
            f"to transition into Senior {req.role_b} positions for a 40%+ compensation bump."
        )
    }

# 3. 10-Minute Daily Career Training & Streak Engine
@router.get("/training/daily-sprint")
async def get_daily_career_training():
    return {
        "streak_days": 18,
        "daily_target_minutes": 10,
        "daily_tasks": [
            {
                "id": "task_1",
                "type": "Technical Q&A",
                "duration": "2 min",
                "title": "Async Event Loop & GIL Mechanics",
                "prompt": "Explain why asyncio is non-blocking even with Python's GIL in I/O bound requests.",
                "completed": True,
                "score": 92
            },
            {
                "id": "task_2",
                "type": "Coding Micro-Problem",
                "duration": "3 min",
                "title": "O(1) Hash Map Inversion",
                "prompt": "Invert a key-value dictionary with collision handling in Python.",
                "completed": False,
                "score": None
            },
            {
                "id": "task_3",
                "type": "Behavioral STAR Quick-Fire",
                "duration": "2 min",
                "title": "Handling Disagreements with Product Managers",
                "prompt": "Give a 45-second STAR answer on negotiating technical debt vs new feature shipping.",
                "completed": False,
                "score": None
            },
            {
                "id": "task_4",
                "type": "Skill Micro-Lesson",
                "duration": "3 min",
                "title": "pgvector Reciprocal Rank Fusion (RRF)",
                "prompt": "Learn how dense cosine distance and sparse BM25 scores are combined in production RAG.",
                "completed": False,
                "score": None
            }
        ],
        "overall_daily_score": 92
    }

# 4. Rejection Analyzer & Pattern Detection Engine
@router.get("/analytics/rejection-patterns")
async def get_rejection_pattern_analysis():
    return {
        "recorded_feedback_count": 6,
        "identified_bottleneck": "System Design: Distributed Caching & Sharding",
        "pattern_summary": (
            "Pattern Detected across 6 interviews: Candidates with your profile passed 100% of pure coding rounds (Leetcode/DSA), "
            "but 5 out of 6 unsuccessful outcomes occurred during high-concurrency System Design rounds where cache invalidation "
            "and multi-region database replication were tested."
        ),
        "recommended_remediation": [
            "Enroll in the 7-Day System Design SRE practice program.",
            "Review Cache-Aside vs Write-Through strategies with Redis.",
            "Simulate 2 System Design whiteboard scenarios in the Sandbox."
        ]
    }

# 5. Opportunity Radar & Global Career Mode
@router.get("/jobs/opportunity-radar")
async def get_opportunity_radar(region: str = "India"):
    return {
        "selected_region": region,
        "radar_counts": {
            "high_match": 12,
            "good_match": 34,
            "skill_gap_stretch": 27,
            "low_match": 18
        },
        "featured_radar_jobs": [
            {
                "title": "Senior AI Systems Engineer",
                "company": "Anthropic Ecosystem Partner",
                "location": f"{region} / Remote",
                "match_tier": "HIGH_MATCH",
                "score": 94,
                "salary": "₹24L – ₹36L",
                "primary_reason": "Exact fit on FastAPI, RAG, and Async Python."
            },
            {
                "title": "Distributed Backend Architect",
                "company": "Stripe Integrations",
                "location": f"{region} / Remote",
                "match_tier": "HIGH_MATCH",
                "score": 91,
                "salary": "₹22L – ₹30L",
                "primary_reason": "High alignment on PostgreSQL, Redis, and high-throughput APIs."
            },
            {
                "title": "AI Infrastructure Lead",
                "company": "NextGen Cloud Labs",
                "location": f"{region} (Hybrid)",
                "match_tier": "SKILL_GAP_STRETCH",
                "score": 76,
                "salary": "₹28L – ₹40L",
                "primary_reason": "Requires Kubernetes orchestration and AWS EKS depth."
            }
        ]
    }
