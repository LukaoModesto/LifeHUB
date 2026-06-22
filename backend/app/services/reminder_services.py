from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.reminder_model import EventReminder
from app.models.user_model import User
from app.schemas.reminder_schema import ReminderCreate
from app.services.event_services import get_event_by_id

def create_reminder(
        db: Session,
        event_id: int,
        reminder_data: ReminderCreate,
        current_user: User
):
    event = get_event_by_id(db, event_id, current_user)

    existing_reminder = db.query(EventReminder).filter(
        EventReminder.event_id == event.id,
        EventReminder.minutes_before == reminder_data.minutes_before).first()
        
    if existing_reminder:
        raise HTTPException(
            status_code=400,
            detail="Este lembrete já existe para este evento."
        )
    
    new_reminder = EventReminder(
        event_id=event.id,
        minutes_before=reminder_data.minutes_before
    )

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)
    
    return new_reminder

def get_event_reminders(
        db: Session,
        event_id: int,
        current_user: User
):
    event = get_event_by_id(db, event_id, current_user)
    return db.query(EventReminder).filter(
        EventReminder.event_id == event.id
    ).all()

def delete_reminder(
    db: Session,
    event_id: int,
    reminder_id: int,
    current_user: User
):
    event = get_event_by_id(db, event_id, current_user)

    reminder = db.query(EventReminder).filter(
        EventReminder.id == reminder_id,
        EventReminder.event_id == event.id
    ).first()

    if not reminder:
        raise HTTPException(
            status_code=404,
            detail="Lembre não encotrado."
        )
    
    db.delete(reminder)
    db.commit()

    return {
        "message": "Lembre excluído com sucesso."
    }
