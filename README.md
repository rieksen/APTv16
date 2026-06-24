# APT

A modern, production-ready Apartment Management SaaS platform designed for landlords, property managers, and tenants. This system streamlines rent tracking, tenant management, unit administration, and financial reporting through a clean, responsive dashboard UI.

Built from a Figma design and implemented as a scalable React frontend architecture ready for full backend integration.

Frontend Demo: `https://aptv2.pages.dev/`

## Running the frontend

Run `npm i` to install the dependencies.

Run `npm run dev` to start the Vite development server.

## Running the backend

The FastAPI backend lives in `backend/`.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Useful local endpoints:

- API root: `http://localhost:8000/`
- Health check: `http://localhost:8000/health`
- Swagger docs: `http://localhost:8000/docs`

## Backend tests

```bash
cd backend
pytest
```

## Database schema

A PostgreSQL schema for the apartment-management domain is expected at `database/schema.sql`.
