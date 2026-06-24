from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.unit import Unit
    from app.models.maintenance import MaintenanceRequest
    from app.models.metrics import MonthlyPropertyMetric
    from app.models.activity import ActivityEvent


class Property(BaseModel):
    """Property/Building managed by the organization."""

    __tablename__ = "properties"

    organization_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line1: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address_line2: Mapped[str | None] = mapped_column(String(255), nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    region: Mapped[str | None] = mapped_column(String(100), nullable=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False, default="Uganda")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    organization: Mapped["Organization"] = relationship(
        "Organization",
        back_populates="properties",
    )
    units: Mapped[list["Unit"]] = relationship(
        "Unit",
        back_populates="property",
        cascade="all, delete-orphan",
    )
    maintenance_requests: Mapped[list["MaintenanceRequest"]] = relationship(
        "MaintenanceRequest",
        back_populates="property",
        cascade="all, delete-orphan",
    )
    monthly_metrics: Mapped[list["MonthlyPropertyMetric"]] = relationship(
        "MonthlyPropertyMetric",
        back_populates="property",
        cascade="all, delete-orphan",
    )
    activity_events: Mapped[list["ActivityEvent"]] = relationship(
        "ActivityEvent",
        back_populates="property",
        foreign_keys="ActivityEvent.property_id",
    )
