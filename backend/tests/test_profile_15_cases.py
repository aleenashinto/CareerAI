import sys
import os
sys.path.insert(0, os.path.abspath("."))

from app.services.profile_service import ProfileService

def run_all_15_profile_tests():
    print("=" * 65)
    print("RUNNING CAREERAI 15 CANDIDATE PROFILE REGRESSION TEST CASES")
    print("=" * 65)
    
    ps = ProfileService()
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

    # TC-PROF-001: Get candidate profile
    p1 = ps.get_profile(1)
    assert_test("TC-PROF-001", "Fetch candidate profile", p1 is not None and p1["full_name"] == "Aleena Mathew")

    # TC-PROF-002: Update basic info with valid data
    s2, _ = ps.update_basic_info(1, {"headline": "Lead AI Architect", "location": "Bangalore / Remote"})
    assert_test("TC-PROF-002", "Update basic info valid data", s2 and ps.profiles[1]["headline"] == "Lead AI Architect")

    # TC-PROF-003: Update basic info with empty name rejected
    s3, m3 = ps.update_basic_info(1, {"full_name": ""})
    assert_test("TC-PROF-003", "Empty full name rejected", not s3 and "empty" in m3)

    # TC-PROF-004: Add education record with valid years
    s4, _ = ps.add_education(1, {"degree": "M.S. in Artificial Intelligence", "institution": "Stanford Online", "start_year": 2024, "end_year": 2026})
    assert_test("TC-PROF-004", "Add valid education record", s4 and len(ps.profiles[1]["educations"]) == 2)

    # TC-PROF-005: Add education with invalid year order rejected
    s5, m5 = ps.add_education(1, {"degree": "B.S.", "institution": "Univ", "start_year": 2024, "end_year": 2020})
    assert_test("TC-PROF-005", "Invalid graduation year order rejected", not s5 and "earlier" in m5)

    # TC-PROF-006: Add work experience record
    s6, _ = ps.add_experience(1, {"role": "Senior AI Engineer", "company": "ScaleAI Lab", "start_date": "2024-01", "is_current": True})
    assert_test("TC-PROF-006", "Add valid work experience", s6 and len(ps.profiles[1]["experiences"]) == 2)

    # TC-PROF-007: Add work experience with missing company rejected
    s7, m7 = ps.add_experience(1, {"role": "Senior Engineer", "start_date": "2024-01"})
    assert_test("TC-PROF-007", "Missing experience company rejected", not s7 and "mandatory" in m7)

    # TC-PROF-008: Update skills with valid scores
    s8, _ = ps.update_skills(1, {"Python": 95, "FastAPI": 90, "pgvector": 85})
    assert_test("TC-PROF-008", "Update verified skills valid", s8 and ps.profiles[1]["skills"]["Python"] == 95)

    # TC-PROF-009: Update skills with out-of-bound score rejected
    s9, m9 = ps.update_skills(1, {"Python": 150})
    assert_test("TC-PROF-009", "Out-of-bound skill score (>100) rejected", not s9 and "between 0 and 100" in m9)

    # TC-PROF-010: Add portfolio project with valid repo URL
    s10, _ = ps.add_project(1, {"title": "Autonomous Agent Swarm", "description": "Multi-agent LangGraph system", "github_url": "https://github.com/careerai/swarm"})
    assert_test("TC-PROF-010", "Add project with valid repository link", s10 and len(ps.profiles[1]["projects"]) == 2)

    # TC-PROF-011: Add project with malformed URL rejected
    s11, m11 = ps.add_project(1, {"title": "Bad Project", "description": "desc", "github_url": "invalid_url_no_http"})
    assert_test("TC-PROF-011", "Malformed project URL rejected", not s11 and "valid HTTP" in m11)

    # TC-PROF-012: Add verified certification
    s12, _ = ps.add_certification(1, {"name": "Deep Learning Specialization", "issuer": "DeepLearning.AI"})
    assert_test("TC-PROF-012", "Add professional certification", s12 and len(ps.profiles[1]["certifications"]) == 2)

    # TC-PROF-013: Profile completion score recalculation
    score13 = ps.calculate_completion_score(ps.profiles[1])
    assert_test("TC-PROF-013", "Calculate profile completion index", score13 >= 90.0)

    # TC-PROF-014: Update privacy controls (recruiter visibility)
    s14, _ = ps.update_privacy_settings(1, {"profile_visible_to_recruiters": False, "hide_contact_info": True})
    assert_test("TC-PROF-014", "Update recruiter privacy settings", s14 and not ps.profiles[1]["privacy_settings"]["profile_visible_to_recruiters"])

    # TC-PROF-015: GDPR data portability export & deletion
    export15 = ps.export_profile_data(1)
    del15 = ps.delete_profile_data(1)
    p15_after = ps.get_profile(1)
    assert_test("TC-PROF-015", "GDPR profile data export & deletion", export15 is not None and del15 and p15_after is None)

    print("=" * 65)
    print(f"SUMMARY: {passed} / 15 PROFILE TEST CASES PASSED ({failed} FAILED)")
    print("=" * 65)

if __name__ == "__main__":
    run_all_15_profile_tests()
