from typing import TYPE_CHECKING

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.property import Property
    from app.models.tenant import Tenant
    from app.models.vendor import Vendor
    from app.models.activity import ActivityEvent


class Organization(BaseModel):
    """Organization/Company managing properties."""

    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    default_currency: Mapped[str] = mapped_column(
        String(3), nullable=False, default="UGX"
    )
    timezone: Mapped[str] = mapped_column(
        String(50), nullable=False, default="Africa/Kampala"
    )

    # Relationships
    users: Mapped[list["User"]] = relationship(
        "User",
        back_populates="organization",
        cascade="all, delete-orphan",
    )
    properties: Mapped[list["Property"]] = relationship(
        "Property",
        back_populates="organization",
        cascade="all, delete-orphan",
    )
    tenants: Mapped[list["Tenant"]] = relationship(
        "Tenant",
        back_populates="organization",
        cascade="all, delete-orphan",
    )
    vendors: Mapped[list["Vendor"]] = relationship(
        "Vendor",
        back_populates="organization",
        cascade="all, delete-orphan",
    )
    activity_events: Mapped[list["ActivityEvent"]] = relationship(
        "ActivityEvent",
        back_populates="organization",
        cascade="all, delete-orphan",
    )
