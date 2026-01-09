#File for CRUD helper functions for the swipes database
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
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
    '''
    if categories:
        for category in categories:
            # Recipe.dish_type is an array, check if it overlaps with selected categories
            query = query.filter(Recipe.dish_type.contains([category]))

    if diets:
        # Recipe must match ALL specified diets (AND logic)
        # Assuming Recipe has a 'diets' field that's an array like dish_type
        for diet in diets:
            query = query.filter(Recipe.diets.contains([diet]))
    '''

    # basically it puts all the categories that are included as filters in category_filters using .contains
    if categories:
        category_filters= []
        for category in categories:
            category_filters.append(Recipe.dish_type.contains([category]))

        # if there are category filters then it adds them as or parameters
        if category_filters:
            query = query.filter(or_(*category_filters))

     # basically it puts all the diet that are included as filters in category_filters using .contains
    if diets:
        diet_filters= []
        for diet in diets:
            diet_filters.append(Recipe.diets.contains([diet]))

        # if there are diet filters then it adds them as or parameters
        if diet_filters:
            query = query.filter(and_(*diet_filters))

    # Optional limit
    if limit:
        query = query.limit(limit)

    return query.all()


