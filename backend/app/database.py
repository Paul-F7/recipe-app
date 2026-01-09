import os
from pathlib import Path

from sqlalchemy import create_engine #create the database enginer - entry point to database
from sqlalchemy.orm import sessionmaker, DeclarativeBase #base class for all database models

def _load_env() -> None:
    env_path = Path(__file__).resolve().parents[1] / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())

_load_env()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

engine = create_engine(DATABASE_URL, echo=True) #this creates the database enginer(main connection to it)
#echo=True prints SQLqueries to consolve for debuggging

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False) #autofulsh dont automatically save changs, autocommit is commit transactions
# creates a factory that makes database sessions, bind=engine connects session to db

# base class that every other model inherits from
class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()     # Create a new session
    try:
        yield db            # Give the session to whoever needs it
    finally:
        db.close()          # Always close the session when done

