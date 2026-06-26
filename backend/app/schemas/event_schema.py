from datetime import date, time

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


MAX_EVENT_TITLE_LENGTH = 80
MAX_EVENT_DESCRIPTION_LENGTH = 300


class EventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=MAX_EVENT_TITLE_LENGTH)
    description: str | None = Field(
        default=None,
        max_length=MAX_EVENT_DESCRIPTION_LENGTH,
    )

    event_date: date
    start_time: time
    end_time: time | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str):
        value = value.strip()

        if len(value) < 2:
            raise ValueError("O título deve ter pelo menos 2 caracteres.")

        if len(value) > MAX_EVENT_TITLE_LENGTH:
            raise ValueError(
                f"O título não pode passar de {MAX_EVENT_TITLE_LENGTH} caracteres."
            )

        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str | None):
        if value is None:
            return value

        value = value.strip()

        if not value:
            return None

        if len(value) > MAX_EVENT_DESCRIPTION_LENGTH:
            raise ValueError(
                f"A descrição não pode passar de {MAX_EVENT_DESCRIPTION_LENGTH} caracteres."
            )

        return value

    @model_validator(mode="after")
    def validate_event_time(self):
        if self.end_time is not None and self.end_time <= self.start_time:
            raise ValueError("O horário final deve ser maior que o horário inicial.")

        return self


class EventUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=MAX_EVENT_TITLE_LENGTH,
    )
    description: str | None = Field(
        default=None,
        max_length=MAX_EVENT_DESCRIPTION_LENGTH,
    )

    event_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None):
        if value is None:
            return value

        value = value.strip()

        if len(value) < 2:
            raise ValueError("O título deve ter pelo menos 2 caracteres.")

        if len(value) > MAX_EVENT_TITLE_LENGTH:
            raise ValueError(
                f"O título não pode passar de {MAX_EVENT_TITLE_LENGTH} caracteres."
            )

        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str | None):
        if value is None:
            return value

        value = value.strip()

        if not value:
            return None

        if len(value) > MAX_EVENT_DESCRIPTION_LENGTH:
            raise ValueError(
                f"A descrição não pode passar de {MAX_EVENT_DESCRIPTION_LENGTH} caracteres."
            )

        return value

    @model_validator(mode="after")
    def validate_event_time(self):
        if (
            self.start_time is not None
            and self.end_time is not None
            and self.end_time <= self.start_time
        ):
            raise ValueError("O horário final deve ser maior que o horário inicial.")

        return self


class EventResponse(BaseModel):
    id: int
    title: str
    description: str | None
    event_date: date
    start_time: time
    end_time: time | None

    model_config = ConfigDict(from_attributes=True)