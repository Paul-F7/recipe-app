from sqlalchemy import create_engine
from app.database import Base, DATABASE_URL
from app.models import User, Swipe
engine = create_engine(DATABASE_URL)

def create_tables():
    try:
        # 2. Create the engine
        engine = create_engine(DATABASE_URL)
        
        # 3. Create all tables defined in Base
        print("Connecting to Supabase and creating tables...")
        Base.metadata.create_all(engine)
        
        print("Success! Swipe and Recipe tables have been created.")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    create_tables()
