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
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.enums import PaymentMethod, PaymentStatus

if TYPE_CHECKING:
    from app.models.lease import Lease
    from app.models.tenant import Tenant
    from app.models.user import User
    from app.models.activity import ActivityEvent


class RentCharge(BaseModel):
    """Rent charge for a lease period."""

    __tablename__ = "rent_charges"
    __table_args__ = (
        UniqueConstraint(
            "lease_id", "period_start", "period_end",
            name="uq_lease_period_charge",
        ),
        CheckConstraint("period_end >= period_start", name="ck_charge_period"),
        CheckConstraint("amount >= 0", name="ck_charge_amount_positive"),
    )

    lease_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("leases.id", ondelete="CASCADE"),
        nullable=False,
    )
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        default=PaymentStatus.pending,
        nullable=False,
    )

    # Relationships
    lease: Mapped["Lease"] = relationship(
        "Lease",
        back_populates="rent_charges",
    )
    payments: Mapped[list["Payment"]] = relationship(
        "Payment",
        back_populates="rent_charge",
    )


class Payment(BaseModel):
    """Payment record for rent or other charges."""

    __tablename__ = "payments"
    __table_args__ = (
        CheckConstraint("amount > 0", name="ck_payment_amount_positive"),
    )

    rent_charge_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("rent_charges.id", ondelete="SET NULL"),
        nullable=True,
    )
    lease_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("leases.id", ondelete="RESTRICT"),
        nullable=False,
    )
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("tenants.id", ondelete="RESTRICT"),
        nullable=False,
    )
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    method: Mapped[PaymentMethod] = mapped_column(
        default=PaymentMethod.mobile_money,
        nullable=False,
    )
    status: Mapped[PaymentStatus] = mapped_column(
        default=PaymentStatus.pending,
        nullable=False,
    )
    reference: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    recorded_by_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Relationships
    rent_charge: Mapped["RentCharge"] = relationship(
        "RentCharge",
        back_populates="payments",
    )
    lease: Mapped["Lease"] = relationship(
        "Lease",
        back_populates="payments",
    )
    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="payments",
    )
    recorded_by_user: Mapped["User"] = relationship(
        "User",
        back_populates="payments",
    )
    activity_events: Mapped[list["ActivityEvent"]] = relationship(
        "ActivityEvent",
        back_populates="payment",
        foreign_keys="ActivityEvent.payment_id",
    )
