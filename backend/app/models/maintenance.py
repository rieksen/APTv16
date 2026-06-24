from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import MaintenancePriority, MaintenanceStatus

if TYPE_CHECKING:
    from app.models.property import Property
    from app.models.unit import Unit
    from app.models.tenant import Tenant
    from app.models.user import User
    from app.models.vendor import Vendor
    from app.models.activity import ActivityEvent


class MaintenanceRequest(BaseModel):
    """Maintenance request for property/unit repairs."""

    __tablename__ = "maintenance_requests"
    __table_args__ = (
        CheckConstraint(
            "estimated_cost IS NULL OR estimated_cost >= 0",
            name="ck_estimated_cost_positive",
        ),
        CheckConstraint(
            "actual_cost IS NULL OR actual_cost >= 0",
            name="ck_actual_cost_positive",
        ),
    )

    property_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    unit_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("units.id", ondelete="SET NULL"),
        nullable=True,
    )
    tenant_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("tenants.id", ondelete="SET NULL"),
        nullable=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    priority: Mapped[MaintenancePriority] = mapped_column(
        default=MaintenancePriority.medium,
        nullable=False,
    )
    status: Mapped[MaintenanceStatus] = mapped_column(
        default=MaintenanceStatus.open,
        nullable=False,
    )
    assignee_user_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    vendor_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("vendors.id", ondelete="SET NULL"),
        nullable=True,
    )
    requested_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    estimated_cost: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    actual_cost: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    # Relationships
    property: Mapped["Property"] = relationship(
        "Property",
        back_populates="maintenance_requests",
    )
    unit: Mapped["Unit"] = relationship(
        "Unit",
        back_populates="maintenance_requests",
    )
    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="maintenance_requests",
    )
    assignee_user: Mapped["User"] = relationship(
        "User",
        back_populates="maintenance_requests",
    )
    vendor: Mapped["Vendor"] = relationship(
        "Vendor",
        back_populates="maintenance_requests",
    )
    activity_events: Mapped[list["ActivityEvent"]] = relationship(
        "ActivityEvent",
        back_populates="maintenance_request",
        foreign_keys="ActivityEvent.maintenance_request_id",
    )
