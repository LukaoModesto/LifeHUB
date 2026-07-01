from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database import get_db
from app.models.recurring_reminder_model import RecurringReminder
from app.models.user_model import User
from app.schemas.recurring_reminder_schema import (
    RecurringReminderCreate,
    RecurringReminderResponse,
    RecurringReminderUpdate,
)
from app.services.recurring_reminder_processor_service import (
    process_due_recurring_reminders,
)

router = APIRouter(
    prefix="/recurring-reminders",
    tags=["Recurring Reminders"],
)


@router.post("/", response_model=RecurringReminderResponse)
def create_recurring_reminder(
    recurring_reminder_data: RecurringReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recurring_reminder = RecurringReminder(
        user_id=current_user.id,
        title=recurring_reminder_data.title,
        description=recurring_reminder_data.description,
        weekday=recurring_reminder_data.weekday,
        reminder_time=recurring_reminder_data.event_time,
        event_time=recurring_reminder_data.event_time,
        minutes_before=recurring_reminder_data.minutes_before,
        is_active=recurring_reminder_data.is_active,
    )

    db.add(recurring_reminder)
    db.commit()
    db.refresh(recurring_reminder)

    return recurring_reminder


@router.get("/", response_model=list[RecurringReminderResponse])
def list_recurring_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(RecurringReminder)
        .filter(RecurringReminder.user_id == current_user.id)
        .order_by(
            RecurringReminder.weekday.asc(),
            RecurringReminder.event_time.asc(),
        )
        .all()
    )


@router.post("/process-due")
def process_due_recurring_reminders_for_current_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return process_due_recurring_reminders(
        db=db,
        user_id=current_user.id,
    )


@router.get("/{recurring_reminder_id}", response_model=RecurringReminderResponse)
def get_recurring_reminder(
    recurring_reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recurring_reminder = (
        db.query(RecurringReminder)
        .filter(
            RecurringReminder.id == recurring_reminder_id,
            RecurringReminder.user_id == current_user.id,
        )
        .first()
    )

    if not recurring_reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lembrete recorrente não encontrado.",
        )

    return recurring_reminder


@router.put("/{recurring_reminder_id}", response_model=RecurringReminderResponse)
def update_recurring_reminder(
    recurring_reminder_id: int,
    recurring_reminder_data: RecurringReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recurring_reminder = (
        db.query(RecurringReminder)
        .filter(
            RecurringReminder.id == recurring_reminder_id,
            RecurringReminder.user_id == current_user.id,
        )
        .first()
    )

    if not recurring_reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lembrete recorrente não encontrado.",
        )

    update_data = recurring_reminder_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(recurring_reminder, field, value)

        if field == "event_time":
            recurring_reminder.reminder_time = value

    db.commit()
    db.refresh(recurring_reminder)

    return recurring_reminder


@router.delete("/{recurring_reminder_id}")
def delete_recurring_reminder(
    recurring_reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recurring_reminder = (
        db.query(RecurringReminder)
        .filter(
            RecurringReminder.id == recurring_reminder_id,
            RecurringReminder.user_id == current_user.id,
        )
        .first()
    )

    if not recurring_reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lembrete recorrente não encontrado.",
        )

    db.delete(recurring_reminder)
    db.commit()

    return {
        "message": "Lembrete recorrente removido com sucesso."
    }