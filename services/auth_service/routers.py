from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import AuthUser
from schemas import RegisterRequest, LoginRequest, AuthResponse, LoginResponse
import bcrypt
import secrets
from datetime import datetime

auth_router = APIRouter()

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token() -> str:
    return secrets.token_urlsafe(32)

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

    return LoginResponse(
        id=user.id,
        email=user.email,
        token=token,
        message="Login successful"
    )
