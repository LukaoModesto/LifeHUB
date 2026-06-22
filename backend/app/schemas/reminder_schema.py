from pydantic import BaseModel, Field
from datetime import datetime

class ReminderCreate(BaseModel):
    minutes_before: int = Field(
        gt=0,
        le=43200
    )

class ReminderResponse(BaseModel):
    id: int
    event_id: int
    minutes_before: int

    class Config:
        from_attributes = True

class DueReminderResponse(BaseModel):
    reminder_id: int
    event_id: int
    event_title: str
    event_datetime: datetime
    reminder_datetime: datetime
    minutes_before: int
    notification_level: str
    sound_type: str
