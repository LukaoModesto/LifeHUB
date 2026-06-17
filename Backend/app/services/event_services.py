from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.event_model import Event
from app.models.user_model import User
from app.schemas.event_schema import EventCreate, EventUpdate


def create_event(db: Session, event_data: EventCreate, current_user: User):
    new_event = Event(
        user_id=current_user.id,
        title=event_data.title,
        description=event_data.description,
        event_date=event_data.event_date,
        start_time=event_data.start_time,
        end_time=event_data.end_time
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


def get_user_events(db: Session, current_user: User):
    return db.query(Event).filter(Event.user_id == current_user.id).all()


def get_event_by_id(db: Session, event_id: int, current_user: User):
    event = db.query(Event).filter(
        Event.id == event_id,
        Event.user_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Evento não encontrado."
        )

    return event


def update_event(
    db: Session,
    event_id: int,
    event_data: EventUpdate,
    current_user: User
):
    event = get_event_by_id(db, event_id, current_user)

    update_data = event_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)

    return event


def delete_event(db: Session, event_id: int, current_user: User):
    event = get_event_by_id(db, event_id, current_user)

    db.delete(event)
    db.commit()

    return {
        "message": "Evento excluído com sucesso."
    }