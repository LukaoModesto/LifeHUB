from fastapi import HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.models.user_model import User
from app.schemas.user_schema import GoogleLoginRequest, UserCreate, UserLogin


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(db: Session, user_data: UserCreate):
    existing_user = get_user_by_email(db, user_data.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email já cadastrado.",
        )

    hashed_password = pwd_context.hash(user_data.password)

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def get_users(db: Session):
    return db.query(User).all()


def authenticate_user(db: Session, login_data: UserLogin):
    user = get_user_by_email(db, login_data.email)

    if not user:
        raise_invalid_credentials_exception()

    if not verify_password(login_data.password, user.password_hash):
        raise_invalid_credentials_exception()

    return create_user_token(user)


def authenticate_google_user(
    db: Session,
    google_login_data: GoogleLoginRequest,
):
    if not settings.google_client_id:
        raise HTTPException(
            status_code=500,
            detail="Google Client ID não configurado no servidor.",
        )

    try:
        google_user_data = id_token.verify_oauth2_token(
            google_login_data.credential,
            requests.Request(),
            settings.google_client_id,
        )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Token do Google inválido.",
        )

    email = google_user_data.get("email")
    name = google_user_data.get("name")
    email_verified = google_user_data.get("email_verified")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Não foi possível obter o e-mail da conta Google.",
        )

    if email_verified is not True:
        raise HTTPException(
            status_code=401,
            detail="E-mail da conta Google não verificado.",
        )

    normalized_email = email.lower()
    user = get_user_by_email(db, normalized_email)

    if not user:
        user = create_google_user(
            db=db,
            name=name or normalized_email.split("@")[0],
            email=normalized_email,
        )

    return create_user_token(user)


def create_google_user(db: Session, name: str, email: str):
    new_user = User(
        name=name.strip() or email.split("@")[0],
        email=email,
        password_hash=pwd_context.hash("__google_oauth_user__"),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email.lower()).first()


def create_user_token(user: User):
    access_token = create_access_token(
        data={"sub": str(user.id)},
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


def raise_invalid_credentials_exception():
    raise HTTPException(
        status_code=401,
        detail="Email ou senha inválidos.",
    )