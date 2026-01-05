from sqlalchemy import create_engine #create the database enginer - entry point to database
from sqlalchemy.orm import sessionmaker, DeclarativeBase #base class for all database models

DATABASE_URL = "postgresql+psycopg://recipe_user:test@localhost:5432/recipe_app_db" 
# postgresql+psycopg://USER:PASSWORD@HOST:PORT/DATABASE_NAME
"""
Database Name: recipe_app_db
Username: recipe_user
Password: test
Host: localhost
Port: 5432
"""

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


