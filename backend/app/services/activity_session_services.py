from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.activity_session_model import ActivitySession
from app.models.goal_model import Goal
from app.models.user_model import User
from app.schemas.activity_session_schema import (
    ActivitySessionCreate,
    ActivitySessionUpdate
)

def validate_goal_owner(db: Session, goal_id: int | None, current_user: User):
    if goal_id is None:
        return None
    
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="meta não encontrada."
        )
    
    return goal

def create_activity_session(
        db: Session,
        session_data: ActivitySessionCreate,
        current_user: User
):
    validate_goal_owner(db, session_data.goal_id, current_user)

    new_session = ActivitySession(
        user_id=current_user.id,
        goal_id=session_data.goal_id,
        title=session_data.title,
        description=session_data.description,
        start_time=session_data.start_time,
        end_time=session_data.end_time
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session

def get_user_activity_sessions(db: Session, current_user: User):
    return db.query(ActivitySession).filter(
        ActivitySession.user_id == current_user.id
    ).order_by(ActivitySession.start_time.desc()).all()

def get_activity_session_by_id(
        db: Session,
        session_id: int,
        current_user: User
):
    session = db.query(ActivitySession).filter(
        ActivitySession.id == session_id,
        ActivitySession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Sessão não encontrada."
        )
    
    return session

def update_activity_session(
    db: Session,
    session_id: int,
    session_data: ActivitySessionUpdate,
    current_user: User
):
    session = get_activity_session_by_id(db, session_id, current_user)

    update_data = session_data.model_dump(exclude_unset=True)

    if "goal_id" in update_data:
        validate_goal_owner(db, update_data["goal_id"], current_user)

    for field, value in update_data.items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)

    return session

def delete_acitivity_sessions(
    db: Session,
    session_id: int,
    current_user: User   
):
    
    session = get_activity_session_by_id(db, session_id, current_user)

    db.delete(session)
    db.commit()

    return {
        "message": "Sessão excluída com sucesso."
    }