#File for CRUD helper functions for the swipes database
from sqlalchemy.orm import Session

def get_recipe(db: Session, recipe_id: int):
    """Get a recipe by ID"""
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()