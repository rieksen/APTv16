from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import LeaseStatus

if TYPE_CHECKING:
    from app.models.unit import Unit
    from app.models.tenant import Tenant
    from app.models.user import User
    from app.models.payment import Payment, RentCharge
    from app.models.activity import ActivityEvent


class Lease(BaseModel):
    """Lease agreement between tenant and property."""

    __tablename__ = "leases"
    __table_args__ = (
        CheckConstraint("end_date > start_date", name="ck_lease_dates"),
        CheckConstraint("rent_amount >= 0", name="ck_lease_rent_positive"),
        CheckConstraint("deposit_amount >= 0", name="ck_lease_deposit_positive"),
    )

    unit_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("units.id", ondelete="RESTRICT"),
        nullable=False,
    )
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("tenants.id", ondelete="RESTRICT"),
        nullable=False,
    )
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    rent_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    deposit_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    status: Mapped[LeaseStatus] = mapped_column(default=LeaseStatus.draft, nullable=False)
    signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    unit: Mapped["Unit"] = relationship(
        "Unit",
        back_populates="leases",
    )
    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="leases",
    )
    payments: Mapped[list["Payment"]] = relationship(
        "Payment",
        back_populates="lease",
        cascade="all, delete-orphan",
    )
    rent_charges: Mapped[list["RentCharge"]] = relationship(
        "RentCharge",
        back_populates="lease",
        cascade="all, delete-orphan",
    )
    documents: Mapped[list["LeaseDocument"]] = relationship(
        "LeaseDocument",
        back_populates="lease",
        cascade="all, delete-orphan",
    )
    activity_events: Mapped[list["ActivityEvent"]] = relationship(
        "ActivityEvent",
        back_populates="lease",
        foreign_keys="ActivityEvent.lease_id",
    )


class LeaseDocument(BaseModel):
    """Document attached to a lease."""

    __tablename__ = "lease_documents"

    lease_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("leases.id", ondelete="CASCADE"),
        nullable=False,
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_url: Mapped[str] = mapped_column(String(512), nullable=False)
    uploaded_by_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Relationships
    lease: Mapped["Lease"] = relationship(
        "Lease",
        back_populates="documents",
    )
    uploaded_by_user: Mapped["User"] = relationship(
        "User",
        back_populates="lease_documents",
    )
