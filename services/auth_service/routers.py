from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import AuthUser, AuthToken
from schemas import RegisterRequest, LoginRequest, AuthResponse, LoginResponse, MeResponse
import bcrypt
import secrets
from typing import Optional
from datetime import datetime

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
    existing_user = db.query(AuthUser).filter(AuthUser.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = hash_password(request.password)
    new_user = AuthUser(
        email=request.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = generate_token()
    db.add(AuthToken(token=token, user_id=new_user.id))
    db.commit()

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
