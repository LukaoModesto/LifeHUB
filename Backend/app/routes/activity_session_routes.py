from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database import get_db
from app.models.user_model import User
from app.schemas.activity_session_schema import (
    ActivitySessionCreate,
    ActivitySessionResponse,
    ActivitySessionUpdate
)
from app.services.activity_session_services import (
    create_activity_session,
    get_user_activity_sessions,
    get_activity_session_by_id,
    update_activity_session,
    delete_acitivity_sessions
)


router = APIRouter(
    prefix="/activity-sessions",
    tags=["Activity Sessions"]
)


@router.post("/", response_model=ActivitySessionResponse)
def register_activity_session(
    session_data: ActivitySessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_activity_session(db, session_data, current_user)


@router.get("/", response_model=list[ActivitySessionResponse])
def list_activity_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_activity_sessions(db, current_user)


@router.get("/{session_id}", response_model=ActivitySessionResponse)
def get_activity_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_activity_session_by_id(db, session_id, current_user)


@router.put("/{session_id}", response_model=ActivitySessionResponse)
def edit_activity_session(
    session_id: int,
    session_data: ActivitySessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_activity_session(db, session_id, session_data, current_user)


@router.delete("/{session_id}")
def remove_activity_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_acitivity_sessions(db, session_id, current_user)