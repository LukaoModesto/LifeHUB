from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReminderCreate(BaseModel):
    minutes_before: int = Field(
        gt=0,
        le=43200,
        description="Quantidade de minutos antes do evento.",
    )


class ReminderResponse(BaseModel):
    id: int
    event_id: int
    minutes_before: int

    model_config = ConfigDict(from_attributes=True)


class DueReminderResponse(BaseModel):
    reminder_id: int
    event_id: int
    event_title: str
    event_datetime: datetime
    reminder_datetime: datetime
    minutes_before: int
    notification_level: str
    sound_type: str