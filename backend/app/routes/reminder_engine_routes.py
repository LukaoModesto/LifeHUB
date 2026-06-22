from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database import get_db
from app.models.user_model import User
from app.schemas.reminder_schema import DueReminderResponse
from app.services.reminder_engine_services import (
    get_due_reminders,
    mark_reminder_as_sent
)

router = APIRouter(
    prefix="/reminders",
    tags=["Reminder Engine"]
)

@router.get("/due", response_model=list[DueReminderResponse])
def list_due_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_due_reminders(db, current_user)

@router.patch("/{reminder_id}/sent")
def mark_as_sent(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return mark_reminder_as_sent(db, reminder_id, current_user)