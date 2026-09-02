import os
import tempfile
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerAI - AI Career Intelligence Platform"
    API_V1_STR: str = "/api/v1"
    
    # In Vercel serverless, the filesystem is read-only except /tmp
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{tempfile.gettempdir()}/careerai.db")
    
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    DEFAULT_LLM_MODEL: str = "auto"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()