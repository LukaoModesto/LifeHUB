from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError("O nome não pode estar vazio.")

        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str):
        return value.lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        if value.strip() != value:
            raise ValueError("A senha não pode começar ou terminar com espaços.")

        return value


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str):
        return value.lower()


class GoogleLoginRequest(BaseModel):
    credential: str = Field(min_length=10)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str