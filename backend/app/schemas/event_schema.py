from datetime import date, time
from pydantic import BaseModel, Field, field_validator, model_validator


class EventCreate(BaseModel):
    title: str = Field(min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=500)

    event_date: date
    start_time: time
    end_time: time | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("O título não pode estar vazio.")

        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value):
        if value is None:
            return value

        value = value.strip()

        if not value:
            return None

        return value
    
    @model_validator(mode="after")
    def validate_event_time(self):
        if self.end_time is not None and self.end_time <= self.start_time:
            raise ValueError ("O horário final deve ser maiso que o horário incial.")
        
        return self

class EventUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=500)

    event_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("O título não pode estar vazio.")

        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value):
        if value is None:
            return value

        value = value.strip()

        if not value:
            return None

        return value
    
    @model_validator(mode="after")
    def validate_time_event(self):
        if (
            self.start_time is not None
            and self.end_time is not None
            and self.end_time <= self.start_time
        ):
            raise ValueError ("O horário final deve ser maior que o horário inicial.")
        
        return self

class EventResponse(BaseModel):
    id: int
    title: str
    description: str | None
    event_date: date
    start_time: time
    end_time: time | None

    class Config:
        from_attributes = True
