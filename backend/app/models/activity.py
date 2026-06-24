from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import ActivityType

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.user import User
    from app.models.property import Property
    from app.models.unit import Unit
    from app.models.tenant import Tenant
    from app.models.lease import Lease
    from app.models.payment import Payment
    from app.models.maintenance import MaintenanceRequest


class ActivityEvent(BaseModel):
    """Activity audit log for tracking important events."""

    __tablename__ = "activity_events"

    organization_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    type: Mapped[ActivityType] = mapped_column(nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    actor_user_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    property_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("properties.id", ondelete="SET NULL"),
        nullable=True,
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
    lease_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("leases.id", ondelete="SET NULL"),
        nullable=True,
    )
    payment_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("payments.id", ondelete="SET NULL"),
        nullable=True,
    )
    maintenance_request_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("maintenance_requests.id", ondelete="SET NULL"),
        nullable=True,
    )
    metadata_obj: Mapped[dict] = mapped_column(
        "metadata",
        JSON,
        nullable=False,
        default={},
    )
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Relationships
    organization: Mapped["Organization"] = relationship(
        "Organization",
        back_populates="activity_events",
    )
    actor_user: Mapped["User"] = relationship(
        "User",
        back_populates="activity_events",
    )
    property: Mapped["Property"] = relationship(
        "Property",
        back_populates="activity_events",
    )
    unit: Mapped["Unit"] = relationship(
        "Unit",
        back_populates="activity_events",
    )
    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="activity_events",
    )
    lease: Mapped["Lease"] = relationship(
        "Lease",
        back_populates="activity_events",
    )
    payment: Mapped["Payment"] = relationship(
        "Payment",
        back_populates="activity_events",
    )
    maintenance_request: Mapped["MaintenanceRequest"] = relationship(
        "MaintenanceRequest",
        back_populates="activity_events",
    )
