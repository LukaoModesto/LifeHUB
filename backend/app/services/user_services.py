from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi import HTTPException

from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserLogin
from app.core.security import verify_password, create_access_token


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(db: Session, user_data: UserCreate):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email já cadastrado."
        )
    
    hashed_password = pwd_context.hash(user_data.password)

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def get_users(db: Session):
    return db.query(User).all()

def authenticate_user(db: Session, login_data: UserLogin):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos."
        )
    
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos."
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)}
    )
    
    return{
        "access_token": access_token,
        "token_type": "bearer"
    }