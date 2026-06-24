from typing import TYPE_CHECKING, Annotated

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import verify_token

if TYPE_CHECKING:
    from app.models.user import User


async def get_current_user(
    token: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> "User":
    """
    Get the current authenticated user from token.
    
    This is a placeholder that will be connected to your FastAPI
    dependency system (e.g., via OAuth2PasswordBearer).
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id: str = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database (import here to avoid circular imports)
    from sqlalchemy import select

    from app.models.user import User

    result = await db.execute(
        select(User).where(User.id == user_id).where(User.is_active)
    )
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


# Type alias for dependency injection
CurrentUser = Annotated["User", Depends(get_current_user)]

