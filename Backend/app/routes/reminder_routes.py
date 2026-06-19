from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database import get_db
from app.models.user_model import User
from app.schemas.reminder_schema import ReminderCreate, ReminderResponse
from app.services.reminder_services import (
    create_reminder,
    get_event_reminders,
    delete_reminder
)


router = APIRouter(
    prefix="/events/{event_id}/reminders",
    tags=["Event Reminders"]
)


@router.post("/", response_model=ReminderResponse)
def register_reminder(
    event_id: int,
    reminder_data: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_reminder(db, event_id, reminder_data, current_user)


@router.get("/", response_model=list[ReminderResponse])
def list_reminders(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_event_reminders(db, event_id, current_user)


@router.delete("/{reminder_id}")
def remove_reminder(
    event_id: int,
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_reminder(db, event_id, reminder_id, current_user)