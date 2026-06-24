from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import UnitStatus

if TYPE_CHECKING:
    from app.models.property import Property
    from app.models.lease import Lease
    from app.models.maintenance import MaintenanceRequest
    from app.models.activity import ActivityEvent


class Unit(BaseModel):
    """Rental unit within a property."""

    __tablename__ = "units"
    __table_args__ = (
        UniqueConstraint("property_id", "unit_number", name="uq_property_unit"),
        CheckConstraint("bedrooms >= 0", name="ck_bedrooms_positive"),
        CheckConstraint("bathrooms >= 0", name="ck_bathrooms_positive"),
        CheckConstraint("rent_amount >= 0", name="ck_rent_positive"),
        CheckConstraint("square_meters IS NULL OR square_meters >= 0", name="ck_sqm_positive"),
    )

    property_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    unit_number: Mapped[str] = mapped_column(String(50), nullable=False)
    floor: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    bathrooms: Mapped[float] = mapped_column(Numeric(3, 1), nullable=False, default=1)
    rent_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[UnitStatus] = mapped_column(
        default=UnitStatus.vacant,
        nullable=False,
    )
    square_meters: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    property: Mapped["Property"] = relationship(
        "Property",
        back_populates="units",
    )
    leases: Mapped[list["Lease"]] = relationship(
        "Lease",
        back_populates="unit",
        cascade="all, delete-orphan",
    )
    maintenance_requests: Mapped[list["MaintenanceRequest"]] = relationship(
        "MaintenanceRequest",
        back_populates="unit",
        foreign_keys="MaintenanceRequest.unit_id",
    )
    activity_events: Mapped[list["ActivityEvent"]] = relationship(
        "ActivityEvent",
        back_populates="unit",
        foreign_keys="ActivityEvent.unit_id",
    )
