from datetime import date, datetime

from pydantic import BaseModel

from app.models.enums import (
    LeaseStatus,
    MaintenancePriority,
    MaintenanceStatus,
    PaymentMethod,
    PaymentStatus,
    UnitStatus,
)


# ==================== PROPERTY SCHEMAS ====================


class PropertyBase(BaseModel):
    name: str
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    region: str | None = None
    country: str = "Uganda"
    notes: str | None = None


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    name: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    region: str | None = None
    country: str | None = None
    notes: str | None = None


class PropertyResponse(PropertyBase):
    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== UNIT SCHEMAS ====================


class UnitBase(BaseModel):
    unit_number: str
    floor: int | None = None
    bedrooms: int = 0
    bathrooms: float = 1
    rent_amount: float
    status: UnitStatus = UnitStatus.vacant
    square_meters: float | None = None
    notes: str | None = None


class UnitCreate(UnitBase):
    pass


class UnitUpdate(BaseModel):
    unit_number: str | None = None
    floor: int | None = None
    bedrooms: int | None = None
    bathrooms: float | None = None
    rent_amount: float | None = None
    status: UnitStatus | None = None
    square_meters: float | None = None
    notes: str | None = None


class UnitResponse(UnitBase):
    id: str
    property_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== TENANT SCHEMAS ====================


class TenantBase(BaseModel):
    full_name: str
    email: str | None = None
    phone: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None
    notes: str | None = None


class TenantCreate(TenantBase):
    pass


class TenantUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None
    notes: str | None = None


class TenantResponse(TenantBase):
    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== LEASE SCHEMAS ====================


class LeaseBase(BaseModel):
    start_date: date
    end_date: date
    rent_amount: float
    deposit_amount: float = 0
    status: LeaseStatus = LeaseStatus.draft


class LeaseCreate(LeaseBase):
    unit_id: str
    tenant_id: str


class LeaseUpdate(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    rent_amount: float | None = None
    deposit_amount: float | None = None
    status: LeaseStatus | None = None
    signed_at: datetime | None = None


class LeaseResponse(LeaseBase):
    id: str
    unit_id: str
    tenant_id: str
    signed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== PAYMENT SCHEMAS ====================


class PaymentBase(BaseModel):
    amount: float
    method: PaymentMethod = PaymentMethod.mobile_money
    status: PaymentStatus = PaymentStatus.pending
    reference: str | None = None
    notes: str | None = None


class PaymentCreate(PaymentBase):
    lease_id: str
    tenant_id: str
    rent_charge_id: str | None = None


class PaymentUpdate(BaseModel):
    status: PaymentStatus | None = None
    paid_at: datetime | None = None
    notes: str | None = None


class PaymentResponse(PaymentBase):
    id: str
    lease_id: str
    tenant_id: str
    rent_charge_id: str | None = None
    paid_at: datetime | None = None
    recorded_by_id: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==================== MAINTENANCE REQUEST SCHEMAS ====================


class MaintenanceRequestBase(BaseModel):
    title: str
    description: str | None = None
    priority: MaintenancePriority = MaintenancePriority.medium
    status: MaintenanceStatus = MaintenanceStatus.open
    estimated_cost: float | None = None


class MaintenanceRequestCreate(MaintenanceRequestBase):
    property_id: str
    unit_id: str | None = None
    tenant_id: str | None = None
    assignee_user_id: str | None = None
    vendor_id: str | None = None


class MaintenanceRequestUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    priority: MaintenancePriority | None = None
    status: MaintenanceStatus | None = None
    assignee_user_id: str | None = None
    vendor_id: str | None = None
    estimated_cost: float | None = None
    actual_cost: float | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None


class MaintenanceRequestResponse(MaintenanceRequestBase):
    id: str
    property_id: str
    unit_id: str | None = None
    tenant_id: str | None = None
    assignee_user_id: str | None = None
    vendor_id: str | None = None
    requested_at: datetime
    started_at: datetime | None = None
    completed_at: datetime | None = None
    actual_cost: float | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
