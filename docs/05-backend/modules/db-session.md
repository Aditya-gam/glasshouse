# Module — `db/session.py`

> **Depends on:** `tech-stack.md` (SQLAlchemy 2.0 async) · **Consumed by:** `deps.py`, repositories · **Version:** v1

Async engine + session factory.

- One async engine (lifespan-managed); a **request-scoped session** via `deps.py`.
- The scoped session applies the **RLS GUCs** (`rls.py`) and is the unit of work for repositories.
- Workers open their own sessions (same factory).
