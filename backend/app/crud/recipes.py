#File for CRUD helper functions for the swipes database
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Recipe
from app.models import Swipe
from typing import List, Optional

def get_recipe(db: Session, recipe_id: int):
    """Get a recipe by ID"""
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()

# gets all the unseen recipes -- this is where all the filteration happens 
def get_unseen_recipes(
    db: Session, 
    user_id: int,
    categories: Optional[List[str]] = None,
    diets: Optional[List[str]] = None,
    limit: Optional[int] = None
) -> List[Recipe]:
    # gets recipe table
    query = db.query(Recipe)
    # joins with swipes for this user
    query = query.outerjoin(
        Swipe,
        and_(
            Recipe.id == Swipe.recipe_id,
            Swipe.user_id == user_id
        )
    )
    
    # only keeps recipes where swipe is none
    query = query.filter(Swipe.id.is_(None))

    if categories:
        # Recipe.dish_type is an array, check if it overlaps with selected categories
        query = query.filter(Recipe.dish_type.overlap(categories))

    if diets:
        # Recipe must match ALL specified diets (AND logic)
        # Assuming Recipe has a 'diets' field that's an array like dish_type
        for diet in diets:
            query = query.filter(Recipe.diets.contains([diet]))
    

    # Optional limit
    if limit:
        query = query.limit(limit)
    
    return query.all()

    
