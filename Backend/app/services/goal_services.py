from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.goal_model import Goal
from app.models.user_model import User
from app.schemas.goal_schema import GoalCreate, GoalUpdate


def create_goal(db: Session, goal_data: GoalCreate, current_user: User):
    new_goal = Goal(
        user_id=current_user.id,
        title=goal_data.title,
        target_hours=goal_data.target_hours,
        period=goal_data.period
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


def get_user_goals(db: Session, current_user: User):
    return db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()


def get_goal_by_id(db: Session, goal_id: int, current_user: User):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Meta não encontrada."
        )

    return goal


def update_goal(
    db: Session,
    goal_id: int,
    goal_data: GoalUpdate,
    current_user: User
):
    goal = get_goal_by_id(db, goal_id, current_user)

    update_data = goal_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(goal, field, value)

    db.commit()
    db.refresh(goal)

    return goal


def delete_goal(db: Session, goal_id: int, current_user: User):
    goal = get_goal_by_id(db, goal_id, current_user)

    db.delete(goal)
    db.commit()

    return {
        "message": "Meta excluída com sucesso."
    }