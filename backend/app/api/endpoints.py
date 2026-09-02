from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import pypdf
import io
import datetime

from app.core.database import get_db
from app.models.models import CandidateProfile, ResumeVersion, JobListing, JobApplication, InterviewSession
from app.schemas.schemas import (
    CandidateProfileResponse, CandidateProfileBase,
    ResumeAnalyzeRequest, ResumeAnalyzeResponse,
    ResumeTailorRequest, ResumeTailorResponse,
    JobParseRequest, JobAnalysisResponse,
    CareerRoadmapRequest, CareerRoadmapResponse,
    InterviewStartRequest, InterviewQuestion,
    InterviewAnswerSubmitRequest, AnswerEvaluation,
    InterviewCompleteResponse,
    JobApplicationCreate, JobApplicationUpdate
)
from app.services.ai_engine import ai_engine

router = APIRouter()

# ----------------- Candidate Profile Endpoints -----------------
@router.get("/profile", response_model=CandidateProfileResponse)
async def get_candidate_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    if not profile:
        profile = CandidateProfile(
            name="Alex Mercer",
            email="alex.mercer@careerai.dev",
            title="Full Stack & AI Engineer",
            experience_years=2.5,
            bio="Software engineer specializing in Python, FastAPI, React, and Applied LLM agents.",
            github_url="https://github.com/alexmercer-dev",
            linkedin_url="https://linkedin.com/in/alexmercer",
            location="Bangalore / Remote",
            skills={
                "Python": 90, "FastAPI": 85, "React": 82, "TypeScript": 78,
                "SQL": 84, "PostgreSQL": 82, "Docker": 65, "RAG": 78,
                "LLMs": 80, "Redis": 70, "System Design": 62, "Kubernetes": 42
            },
            skill_categories={
                "Languages": ["Python", "TypeScript", "SQL"],
                "Frameworks": ["FastAPI", "React", "Next.js", "Django"],
                "AI/Data": ["RAG", "LLMs", "pgvector", "Pandas", "PyTorch"],
                "DevOps": ["Docker", "Git", "CI/CD", "Redis", "Kubernetes"]
            },
            experience_list=[
                {
                    "role": "Software Engineer",
                    "company": "InnovateTech Labs",
                    "period": "2023 – Present",
                    "highlights": [
                        "Architected FastAPI backend services handling 50k+ daily requests.",
                        "Optimized pgvector semantic retrieval lowering search latency by 42%."
                    ]
                },
                {
                    "role": "Associate Developer",
                    "company": "CloudByte Systems",
                    "period": "2022 – 2023",
                    "highlights": [
                        "Built real-time telemetry dashboards in Next.js and TypeScript.",
                        "Maintained 92% automated test coverage with pytest."
                    ]
                }
            ],
            projects_list=[
                {
                    "title": "CareerAI Platform",
                    "tech_stack": ["FastAPI", "React", "pgvector", "TailwindCSS"],
                    "description": "AI Career Intelligence and adaptive interview simulation platform.",
                    "impact_metrics": "94% ATS matching accuracy"
                }
            ],
            readiness_score=84.5
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile

@router.put("/profile", response_model=CandidateProfileResponse)
async def update_candidate_profile(data: CandidateProfileBase, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    if not profile:
        profile = CandidateProfile(**data.model_dump())
        db.add(profile)
    else:
        for key, val in data.model_dump().items():
            setattr(profile, key, val)
    await db.commit()
    await db.refresh(profile)
    return profile

# ----------------- Resume & ATS Endpoints -----------------
@router.post("/resume/analyze", response_model=ResumeAnalyzeResponse)
async def analyze_resume_ats(req: ResumeAnalyzeRequest):
    result = ai_engine.analyze_resume_ats(
        resume_text=req.resume_text,
        job_description=req.job_description,
        target_role=req.target_role or "AI Engineer"
    )
    return result

@router.post("/resume/upload-parse")
async def upload_and_parse_resume(file: UploadFile = File(...)):
    contents = await file.read()
    extracted_text = ""
    if file.filename.endswith(".pdf"):
        try:
            reader = pypdf.PdfReader(io.BytesIO(contents))
            for page in reader.pages:
                extracted_text += page.extract_text() or ""
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to extract PDF text: {str(e)}")
    else:
        extracted_text = contents.decode("utf-8", errors="ignore")
        
    return {
        "filename": file.filename,
        "extracted_length": len(extracted_text),
        "raw_text": extracted_text.strip()
    }

@router.post("/resume/tailor", response_model=ResumeTailorResponse)
async def tailor_resume(req: ResumeTailorRequest, db: AsyncSession = Depends(get_db)):
    tailored = ai_engine.tailor_resume(
        resume_text=req.resume_text,
        target_role=req.target_role,
        job_description=req.job_description or ""
    )
    # Save as version
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    if profile:
        version = ResumeVersion(
            profile_id=profile.id,
            version_tag=tailored["version_tag"],
            title=f"{req.target_role} Tailored Resume",
            target_role=req.target_role,
            raw_content=tailored["tailored_text"],
            ats_score=tailored["ats_score_estimate"],
            keyword_matches=[req.target_role, "FastAPI", "Python", "RAG"],
            bullet_improvements=tailored["tailored_bullets"]
        )
        db.add(version)
        await db.commit()
    return tailored

@router.get("/resume/versions")
async def get_resume_versions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ResumeVersion).order_by(ResumeVersion.created_at.desc()))
    versions = result.scalars().all()
    if not versions:
        # Provide pre-seeded versions
        return [
            {
                "id": 1,
                "version_tag": "v_ai_engineer",
                "title": "AI / ML Engineer Resume",
                "target_role": "AI Engineer",
                "ats_score": 92.0,
                "applications_count": 14,
                "interviews_count": 5,
                "created_at": "2026-08-15"
            },
            {
                "id": 2,
                "version_tag": "v_python_dev",
                "title": "Python Backend Resume",
                "target_role": "Python Backend Developer",
                "ats_score": 88.5,
                "applications_count": 22,
                "interviews_count": 7,
                "created_at": "2026-08-20"
            },
            {
                "id": 3,
                "version_tag": "v_fullstack",
                "title": "Full Stack Engineer Resume",
                "target_role": "Full Stack Engineer",
                "ats_score": 84.0,
                "applications_count": 18,
                "interviews_count": 4,
                "created_at": "2026-08-28"
            }
        ]
    return versions

# ----------------- Job Intelligence & "Should I Apply?" -----------------
@router.post("/jobs/analyze", response_model=JobAnalysisResponse)
async def analyze_job_listing(req: JobParseRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    cand_dict = {"skills": profile.skills if profile else {}}
    analysis = ai_engine.analyze_job_listing(req.job_description, cand_dict)
    if req.title:
        analysis["title"] = req.title
    if req.company:
        analysis["company"] = req.company
    return analysis

# ----------------- Career Roadmap & Skill Gap -----------------
@router.post("/career/roadmap", response_model=CareerRoadmapResponse)
async def get_career_roadmap(req: CareerRoadmapRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    skills = profile.skills if profile else {}
    roadmap = ai_engine.generate_career_roadmap(req.target_role, skills)
    return roadmap

# ----------------- Adaptive Interview Engine -----------------
@router.post("/interviews/start")
async def start_interview_session(req: InterviewStartRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    
    questions = ai_engine.get_interview_questions(
        role_target=req.role_target,
        interview_type=req.interview_type,
        difficulty=req.difficulty
    )
    
    session = InterviewSession(
        profile_id=profile.id if profile else 1,
        role_target=req.role_target,
        interview_type=req.interview_type,
        difficulty=req.difficulty,
        questions_count=len(questions),
        current_question_index=0,
        status="Active",
        transcript=[]
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    return {
        "session_id": session.id,
        "interview_type": req.interview_type,
        "difficulty": req.difficulty,
        "total_questions": len(questions),
        "first_question": questions[0],
        "all_questions": questions
    }

@router.post("/interviews/submit-answer", response_model=AnswerEvaluation)
async def submit_interview_answer(req: InterviewAnswerSubmitRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InterviewSession).where(InterviewSession.id == req.session_id))
    session = result.scalars().first()
    
    interview_type = session.interview_type if session else "Technical"
    questions = ai_engine.get_interview_questions(
        role_target=session.role_target if session else "AI Engineer",
        interview_type=interview_type
    )
    
    q_text = questions[req.question_index]["question"] if req.question_index < len(questions) else "Question"
    
    evaluation = ai_engine.evaluate_interview_answer(
        question=q_text,
        candidate_answer=req.candidate_answer or (req.code_submission or ""),
        interview_type=interview_type,
        audio_duration=req.audio_duration_seconds or 0.0
    )
    
    if session:
        t_list = list(session.transcript) if session.transcript else []
        t_list.append({
            "question_index": req.question_index,
            "question": q_text,
            "answer": req.candidate_answer,
            "code": req.code_submission,
            "scores": evaluation
        })
        session.transcript = t_list
        session.current_question_index = req.question_index + 1
        await db.commit()
        
    return evaluation

@router.post("/interviews/{session_id}/complete", response_model=InterviewCompleteResponse)
async def complete_interview(session_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InterviewSession).where(InterviewSession.id == session_id))
    session = result.scalars().first()
    
    scorecard = ai_engine.generate_interview_scorecard(session.transcript if session else [])
    
    if session:
        session.status = "Completed"
        session.completed_at = datetime.datetime.utcnow()
        session.overall_score = scorecard["overall_score"]
        session.technical_accuracy = scorecard["technical_accuracy"]
        session.communication_score = scorecard["communication"]
        session.completeness_score = scorecard["completeness"]
        session.confidence_score = scorecard["confidence"]
        session.strengths = scorecard["strengths"]
        session.weaknesses = scorecard["weaknesses"]
        session.actionable_feedback = scorecard["actionable_feedback"]
        session.seven_day_plan = scorecard["seven_day_plan"]
        await db.commit()

    return {
        "session_id": session_id,
        "overall_score": scorecard["overall_score"],
        "technical_accuracy": scorecard["technical_accuracy"],
        "communication": scorecard["communication"],
        "completeness": scorecard["completeness"],
        "confidence": scorecard["confidence"],
        "strengths": scorecard["strengths"],
        "weaknesses": scorecard["weaknesses"],
        "actionable_feedback": scorecard["actionable_feedback"],
        "seven_day_plan": scorecard["seven_day_plan"]
    }

# ----------------- Application CRM Endpoints -----------------
@router.get("/applications")
async def get_applications(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JobApplication).order_by(JobApplication.updated_at.desc()))
    apps = result.scalars().all()
    if not apps:
        # Pre-seed realistic CRM applications
        default_apps = [
            JobApplication(
                profile_id=1,
                job_title="Senior AI Engineer",
                company="Anthropic Ecosystem Partner",
                location="Remote",
                salary="₹24 LPA",
                status="Technical Interview",
                resume_version_used="v_ai_engineer",
                match_score=91.0,
                notes="Completed screening call with hiring manager. Live coding round scheduled."
            ),
            JobApplication(
                profile_id=1,
                job_title="Full Stack / Python Lead",
                company="FinTech Scaleup",
                location="Bangalore (Hybrid)",
                salary="₹20 LPA",
                status="HR Interview",
                resume_version_used="v_fullstack",
                match_score=88.0,
                notes="Cleared system design challenge. Final compensation alignment."
            ),
            JobApplication(
                profile_id=1,
                job_title="Backend Microservices Dev",
                company="Stripe Integration Lab",
                location="Remote",
                salary="₹18 LPA",
                status="Applied",
                resume_version_used="v_python_dev",
                match_score=85.0,
                notes="Application submitted via direct referral."
            ),
            JobApplication(
                profile_id=1,
                job_title="Applied AI Scientist",
                company="Autonomous AI Co",
                location="Remote",
                salary="₹28 LPA",
                status="Offer",
                resume_version_used="v_ai_engineer",
                match_score=94.0,
                notes="Received official offer letter! Reviewing stock option terms."
            )
        ]
        for a in default_apps:
            db.add(a)
        await db.commit()
        result = await db.execute(select(JobApplication).order_by(JobApplication.updated_at.desc()))
        apps = result.scalars().all()
        
    return apps

@router.post("/applications")
async def create_application(req: JobApplicationCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CandidateProfile).limit(1))
    profile = result.scalars().first()
    app = JobApplication(
        profile_id=profile.id if profile else 1,
        job_title=req.job_title,
        company=req.company,
        location=req.location or "Remote",
        salary=req.salary or "₹15 LPA",
        status=req.status or "Applied",
        resume_version_used=req.resume_version_used or "v1_master",
        match_score=req.match_score or 85.0,
        notes=req.notes or ""
    )
    db.add(app)
    await db.commit()
    await db.refresh(app)
    return app

@router.patch("/applications/{app_id}")
async def update_application_status(app_id: int, req: JobApplicationUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JobApplication).where(JobApplication.id == app_id))
    app = result.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if req.status is not None:
        app.status = req.status
    if req.notes is not None:
        app.notes = req.notes
    if req.match_score is not None:
        app.match_score = req.match_score
    if req.salary is not None:
        app.salary = req.salary
    await db.commit()
    await db.refresh(app)
    return app
