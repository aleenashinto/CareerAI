# Complete Security & Authentication Service with Hashing, Tokens, Rate-limiting and Validation
import hashlib
import secrets
import datetime
import re
from typing import Dict, Optional, Tuple, Any

class AuthService:
    def __init__(self):
        # In-memory auth simulation store & rate-limit tracker for high-performance security verification
        self.users: Dict[str, Dict[str, Any]] = {
            "testuser@example.com": {
                "id": 1,
                "name": "Aleena Mathew",
                "email": "testuser@example.com",
                "password_hash": self._hash_password("CareerAI@2026Secure"),
                "email_verified": True,
                "role": "candidate",
                "is_active": True,
                "created_at": datetime.datetime.utcnow()
            },
            "unverified@example.com": {
                "id": 2,
                "name": "Unverified User",
                "email": "unverified@example.com",
                "password_hash": self._hash_password("CareerAI@2026Secure"),
                "email_verified": False,
                "role": "candidate",
                "is_active": True,
                "created_at": datetime.datetime.utcnow()
            }
        }
        self.verification_tokens: Dict[str, Dict[str, Any]] = {
            "VALID_VERIFY_TOKEN": {
                "email": "unverified@example.com",
                "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                "used": False
            },
            "EXPIRED_VERIFY_TOKEN": {
                "email": "unverified@example.com",
                "expires_at": datetime.datetime.utcnow() - datetime.timedelta(hours=1),
                "used": False
            }
        }
        self.reset_tokens: Dict[str, Dict[str, Any]] = {
            "VALID_RESET_TOKEN": {
                "email": "testuser@example.com",
                "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
                "used": False
            },
            "EXPIRED_RESET_TOKEN": {
                "email": "testuser@example.com",
                "expires_at": datetime.datetime.utcnow() - datetime.timedelta(hours=1),
                "used": False
            },
            "USED_RESET_TOKEN": {
                "email": "testuser@example.com",
                "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
                "used": True
            }
        }
        self.active_sessions: Dict[str, str] = {} # session_token -> email
        self.login_attempts: Dict[str, List[datetime.datetime]] = {} # ip/email -> timestamps
        self.resend_attempts: Dict[str, List[datetime.datetime]] = {}

    def _hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    def validate_email(self, email: str) -> bool:
        if not email or "@" not in email:
            return False
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        return bool(re.match(pattern, email.strip()))

    def validate_password_strength(self, password: str) -> Tuple[bool, str]:
        if len(password) < 8:
            return False, "Password must be at least 8 characters long."
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter."
        if not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter."
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one digit."
        return True, "Password is secure."

    def check_login_rate_limit(self, identifier: str) -> bool:
        now = datetime.datetime.utcnow()
        attempts = self.login_attempts.get(identifier, [])
        # Keep attempts in last 5 minutes
        recent = [t for t in attempts if (now - t).total_seconds() < 300]
        self.login_attempts[identifier] = recent
        if len(recent) >= 5:
            return False # Rate limit triggered
        return True

    def record_login_attempt(self, identifier: str):
        attempts = self.login_attempts.get(identifier, [])
        attempts.append(datetime.datetime.utcnow())
        self.login_attempts[identifier] = attempts

    def signup(self, name: str, email: str, password: str, confirm_password: str, terms_accepted: bool) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        if not name or not email or not password or not confirm_password:
            return False, "All fields are required.", None
        if not terms_accepted:
            return False, "Terms of Service must be accepted.", None
        if not self.validate_email(email):
            return False, "Invalid email address format.", None
        if password != confirm_password:
            return False, "Passwords do not match.", None
        
        is_strong, msg = self.validate_password_strength(password)
        if not is_strong:
            return False, msg, None

        norm_email = email.strip().lower()
        if norm_email in self.users:
            return False, "An account with this email address already exists.", None

        # Create user
        user_id = len(self.users) + 1
        user_record = {
            "id": user_id,
            "name": name.strip(),
            "email": norm_email,
            "password_hash": self._hash_password(password),
            "email_verified": False,
            "role": "candidate",
            "is_active": True,
            "created_at": datetime.datetime.utcnow()
        }
        self.users[norm_email] = user_record

        # Generate verification token
        verify_token = f"verify_{secrets.token_hex(16)}"
        self.verification_tokens[verify_token] = {
            "email": norm_email,
            "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            "used": False
        }

        return True, "Account created successfully. Verification email sent.", {
            "user_id": user_id,
            "email": norm_email,
            "verification_token": verify_token
        }

    def verify_email(self, token: str) -> Tuple[bool, str]:
        token_data = self.verification_tokens.get(token)
        if not token_data:
            return False, "Invalid or unrecognized verification token."
        if token_data["used"]:
            return False, "This verification token has already been used."
        if datetime.datetime.utcnow() > token_data["expires_at"]:
            return False, "Verification link has expired. Please request a new verification email."

        email = token_data["email"]
        if email in self.users:
            self.users[email]["email_verified"] = True
            token_data["used"] = True
            return True, "Email successfully verified. You can now access your dashboard."
        return False, "User account not found."

    def resend_verification(self, email: str) -> Tuple[bool, str]:
        norm_email = email.strip().lower()
        now = datetime.datetime.utcnow()
        attempts = self.resend_attempts.get(norm_email, [])
        recent = [t for t in attempts if (now - t).total_seconds() < 60]
        self.resend_attempts[norm_email] = recent

        if len(recent) >= 2:
            return False, "Too many resend requests. Please wait a minute before trying again."

        attempts.append(now)
        self.resend_attempts[norm_email] = attempts

        if norm_email not in self.users:
            return True, "If an account exists, a verification link has been dispatched."

        verify_token = f"verify_{secrets.token_hex(16)}"
        self.verification_tokens[verify_token] = {
            "email": norm_email,
            "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            "used": False
        }
        return True, "New verification email dispatched successfully."

    def login(self, email: str, password: str, client_ip: str = "127.0.0.1") -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        if not self.check_login_rate_limit(client_ip):
            return False, "Too many login attempts. Requests throttled for 5 minutes.", None

        norm_email = email.strip().lower() if email else ""
        user = self.users.get(norm_email)
        
        if not user or user["password_hash"] != self._hash_password(password):
            self.record_login_attempt(client_ip)
            return False, "Invalid authentication credentials.", None

        if not user["email_verified"]:
            return False, "Please verify your email address before accessing protected services.", {"requires_verification": True, "email": norm_email}

        session_token = f"sess_{secrets.token_hex(24)}"
        self.active_sessions[session_token] = norm_email

        return True, "Authentication successful.", {
            "session_token": session_token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }

    def request_password_reset(self, email: str) -> Tuple[bool, str, Optional[str]]:
        norm_email = email.strip().lower()
        reset_token = f"reset_{secrets.token_hex(16)}"
        
        if norm_email in self.users:
            self.reset_tokens[reset_token] = {
                "email": norm_email,
                "expires_at": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
                "used": False
            }
        # Generic response to prevent email enumeration
        return True, "If this email is registered, a password reset link has been sent.", reset_token

    def reset_password(self, token: str, new_password: str, confirm_password: str) -> Tuple[bool, str]:
        token_data = self.reset_tokens.get(token)
        if not token_data:
            return False, "Invalid password reset token."
        if token_data["used"]:
            return False, "This password reset token has already been consumed."
        if datetime.datetime.utcnow() > token_data["expires_at"]:
            return False, "Password reset token has expired. Please request a new reset link."

        if new_password != confirm_password:
            return False, "Passwords do not match."
        
        is_strong, msg = self.validate_password_strength(new_password)
        if not is_strong:
            return False, msg

        email = token_data["email"]
        if email in self.users:
            self.users[email]["password_hash"] = self._hash_password(new_password)
            token_data["used"] = True
            # Invalidate all existing sessions for security
            self.active_sessions = {k: v for k, v in self.active_sessions.items() if v != email}
            return True, "Password has been updated successfully. You can now login."
        return False, "User account not found."

    def logout(self, session_token: str) -> Tuple[bool, str]:
        if session_token in self.active_sessions:
            del self.active_sessions[session_token]
            return True, "Session successfully invalidated."
        return False, "Invalid or already expired session token."

    def validate_session(self, session_token: str) -> Optional[Dict[str, Any]]:
        email = self.active_sessions.get(session_token)
        if not email:
            return None
        user = self.users.get(email)
        return user

auth_service = AuthService()
