from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class OrganizationBase(BaseModel):
    name: str
    default_currency: str = "UGX"
    timezone: str = "Africa/Kampala"


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: str | None = None
    default_currency: str | None = None
    timezone: str | None = None


class OrganizationResponse(OrganizationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
