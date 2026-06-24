# Quick Reference Card

## 🔧 Setup (One-Time)

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Copy environment file and edit with your Neon credentials
cp .env.example .env
# Edit .env and add DATABASE_URL

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

## 📝 Common Patterns

### Query Data
```python
from sqlalchemy import select
from app.models import User

result = await db.execute(select(User).where(User.email == "test@example.com"))
user = result.scalars().first()
```

### Create Record
```python
user = User(
    organization_id="org-uuid",
    full_name="John Doe",
    email="john@example.com",
    password_hash=hash_password("password123"),
    role=UserRole.manager
)
db.add(user)
await db.commit()
```

### Update Record
```python
user.full_name = "Jane Doe"
db.add(user)
await db.commit()
```

### Delete Record
```python
await db.delete(user)
await db.commit()
```

## 🔐 Authentication

### Hash Password
```python
from app.core.security import hash_password
hashed = hash_password("user_password")
```

### Verify Password
```python
from app.core.security import verify_password
is_correct = verify_password("user_password", hashed)
```

### Create Token
```python
from app.core.security import create_access_token
token = create_access_token({"sub": user_id})
```

### Protected Route
```python
from app.core.auth import CurrentUser

@router.get("/me")
async def get_current_user(current_user: CurrentUser):
    return current_user
```

## 🌐 API Response Format

### Successful Response
```python
@router.get("/users", response_model=list[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()
```

### With Status & Message
```python
from fastapi import HTTPException

@router.post("/login")
async def login(email: str, password: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}
```

## 📊 Database Migration

### Create New Model
```python
# app/models/your_model.py
from app.models.base import BaseModel

class YourModel(BaseModel):
    __tablename__ = "your_models"
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    # Add relationships...
```

### Generate Migration
```bash
alembic revision --autogenerate -m "Add your_models table"
```

### Apply Migration
```bash
alembic upgrade head
```

### Rollback Migration
```bash
alembic downgrade -1
```

## 📁 File Locations

| What | Where |
|------|-------|
| Models | `app/models/*.py` |
| Routes | `app/api/v1/endpoints/*.py` |
| Schemas | `app/schemas/*.py` |
| Config | `app/config.py` |
| Database | `app/core/database.py` |
| Auth | `app/core/auth.py` |
| Migrations | `migrations/versions/*.py` |

## 🧪 Testing

```bash
# Run all tests
pytest

# Run specific file
pytest tests/test_users.py

# Run with coverage
pytest --cov=app
```

## 🔍 Common Imports

```python
# Models
from app.models import User, Property, Unit, Tenant, Lease, Payment

# Enums
from app.models import UserRole, UnitStatus, LeaseStatus, PaymentStatus

# Schemas
from app.schemas import UserCreate, UserResponse, PropertyCreate

# Dependencies
from app.core.database import get_db
from app.core.auth import CurrentUser
from sqlalchemy.ext.asyncio import AsyncSession

# FastAPI
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
```

## ⚡ Performance Tips

1. **Use async/await** - Never use sync database calls
2. **Add indexes** - For frequently queried columns
3. **Eager loading** - Use `selectinload()` to avoid N+1 queries
4. **Connection pooling** - Configured (20 connections)
5. **Pagination** - Use `limit()` and `offset()` for large result sets

## 🛡️ Security Checklist

- [ ] Change `JWT_SECRET_KEY` in production
- [ ] Use HTTPS only in production
- [ ] Keep `.env` out of version control
- [ ] Hash passwords before storing: `hash_password()`
- [ ] Validate user input with Pydantic schemas
- [ ] Check user roles for sensitive operations
- [ ] Add rate limiting to auth endpoints
- [ ] Log all activity events

## 🐛 Debugging

```python
# Print SQL queries (enable in config)
# Set APP_ENV=development and set database echo=True

# Use debugger
import pdb; pdb.set_trace()

# Check migrations
alembic current  # Current migration
alembic branches  # Branch information
alembic history  # Migration history
```

## 📞 Support Resources

- FastAPI Docs: https://fastapi.tiangolo.com
- SQLAlchemy Docs: https://docs.sqlalchemy.org
- Alembic Docs: https://alembic.sqlalchemy.org
- Pydantic Docs: https://docs.pydantic.dev
- PostgreSQL Docs: https://www.postgresql.org/docs

## ✨ Code Style

```python
# Use type hints
def my_function(user_id: str, db: AsyncSession) -> UserResponse:
    pass

# Use constants
class UserStatus:
    ACTIVE = "active"
    INACTIVE = "inactive"

# Use context managers
async with db.begin():
    # transaction
    pass
```

---

**Remember:** Always test your code before deploying! 🚀
