from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.enums import UserRole


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    role: UserRole = UserRole.viewer


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    role: UserRole | None = None


class UserResponse(UserBase):
    id: str
    organization_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
