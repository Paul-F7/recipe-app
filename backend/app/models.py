#this is where you define the data models for the information you need for each recipe
# sqlalchemy and alembic models
from sqlalchemy import Column, Integer, String, Float, DateTime, func, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    image_name = Column(String, nullable=True)
    
    # Core recipe data
    instructions = Column(JSONB, nullable=False, default=list)
    ingredients = Column(JSONB, nullable=False, default=list)
    cleaned_ingredients = Column(JSONB, nullable=True, default=list)  # Optional, from SQL but not used
    
    # Map Python attribute names to SQL column names
    dish_type = Column("meal_types", JSONB, nullable=False, default=list)
    diets = Column("dietary_tags", JSONB, nullable=False, default=list)
    
    nutrition = Column(JSONB, nullable=True, default=dict)
    taste_profile = Column(JSONB, nullable=False, default=dict)
    
    created_at = Column(DateTime, server_default=func.now())
    


class User(Base): #maybe you should add the swipes here
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    # Device-based identity (UUID from frontend)
    device_id = Column(String, nullable=False, unique=True)

    created_at = Column(DateTime, server_default=func.now()) #database sets the time at the exact moment the row is created


class Swipe(Base):
    __tablename__ = "swipes"
    id = Column(Integer, primary_key=True)

    # ForeignKey points to other table
    # Ondelete handles if that recipe/user is deleted delete everything with them in it
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)

    liked = Column(Boolean, nullable=False)

    # also stored in swipes for easier access
    taste_profile = Column(JSONB, nullable=False, default=dict)
    dish_type = Column(JSONB, nullable=False, default=list)
    

    created_at = Column(DateTime, server_default=func.now())
    
    # No unique constraint











