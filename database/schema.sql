-- APT Manager database schema
-- Target: PostgreSQL 14+

create extension if not exists pgcrypto;

create type user_role as enum ('owner', 'manager', 'maintenance', 'accountant', 'viewer');
create type unit_status as enum ('occupied', 'vacant', 'booked', 'maintenance', 'inactive');
create type lease_status as enum ('draft', 'active', 'expiring_soon', 'expired', 'terminated');
create type payment_status as enum ('pending', 'paid', 'overdue', 'failed', 'refunded', 'cancelled');
create type payment_method as enum ('cash', 'mobile_money', 'bank_transfer', 'card', 'cheque', 'other');
create type maintenance_priority as enum ('low', 'medium', 'high', 'critical');
create type maintenance_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type activity_type as enum (
  'rent_payment_received',
  'lease_signed',
  'lease_renewed',
  'maintenance_request_opened',
  'maintenance_request_completed',
  'tenant_onboarded',
  'payment_overdue_notice',
  'unit_status_changed'
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  default_currency char(3) not null default 'UGX',
  timezone text not null default 'Africa/Kampala',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role user_role not null default 'viewer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, email)
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address_line1 text,
  address_line2 text,
  city text,
  region text,
  country text not null default 'Uganda',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_number text not null,
  floor integer,
  bedrooms integer not null default 0 check (bedrooms >= 0),
  bathrooms numeric(3, 1) not null default 1 check (bathrooms >= 0),
  rent_amount numeric(12, 2) not null check (rent_amount >= 0),
  status unit_status not null default 'vacant',
  square_meters numeric(8, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, unit_number)
);

create table tenants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table leases (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete restrict,
  tenant_id uuid not null references tenants(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  rent_amount numeric(12, 2) not null check (rent_amount >= 0),
  deposit_amount numeric(12, 2) not null default 0 check (deposit_amount >= 0),
  status lease_status not null default 'draft',
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date > start_date)
);

create unique index leases_one_active_per_unit
  on leases(unit_id)
  where status in ('active', 'expiring_soon');

create table lease_documents (
  id uuid primary key default gen_random_uuid(),
  lease_id uuid not null references leases(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  uploaded_by uuid references users(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

create table rent_charges (
  id uuid primary key default gen_random_uuid(),
  lease_id uuid not null references leases(id) on delete cascade,
  due_date date not null,
  period_start date not null,
  period_end date not null,
  amount numeric(12, 2) not null check (amount >= 0),
  status payment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start)
);

create unique index rent_charges_one_charge_per_lease_period
  on rent_charges(lease_id, period_start, period_end);

create table payments (
  id uuid primary key default gen_random_uuid(),
  rent_charge_id uuid references rent_charges(id) on delete set null,
  lease_id uuid not null references leases(id) on delete restrict,
  tenant_id uuid not null references tenants(id) on delete restrict,
  amount numeric(12, 2) not null check (amount > 0),
  paid_at timestamptz,
  method payment_method not null default 'mobile_money',
  status payment_status not null default 'pending',
  reference text,
  notes text,
  recorded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  specialty text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  tenant_id uuid references tenants(id) on delete set null,
  title text not null,
  description text,
  priority maintenance_priority not null default 'medium',
  status maintenance_status not null default 'open',
  assignee_user_id uuid references users(id) on delete set null,
  vendor_id uuid references vendors(id) on delete set null,
  requested_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  estimated_cost numeric(12, 2) check (estimated_cost is null or estimated_cost >= 0),
  actual_cost numeric(12, 2) check (actual_cost is null or actual_cost >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table activity_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  type activity_type not null,
  title text not null,
  detail text,
  actor_user_id uuid references users(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  unit_id uuid references units(id) on delete set null,
  tenant_id uuid references tenants(id) on delete set null,
  lease_id uuid references leases(id) on delete set null,
  payment_id uuid references payments(id) on delete set null,
  maintenance_request_id uuid references maintenance_requests(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table monthly_property_metrics (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  month date not null,
  revenue_amount numeric(12, 2) not null default 0 check (revenue_amount >= 0),
  previous_revenue_amount numeric(12, 2) not null default 0 check (previous_revenue_amount >= 0),
  occupied_units integer not null default 0 check (occupied_units >= 0),
  vacant_units integer not null default 0 check (vacant_units >= 0),
  booked_units integer not null default 0 check (booked_units >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (property_id, month)
);

create index units_property_status_idx on units(property_id, status);
create index tenants_org_name_idx on tenants(organization_id, full_name);
create index leases_tenant_status_idx on leases(tenant_id, status);
create index rent_charges_due_status_idx on rent_charges(due_date, status);
create index payments_lease_status_idx on payments(lease_id, status);
create index maintenance_property_status_idx on maintenance_requests(property_id, status);
create index activity_org_occurred_idx on activity_events(organization_id, occurred_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger organizations_set_updated_at
  before update on organizations
  for each row execute function set_updated_at();

create trigger users_set_updated_at
  before update on users
  for each row execute function set_updated_at();

create trigger properties_set_updated_at
  before update on properties
  for each row execute function set_updated_at();

create trigger units_set_updated_at
  before update on units
  for each row execute function set_updated_at();

create trigger tenants_set_updated_at
  before update on tenants
  for each row execute function set_updated_at();

create trigger leases_set_updated_at
  before update on leases
  for each row execute function set_updated_at();

create trigger rent_charges_set_updated_at
  before update on rent_charges
  for each row execute function set_updated_at();

create trigger payments_set_updated_at
  before update on payments
  for each row execute function set_updated_at();

create trigger vendors_set_updated_at
  before update on vendors
  for each row execute function set_updated_at();

create trigger maintenance_requests_set_updated_at
  before update on maintenance_requests
  for each row execute function set_updated_at();

create trigger monthly_property_metrics_set_updated_at
  before update on monthly_property_metrics
  for each row execute function set_updated_at();
