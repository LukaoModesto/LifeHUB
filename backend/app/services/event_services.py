from datetime import date, datetime, time

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.event_model import Event
from app.models.user_model import User
from app.schemas.event_schema import EventCreate, EventUpdate


def create_event(db: Session, event_data: EventCreate, current_user: User):
    validate_event_not_in_past(
        event_data.event_date,
        event_data.start_time,
    )

    new_event = Event(
        user_id=current_user.id,
        title=event_data.title,
        description=event_data.description,
        event_date=event_data.event_date,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


def get_user_events(
    db: Session,
    current_user: User,
    event_date: date | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
):
    query = db.query(Event).filter(Event.user_id == current_user.id)

    if event_date:
        query = query.filter(Event.event_date == event_date)

    if start_date and end_date:
        if end_date < start_date:
            raise HTTPException(
                status_code=400,
                detail="A data final não pode ser menor que a data inicial.",
            )

        query = query.filter(
            Event.event_date >= start_date,
            Event.event_date <= end_date,
        )

    elif start_date:
        query = query.filter(Event.event_date >= start_date)

    elif end_date:
        query = query.filter(Event.event_date <= end_date)

    return query.order_by(Event.event_date, Event.start_time).all()


def get_event_by_id(db: Session, event_id: int, current_user: User):
    event = (
        db.query(Event)
        .filter(
            Event.id == event_id,
            Event.user_id == current_user.id,
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Evento não encontrado.",
        )

    return event


def update_event(
    db: Session,
    event_id: int,
    event_data: EventUpdate,
    current_user: User,
):
    event = get_event_by_id(db, event_id, current_user)

    update_data = event_data.model_dump(exclude_unset=True)

    new_event_date = update_data.get("event_date", event.event_date)
    new_start_time = update_data.get("start_time", event.start_time)
    new_end_time = update_data.get("end_time", event.end_time)

    validate_event_time(new_start_time, new_end_time)

    is_moving_event_datetime = (
        "event_date" in update_data or "start_time" in update_data
    )

    if is_moving_event_datetime:
        validate_event_not_in_past(new_event_date, new_start_time)

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
        "message": "Evento excluído com sucesso.",
    }


def validate_event_time(start_time: time, end_time: time | None):
    if end_time is not None and end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="O horário final deve ser maior que o horário inicial.",
        )


def validate_event_not_in_past(event_date: date, start_time: time):
    event_datetime = build_event_datetime(event_date, start_time)

    if event_datetime <= datetime.now():
        raise HTTPException(
            status_code=400,
            detail="Não é possível criar ou mover um evento para um horário que já passou.",
        )


def build_event_datetime(event_date: date, start_time: time):
    return datetime.combine(event_date, start_time)