from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database import get_db
from app.models.user_model import User
from app.schemas.goal_schema import GoalCreate, GoalResponse, GoalUpdate
from app.services.goal_services import (
    create_goal,
    get_user_goals,
    get_goal_by_id,
    update_goal,
    delete_goal
)


router = APIRouter(
    prefix="/goals",
    tags=["Goals"]
)


@router.post("/", response_model=GoalResponse)
def register_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_goal(db, goal_data, current_user)


@router.get("/", response_model=list[GoalResponse])
def list_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_goals(db, current_user)


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_goal_by_id(db, goal_id, current_user)


@router.put("/{goal_id}", response_model=GoalResponse)
def edit_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_goal(db, goal_id, goal_data, current_user)


@router.delete("/{goal_id}")
def remove_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_goal(db, goal_id, current_user)