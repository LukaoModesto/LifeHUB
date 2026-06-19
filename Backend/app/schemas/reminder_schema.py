from pydantic import BaseModel, Field

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