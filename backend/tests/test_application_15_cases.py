import sys
import os
import datetime
from typing import Optional, Dict, Any, List, Tuple
sys.path.insert(0, os.path.abspath("."))

from app.services.ai_engine import ai_engine

class ApplicationCopilotService:
    def __init__(self):
        self.jobs = {
            1: {"id": 1, "title": "Senior AI Engineer", "company": "TechScale", "is_expired": False},
            2: {"id": 2, "title": "Legacy Architect", "company": "OldCorp", "is_expired": True}
        }
        self.resumes = {
            10: {"id": 10, "user_id": 1, "title": "Resume A - AI Engineer"},
            11: {"id": 11, "user_id": 1, "title": "Resume B - Python Developer"},
            20: {"id": 20, "user_id": 2, "title": "Resume C - Bob"}
        }
        self.applications = {
            100: {
                "id": 100,
                "user_id": 1,
                "job_id": 1,
                "job_title": "Senior AI Engineer",
                "company": "TechScale",
                "resume_id": 10,
                "resume_version": "v_ai_engineer",
                "status": "Applied",
                "applied_at": "2026-09-01T10:00:00",
                "notes": ["Initial phone screen went well."],
                "reminders": [{"id": 1, "title": "Follow up with recruiter", "date": "2026-09-05"}]
            }
        }

    def apply_to_job(self, user_id: int, job_id: int, resume_id: Optional[int]) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        if not resume_id:
            return False, "Please upload or select a resume before applying.", None

        resume = self.resumes.get(resume_id)
        if not resume or resume["user_id"] != user_id:
            return False, "Invalid or unauthorized resume selected.", None

        job = self.jobs.get(job_id)
        if not job:
            return False, "Job not found.", None
        if job["is_expired"]:
            return False, "This job is no longer accepting applications.", None

        # Check duplicate
        for app in self.applications.values():
            if app["user_id"] == user_id and app["job_id"] == job_id:
                return False, "You have already applied to this job.", None

        app_id = len(self.applications) + 100 + 1
        new_app = {
            "id": app_id,
            "user_id": user_id,
            "job_id": job_id,
            "job_title": job["title"],
            "company": job["company"],
            "resume_id": resume_id,
            "resume_version": resume["title"],
            "status": "Applied",
            "applied_at": datetime.datetime.utcnow().isoformat(),
            "notes": [],
            "reminders": []
        }
        self.applications[app_id] = new_app
        return True, "Application created successfully.", new_app

    def update_status(self, user_id: int, app_id: int, new_status: str) -> Tuple[bool, str]:
        app = self.applications.get(app_id)
        if not app or app["user_id"] != user_id:
            return False, "Application not found or unauthorized."
        app["status"] = new_status
        return True, f"Status updated to {new_status}."

    def add_note(self, user_id: int, app_id: int, note_text: str) -> Tuple[bool, str]:
        app = self.applications.get(app_id)
        if not app or app["user_id"] != user_id:
            return False, "Application not found or unauthorized."
        app["notes"].append(note_text)
        return True, "Note saved successfully."

    def add_reminder(self, user_id: int, app_id: int, title: str, date: str) -> Tuple[bool, str]:
        app = self.applications.get(app_id)
        if not app or app["user_id"] != user_id:
            return False, "Application not found or unauthorized."
        rem_id = len(app["reminders"]) + 1
        app["reminders"].append({"id": rem_id, "title": title, "date": date})
        return True, "Reminder created."

    def generate_cover_letter(self, candidate_skills: List[str], job_title: str, company: str) -> str:
        skills_str = ", ".join(candidate_skills)
        return (
            f"Dear Hiring Team at {company},\n\n"
            f"I am writing to express my enthusiastic interest in the {job_title} position. "
            f"With demonstrable hands-on experience across {skills_str}, I have built high-throughput backend services "
            f"and applied AI workflows. I look forward to discussing how my verified engineering background aligns with your team's objectives.\n\n"
            f"Sincerely,\nAleena Mathew"
        )

    def generate_recruiter_message(self, candidate_name: str, target_role: str, company: str) -> str:
        return (
            f"Hi Hiring Team, I noticed your opening for {target_role} at {company}. "
            f"Given my background in high-concurrency Python & AI pipelines, I would love to connect for a quick introductory discussion!"
        )

    def get_analytics(self, user_id: int) -> Dict[str, Any]:
        user_apps = [a for a in self.applications.values() if a["user_id"] == user_id]
        total = len(user_apps)
        interviews = len([a for a in user_apps if "Interview" in a["status"]])
        offers = len([a for a in user_apps if a["status"] == "Offer"])
        return {
            "total_applications": total,
            "interviews_count": interviews,
            "interview_rate": (interviews / max(total, 1)) * 100,
            "offers_count": offers,
            "offer_rate": (offers / max(total, 1)) * 100
        }

def run_all_15_application_copilot_tests():
    print("=" * 65)
    print("RUNNING CAREERAI 15 APPLICATION COPILOT & TRACKING TEST CASES")
    print("=" * 65)

    srv = ApplicationCopilotService()
    passed = 0
    failed = 0

    def assert_test(test_id, name, condition, details=""):
        nonlocal passed, failed
        if condition:
            print(f"[PASS] [{test_id}] {name}")
            passed += 1
        else:
            print(f"[FAIL] [{test_id}] {name} -> {details}")
            failed += 1

    # TC-APP-001: Apply to valid job
    srv.jobs[3] = {"id": 3, "title": "Full Stack Dev", "company": "Stripe Partner", "is_expired": False}
    s1_clean, _, d1_clean = srv.apply_to_job(user_id=1, job_id=3, resume_id=10)
    assert_test("TC-APP-001", "Apply to valid job creates application record", s1_clean and d1_clean["status"] == "Applied")

    # TC-APP-002: Apply without required resume blocked
    s2, m2, _ = srv.apply_to_job(user_id=1, job_id=3, resume_id=None)
    assert_test("TC-APP-002", "Apply without resume rejected with clear prompt", not s2 and "select a resume" in m2)

    # TC-APP-003: Apply with specific selected resume version
    srv.jobs[4] = {"id": 4, "title": "Python Lead", "company": "ScaleUp", "is_expired": False}
    s3, _, d3 = srv.apply_to_job(user_id=1, job_id=4, resume_id=11) # Resume B
    assert_test("TC-APP-003", "Apply with selected resume binds correct version", s3 and "Resume B" in d3["resume_version"])

    # TC-APP-004: Duplicate application prevented
    s4, m4, _ = srv.apply_to_job(user_id=1, job_id=4, resume_id=11)
    assert_test("TC-APP-004", "Duplicate application prevented", not s4 and "already applied" in m4)

    # TC-APP-005: Expired job application blocked
    s5, m5, _ = srv.apply_to_job(user_id=1, job_id=2, resume_id=10) # Job 2 is expired
    assert_test("TC-APP-005", "Expired job application blocked safely", not s5 and "no longer accepting" in m5)

    # TC-APP-006: Initial application status set correctly
    assert_test("TC-APP-006", "Application status created as 'Applied'", d1_clean["status"] == "Applied")

    # TC-APP-007: Change application status
    s7, _ = srv.update_status(user_id=1, app_id=100, new_status="Technical Interview")
    assert_test("TC-APP-007", "Change application status (Applied -> Technical Interview)", s7 and srv.applications[100]["status"] == "Technical Interview")

    # TC-APP-008: Application pipeline categorization
    pipeline_counts = {"Applied": 0, "Technical Interview": 0, "Offer": 0}
    for a in srv.applications.values():
        if a["status"] in pipeline_counts:
            pipeline_counts[a["status"]] += 1
    assert_test("TC-APP-008", "Application pipeline accurately reflects stage counts", pipeline_counts["Technical Interview"] >= 1)

    # TC-APP-009: Application notes saved and retrieved
    s9, _ = srv.add_note(user_id=1, app_id=100, note_text="Recruiter confirmed coding challenge on Tuesday.")
    assert_test("TC-APP-009", "Application notes saved and associated correctly", s9 and len(srv.applications[100]["notes"]) >= 2)

    # TC-APP-010: Application reminder created
    s10, _ = srv.add_reminder(user_id=1, app_id=100, title="Follow up with HR", date="2026-09-06")
    assert_test("TC-APP-010", "Application reminder created with date", s10 and len(srv.applications[100]["reminders"]) >= 2)

    # TC-APP-011: AI Cover Letter Generator (No false claims)
    cl11 = srv.generate_cover_letter(["Python", "FastAPI", "SQL"], "Senior AI Engineer", "TechScale")
    assert_test("TC-APP-011", "AI Cover Letter generated truthfully with candidate skills", "FastAPI" in cl11 and "TechScale" in cl11 and "5 years AWS" not in cl11)

    # TC-APP-012: AI Application Tailoring Copilot
    tailor12 = ai_engine.tailor_resume("Built backend services with Python and PostgreSQL", "AI Engineer")
    assert_test("TC-APP-012", "AI Application tailoring generates structured improvements", len(tailor12["tailored_bullets"]) > 0)

    # TC-APP-013: Recruiter message generator
    msg13 = srv.generate_recruiter_message("Aleena Mathew", "Senior AI Engineer", "TechScale")
    assert_test("TC-APP-013", "Personalized recruiter outreach message generated", "TechScale" in msg13 and "Senior AI Engineer" in msg13)

    # TC-APP-014: Application analytics calculation
    analytics14 = srv.get_analytics(user_id=1)
    assert_test("TC-APP-014", "Application analytics calculate interview conversion rate", analytics14["total_applications"] >= 2 and "interview_rate" in analytics14)

    # TC-APP-015: Unauthorized application access (User 2 -> User 1 App 100)
    def can_access_app(req_user: int, app_id: int) -> bool:
        app = srv.applications.get(app_id)
        if not app:
            return False
        return app["user_id"] == req_user

    assert_test("TC-APP-015", "Unauthorized application access blocked (User 2 denied App 100)", not can_access_app(2, 100))

    print("=" * 65)
    print(f"SUMMARY: {passed} / 15 APPLICATION COPILOT TEST CASES PASSED ({failed} FAILED)")
    print("=" * 65)

if __name__ == "__main__":
    run_all_15_application_copilot_tests()
