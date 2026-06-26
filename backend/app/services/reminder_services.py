from datetime import datetime, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.reminder_model import EventReminder
from app.models.user_model import User
from app.schemas.reminder_schema import ReminderCreate
from app.services.event_services import build_event_datetime, get_event_by_id


def create_reminder(
    db: Session,
    event_id: int,
    reminder_data: ReminderCreate,
    current_user: User,
):
    event = get_event_by_id(db, event_id, current_user)

    validate_reminder_time(
        event_datetime=build_event_datetime(event.event_date, event.start_time),
        minutes_before=reminder_data.minutes_before,
    )

    existing_reminder = (
        db.query(EventReminder)
        .filter(
            EventReminder.event_id == event.id,
            EventReminder.minutes_before == reminder_data.minutes_before,
        )
        .first()
    )

    if existing_reminder:
        raise HTTPException(
            status_code=400,
            detail="Este lembrete já existe para este evento.",
        )

    new_reminder = EventReminder(
        event_id=event.id,
        minutes_before=reminder_data.minutes_before,
    )

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)

    return new_reminder


def get_event_reminders(
    db: Session,
    event_id: int,
    current_user: User,
):
    event = get_event_by_id(db, event_id, current_user)

    return (
        db.query(EventReminder)
        .filter(EventReminder.event_id == event.id)
        .order_by(EventReminder.minutes_before.desc())
        .all()
    )


def delete_reminder(
    db: Session,
    event_id: int,
    reminder_id: int,
    current_user: User,
):
    event = get_event_by_id(db, event_id, current_user)

    reminder = (
        db.query(EventReminder)
        .filter(
            EventReminder.id == reminder_id,
            EventReminder.event_id == event.id,
        )
        .first()
    )

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Lembrete não encontrado.",
        )

    db.delete(reminder)
    db.commit()

    return {
        "message": "Lembrete excluído com sucesso.",
    }


def validate_reminder_time(event_datetime: datetime, minutes_before: int):
    now = datetime.now()

    if event_datetime <= now:
        raise HTTPException(
            status_code=400,
            detail="Não é possível criar lembrete para um evento que já começou.",
        )

    reminder_datetime = event_datetime - timedelta(minutes=minutes_before)

    if reminder_datetime <= now:
        raise HTTPException(
            status_code=400,
            detail="Este lembrete já passou para o horário deste evento. Escolha um intervalo menor.",
        )