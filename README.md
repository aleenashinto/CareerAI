# CareerAI — AI Career Intelligence Platform & Multi-Tenant SaaS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![Tests Passing](https://img.shields.io/badge/Tests-210%20%2F%20210%20Passed-brightgreen.svg)]()

> **CareerAI** is a complete, commercial-grade **AI Career Operating System & Multi-Tenant SaaS Platform**. It guides users from career discovery → ATS-optimized resume tailoring → skill gap analysis → job application CRM → adaptive AI mock interviews → real-time performance analytics.

---

## 🌟 Key Pillars & Features

### 1. 🧠 AI Career Brain & Decision Simulator
- **7-Category Readiness Index**: Technical Skills (88%), Resume Quality (92%), Demonstrated Projects (78%), Mock Interview Performance (74%), Career Clarity (81%), Job Alignment (86%), and Profile Completeness (90%).
- **Score Boosters**: Actionable point-gain tasks (`+3 pts` for Coding, `+5 pts` for System Design).
- **Career Path Decision Simulator**: Side-by-side transition blueprint comparing **Python Backend Developer** (91.5% match, ₹16L-₹24L) vs. **AI Engineer** (74.0% match, ₹22L-₹35L).
- **10-Minute Daily Career Training**: Habit-forming micro-lessons, STAR behavioral quick-fire drills, and streak tracking (**18 Days 🔥**).
- **Grounded AI Career Coach**: Context-aware career advice with strict no-fabrication guardrails.

### 2. 📄 ATS Resume Studio & Truth Guard
- **Deep Keyword Match & Diagnostics**: Transparent match scoring and missing quantified impact detection.
- **Truthful Bullet Upgrades**: Generates STAR-syntax bullets without inventing false degrees, titles, or metrics.
- **Version Control & Conversion Telemetry**: Tracks interview callback rates across tailored resume versions (`v_ai_engineer` @ 50% callback rate).
- **"Should I Apply?" Advisor**: Objective JD analysis with clear `APPLY` / `UPSKILL FIRST` verdicts.

### 3. 🎙️ Adaptive AI Voice & Coding Interview Arena
- **Web Speech Voice Studio**: Real-time voice reading and speech-to-text transcription.
- **Dynamic Difficulty Adaptation**: Real-time question difficulty adjustment (`Easy` → `Medium` → `Hard`).
- **In-Browser Live Coding Sandbox**: Python execution environment with test cases and algorithmic complexity analysis.
- **7-Day Corrective Sprint Generator**: Instant tailored post-interview improvement schedule.

### 4. 👥 Multi-Tenant Persona Portals (RBAC)
- **Candidate Portal**: Full Career Operating System suite.
- **College / Institution Placement SaaS**: 1,250-student cohort readiness radar, stream analytics, and placement drive planning.
- **Recruiter Hiring Suite**: Verified candidate talent pool search, automated shortlisting, and screening velocity tracker (1.2 hrs).
- **Platform Admin & LLMOps Hub**: Real-time MRR analytics (**₹18.4 Lakhs MRR**) and automated AI benchmarks (sub-250ms latency, 0.1% error rate).

---

## 🏗️ Tech Stack & Architecture

- **Backend**: Python 3.11, FastAPI, Async SQLAlchemy, SQLite (Dev) / PostgreSQL + pgvector (Prod), Pydantic v2.
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Lucide Icons, Glassmorphism UI.
- **AI & Evaluation**: Groq API, Google Gemini, OpenAI, Multi-Agent Orchestration.
- **Testing**: 210 Comprehensive Automated Regression Tests (100% Pass Rate).

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Swagger API Docs will be live at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Web Application will be live at: `http://localhost:5173`

---

## 🧪 Automated Test Suite (210/210 Passing)

Run the full test suite:
```bash
cd backend
.\venv\Scripts\python.exe -c "
import glob, subprocess
for t in sorted(glob.glob('tests/test_*_cases*.py')):
    res = subprocess.run(['.\\venv\\Scripts\\python.exe', t], capture_output=True, text=True)
    print(f'[{res.returncode == 0 and \"PASS\" or \"FAIL\"}] {t}')
"
```

| Module | Test Cases | Pass Rate |
| :--- | :---: | :---: |
| 1. Authentication Engine | 20 | 100% |
| 2. Authorization & RBAC | 20 | 100% |
| 3. Candidate Profile Module | 15 | 100% |
| 4. Resume Module & ATS Engine | 20 | 100% |
| 5. Application Tracking & Copilot | 15 | 100% |
| 6. AI Mock Interview & Sandbox | 20 | 100% |
| 7. Skill Gap & Career Roadmap | 15 | 100% |
| 8. AI Career Coach & Intelligence | 15 | 100% |
| 9. Subscription, Payments & Billing | 15 | 100% |
| 10. Notifications & Communication | 15 | 100% |
| 11. Admin Dashboard & Platform | 20 | 100% |
| 12. Recruiter Portal & Sourcing | 20 | 100% |
| **TOTAL** | **210** | **100%** |

---

## 📄 License
This project is licensed under the MIT License.
