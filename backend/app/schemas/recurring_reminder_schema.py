from datetime import datetime, time

from pydantic import BaseModel, Field, field_validator


class RecurringReminderBase(BaseModel):
    title: str = Field(min_length=1, max_length=80)
    description: str | None = Field(default=None, max_length=300)
    weekday: int = Field(ge=0, le=6)
    reminder_time: time
    is_active: bool = True

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str):
        trimmed_value = value.strip()

        if not trimmed_value:
            raise ValueError("O título do lembrete recorrente é obrigatório.")

        return trimmed_value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str | None):
        if value is None:
            return value

        trimmed_value = value.strip()

        return trimmed_value or None


class RecurringReminderCreate(RecurringReminderBase):
    pass


class RecurringReminderUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=80)
    description: str | None = Field(default=None, max_length=300)
    weekday: int | None = Field(default=None, ge=0, le=6)
    reminder_time: time | None = None
    is_active: bool | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None):
        if value is None:
            return value

        trimmed_value = value.strip()

        if not trimmed_value:
            raise ValueError("O título do lembrete recorrente é obrigatório.")

        return trimmed_value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str | None):
        if value is None:
            return value

        trimmed_value = value.strip()

        return trimmed_value or None


class RecurringReminderResponse(BaseModel):
    id: int
    title: str
    description: str | None
    weekday: int
    reminder_time: time
    is_active: bool
    last_sent_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }