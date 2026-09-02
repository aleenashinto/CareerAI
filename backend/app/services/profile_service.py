# Candidate Profile Service with Education, Experience, Verified Skills, Projects, Certifications, and Data Privacy
import datetime
from typing import Dict, Any, List, Optional, Tuple

class ProfileService:
    def __init__(self):
        self.profiles: Dict[int, Dict[str, Any]] = {
            1: {
                "user_id": 1,
                "full_name": "Aleena Mathew",
                "headline": "Full Stack & AI Engineer",
                "email": "testuser@example.com",
                "phone": "+91 98765 43210",
                "location": "Bangalore, India",
                "bio": "Software engineer specializing in Python, FastAPI, and Applied LLMs.",
                "educations": [
                    {
                        "id": 101,
                        "degree": "B.Tech in Computer Science",
                        "institution": "Apex Engineering University",
                        "start_year": 2019,
                        "end_year": 2023,
                        "gpa": "8.8/10.0"
                    }
                ],
                "experiences": [
                    {
                        "id": 201,
                        "role": "Software Engineer",
                        "company": "InnovateTech Labs",
                        "start_date": "2023-06",
                        "end_date": "Present",
                        "is_current": True,
                        "description": "Architected FastAPI backend services handling 50k+ daily requests."
                    }
                ],
                "skills": {
                    "Python": 90, "FastAPI": 85, "React": 80, "SQL": 84, "RAG": 78
                },
                "projects": [
                    {
                        "id": 301,
                        "title": "CareerAI Platform",
                        "tech_stack": ["FastAPI", "React", "pgvector"],
                        "github_url": "https://github.com/alexmercer-dev/careerai",
                        "live_url": "https://careerai.dev",
                        "description": "AI Career Intelligence and adaptive interview simulation platform."
                    }
                ],
                "certifications": [
                    {
                        "id": 401,
                        "name": "AWS Certified Cloud Practitioner",
                        "issuer": "Amazon Web Services",
                        "issue_date": "2024-01",
                        "credential_id": "AWS-CLF-001"
                    }
                ],
                "privacy_settings": {
                    "profile_visible_to_recruiters": True,
                    "hide_contact_info": False,
                    "allow_ai_indexing": True
                },
                "completion_score": 95.0
            }
        }

    def get_profile(self, user_id: int) -> Optional[Dict[str, Any]]:
        return self.profiles.get(user_id)

    def calculate_completion_score(self, profile: Dict[str, Any]) -> float:
        score = 0.0
        if profile.get("full_name") and profile.get("headline"):
            score += 20.0
        if profile.get("bio") and len(profile.get("bio", "")) >= 20:
            score += 15.0
        if profile.get("educations") and len(profile["educations"]) > 0:
            score += 15.0
        if profile.get("experiences") and len(profile["experiences"]) > 0:
            score += 20.0
        if profile.get("skills") and len(profile["skills"]) >= 3:
            score += 15.0
        if profile.get("projects") and len(profile["projects"]) > 0:
            score += 10.0
        if profile.get("certifications") and len(profile["certifications"]) > 0:
            score += 5.0
        return min(100.0, score)

    def update_basic_info(self, user_id: int, data: Dict[str, Any]) -> Tuple[bool, str]:
        profile = self.profiles.get(user_id)
        if not profile:
            return False, "Profile not found."
        
        # Validation checks
        if "full_name" in data and not data["full_name"].strip():
            return False, "Full name cannot be empty."
        if "headline" in data and not data["headline"].strip():
            return False, "Professional headline cannot be empty."

        for k, v in data.items():
            if k in ["full_name", "headline", "phone", "location", "bio"]:
                profile[k] = v

        profile["completion_score"] = self.calculate_completion_score(profile)
        return True, "Profile updated successfully."

    def add_education(self, user_id: int, edu: Dict[str, Any]) -> Tuple[bool, str]:
        profile = self.profiles.get(user_id)
        if not profile:
            return False, "Profile not found."
        
        if not edu.get("degree") or not edu.get("institution") or not edu.get("start_year"):
            return False, "Degree, institution, and start year are required."

        if edu.get("end_year") and edu.get("end_year") < edu.get("start_year"):
            return False, "Graduation year cannot be earlier than start year."

        edu_id = len(profile["educations"]) + 101
        new_edu = {**edu, "id": edu_id}
        profile["educations"].append(new_edu)
        profile["completion_score"] = self.calculate_completion_score(profile)
        return True, "Education record added."

    def add_experience(self, user_id: int, exp: Dict[str, Any]) -> Tuple[bool, str]:
        profile = self.profiles.get(user_id)
        if not profile:
            return False, "Profile not found."

        if not exp.get("role") or not exp.get("company") or not exp.get("start_date"):
            return False, "Role, company, and start date are mandatory."

        exp_id = len(profile["experiences"]) + 201
        new_exp = {**exp, "id": exp_id}
        profile["experiences"].append(new_exp)
        profile["completion_score"] = self.calculate_completion_score(profile)
        return True, "Experience record added."

    def update_skills(self, user_id: int, skills: Dict[str, int]) -> Tuple[bool, str]:
        profile = self.profiles.get(user_id)
        if not profile:
            return False, "Profile not found."

        for skill, lvl in skills.items():
            if lvl < 0 or lvl > 100:
                return False, f"Proficiency for '{skill}' must be between 0 and 100."

        profile["skills"] = skills
        profile["completion_score"] = self.calculate_completion_score(profile)
        return True, "Skills updated successfully."

    def add_project(self, user_id: int, proj: Dict[str, Any]) -> Tuple[bool, str]:
        profile = self.profiles.get(user_id)
        if not profile:
            return False, "Profile not found."

        if not proj.get("title") or not proj.get("description"):
            return False, "Project title and description are required."

        # Validate URL formats if provided
        if proj.get("github_url") and not proj["github_url"].startswith("http"):
            return False, "GitHub URL must be a valid HTTP/HTTPS link."

        proj_id = len(profile["projects"]) + 301
        new_proj = {**proj, "id": proj_id}
        profile["projects"].append(new_proj)
        profile["completion_score"] = self.calculate_completion_score(profile)
        return True, "Project added successfully."

    def add_certification(self, user_id: int, cert: Dict[str, Any]) -> Tuple[bool, str]:
        profile = self.profiles.get(user_id)
        if not profile:
            return False, "Profile not found."

        if not cert.get("name") or not cert.get("issuer"):
            return False, "Certification name and issuer are required."

        cert_id = len(profile["certifications"]) + 401
        new_cert = {**cert, "id": cert_id}
        profile["certifications"].append(new_cert)
        profile["completion_score"] = self.calculate_completion_score(profile)
        return True, "Certification added."

    def update_privacy_settings(self, user_id: int, settings: Dict[str, bool]) -> Tuple[bool, str]:
        profile = self.profiles.get(user_id)
        if not profile:
            return False, "Profile not found."

        profile["privacy_settings"] = {**profile["privacy_settings"], **settings}
        return True, "Privacy settings updated."

    def export_profile_data(self, user_id: int) -> Optional[Dict[str, Any]]:
        # GDPR / Data Portability export
        profile = self.profiles.get(user_id)
        if not profile:
            return None
        return {
            "exported_at": datetime.datetime.utcnow().isoformat(),
            "profile_data": profile
        }

    def delete_profile_data(self, user_id: int) -> bool:
        # GDPR Right to be Forgotten
        if user_id in self.profiles:
            del self.profiles[user_id]
            return True
        return False

profile_service = ProfileService()
