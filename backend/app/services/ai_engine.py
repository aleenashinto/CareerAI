import os
import json
import re
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings

class AIEngine:
    def __init__(self):
        self.openai_key = settings.OPENAI_API_KEY
        self.gemini_key = settings.GEMINI_API_KEY
        self.groq_key = settings.GROQ_API_KEY

    def analyze_resume_ats(self, resume_text: str, job_description: str, target_role: str = "AI Engineer") -> Dict[str, Any]:
        tech_keywords = [
            "Python", "FastAPI", "Django", "React", "TypeScript", "JavaScript", "SQL", "PostgreSQL",
            "Docker", "Kubernetes", "AWS", "GCP", "Azure", "RAG", "LLM", "LangChain", "LlamaIndex",
            "Vector DB", "Pinecone", "ChromaDB", "System Design", "Microservices", "REST API",
            "GraphQL", "Redis", "Kafka", "CI/CD", "Git", "PyTorch", "TensorFlow", "Scikit-Learn",
            "Pandas", "NumPy", "Unit Testing", "TDD", "AsyncIO", "Celery", "Next.js", "TailwindCSS"
        ]

        resume_lower = resume_text.lower()
        jd_lower = job_description.lower()

        jd_matched_keywords = [kw for kw in tech_keywords if kw.lower() in jd_lower]
        if not jd_matched_keywords:
            jd_matched_keywords = ["Python", "FastAPI", "SQL", "Docker", "REST API", "Git"]

        found_in_resume = [kw for kw in jd_matched_keywords if kw.lower() in resume_lower]
        missing_in_resume = [kw for kw in jd_matched_keywords if kw.lower() not in resume_lower]

        total_reqs = max(len(jd_matched_keywords), 1)
        match_ratio = len(found_in_resume) / total_reqs
        ats_score = round(min(100.0, max(35.0, (match_ratio * 70.0) + 25.0)), 1)
        exp_score = round(min(100.0, match_ratio * 90.0 + 10.0), 1)

        has_metrics = bool(re.search(r'\d+%', resume_text) or re.search(r'\$\d+', resume_text) or re.search(r'\b\d+x\b', resume_text, re.I))
        missing_evidence = []
        if not has_metrics:
            missing_evidence.append("You list key technical skills, but several bullet points lack quantified impact (e.g. latency reduced by X%, throughput increased by Y%).")
        if missing_in_resume:
            missing_evidence.append(f"High-priority job requirement '{missing_in_resume[0]}' is absent from your work history and project bullets.")
        if "fastapi" in jd_lower and "fastapi" not in resume_lower:
            missing_evidence.append("Job explicitly asks for high-performance async API development (FastAPI/AsyncIO).")

        bullet_recommendations = [
            {
                "original": "Built backend APIs and handled database queries.",
                "improved": "Architected high-throughput REST APIs using Python/FastAPI with async SQLAlchemy, reducing query response times by 35%.",
                "rationale": "Adds specific tech stack and measurable performance outcome without inventing new roles."
            },
            {
                "original": "Worked on AI and chatbot projects.",
                "improved": "Developed RAG-based search pipeline utilizing pgvector and semantic embeddings, increasing answer relevance to 94%.",
                "rationale": "Directly highlights LLM / vector search competencies required for AI Engineer roles."
            },
            {
                "original": "Created frontend dashboard components in React.",
                "improved": "Implemented responsive, state-managed UI dashboards in Next.js & TypeScript with real-time telemetry streaming.",
                "rationale": "Elevates frontend engineering precision for production enterprise applications."
            }
        ]

        verdict = "STRONG CANDIDATE" if ats_score >= 80 else ("MODERATE MATCH" if ats_score >= 60 else "NEEDS RESUME REFINEMENT")

        return {
            "ats_score": ats_score,
            "keyword_matches": found_in_resume,
            "missing_keywords": missing_in_resume,
            "experience_match_score": exp_score,
            "missing_evidence_notes": missing_evidence,
            "tailored_bullet_recommendations": bullet_recommendations,
            "verdict": verdict
        }

    def tailor_resume(self, resume_text: str, target_role: str, job_description: str = "") -> Dict[str, Any]:
        role_cleaned = target_role.strip()
        version_tag = f"v_{role_cleaned.lower().replace(' ', '_')}"

        improvements = [
            f"Emphasized {target_role}-specific architectural competencies in summary and skills.",
            "Reordered technical highlights to prioritize high-impact production contributions.",
            "Standardized action-oriented STAR bullet syntax (Action Verb + Context + Quantified Result).",
            "Enhanced keyword alignment for modern automated applicant tracking algorithms."
        ]

        tailored_bullets = [
            {
                "section": "Professional Experience",
                "bullet": f"Spearheaded end-to-end development of {target_role} features, delivering scalable distributed microservices serving 50k+ monthly active requests."
            },
            {
                "section": "Professional Experience",
                "bullet": "Streamlined CI/CD build cycles and container orchestration with Docker & GitHub Actions, reducing staging deployment friction by 40%."
            },
            {
                "section": "Technical Projects",
                "bullet": "Engineered autonomous multi-agent evaluation pipeline with asynchronous task queues (Redis/Celery) and real-time streaming feedback."
            }
        ]

        tailored_full_text = f"""# ALEX MERCER
**{target_role.upper()}** | alex.mercer@careerai.dev | +91 98765 43210 | Bangalore / Remote
GitHub: github.com/alexmercer-dev | LinkedIn: linkedin.com/in/alexmercer

---

### PROFESSIONAL SUMMARY
Versatile {target_role} with 2.5+ years of demonstrable experience building production-grade distributed backends, AI-powered applications, and robust data pipelines. Proven expertise across Python, FastAPI, React/TypeScript, PostgreSQL, and scalable LLM/RAG architectures.

---

### CORE TECHNICAL SKILLS
- **Languages & Frameworks:** Python, FastAPI, Django, TypeScript, React, Next.js, SQL
- **AI & Data:** RAG Pipelines, LLM Orchestration, pgvector, Vector Embeddings, PyTorch, Pandas
- **Databases & Storage:** PostgreSQL, Redis, SQLite, MongoDB
- **DevOps & Cloud:** Docker, Kubernetes Basics, Git, CI/CD, Linux, AWS Services

---

### WORK EXPERIENCE
**Software Engineer** — InnovateTech Labs *(2023 – Present)*
- Architected and deployed production {target_role} microservices using FastAPI and async SQLAlchemy, serving 50,000+ daily API requests with 99.9% uptime.
- Optimized database indexing and pgvector semantic query execution, cutting p95 search latency by 42%.
- Integrated automated evaluation harnesses to ensure deterministic LLM structured outputs with zero hallucination regressions.

**Associate Software Developer** — CloudByte Systems *(2022 – 2023)*
- Built interactive analytics dashboards with Next.js & TailwindCSS, enabling cross-functional stakeholders to track core product KPIs in real time.
- Implemented robust unit and integration testing suites with pytest, maintaining 92% code coverage.

---

### KEY PROJECTS
**Enterprise AI Knowledge Graph & Agent (RAG)**
- Built an autonomous career intelligence agent combining hybrid semantic search (pgvector + BM25) and real-time voice interview processing.
- Leveraged Redis streaming queues to handle asynchronous inference jobs seamlessly under high concurrency.
"""

        return {
            "version_tag": version_tag,
            "tailored_text": tailored_full_text.strip(),
            "tailored_bullets": tailored_bullets,
            "improvements_made": improvements,
            "ats_score_estimate": 89.5
        }

    def analyze_job_listing(self, job_description: str, candidate_profile: Dict[str, Any]) -> Dict[str, Any]:
        jd_lower = job_description.lower()
        skills = candidate_profile.get("skills", {})

        keywords_map = {
            "python": ("Python", 90),
            "fastapi": ("FastAPI", 85),
            "react": ("React", 80),
            "typescript": ("TypeScript", 75),
            "docker": ("Docker", 65),
            "kubernetes": ("Kubernetes", 40),
            "aws": ("AWS", 45),
            "postgresql": ("PostgreSQL", 88),
            "sql": ("SQL", 85),
            "rag": ("RAG", 78),
            "llm": ("LLMs", 82),
            "redis": ("Redis", 70),
            "system design": ("System Design", 60)
        }

        required_extracted = []
        strong = []
        partial = []
        missing = []

        for kw, (display_name, default_cand_score) in keywords_map.items():
            if kw in jd_lower:
                required_extracted.append(display_name)
                cand_score = skills.get(display_name, default_cand_score)
                if cand_score >= 75:
                    strong.append(display_name)
                elif cand_score >= 50:
                    partial.append(display_name)
                else:
                    missing.append(display_name)

        if not required_extracted:
            required_extracted = ["Python", "FastAPI", "SQL", "Docker", "System Design"]
            strong = ["Python", "FastAPI", "SQL"]
            partial = ["Docker"]
            missing = ["System Design"]

        total = len(required_extracted)
        tech_match = round(((len(strong) * 1.0 + len(partial) * 0.5) / max(total, 1)) * 100, 1)
        exp_match = 85.0
        overall_match = round((tech_match * 0.7) + (exp_match * 0.3), 1)

        if overall_match >= 75:
            recommendation = "APPLY"
            ai_reasoning = f"Strong alignment across core tech stack ({', '.join(strong[:3])}). Your practical experience directly satisfies senior/mid-level requirements."
        elif overall_match >= 55:
            recommendation = "APPLY (STRETCH)"
            ai_reasoning = f"Good foundational match ({', '.join(strong[:2])}). Bridging {', '.join(missing[:2])} via quick target revision will maximize interview conversions."
        else:
            recommendation = "UPSKILL FIRST"
            ai_reasoning = f"Critical gaps detected in {', '.join(missing[:3])}. We recommend completing the 7-Day target sprint before submitting."

        return {
            "title": "Senior AI / Backend Engineer",
            "company": "TechScale Global",
            "experience_level": "2–4 years",
            "salary_range": "₹16L – ₹28L / annum",
            "required_skills": required_extracted,
            "preferred_skills": ["Kubernetes", "Distributed Caching", "Vector Databases"],
            "match_score": overall_match,
            "technical_match": tech_match,
            "experience_match": exp_match,
            "recommendation": recommendation,
            "strong_matches": strong,
            "partial_matches": partial,
            "critical_missing": missing,
            "ai_reasoning": ai_reasoning
        }

    def generate_career_roadmap(self, target_role: str, current_skills: Dict[str, int]) -> Dict[str, Any]:
        target_role_clean = target_role.title()
        
        role_requirements = {
            "Ai Engineer": {
                "Python & AsyncIO": 90,
                "LLMs & Prompt Architecture": 85,
                "RAG & pgvector": 80,
                "FastAPI Microservices": 85,
                "Docker & Cloud Deployment": 75,
                "System Design & Scalability": 70,
                "Autonomous Agents (LangGraph/Autogen)": 65
            },
            "Full Stack Developer": {
                "React & Next.js": 90,
                "TypeScript": 85,
                "Node.js / Python Backend": 85,
                "PostgreSQL & ORMs": 80,
                "TailwindCSS & UI Polish": 85,
                "State Management & Testing": 75
            }
        }.get(target_role_clean, {
            "Python Core": 85,
            "API Architecture": 80,
            "Data Modeling (SQL)": 80,
            "System Design": 70,
            "Cloud & DevOps": 65
        })

        gaps = []
        total_req_score = 0
        total_cand_score = 0

        for skill, req_lvl in role_requirements.items():
            curr = current_skills.get(skill, 50)
            total_req_score += req_lvl
            total_cand_score += min(curr, req_lvl)
            gaps.append({
                "skill": skill,
                "required_level": req_lvl,
                "current_level": curr,
                "gap": max(0, req_lvl - curr),
                "priority": "HIGH" if (req_lvl - curr) > 20 else ("MEDIUM" if (req_lvl - curr) > 0 else "MASTERED")
            })

        readiness = round((total_cand_score / max(total_req_score, 1)) * 100, 1)

        milestones = [
            {
                "week_range": "Week 1–2",
                "topic": "Advanced Python & AsyncIO Architecture",
                "description": "Deep dive into async event loops, coroutines, connection pools, and high-concurrency patterns.",
                "core_skills": ["Python 3.11+", "AsyncIO", "httpx", "SQLAlchemy 2.0 Async"],
                "recommended_project": {
                    "name": "High-Throughput Concurrent Web Scraper & Task Engine",
                    "github_template": "careerai-async-engine"
                },
                "resources": ["Async Python Docs", "FastAPI Advanced Patterns", "RealPython Concurrency Guide"]
            },
            {
                "week_range": "Week 3–4",
                "topic": "Production RAG & Vector Search Engines",
                "description": "Implement hybrid search (sparse + dense), semantic chunking, reciprocal rank fusion (RRF), and vector databases.",
                "core_skills": ["pgvector", "Embeddings", "RAG Triad", "Hybrid Search"],
                "recommended_project": {
                    "name": "Document Intelligence System with pgvector",
                    "github_template": "careerai-rag-pgvector"
                },
                "resources": ["Vector Database Masterclass", "OpenAI Embeddings Guide", "Pinecone Hybrid Search"]
            },
            {
                "week_range": "Week 5–7",
                "topic": "Autonomous AI Agents & Tool Calling",
                "description": "Build multi-step agent graphs with self-reflection, automated verification loops, and external tool execution.",
                "core_skills": ["Agent Workflows", "Structured JSON Outputs", "Stateful Graph Memory"],
                "recommended_project": {
                    "name": "Autonomous Market Research & Report Agent",
                    "github_template": "careerai-agent-framework"
                },
                "resources": ["LangGraph Reference", "Function Calling Guidelines", "Anthropic Tool Use Docs"]
            },
            {
                "week_range": "Week 8–10",
                "topic": "Scalable Microservice & Caching Infrastructure",
                "description": "Design distributed cache layers with Redis, implement message brokers (Kafka/RabbitMQ), and container orchestration.",
                "core_skills": ["Docker", "Redis Caching", "Rate Limiting", "Celery Queues"],
                "recommended_project": {
                    "name": "Distributed Job Processing Engine with Redis & Docker",
                    "github_template": "careerai-distributed-worker"
                },
                "resources": ["Redis University", "Docker Production Best Practices", "System Design Primer"]
            },
            {
                "week_range": "Week 11–12",
                "topic": "Capstone Architecture & Production Deployment",
                "description": "Tie all components into a full-scale AI platform with automated CI/CD pipelines, telemetry, and observability.",
                "core_skills": ["CI/CD", "Monitoring", "System Design", "Cloud Hosting"],
                "recommended_project": {
                    "name": "CareerAI Full Stack Intelligence Platform",
                    "github_template": "careerai-capstone"
                },
                "resources": ["AWS Well-Architected", "Twelve-Factor App", "Observability with OpenTelemetry"]
            }
        ]

        capstone = {
            "title": f"Production-Grade {target_role} System",
            "overview": "An end-to-end intelligent platform handling ingestion, async embeddings, agent workflows, and real-time streaming interfaces.",
            "database_schema": [
                "users (id, email, password_hash, created_at)",
                "profiles (id, user_id, bio, skills, readiness_score)",
                "embeddings (id, doc_id, vector_embedding vector(1536), metadata jsonb)",
                "sessions (id, profile_id, transcript jsonb, scores jsonb)"
            ],
            "api_endpoints": [
                "POST /api/v1/auth/login",
                "POST /api/v1/rag/query",
                "POST /api/v1/agents/execute",
                "GET /api/v1/analytics/dashboard"
            ],
            "resume_bullets": [
                f"Designed and implemented distributed {target_role} architecture processing 10k+ daily async tasks with FastAPI, Redis, and pgvector.",
                "Achieved sub-150ms p95 query latency via hybrid dense-sparse vector indexing and Redis caching.",
                "Authored comprehensive automated test harness with pytest achieving 94% code coverage."
            ]
        }

        return {
            "target_role": target_role_clean,
            "current_readiness": readiness,
            "gap_skills": gaps,
            "milestones": milestones,
            "capstone_project": capstone
        }

    def get_interview_questions(self, role_target: str, interview_type: str, difficulty: str = "Medium") -> List[Dict[str, Any]]:
        if interview_type == "Live Coding":
            return [
                {
                    "question_id": 1,
                    "question": "Two Sum with Indices",
                    "context_hint": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Aim for O(n) time complexity using a hash map.",
                    "code_starter": "def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n",
                    "test_cases": [
                        {"input": "nums = [2,7,11,15], target = 9", "expected": "[0, 1]"},
                        {"input": "nums = [3,2,4], target = 6", "expected": "[1, 2]"},
                        {"input": "nums = [3,3], target = 6", "expected": "[0, 1]"}
                    ],
                    "evaluation_criteria": ["O(n) time complexity", "O(n) space complexity", "Handles duplicate values", "Clean idiomatic code"]
                },
                {
                    "question_id": 2,
                    "question": "LRU Cache Implementation",
                    "context_hint": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) `get` and `put` operations.",
                    "code_starter": "class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        return self.cache.get(key, -1)\n\n    def put(self, key: int, value: int) -> None:\n        self.cache[key] = value\n",
                    "test_cases": [
                        {"input": "LRUCache(2); put(1,1); put(2,2); get(1)", "expected": "1"},
                        {"input": "put(3,3); get(2)", "expected": "-1"}
                    ],
                    "evaluation_criteria": ["O(1) time complexity for get/put", "Correct eviction of least recently accessed item", "Boundary checks"]
                }
            ]

        if interview_type == "System Design":
            return [
                {
                    "question_id": 1,
                    "question": "Design a Scalable URL Shortener (e.g. TinyURL / Bitly)",
                    "context_hint": "Outline requirements (100M URLs/month, 100:1 read-to-write ratio), API design, Base62 hashing vs counter generation, database schema (PostgreSQL / NoSQL), caching strategy with Redis, and high availability.",
                    "code_starter": None,
                    "evaluation_criteria": ["Traffic & Storage Estimation", "API Endpoints Design", "Hashing Algorithm (Base62)", "Database & Indexing Choice", "Caching & CDN", "Fault Tolerance"]
                },
                {
                    "question_id": 2,
                    "question": "Design a Real-Time Collaborative Document Editor (e.g. Google Docs)",
                    "context_hint": "Address Operational Transformation (OT) vs CRDTs, WebSocket bidirectional communication, conflict resolution, snapshot storage, and Redis pub/sub for scale.",
                    "code_starter": None,
                    "evaluation_criteria": ["CRDTs vs OT", "WebSocket Connection Management", "Conflict Resolution", "Persistence & Snapshots"]
                }
            ]

        if interview_type == "Behavioral STAR":
            return [
                {
                    "question_id": 1,
                    "question": "Describe a challenging technical disagreement you had with a teammate. How did you handle it?",
                    "context_hint": "Structure your response clearly using the STAR method: Situation (the project and dispute), Task (your responsibility), Action (how you gathered data/communicated), and Result (the final outcome and impact).",
                    "code_starter": None,
                    "evaluation_criteria": ["Clear Situation", "Defined Task", "Constructive Action", "Quantified Result", "Empathy & Objectivity"]
                },
                {
                    "question_id": 2,
                    "question": "Tell me about a time a critical system failure occurred in production. How did you respond under pressure?",
                    "context_hint": "Focus on root cause analysis (RCA), immediate mitigation vs long-term preventative measures, stakeholder communication, and what you learned.",
                    "code_starter": None,
                    "evaluation_criteria": ["Incident Triage", "Calm Execution", "Blameless Post-Mortem", "Long-term Guardrails"]
                }
            ]

        return [
            {
                "question_id": 1,
                "question": "Explain the difference between Multithreading and Multiprocessing in Python. When would you choose one over the other in production?",
                "context_hint": "Discuss CPU-bound vs I/O-bound tasks, the Python Global Interpreter Lock (GIL), memory sharing vs process isolation, and the `multiprocessing` / `threading` / `asyncio` modules.",
                "code_starter": None,
                "evaluation_criteria": ["GIL Explanation", "I/O bound vs CPU bound", "Memory overhead differences", "Practical production use cases"]
            },
            {
                "question_id": 2,
                "question": "How does Retrieval-Augmented Generation (RAG) work under the hood, and how do you prevent vector search hallucination in production?",
                "context_hint": "Explain embedding generation, chunking strategies, cosine similarity / distance metrics, context stuffing, re-ranking (cross-encoders), and guardrails.",
                "code_starter": None,
                "evaluation_criteria": ["Dense Vector Embeddings", "Chunking Trade-offs", "Hybrid Keyword + Semantic Search", "Re-ranking & Evaluation Guardrails"]
            },
            {
                "question_id": 3,
                "question": "What is database connection pooling, and why is it crucial for high-concurrency async applications (e.g. FastAPI with PostgreSQL)?",
                "context_hint": "Address TCP handshake overhead, connection limits (max_connections), pool sizing, and avoiding thread-starvation.",
                "code_starter": None,
                "evaluation_criteria": ["TCP Handshake Cost", "Max Connections Management", "Async Pool Sizing", "Resource Leaks Prevention"]
            }
        ]

    def evaluate_interview_answer(self, question: str, candidate_answer: str, interview_type: str = "Technical", audio_duration: float = 0.0) -> Dict[str, Any]:
        answer_len = len(candidate_answer.strip().split())
        
        if answer_len < 10:
            tech_acc = 35.0
            comm = 40.0
            comp = 30.0
            conf = 35.0
            pos = "You attempted to answer the prompt directly."
            imp = "Your response is very brief. Expand with concrete technical mechanisms, trade-offs, and production examples."
            ideal = "Provide a comprehensive answer covering core concepts, real-world trade-offs, and specific tools or metrics."
            adaptive_diff = "Easy"
            star_check = {"Situation": False, "Task": False, "Action": False, "Result": False}
        else:
            has_keywords = any(w in candidate_answer.lower() for w in ["gil", "cpu", "io", "thread", "memory", "async", "latency", "vector", "cache", "scale", "star", "result"])
            tech_acc = round(min(96.0, 72.0 + (answer_len * 0.2) + (10.0 if has_keywords else 0.0)), 1)
            comm = round(min(94.0, 75.0 + (answer_len * 0.15)), 1)
            comp = round(min(92.0, 70.0 + (answer_len * 0.2)), 1)
            conf = round(min(95.0, 80.0 + (5.0 if answer_len > 30 else -5.0)), 1)
            
            star_check = {
                "Situation": any(w in candidate_answer.lower() for w in ["when", "project", "client", "team", "situation"]),
                "Task": any(w in candidate_answer.lower() for w in ["needed", "goal", "responsible", "task", "objective"]),
                "Action": any(w in candidate_answer.lower() for w in ["implemented", "built", "decided", "migrated", "refactored", "action"]),
                "Result": any(w in candidate_answer.lower() for w in ["reduced", "improved", "increased", "%", "outcome", "result", "success"])
            }

            pos = "Solid technical articulation! You clearly identified the primary operational concepts and demonstrated practical awareness."
            imp = "To reach top 1% score, reinforce with quantitative production benchmarks (e.g. latency, throughput) and mention architectural trade-offs."
            ideal = "An outstanding answer clearly explains the underlying mechanics (e.g., GIL impact, process memory boundaries), followed by a rule of thumb for when to use each approach in production systems."
            adaptive_diff = "Hard" if tech_acc >= 85 else "Medium"

        overall = round((tech_acc * 0.4) + (comm * 0.25) + (comp * 0.2) + (conf * 0.15), 1)

        return {
            "overall_score": overall,
            "technical_accuracy": tech_acc,
            "communication": comm,
            "completeness": comp,
            "confidence_indicators": conf,
            "star_breakdown": star_check if interview_type == "Behavioral STAR" else None,
            "positive_feedback": pos,
            "areas_for_improvement": imp,
            "suggested_ideal_answer": ideal,
            "adaptive_next_difficulty": adaptive_diff
        }

    def generate_interview_scorecard(self, transcripts: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not transcripts:
            acc, comm, comp, conf = 80.0, 75.0, 77.0, 80.0
            overall = 78.0
        else:
            acc = round(sum(t.get("scores", {}).get("technical_accuracy", 75.0) for t in transcripts) / len(transcripts), 1)
            comm = round(sum(t.get("scores", {}).get("communication", 75.0) for t in transcripts) / len(transcripts), 1)
            comp = round(sum(t.get("scores", {}).get("completeness", 75.0) for t in transcripts) / len(transcripts), 1)
            conf = round(sum(t.get("scores", {}).get("confidence_indicators", 75.0) for t in transcripts) / len(transcripts), 1)
            overall = round((acc * 0.4) + (comm * 0.25) + (comp * 0.2) + (conf * 0.15), 1)

        strengths = [
            "Clear and articulate technical explanation of backend data structures.",
            "Demonstrated solid awareness of async execution paradigms and resource pooling.",
            "Structured response format with logical flow and concise delivery."
        ]

        weaknesses = [
            "System design questions could benefit from deeper exploration of cache invalidation strategies.",
            "Need more explicit quantification of engineering business impact (e.g. latency, error budgets)."
        ]

        feedback = [
            "Lead with high-level architecture before diving into code-level implementation details.",
            "Practice the STAR framework on behavioral questions to consistently land high impact ratings."
        ]

        seven_day_plan = [
            {"day": "Day 1", "focus": "AsyncIO & Concurrency Internals", "action": "Solve 3 async event loop exercises and review connection pool sizing."},
            {"day": "Day 2", "focus": "Vector DBs & RAG Architecture", "action": "Build a mini hybrid search script combining BM25 and pgvector cosine similarity."},
            {"day": "Day 3", "focus": "System Design: Caching & Sharding", "action": "Draft architecture diagrams for a multi-tier cache with Redis cache-aside & write-through."},
            {"day": "Day 4", "focus": "Database Query Optimization", "action": "Analyze EXPLAIN ANALYZE query plans and index selection in PostgreSQL."},
            {"day": "Day 5", "focus": "STAR Behavioral Sprints", "action": "Record 4 voice responses to conflict resolution and outage management prompts."},
            {"day": "Day 6", "focus": "Full Mock Technical Interview", "action": "Execute a timed 45-minute simulation under Hard difficulty."},
            {"day": "Day 7", "focus": "Readiness Assessment & Polish", "action": "Review scorecard analytics and generate final targeted resume version."}
        ]

        return {
            "overall_score": overall,
            "technical_accuracy": acc,
            "communication": comm,
            "completeness": comp,
            "confidence": conf,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "actionable_feedback": feedback,
            "seven_day_plan": seven_day_plan
        }

ai_engine = AIEngine()
