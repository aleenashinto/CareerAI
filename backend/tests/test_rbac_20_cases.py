import sys
import os
sys.path.insert(0, os.path.abspath("."))

from app.services.rbac_service import RBACService

def run_all_20_rbac_tests():
    print("=" * 65)
    print("RUNNING CAREERAI 20 AUTHORIZATION & RBAC REGRESSION TEST CASES")
    print("=" * 65)
    
    rbac = RBACService()
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

    # TC-RBAC-001: Candidate accesses own dashboard
    s1, _ = rbac.access_dashboard(user_id=1, dashboard_type="candidate")
    assert_test("TC-RBAC-001", "Candidate accesses own dashboard", s1)

    # TC-RBAC-002: Candidate accesses admin dashboard
    s2, m2 = rbac.access_dashboard(user_id=1, dashboard_type="admin")
    assert_test("TC-RBAC-002", "Candidate accesses admin dashboard denied", not s2 and "Forbidden" in m2)

    # TC-RBAC-003: Candidate accesses recruiter dashboard
    s3, m3 = rbac.access_dashboard(user_id=1, dashboard_type="recruiter")
    assert_test("TC-RBAC-003", "Candidate accesses recruiter dashboard denied", not s3 and "Forbidden" in m3)

    # TC-RBAC-004: Recruiter accesses recruiter dashboard
    s4, _ = rbac.access_dashboard(user_id=3, dashboard_type="recruiter")
    assert_test("TC-RBAC-004", "Recruiter accesses recruiter dashboard", s4)

    # TC-RBAC-005: Recruiter accesses admin dashboard
    s5, m5 = rbac.access_dashboard(user_id=3, dashboard_type="admin")
    assert_test("TC-RBAC-005", "Recruiter accesses admin dashboard denied", not s5 and "Forbidden" in m5)

    # TC-RBAC-006: Institution Admin accesses institution dashboard
    s6, _ = rbac.access_dashboard(user_id=4, dashboard_type="institution")
    assert_test("TC-RBAC-006", "Institution Admin accesses institution dashboard", s6)

    # TC-RBAC-007: Institution Admin accesses another institution's data (Tenant Isolation)
    s7, m7 = rbac.access_institution_data(user_id=4, target_org_id=202)
    assert_test("TC-RBAC-007", "Institution Admin accessing another institution denied", not s7 and "Tenant isolation" in m7)

    # TC-RBAC-008: Admin accesses user management permission
    s8 = rbac.has_permission(user_id=6, permission="manage_users")
    assert_test("TC-RBAC-008", "Admin has user management permission", s8)

    # TC-RBAC-009: Candidate accesses another candidate's profile/data
    s9, m9, _ = rbac.access_resume(user_id=1, resume_id=200) # Alice tries Bob's resume
    assert_test("TC-RBAC-009", "Candidate accessing another candidate data denied", not s9 and "Forbidden" in m9)

    # TC-RBAC-010: Candidate accesses another candidate's resume (IDOR/BOLA)
    s10, m10, _ = rbac.access_resume(user_id=2, resume_id=100) # Bob tries Alice's resume
    assert_test("TC-RBAC-010", "Candidate accessing another candidate resume denied", not s10 and "Forbidden" in m10)

    # TC-RBAC-011: Candidate modifies another user's resume
    s11, m11 = rbac.modify_resume(user_id=2, resume_id=100, new_title="Hacked Title")
    assert_test("TC-RBAC-011", "Candidate modifying another user's resume rejected", not s11 and rbac.resumes[100]["title"] != "Hacked Title")

    # TC-RBAC-012: Candidate deletes another user's account
    s12, m12 = rbac.delete_user_account(actor_user_id=1, target_user_id=2)
    assert_test("TC-RBAC-012", "Candidate deleting another user's account rejected", not s12 and 2 in rbac.users)

    # TC-RBAC-013: Recruiter accesses candidate pool permission
    s13 = rbac.has_permission(user_id=3, permission="view_candidate_pool")
    assert_test("TC-RBAC-013", "Recruiter has candidate pool permission", s13)

    # TC-RBAC-014: Candidate attempts to modify organization data
    s14, m14 = rbac.access_institution_data(user_id=1, target_org_id=201)
    assert_test("TC-RBAC-014", "Non-institution user accessing organization denied", not s14)

    # TC-RBAC-015: Admin changes user role
    s15, m15 = rbac.change_user_role(actor_user_id=6, target_user_id=2, new_role="recruiter")
    assert_test("TC-RBAC-015", "Admin updates user role successfully", s15 and rbac.users[2]["role"] == "recruiter")

    # TC-RBAC-016: Unauthorized user attempts role escalation
    s16, m16 = rbac.change_user_role(actor_user_id=1, target_user_id=1, new_role="admin")
    assert_test("TC-RBAC-016", "Candidate privilege escalation rejected", not s16 and rbac.users[1]["role"] == "candidate")

    # TC-RBAC-017: User modifies user ID in URL / parameter tampering (IDOR)
    s17, m17, _ = rbac.access_resume(user_id=1, resume_id=200)
    assert_test("TC-RBAC-017", "IDOR parameter tampering blocked", not s17)

    # TC-RBAC-018: Expired/invalid session accesses protected resource
    s18 = rbac.has_permission(user_id=999, permission="view_own_profile")
    assert_test("TC-RBAC-018", "Unknown user ID denied access", not s18)

    # TC-RBAC-019: Suspended user attempts login/API access
    s19, m19 = rbac.access_dashboard(user_id=8, dashboard_type="candidate")
    assert_test("TC-RBAC-019", "Suspended user access blocked immediately", not s19 and "suspended" in m19)

    # TC-RBAC-020: Super Admin accesses all administrative modules
    s20_a, _ = rbac.access_dashboard(user_id=7, dashboard_type="admin")
    s20_b, _ = rbac.access_dashboard(user_id=7, dashboard_type="recruiter")
    s20_c, _ = rbac.access_institution_data(user_id=7, target_org_id=201)
    assert_test("TC-RBAC-020", "Super Admin has universal access", s20_a and s20_b and s20_c)

    print("=" * 65)
    print(f"SUMMARY: {passed} / 20 RBAC TEST CASES PASSED ({failed} FAILED)")
    print("=" * 65)

if __name__ == "__main__":
    run_all_20_rbac_tests()
