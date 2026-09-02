from fastapi import APIRouter, HTTPException, Request, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from app.services.auth_service import auth_service

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    confirm_password: str
    terms_accepted: bool = False

class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerifyRequest(BaseModel):
    email: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str

@router.post("/auth/signup")
async def signup(req: SignupRequest):
    success, msg, data = auth_service.signup(
        name=req.name,
        email=req.email,
        password=req.password,
        confirm_password=req.confirm_password,
        terms_accepted=req.terms_accepted
    )
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg, "data": data}

@router.post("/auth/login")
async def login(req: LoginRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    success, msg, data = auth_service.login(req.email, req.password, client_ip)
    if not success:
        if data and data.get("requires_verification"):
            raise HTTPException(status_code=403, detail=msg)
        raise HTTPException(status_code=401, detail=msg)
    return {"status": "success", "message": msg, "data": data}

@router.post("/auth/verify-email")
async def verify_email(req: VerifyEmailRequest):
    success, msg = auth_service.verify_email(req.token)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg}

@router.post("/auth/resend-verification")
async def resend_verification(req: ResendVerifyRequest):
    success, msg = auth_service.resend_verification(req.email)
    if not success:
        raise HTTPException(status_code=429, detail=msg)
    return {"status": "success", "message": msg}

@router.post("/auth/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    success, msg, token = auth_service.request_password_reset(req.email)
    return {"status": "success", "message": msg, "reset_token_dev": token}

@router.post("/auth/reset-password")
async def reset_password(req: ResetPasswordRequest):
    success, msg = auth_service.reset_password(req.token, req.new_password, req.confirm_password)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg}

@router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(None)):
    token = authorization.replace("Bearer ", "") if authorization else ""
    success, msg = auth_service.logout(token)
    if not success:
        raise HTTPException(status_code=401, detail=msg)
    return {"status": "success", "message": msg}

@router.get("/auth/me")
async def get_me(authorization: Optional[str] = Header(None)):
    token = authorization.replace("Bearer ", "") if authorization else ""
    user = auth_service.validate_session(token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid or expired session.")
    return {"user": user}
