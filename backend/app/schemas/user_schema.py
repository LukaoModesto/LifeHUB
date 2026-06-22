from pydantic import BaseModel, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=80
    )
    email: EmailStr
    password: str = Field(
        min_length=6,
        max_length=72
    )

    @field_validator("name")
    @classmethod
    def validate(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("O nome nao pode estar vazio.")
        
        return value
    
    @field_validator("email")
    @classmethod
    def normalize_email(cls, value):
        return value.lower()
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if value.strip() != value:
            raise ValueError("A senha não pode começar ou terminar com espaços.")
        
        return value
    
class UserResponse(BaseModel):
    id:int
    name:str
    email:EmailStr

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=6,
        max_length=72
    )

    @field_validator("email")
    @classmethod
    def normalize_email(csl, value):
        return value.lower()
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str