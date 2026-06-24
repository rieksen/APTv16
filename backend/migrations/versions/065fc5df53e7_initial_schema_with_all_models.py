"""Initial schema with all models

Revision ID: 065fc5df53e7
Revises: 
Create Date: 2026-06-24 13:16:44.659998

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '065fc5df53e7'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create enums
    user_role_enum = postgresql.ENUM('owner', 'manager', 'maintenance', 'accountant', 'viewer', name='user_role')
    user_role_enum.create(op.get_bind(), checkfirst=True)
    
    unit_status_enum = postgresql.ENUM('occupied', 'vacant', 'booked', 'maintenance', 'inactive', name='unit_status')
    unit_status_enum.create(op.get_bind(), checkfirst=True)
    
    lease_status_enum = postgresql.ENUM('draft', 'active', 'expiring_soon', 'expired', 'terminated', name='lease_status')
    lease_status_enum.create(op.get_bind(), checkfirst=True)
    
    payment_status_enum = postgresql.ENUM('pending', 'paid', 'overdue', 'failed', 'refunded', 'cancelled', name='payment_status')
    payment_status_enum.create(op.get_bind(), checkfirst=True)
    
    payment_method_enum = postgresql.ENUM('cash', 'mobile_money', 'bank_transfer', 'card', 'cheque', 'other', name='payment_method')
    payment_method_enum.create(op.get_bind(), checkfirst=True)
    
    maintenance_priority_enum = postgresql.ENUM('low', 'medium', 'high', 'critical', name='maintenance_priority')
    maintenance_priority_enum.create(op.get_bind(), checkfirst=True)
    
    maintenance_status_enum = postgresql.ENUM('open', 'in_progress', 'completed', 'cancelled', name='maintenance_status')
    maintenance_status_enum.create(op.get_bind(), checkfirst=True)
    
    activity_type_enum = postgresql.ENUM(
        'rent_payment_received', 'lease_signed', 'lease_renewed',
        'maintenance_request_opened', 'maintenance_request_completed',
        'tenant_onboarded', 'payment_overdue_notice', 'unit_status_changed',
        name='activity_type'
    )
    activity_type_enum.create(op.get_bind(), checkfirst=True)
    
    # Create organizations table
    op.create_table(
        'organizations',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('default_currency', sa.String(3), nullable=False, server_default='UGX'),
        sa.Column('timezone', sa.String(50), nullable=False, server_default='Africa/Kampala'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('organization_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('role', user_role_enum, nullable=False, server_default='viewer'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('organization_id', 'email', name='uq_organization_email')
    )
    
    # Create properties table
    op.create_table(
        'properties',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('organization_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('address_line1', sa.String(255), nullable=True),
        sa.Column('address_line2', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=True),
        sa.Column('region', sa.String(100), nullable=True),
        sa.Column('country', sa.String(100), nullable=False, server_default='Uganda'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create units table
    op.create_table(
        'units',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('property_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('unit_number', sa.String(50), nullable=False),
        sa.Column('floor', sa.Integer(), nullable=True),
        sa.Column('bedrooms', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('bathrooms', sa.Numeric(3, 1), nullable=False, server_default='1'),
        sa.Column('rent_amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('status', unit_status_enum, nullable=False, server_default='vacant'),
        sa.Column('square_meters', sa.Numeric(8, 2), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('bedrooms >= 0', name='ck_bedrooms_positive'),
        sa.CheckConstraint('bathrooms >= 0', name='ck_bathrooms_positive'),
        sa.CheckConstraint('rent_amount >= 0', name='ck_rent_positive'),
        sa.CheckConstraint('square_meters IS NULL OR square_meters >= 0', name='ck_sqm_positive'),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('property_id', 'unit_number', name='uq_property_unit')
    )
    
    # Create tenants table
    op.create_table(
        'tenants',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('organization_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('emergency_contact_name', sa.String(255), nullable=True),
        sa.Column('emergency_contact_phone', sa.String(20), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create leases table
    op.create_table(
        'leases',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('unit_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('rent_amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('deposit_amount', sa.Numeric(12, 2), nullable=False, server_default='0'),
        sa.Column('status', lease_status_enum, nullable=False, server_default='draft'),
        sa.Column('signed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('end_date > start_date', name='ck_lease_dates'),
        sa.CheckConstraint('rent_amount >= 0', name='ck_lease_rent_positive'),
        sa.CheckConstraint('deposit_amount >= 0', name='ck_lease_deposit_positive'),
        sa.ForeignKeyConstraint(['unit_id'], ['units.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create vendors table
    op.create_table(
        'vendors',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('organization_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('specialty', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create rent_charges table
    op.create_table(
        'rent_charges',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('lease_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('due_date', sa.Date(), nullable=False),
        sa.Column('period_start', sa.Date(), nullable=False),
        sa.Column('period_end', sa.Date(), nullable=False),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('status', payment_status_enum, nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('period_end >= period_start', name='ck_charge_period'),
        sa.CheckConstraint('amount >= 0', name='ck_charge_amount_positive'),
        sa.ForeignKeyConstraint(['lease_id'], ['leases.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('lease_id', 'period_start', 'period_end', name='uq_lease_period_charge')
    )
    
    # Create payments table
    op.create_table(
        'payments',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('rent_charge_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('lease_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('method', payment_method_enum, nullable=False, server_default='mobile_money'),
        sa.Column('status', payment_status_enum, nullable=False, server_default='pending'),
        sa.Column('reference', sa.String(255), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('recorded_by_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('amount > 0', name='ck_payment_amount_positive'),
        sa.ForeignKeyConstraint(['lease_id'], ['leases.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['rent_charge_id'], ['rent_charges.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['recorded_by_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create lease_documents table
    op.create_table(
        'lease_documents',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('lease_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_url', sa.String(512), nullable=False),
        sa.Column('uploaded_by_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('uploaded_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['lease_id'], ['leases.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['uploaded_by_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create maintenance_requests table
    op.create_table(
        'maintenance_requests',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('property_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('unit_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('priority', maintenance_priority_enum, nullable=False, server_default='medium'),
        sa.Column('status', maintenance_status_enum, nullable=False, server_default='open'),
        sa.Column('assignee_user_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('vendor_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('requested_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('estimated_cost', sa.Numeric(12, 2), nullable=True),
        sa.Column('actual_cost', sa.Numeric(12, 2), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('estimated_cost IS NULL OR estimated_cost >= 0', name='ck_estimated_cost_positive'),
        sa.CheckConstraint('actual_cost IS NULL OR actual_cost >= 0', name='ck_actual_cost_positive'),
        sa.ForeignKeyConstraint(['assignee_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['unit_id'], ['units.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['vendor_id'], ['vendors.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create activity_events table
    op.create_table(
        'activity_events',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('organization_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('type', activity_type_enum, nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('detail', sa.Text(), nullable=True),
        sa.Column('actor_user_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('property_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('unit_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('lease_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('payment_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('maintenance_request_id', postgresql.UUID(as_uuid=False), nullable=True),
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('occurred_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['actor_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['lease_id'], ['leases.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['maintenance_request_id'], ['maintenance_requests.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['payment_id'], ['payments.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['unit_id'], ['units.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create monthly_property_metrics table
    op.create_table(
        'monthly_property_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('property_id', postgresql.UUID(as_uuid=False), nullable=False),
        sa.Column('month', sa.Date(), nullable=False),
        sa.Column('revenue_amount', sa.Numeric(12, 2), nullable=False, server_default='0'),
        sa.Column('previous_revenue_amount', sa.Numeric(12, 2), nullable=False, server_default='0'),
        sa.Column('occupied_units', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('vacant_units', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('booked_units', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('revenue_amount >= 0', name='ck_revenue_positive'),
        sa.CheckConstraint('previous_revenue_amount >= 0', name='ck_prev_revenue_positive'),
        sa.CheckConstraint('occupied_units >= 0', name='ck_occupied_positive'),
        sa.CheckConstraint('vacant_units >= 0', name='ck_vacant_positive'),
        sa.CheckConstraint('booked_units >= 0', name='ck_booked_positive'),
        sa.ForeignKeyConstraint(['property_id'], ['properties.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('property_id', 'month', name='uq_property_month')
    )
    
    # Create indexes
    op.create_index('units_property_status_idx', 'units', ['property_id', 'status'])
    op.create_index('tenants_org_name_idx', 'tenants', ['organization_id', 'full_name'])
    op.create_index('leases_tenant_status_idx', 'leases', ['tenant_id', 'status'])
    op.create_index('rent_charges_due_status_idx', 'rent_charges', ['due_date', 'status'])
    op.create_index('payments_lease_status_idx', 'payments', ['lease_id', 'status'])
    op.create_index('maintenance_property_status_idx', 'maintenance_requests', ['property_id', 'status'])
    op.create_index('activity_org_occurred_idx', 'activity_events', ['organization_id', sa.desc('occurred_at')])


def downgrade() -> None:
    """Downgrade schema."""
    # Drop indexes
    op.drop_index('activity_org_occurred_idx')
    op.drop_index('maintenance_property_status_idx')
    op.drop_index('payments_lease_status_idx')
    op.drop_index('rent_charges_due_status_idx')
    op.drop_index('leases_tenant_status_idx')
    op.drop_index('tenants_org_name_idx')
    op.drop_index('units_property_status_idx')
    
    # Drop tables (order matters due to foreign keys)
    op.drop_table('monthly_property_metrics')
    op.drop_table('activity_events')
    op.drop_table('maintenance_requests')
    op.drop_table('lease_documents')
    op.drop_table('payments')
    op.drop_table('rent_charges')
    op.drop_table('vendors')
    op.drop_table('leases')
    op.drop_table('tenants')
    op.drop_table('units')
    op.drop_table('properties')
    op.drop_table('users')
    op.drop_table('organizations')
    
    # Drop enums
    op.execute('DROP TYPE IF EXISTS activity_type CASCADE')
    op.execute('DROP TYPE IF EXISTS maintenance_status CASCADE')
    op.execute('DROP TYPE IF EXISTS maintenance_priority CASCADE')
    op.execute('DROP TYPE IF EXISTS payment_method CASCADE')
    op.execute('DROP TYPE IF EXISTS payment_status CASCADE')
    op.execute('DROP TYPE IF EXISTS lease_status CASCADE')
    op.execute('DROP TYPE IF EXISTS unit_status CASCADE')
    op.execute('DROP TYPE IF EXISTS user_role CASCADE')
