import sys
import os
sys.path.insert(0, os.path.abspath("."))

from app.services.auth_service import AuthService

def run_all_20_auth_tests():
    print("=" * 65)
    print("RUNNING CAREERAI 20 AUTHENTICATION REGRESSION TEST CASES")
    print("=" * 65)
    
    auth = AuthService()
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

    # TC-AUTH-001: Signup with valid details
    s1, m1, d1 = auth.signup("Aleena Mathew", "newuser@example.com", "CareerAI@2026Secure", "CareerAI@2026Secure", True)
    assert_test("TC-AUTH-001", "Signup with valid details", s1 and "newuser@example.com" in auth.users)

    # TC-AUTH-002: Signup with existing email
    s2, m2, d2 = auth.signup("Duplicate User", "testuser@example.com", "CareerAI@2026Secure", "CareerAI@2026Secure", True)
    assert_test("TC-AUTH-002", "Signup with existing email rejected", not s2 and "already exists" in m2)

    # TC-AUTH-003: Signup with invalid email
    s3, m3, d3 = auth.signup("Invalid Email", "user@", "CareerAI@2026Secure", "CareerAI@2026Secure", True)
    assert_test("TC-AUTH-003", "Signup with invalid email rejected", not s3 and "format" in m3)

    # TC-AUTH-004: Signup with weak password
    s4, m4, d4 = auth.signup("Weak Pass", "weak@example.com", "123456", "123456", True)
    assert_test("TC-AUTH-004", "Signup with weak password rejected", not s4 and "8 characters" in m4)

    # TC-AUTH-005: Signup with mismatched passwords
    s5, m5, d5 = auth.signup("Mismatch", "mismatch@example.com", "CareerAI@2026", "CareerAI@2027", True)
    assert_test("TC-AUTH-005", "Signup with mismatched passwords rejected", not s5 and "do not match" in m5)

    # TC-AUTH-006: Signup without accepting Terms
    s6, m6, d6 = auth.signup("No Terms", "noterms@example.com", "CareerAI@2026Secure", "CareerAI@2026Secure", False)
    assert_test("TC-AUTH-006", "Signup without accepting Terms rejected", not s6 and "Terms" in m6)

    # TC-AUTH-007: Signup with empty fields
    s7, m7, d7 = auth.signup("", "", "", "", True)
    assert_test("TC-AUTH-007", "Signup with empty fields rejected", not s7 and "required" in m7)

    # TC-AUTH-008: Email verification with valid token
    s8, m8 = auth.verify_email("VALID_VERIFY_TOKEN")
    assert_test("TC-AUTH-008", "Email verification with valid token", s8 and auth.users["unverified@example.com"]["email_verified"])

    # TC-AUTH-009: Email verification with invalid token
    s9, m9 = auth.verify_email("INVALID_RANDOM_TOKEN_XYZ")
    assert_test("TC-AUTH-009", "Email verification with invalid token rejected", not s9 and "Invalid" in m9)

    # TC-AUTH-010: Expired verification token
    s10, m10 = auth.verify_email("EXPIRED_VERIFY_TOKEN")
    assert_test("TC-AUTH-010", "Expired verification token rejected", not s10 and "expired" in m10)

    # TC-AUTH-011: Resend verification email & rate limiting
    s11a, m11a = auth.resend_verification("unverified@example.com")
    s11b, m11b = auth.resend_verification("unverified@example.com")
    s11c, m11c = auth.resend_verification("unverified@example.com")
    assert_test("TC-AUTH-011", "Resend verification rate-limiting applied", s11a and not s11c and "Too many" in m11c)

    # TC-AUTH-012: Login with valid credentials
    s12, m12, d12 = auth.login("testuser@example.com", "CareerAI@2026Secure", "10.0.0.1")
    assert_test("TC-AUTH-012", "Login with valid credentials", s12 and d12 and "session_token" in d12)

    # TC-AUTH-013: Login with wrong password
    s13, m13, d13 = auth.login("testuser@example.com", "WrongPass123", "10.0.0.2")
    assert_test("TC-AUTH-013", "Login with wrong password rejected", not s13 and "Invalid authentication" in m13)

    # TC-AUTH-014: Login with unregistered email
    s14, m14, d14 = auth.login("nonexistent@example.com", "CareerAI@2026Secure", "10.0.0.3")
    assert_test("TC-AUTH-014", "Login with unregistered email rejected generic", not s14 and "Invalid authentication" in m14)

    # TC-AUTH-015: Login with unverified account
    auth.users["unverified2@example.com"] = {
        "id": 99,
        "name": "Unverified 2",
        "email": "unverified2@example.com",
        "password_hash": auth._hash_password("CareerAI@2026Secure"),
        "email_verified": False,
        "role": "candidate",
        "is_active": True
    }
    s15, m15, d15 = auth.login("unverified2@example.com", "CareerAI@2026Secure", "10.0.0.4")
    assert_test("TC-AUTH-015", "Login with unverified account requires verification", not s15 and d15.get("requires_verification"))

    # TC-AUTH-016: Forgot password request
    s16, m16, token16 = auth.request_password_reset("testuser@example.com")
    assert_test("TC-AUTH-016", "Forgot password request accepted safely", s16 and token16 is not None)

    # TC-AUTH-017: Reset password with valid token
    s17, m17 = auth.reset_password("VALID_RESET_TOKEN", "CareerAI@2027NewSecure", "CareerAI@2027NewSecure")
    s17_login_old, _, _ = auth.login("testuser@example.com", "CareerAI@2026Secure", "10.0.0.5")
    s17_login_new, _, _ = auth.login("testuser@example.com", "CareerAI@2027NewSecure", "10.0.0.5")
    assert_test("TC-AUTH-017", "Reset password updates password & invalidates old", s17 and not s17_login_old and s17_login_new)

    # TC-AUTH-018: Reset password with expired/used token
    s18a, m18a = auth.reset_password("EXPIRED_RESET_TOKEN", "CareerAI@2027NewSecure", "CareerAI@2027NewSecure")
    s18b, m18b = auth.reset_password("USED_RESET_TOKEN", "CareerAI@2027NewSecure", "CareerAI@2027NewSecure")
    assert_test("TC-AUTH-018", "Reset password with expired/used token rejected", not s18a and not s18b)

    # TC-AUTH-019: Logout and session invalidation
    _, _, d19 = auth.login("testuser@example.com", "CareerAI@2027NewSecure", "10.0.0.6")
    sess_token = d19["session_token"]
    user_before = auth.validate_session(sess_token)
    s19, _ = auth.logout(sess_token)
    user_after = auth.validate_session(sess_token)
    assert_test("TC-AUTH-019", "Logout and session invalidation", user_before is not None and s19 and user_after is None)

    # TC-AUTH-020: Brute-force & Rate-limiting protection
    ip = "192.168.1.100"
    for _ in range(5):
        auth.login("testuser@example.com", "BadPass", ip)
    s20, m20, _ = auth.login("testuser@example.com", "CareerAI@2027NewSecure", ip)
    assert_test("TC-AUTH-020", "Brute-force protection throttles repeated attempts", not s20 and "throttled" in m20)

    print("=" * 65)
    print(f"SUMMARY: {passed} / 20 TEST CASES PASSED ({failed} FAILED)")
    print("=" * 65)

if __name__ == "__main__":
    run_all_20_auth_tests()
