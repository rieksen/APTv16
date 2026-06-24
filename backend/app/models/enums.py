from enum import Enum


class UserRole(str, Enum):
    """User roles in the system."""
    owner = "owner"
    manager = "manager"
    maintenance = "maintenance"
    accountant = "accountant"
    viewer = "viewer"


class UnitStatus(str, Enum):
    """Status of a rental unit."""
    occupied = "occupied"
    vacant = "vacant"
    booked = "booked"
    maintenance = "maintenance"
    inactive = "inactive"


class LeaseStatus(str, Enum):
    """Status of a lease agreement."""
    draft = "draft"
    active = "active"
    expiring_soon = "expiring_soon"
    expired = "expired"
    terminated = "terminated"


class PaymentStatus(str, Enum):
    """Status of a payment."""
    pending = "pending"
    paid = "paid"
    overdue = "overdue"
    failed = "failed"
    refunded = "refunded"
    cancelled = "cancelled"


class PaymentMethod(str, Enum):
    """Payment method used."""
    cash = "cash"
    mobile_money = "mobile_money"
    bank_transfer = "bank_transfer"
    card = "card"
    cheque = "cheque"
    other = "other"


class MaintenancePriority(str, Enum):
    """Priority level of a maintenance request."""
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class MaintenanceStatus(str, Enum):
    """Status of a maintenance request."""
    open = "open"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class ActivityType(str, Enum):
    """Type of activity event."""
    rent_payment_received = "rent_payment_received"
    lease_signed = "lease_signed"
    lease_renewed = "lease_renewed"
    maintenance_request_opened = "maintenance_request_opened"
    maintenance_request_completed = "maintenance_request_completed"
    tenant_onboarded = "tenant_onboarded"
    payment_overdue_notice = "payment_overdue_notice"
    unit_status_changed = "unit_status_changed"
