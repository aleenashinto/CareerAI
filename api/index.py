import sys
import os

backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

try:
    from app.main import app
except Exception as e:
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/api/v1/health")
    @app.get("/health")
    @app.get("/")
    def error_fallback():
        return {"error": "Serverless fallback handler", "details": str(e)}