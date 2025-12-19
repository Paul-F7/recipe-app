#this is where you define the data models for the information you need for each recipe 
from sqlalchemy import Column, Integer, String, Float, DateTime, func, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=False) #added part were it cant be nullable as if its nullable its useless to me if it is

    diets = Column(JSONB, nullable=True, default=list)
    ingredients = Column(JSONB, nullable=False, default=list)
    instructions = Column(JSONB, nullable=False)

    nutrition = Column(JSONB, nullable=False, default=dict)
    equipment = Column(JSONB, nullable=False, default=list)
    dish_type = Column(JSONB, nullable=False, default=list) #maybe for some of these they can be nullable 
    
    cook_time_minutes = Column(Integer)

    # seperate columns for all the taste profiles for quick sorting
    sweetness  = Column(Float, nullable=False)
    saltiness  = Column(Float, nullable=False)
    sourness   = Column(Float, nullable=False)
    bitterness = Column(Float, nullable=False)
    savoriness = Column(Float, nullable=False)
    fattiness  = Column(Float, nullable=False)
    spiciness  = Column(Float, nullable=False)  


class User(Base):
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

    created_at = Column(DateTime, server_default=func.now())
    
    # No unique constraint











