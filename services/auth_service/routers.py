from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import AuthUser, AuthToken
from schemas import RegisterRequest, LoginRequest, AuthResponse, LoginResponse, MeResponse
import bcrypt
import secrets
import os
import httpx
from typing import Optional
from datetime import datetime

# Route through proxy for production compatibility; internal Docker can override via compose env
# Keep trailing slash to match nginx location pattern
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://proxy/api/users/").rstrip("/") + "/"

auth_router = APIRouter()
security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token() -> str:
    return secrets.token_urlsafe(32)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> AuthUser:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid token",
        )
    token_row = db.query(AuthToken).filter(AuthToken.token == credentials.credentials).first()
    if not token_row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user = db.query(AuthUser).filter(AuthUser.id == token_row.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user

@auth_router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    print('1')
    existing_user = db.query(AuthUser).filter(AuthUser.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    print('2')
    hashed_password = hash_password(request.password)
    new_user = AuthUser(
        email=request.email,
        password_hash=hashed_password
    )
    print('3')

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print('4')
    token = generate_token()
    db.add(AuthToken(token=token, user_id=new_user.id))
    db.commit()
    print('5')
    # Create user profile in user service (same id as auth user)
    user_service_payload = {
        "id": str(new_user.id),
        "email": new_user.email,
        "first_name": request.first_name,
        "last_name": request.last_name,
        "dni": request.dni,
        "phone": request.phone,
        "birth_date": request.birth_date.isoformat() if request.birth_date else None,
    }
    print('6')
    try:
        with httpx.Client(timeout=10.0) as client:
            print('USER_SERVICE_URL', USER_SERVICE_URL)
            r = client.post(
                USER_SERVICE_URL,
                json=user_service_payload,
            )
            print('r.status_code', r.status_code)
            if r.status_code >= 400:
                try:
                    detail = r.json().get("detail", r.text)
                    print('detail', detail)
                except Exception:
                    detail = r.text
                if isinstance(detail, list) and detail:
                    detail = detail[0].get("msg", str(detail[0]))
                if not isinstance(detail, str):
                    detail = "User service error"
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=detail,
                )
    except HTTPException:
        print('exeption 1')
        token_row = db.query(AuthToken).filter(AuthToken.token == token).first()
        if token_row:
            db.delete(token_row)
        db.delete(new_user)
        db.commit()
        raise
    except Exception as e:
        print('exeption 2')
        token_row = db.query(AuthToken).filter(AuthToken.token == token).first()
        if token_row:
            db.delete(token_row)
        db.delete(new_user)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User service unavailable. Please try again.",
        ) from e

    return AuthResponse(
        id=new_user.id,
        email=new_user.email,
        token=token,
        created_at=new_user.created_at
    )

@auth_router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(AuthUser).filter(AuthUser.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    user.last_login = datetime.utcnow()
    db.commit()

    token = generate_token()
    db.add(AuthToken(token=token, user_id=user.id))
    db.commit()

    return LoginResponse(
        id=user.id,
        email=user.email,
        token=token,
        message="Login successful"
    )


@auth_router.get("/me", response_model=MeResponse)
def me(current_user: AuthUser = Depends(get_current_user)):
    return MeResponse(id=current_user.id, email=current_user.email)
