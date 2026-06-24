from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Date, ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel

if TYPE_CHECKING:
    from app.models.property import Property


class MonthlyPropertyMetric(BaseModel):
    """Monthly metrics/statistics for a property."""

    __tablename__ = "monthly_property_metrics"
    __table_args__ = (
        UniqueConstraint("property_id", "month", name="uq_property_month"),
        CheckConstraint("revenue_amount >= 0", name="ck_revenue_positive"),
        CheckConstraint("previous_revenue_amount >= 0", name="ck_prev_revenue_positive"),
        CheckConstraint("occupied_units >= 0", name="ck_occupied_positive"),
        CheckConstraint("vacant_units >= 0", name="ck_vacant_positive"),
        CheckConstraint("booked_units >= 0", name="ck_booked_positive"),
    )

    property_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    month: Mapped[date] = mapped_column(Date, nullable=False)
    revenue_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    previous_revenue_amount: Mapped[float] = mapped_column(
        Numeric(12, 2), nullable=False, default=0
    )
    occupied_units: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    vacant_units: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    booked_units: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Relationships
    property: Mapped["Property"] = relationship(
        "Property",
        back_populates="monthly_metrics",
    )
