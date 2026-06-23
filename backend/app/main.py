from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import health


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Backend API for the APT apartment-management platform.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.backend_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)

    @app.get("/", tags=["root"])
    def read_root() -> dict[str, str]:
        return {
            "name": settings.app_name,
            "environment": settings.app_env,
            "status": "ok",
        }

    return app


app = create_app()
