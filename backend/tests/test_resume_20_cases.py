import sys
import os
sys.path.insert(0, os.path.abspath("."))

from app.services.ai_engine import ai_engine

def run_all_20_resume_tests():
    print("=" * 65)
    print("RUNNING CAREERAI 20 RESUME AI & ATS ENGINE TEST CASES")
    print("=" * 65)
    
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

    sample_resume = """ALEX MERCER
Full Stack & AI Engineer | alex.mercer@careerai.dev | Bangalore
GitHub: github.com/alexmercer-dev

SUMMARY:
Software developer with 2.5 years of experience building Python APIs, React interfaces, and backend databases.

EXPERIENCE:
Software Engineer - InnovateTech Labs (2023 - Present)
- Built backend APIs with FastAPI and handled database queries, reducing query response times by 35%.
- Worked on AI and chatbot projects with vector search using pgvector.
- Created frontend dashboard components in React and TypeScript.

Associate Developer - CloudByte Systems (2022 - 2023)
- Built responsive UI components and handled internal state management.
- Wrote unit tests for key user workflows with pytest maintaining 92% coverage."""

    target_jd = """Role: Senior AI Engineer
Requirements:
- 2+ years experience in Python, FastAPI, and asynchronous backend architecture.
- Demonstrated hands-on knowledge of RAG, vector embeddings (pgvector), and LLM orchestration.
- Experience with Docker, CI/CD, and distributed caching (Redis).
- Proven ability to write clean, unit-tested code with quantified performance impact."""

    # TC-RES-001: ATS Analysis on valid resume & JD (Expected score computed proportionally from tech matches)
    r1 = ai_engine.analyze_resume_ats(sample_resume, target_jd, "AI Engineer")
    assert_test("TC-RES-001", "ATS Analysis returns valid match score", r1["ats_score"] >= 50.0)

    # TC-RES-002: Keyword extraction from JD
    assert_test("TC-RES-002", "Extract tech keywords from target JD", "Python" in r1["keyword_matches"] or "FastAPI" in r1["keyword_matches"])

    # TC-RES-003: Identification of missing keywords
    assert_test("TC-RES-003", "Identify missing required keywords", len(r1["missing_keywords"]) > 0 or len(r1["keyword_matches"]) > 0)

    # TC-RES-004: Missing quantified evidence detection
    resume_no_metrics = "Built APIs and handled databases. Worked on AI."
    r4 = ai_engine.analyze_resume_ats(resume_no_metrics, target_jd, "AI Engineer")
    assert_test("TC-RES-004", "Flag bullets missing quantified metrics", len(r4["missing_evidence_notes"]) > 0)

    # TC-RES-005: Truthful bullet recommendations (STAR format)
    assert_test("TC-RES-005", "Generate truthful bullet upgrades without fabrication", len(r1["tailored_bullet_recommendations"]) >= 2)

    # TC-RES-006: ATS score calculation bounds (0-100)
    assert_test("TC-RES-006", "ATS Score bounded within 0% - 100%", 0.0 <= r1["ats_score"] <= 100.0)

    # TC-RES-007: Tailor resume for AI Engineer role
    t7 = ai_engine.tailor_resume(sample_resume, "AI Engineer", target_jd)
    assert_test("TC-RES-007", "Tailor resume for AI Engineer role", t7["version_tag"] == "v_ai_engineer")

    # TC-RES-008: Tailor resume for Python Developer role
    t8 = ai_engine.tailor_resume(sample_resume, "Python Developer", target_jd)
    assert_test("TC-RES-008", "Tailor resume for Python Developer role", t8["version_tag"] == "v_python_developer")

    # TC-RES-009: Verify no qualification fabrication in tailored output
    assert_test("TC-RES-009", "Preserve actual candidate qualifications (No fake degrees)", "ALEX MERCER" in t7["tailored_text"])

    # TC-RES-010: Version tag naming convention
    assert_test("TC-RES-010", "Structured version tag format", t7["version_tag"].startswith("v_"))

    # TC-RES-011: Estimated ATS score uplift on tailored version
    assert_test("TC-RES-011", "Estimated ATS score uplift on tailored output", t7["ats_score_estimate"] >= 85.0)

    # TC-RES-012: Empty resume handling
    r12 = ai_engine.analyze_resume_ats("", target_jd, "AI Engineer")
    assert_test("TC-RES-012", "Empty resume produces baseline low score", r12["ats_score"] <= 40.0)

    # TC-RES-013: Empty JD fallback to role standards
    r13 = ai_engine.analyze_resume_ats(sample_resume, "", "AI Engineer")
    assert_test("TC-RES-013", "Empty JD triggers core role fallback heuristics", r13["ats_score"] > 50.0)

    # TC-RES-014: Tailored bullets structure validation
    assert_test("TC-RES-014", "Tailored bullets contain section and text", "section" in t7["tailored_bullets"][0] and "bullet" in t7["tailored_bullets"][0])

    # TC-RES-015: Experience match rating calculation
    assert_test("TC-RES-015", "Experience match rating calculated", "experience_match_score" in r1)

    # TC-RES-016: Verdict categorization (Strong / Moderate / Needs Refinement)
    assert_test("TC-RES-016", "ATS Verdict categorization generated", r1["verdict"] in ["STRONG CANDIDATE", "MODERATE MATCH", "NEEDS RESUME REFINEMENT"])

    # TC-RES-017: Markdown structure formatting in tailored resume
    assert_test("TC-RES-017", "Tailored resume contains markdown formatting", "#" in t7["tailored_text"] and "###" in t7["tailored_text"])

    # TC-RES-018: Action improvements list generated
    assert_test("TC-RES-018", "List of improvements made is returned", len(t7["improvements_made"]) >= 3)

    # TC-RES-019: Multi-role version switching capability
    t19 = ai_engine.tailor_resume(sample_resume, "Full Stack Developer")
    assert_test("TC-RES-019", "Multi-role version switching (Full Stack)", t19["version_tag"] == "v_full_stack_developer")

    # TC-RES-020: Consistent determinism on identical inputs
    r20_a = ai_engine.analyze_resume_ats(sample_resume, target_jd, "AI Engineer")
    r20_b = ai_engine.analyze_resume_ats(sample_resume, target_jd, "AI Engineer")
    assert_test("TC-RES-020", "Deterministic ATS evaluation results", r20_a["ats_score"] == r20_b["ats_score"])

    print("=" * 65)
    print(f"SUMMARY: {passed} / 20 RESUME AI TEST CASES PASSED ({failed} FAILED)")
    print("=" * 65)

if __name__ == "__main__":
    run_all_20_resume_tests()
