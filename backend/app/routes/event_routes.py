from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database import get_db
from app.models.user_model import User
from app.schemas.event_schema import EventCreate, EventResponse, EventUpdate
from app.services.event_services import (
    create_event,
    get_user_events,
    get_event_by_id,
    update_event,
    delete_event
)
from datetime import date

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.post("/", response_model=EventResponse)
def register_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_event(db, event_data, current_user)


@router.get("/", response_model=list[EventResponse])
def list_events(
    event_date: date | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_events(
        db, 
        current_user,
        event_date,
        start_date,
        end_date
    )


@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_event_by_id(db, event_id, current_user)


@router.put("/{event_id}", response_model=EventResponse)
def edit_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_event(db, event_id, event_data, current_user)


@router.delete("/{event_id}")
def remove_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_event(db, event_id, current_user)