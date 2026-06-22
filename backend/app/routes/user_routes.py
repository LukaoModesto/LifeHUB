from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin, TokenResponse
from app.services.user_services import create_user, get_users, authenticate_user
from app.models.user_model import User 
from app.core.auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/register", response_model=UserResponse)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user_data)

@router.post("/login", response_model=TokenResponse)
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    return authenticate_user(db, login_data)

@router.get("/me", response_model=UserResponse)
def get_logged_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return get_users(db)