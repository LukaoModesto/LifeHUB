from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class PushSubscriptionKeysRequest(BaseModel):
    p256dh: str = Field(min_length=20, max_length=512)
    auth: str = Field(min_length=10, max_length=512)


class PushSubscriptionCreateRequest(BaseModel):
    endpoint: str = Field(min_length=20, max_length=2048)
    keys: PushSubscriptionKeysRequest

    @field_validator("endpoint")
    @classmethod
    def validate_endpoint(cls, value: str):
        if not value.startswith("https://"):
            raise ValueError("Endpoint de push inválido.")

        return value


class PushSubscriptionResponse(BaseModel):
    id: int
    endpoint: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }