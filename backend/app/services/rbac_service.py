# RBAC & Authorization Engine with Tenant Isolation, Object Ownership, and IDOR Guardrails
from typing import Dict, Any, Optional, Tuple, List

class RBACService:
    def __init__(self):
        # Role hierarchy & permissions matrix
        self.role_permissions: Dict[str, List[str]] = {
            "candidate": [
                "view_own_profile", "edit_own_profile", "create_resume", 
                "analyze_resume", "search_jobs", "view_own_applications", 
                "access_candidate_dashboard"
            ],
            "recruiter": [
                "view_own_profile", "edit_own_profile", "create_job", 
                "view_candidate_pool", "access_recruiter_dashboard", "manage_job_pipeline"
            ],
            "institution_admin": [
                "view_own_profile", "edit_own_profile", "manage_students", 
                "access_institution_dashboard", "view_institution_analytics"
            ],
            "admin": [
                "view_own_profile", "edit_own_profile", "create_resume", "analyze_resume",
                "search_jobs", "create_job", "view_candidate_pool", "manage_students",
                "manage_users", "manage_ai", "manage_billing", "change_user_role",
                "access_admin_dashboard"
            ],
            "super_admin": [
                "*" # Full system access across all tenants and administrative subsystems
            ]
        }

        # Mock database tables for RBAC & IDOR testing
        self.users: Dict[int, Dict[str, Any]] = {
            1: {"id": 1, "name": "Candidate Alice", "email": "alice@careerai.dev", "role": "candidate", "org_id": None, "is_active": True},
            2: {"id": 2, "name": "Candidate Bob", "email": "bob@careerai.dev", "role": "candidate", "org_id": None, "is_active": True},
            3: {"id": 3, "name": "Recruiter Rick", "email": "rick@techscale.com", "role": "recruiter", "org_id": 101, "is_active": True},
            4: {"id": 4, "name": "Dean Davis", "email": "davis@apexuniv.edu", "role": "institution_admin", "org_id": 201, "is_active": True},
            5: {"id": 5, "name": "Dean Evans", "email": "evans@otheruniv.edu", "role": "institution_admin", "org_id": 202, "is_active": True},
            6: {"id": 6, "name": "Platform Admin Alex", "email": "admin@careerai.dev", "role": "admin", "org_id": None, "is_active": True},
            7: {"id": 7, "name": "Super Admin Sarah", "email": "superadmin@careerai.dev", "role": "super_admin", "org_id": None, "is_active": True},
            8: {"id": 8, "name": "Suspended Sam", "email": "sam@careerai.dev", "role": "candidate", "org_id": None, "is_active": False}
        }

        self.resumes: Dict[int, Dict[str, Any]] = {
            100: {"id": 100, "owner_user_id": 1, "title": "Alice AI Engineer Resume", "content": "..."},
            200: {"id": 200, "owner_user_id": 2, "title": "Bob Fullstack Resume", "content": "..."}
        }

        self.applications: Dict[int, Dict[str, Any]] = {
            500: {"id": 500, "owner_user_id": 1, "job_title": "Senior AI Engineer", "company": "Anthropic Partner"},
            501: {"id": 501, "owner_user_id": 2, "job_title": "Frontend Lead", "company": "Stripe Partner"}
        }

        self.org_data: Dict[int, Dict[str, Any]] = {
            201: {"id": 201, "name": "Apex Engineering University", "students_count": 1250, "placement_drives": 8},
            202: {"id": 202, "name": "Other State Institute", "students_count": 800, "placement_drives": 3}
        }

    def has_permission(self, user_id: int, permission: str) -> bool:
        user = self.users.get(user_id)
        if not user or not user["is_active"]:
            return False
        role = user["role"]
        perms = self.role_permissions.get(role, [])
        if "*" in perms:
            return True
        return permission in perms

    def access_dashboard(self, user_id: int, dashboard_type: str) -> Tuple[bool, str]:
        user = self.users.get(user_id)
        if not user:
            return False, "User not found."
        if not user["is_active"]:
            return False, "Account suspended: Access blocked."

        role = user["role"]
        if role == "super_admin":
            return True, "Access granted."

        if dashboard_type == "candidate":
            if role in ["candidate", "admin"]:
                return True, "Access granted."
            return False, "Forbidden: Only candidates or authorized admins can access candidate dashboard."

        if dashboard_type == "recruiter":
            if role in ["recruiter", "admin"]:
                return True, "Access granted."
            return False, "Forbidden: Recruiter portal access required."

        if dashboard_type == "institution":
            if role in ["institution_admin", "admin"]:
                return True, "Access granted."
            return False, "Forbidden: Institution administration credentials required."

        if dashboard_type == "admin":
            if role in ["admin"]:
                return True, "Access granted."
            return False, "Forbidden: Administrative privileges required."

        return False, "Forbidden: Unknown dashboard type."

    def access_resume(self, user_id: int, resume_id: int) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        user = self.users.get(user_id)
        if not user or not user["is_active"]:
            return False, "Unauthorized", None

        resume = self.resumes.get(resume_id)
        if not resume:
            return False, "Resume not found.", None

        # Owner or Admin/SuperAdmin or authorized recruiter
        if resume["owner_user_id"] == user_id or user["role"] in ["admin", "super_admin"]:
            return True, "Access granted.", resume
        return False, "Forbidden: You do not have permission to access another candidate's resume.", None

    def modify_resume(self, user_id: int, resume_id: int, new_title: str) -> Tuple[bool, str]:
        can_access, msg, resume = self.access_resume(user_id, resume_id)
        if not can_access:
            return False, msg
        
        # Only owner or admin can mutate
        if resume["owner_user_id"] == user_id or self.users[user_id]["role"] in ["admin", "super_admin"]:
            resume["title"] = new_title
            return True, "Resume updated successfully."
        return False, "Forbidden: You cannot modify another candidate's resume."

    def access_institution_data(self, user_id: int, target_org_id: int) -> Tuple[bool, str]:
        user = self.users.get(user_id)
        if not user or not user["is_active"]:
            return False, "Unauthorized"

        if user["role"] in ["admin", "super_admin"]:
            return True, "Access granted."

        if user["role"] == "institution_admin":
            if user["org_id"] == target_org_id:
                return True, "Access granted."
            return False, "Forbidden: Tenant isolation violation. You cannot access another institution's data."

        return False, "Forbidden: Institution access required."

    def change_user_role(self, actor_user_id: int, target_user_id: int, new_role: str) -> Tuple[bool, str]:
        actor = self.users.get(actor_user_id)
        if not actor or not actor["is_active"]:
            return False, "Unauthorized"

        # Only admin/super_admin can change roles
        if actor["role"] not in ["admin", "super_admin"]:
            return False, "Forbidden: Only platform admins can perform role escalation or modification."

        target = self.users.get(target_user_id)
        if not target:
            return False, "Target user not found."

        target["role"] = new_role
        return True, f"User role updated to {new_role}."

    def delete_user_account(self, actor_user_id: int, target_user_id: int) -> Tuple[bool, str]:
        actor = self.users.get(actor_user_id)
        if not actor or not actor["is_active"]:
            return False, "Unauthorized"

        if actor_user_id == target_user_id or actor["role"] in ["admin", "super_admin"]:
            if target_user_id in self.users:
                del self.users[target_user_id]
                return True, "Account deleted."
            return False, "User not found."

        return False, "Forbidden: You cannot delete another user's account."

rbac_service = RBACService()
