from sqlalchemy.orm import Session

from app.models.event_model import Event
from app.models.user_model import User
from app.schemas.event_schema import EventCreate


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