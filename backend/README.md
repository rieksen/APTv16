# APT FastAPI Backend

FastAPI backend for the APT apartment-management platform.

## Setup

Create a virtual environment and install dependencies:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
```

## Development

Run the API locally:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- `http://localhost:8000/`
- `http://localhost:8000/health`
- `http://localhost:8000/docs`

## Configuration

Settings are read from environment variables:

- `APP_NAME` defaults to `APT API`
- `APP_ENV` defaults to `development`
- `DATABASE_URL` is optional until database-backed routes are added
- `BACKEND_CORS_ORIGINS` defaults to `http://localhost:5173,http://127.0.0.1:5173`

Copy `.env.example` to `.env` when you want local overrides.

## Tests

```bash
pytest
```
