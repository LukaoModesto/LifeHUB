from pydantic import BaseModel, Field, field_validator


class GoalCreate(BaseModel):
    title: str = Field(min_length=2, max_length=100)
    target_hours: float = Field(gt=0, le=1000)
    period: str = Field(min_length=3, max_length=20)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("O título não pode estar vazio.")

        return value

    @field_validator("period")
    @classmethod
    def validate_period(cls, value):
        value = value.strip().lower()

        allowed_periods = ["daily", "weekly", "monthly"]

        if value not in allowed_periods:
            raise ValueError("O período deve ser daily, weekly ou monthly.")

        return value


class GoalUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=100)
    target_hours: float | None = Field(default=None, gt=0, le=1000)
    period: str | None = Field(default=None, min_length=3, max_length=20)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("O título não pode estar vazio.")

        return value

    @field_validator("period")
    @classmethod
    def validate_period(cls, value):
        if value is None:
            return value

        value = value.strip().lower()

        allowed_periods = ["daily", "weekly", "monthly"]

        if value not in allowed_periods:
            raise ValueError("O período deve ser daily, weekly ou monthly.")

        return value


class GoalResponse(BaseModel):
    id: int
    title: str
    target_hours: float
    period: str

    class Config:
        from_attributes = True