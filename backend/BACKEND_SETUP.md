# APT Backend Setup Guide

## 📋 Overview

The backend has been fully configured with:
- ✅ FastAPI web framework
- ✅ SQLAlchemy ORM with async support
- ✅ PostgreSQL database with asyncpg driver
- ✅ Alembic database migrations
- ✅ JWT authentication foundation
- ✅ All 12 SQLAlchemy models with relationships
- ✅ Pydantic schemas for validation
- ✅ Complete initial migration file

## 🏗️ Architecture

### Directory Structure
```
app/
├── core/              # Core functionality
│   ├── database.py    # SQLAlchemy async engine setup
│   ├── security.py    # Password hashing & JWT tokens
│   └── auth.py        # Authentication dependencies
├── models/            # SQLAlchemy ORM models
│   ├── base.py        # Base model with common fields
│   ├── enums.py       # All enum types
│   ├── organization.py
│   ├── user.py
│   ├── property.py
│   ├── unit.py
│   ├── tenant.py
│   ├── lease.py
│   ├── payment.py
│   ├── maintenance.py
│   ├── vendor.py
│   ├── activity.py
│   └── metrics.py
├── schemas/           # Pydantic request/response schemas
│   ├── organization.py
│   ├── user.py
│   ├── token.py
│   ├── models.py      # All model schemas
├── api/               # API routes (v1 ready)
│   └── v1/endpoints/  # Individual endpoint modules
├── routers/           # Legacy routers
│   └── health.py
├── config.py          # Settings management
└── main.py            # FastAPI app initialization

migrations/           # Alembic database migrations
├── versions/
│   └── 065fc5df53e7_initial_schema...py  # Initial schema
└── env.py            # Migration environment
```

### Database Models

**Core Models (13 tables):**
1. **Organization** - Root entity, parent to all data
2. **User** - Staff/managers with roles (owner, manager, maintenance, accountant, viewer)
3. **Property** - Buildings managed by org
4. **Unit** - Individual rental units in properties
5. **Tenant** - Renters with contact info
6. **Lease** - Agreements between tenants and units
7. **LeaseDocument** - PDF/documents attached to leases
8. **RentCharge** - Monthly rent charges (pending/paid/overdue)
9. **Payment** - Payment records linked to rent charges
10. **Vendor** - Service providers for maintenance
11. **MaintenanceRequest** - Work orders for repairs
12. **ActivityEvent** - Audit log of all important events
13. **MonthlyPropertyMetric** - Monthly statistics

### Enums
- `UserRole`: owner, manager, maintenance, accountant, viewer
- `UnitStatus`: occupied, vacant, booked, maintenance, inactive
- `LeaseStatus`: draft, active, expiring_soon, expired, terminated
- `PaymentStatus`: pending, paid, overdue, failed, refunded, cancelled
- `PaymentMethod`: cash, mobile_money, bank_transfer, card, cheque, other
- `MaintenancePriority`: low, medium, high, critical
- `MaintenanceStatus`: open, in_progress, completed, cancelled
- `ActivityType`: 8 different event types for audit log

## 🚀 Quick Start

### 1. Set Up Environment Variables

Copy the example and add your Neon PostgreSQL URL:

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
APP_ENV=development
DATABASE_URL=postgresql+asyncpg://user:password@hostname/database
JWT_SECRET_KEY=your-super-secret-key-change-in-production
```

### 2. Install Dependencies

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

### 3. Run Database Migrations

```bash
alembic upgrade head
```

This will:
- Create all 8 enums
- Create all 13 tables
- Create all foreign key constraints
- Create all unique constraints
- Create all check constraints
- Create all indexes

### 4. Run the API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- http://localhost:8000/ - Root endpoint
- http://localhost:8000/health - Health check
- http://localhost:8000/docs - Swagger UI documentation
- http://localhost:8000/redoc - ReDoc documentation

## 🔑 Key Features

### Authentication Foundation
- JWT token creation and validation
- Password hashing with bcrypt
- User role-based access control (RBAC) ready
- `get_current_user` dependency for protecting routes

### Async Database Operations
- All database operations are fully async
- Uses `asyncpg` for high performance
- Connection pooling configured
- Transactions support

### Type Safety
- Full type hints throughout
- Pydantic models for request/response validation
- SQLAlchemy Mapped types for ORM models

### Migration Support
- Alembic configured for async PostgreSQL
- Initial migration covers complete schema
- Easy to add future migrations

## 📝 Creating a New Endpoint

### Example: Get all properties

```python
# app/api/v1/endpoints/properties.py
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Property
from app.schemas import PropertyResponse

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("", response_model=list[PropertyResponse])
async def list_properties(db: AsyncSession = Depends(get_db)):
    """Get all properties."""
    result = await db.execute(select(Property))
    properties = result.scalars().all()
    return properties
```

### Example: Protected endpoint (requires auth)

```python
from app.core.auth import CurrentUser

@router.post("", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    current_user: CurrentUser,
    db: AsyncSession = Depends(get_db),
):
    """Create a property (admin only)."""
    # In a real app, check current_user.role == UserRole.owner
    property = Property(**property_data.dict())
    db.add(property)
    await db.commit()
    await db.refresh(property)
    return property
```

## 🔧 Configuration

All settings are in `app/config.py` using Pydantic Settings:

- `APP_NAME` - Application name (default: "APT API")
- `APP_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret key for signing JWTs
- `JWT_ALGORITHM` - JWT algorithm (default: HS256)
- `JWT_EXPIRATION_HOURS` - Token expiry (default: 24)
- `BACKEND_CORS_ORIGINS` - Allowed origins

## 🧪 Testing

Run tests with:

```bash
pytest
```

Tests are configured in `pyproject.toml` with pytest-asyncio support for async tests.

## 📚 Database Connection

The database connection is configured in `app/core/database.py`:

```python
# Async engine with asyncpg
engine = create_async_engine(
    settings.database_url,
    echo=settings.app_env == "development",  # Log SQL in dev
    pool_pre_ping=True,  # Verify connections
    pool_size=20,
    max_overflow=0,
)

# Session factory for dependency injection
async_session = async_sessionmaker(engine, class_=AsyncSession)

# Dependency for routes
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
```

## 🔒 Security Notes

1. **JWT_SECRET_KEY**: Change this in production! Use a long, random string.
2. **Password Storage**: All passwords must be hashed with `hash_password()` before storing.
3. **CORS Origins**: Update `BACKEND_CORS_ORIGINS` to match your frontend URL.
4. **Environment Variables**: Never commit `.env` files; use `.env.example` as template.

## 🚦 Health Check

The API includes a built-in health check endpoint:

```bash
curl http://localhost:8000/health
# {"status": "ok"}
```

## 📖 Next Steps

1. **Create API Routes**: Implement CRUD endpoints for each model in `app/api/v1/endpoints/`
2. **Add Authentication**: Implement login endpoint that generates JWT tokens
3. **Add Business Logic**: Create service layer for complex operations
4. **Add Tests**: Write unit and integration tests using pytest
5. **Deploy**: Deploy to production with proper environment configuration

## 🆘 Troubleshooting

### Database Connection Errors
- Verify `DATABASE_URL` is correct (check Neon credentials)
- Ensure PostgreSQL is running
- Check network connectivity to database host

### Migration Errors
- Make sure you've run `alembic upgrade head` before starting the app
- If migrations fail, check the migration file in `migrations/versions/`

### Import Errors
- Make sure you've installed dependencies: `pip install -e ".[dev]"`
- Python path should include the backend directory

### JWT Errors
- Verify `JWT_SECRET_KEY` is set in `.env`
- Ensure token format is `Bearer <token>` in Authorization header
