from datetime import datetime
from pydantic import BaseModel, Field, field_validator, model_validator

class ActivitySessionCreate(BaseModel):
    goal_id: int | None = None

    title: str = Field(min_length=2, max_length=100)
    description: str | None = Field (default=None, max_length=500)

    start_time: datetime
    end_time: datetime | None = None

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
    def validate_session_time(self):
        if self.end_time is not None and self.end_time <= self.start_time:
            raise ValueError ("O horário final deve ser maior que o horário inicial.")

        return self
    
class ActivitySessionUpdate(BaseModel):
    goal_id: int | None = None

    title: str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=500)

    start_time: datetime | None = None
    end_time: datetime | None = None

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
    def validade_description(cls, value):
        if value is None:
            return value
        
        value = value.strip()

        if not value:
            return None
        
        return value
    
    @classmethod
    @model_validator(mode="after")
    def validate_session_time(self):
        if (
            self.start_time is not None
            and self.end_time is not None
            and self.end_time <= self.start_time
        ):
            raise ValueError("O horário final deve ser maior que o horário inicial.")
            
        return self
    
class ActivitySessionResponse(BaseModel):
    id: int
    goal_id: int | None 
    title: str
    description: str | None
    start_time: datetime
    end_time: datetime | None

    class Config:
        from_attributes = True
    