from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import UserRole

if TYPE_CHECKING:
    from app.models.organization import Organization
    from app.models.activity import ActivityEvent
    from app.models.lease import LeaseDocument
    from app.models.maintenance import MaintenanceRequest
    from app.models.payment import Payment


class User(BaseModel):
    """User account in the system."""

    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("organization_id", "email", name="uq_organization_email"),
    )

    organization_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(default=UserRole.viewer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    organization: Mapped["Organization"] = relationship(
        "Organization",
        back_populates="users",
    )
    activity_events: Mapped[list["ActivityEvent"]] = relationship(
        "ActivityEvent",
        back_populates="actor_user",
        foreign_keys="ActivityEvent.actor_user_id",
    )
    lease_documents: Mapped[list["LeaseDocument"]] = relationship(
        "LeaseDocument",
        back_populates="uploaded_by_user",
    )
    maintenance_requests: Mapped[list["MaintenanceRequest"]] = relationship(
        "MaintenanceRequest",
        back_populates="assignee_user",
        foreign_keys="MaintenanceRequest.assignee_user_id",
    )
    payments: Mapped[list["Payment"]] = relationship(
        "Payment",
        back_populates="recorded_by_user",
        foreign_keys="Payment.recorded_by_id",
    )
