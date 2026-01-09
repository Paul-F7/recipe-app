#File for CRUD helper functions for the swipes database
from sqlalchemy.orm import Session
from app.models import Swipe
from app.crud.user import get_or_create_user
from app.crud.recipes import get_recipe
from fastapi import HTTPException


#create swipe from the frontend
def create_swipe(
    db: Session,
    device_id: str,
    recipe_id: int,
    liked: bool,
)-> Swipe:
    user = get_or_create_user(db, device_id)
    recipe = get_recipe(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # Check if swipe already exists for this user+recipe
    existing_swipe = db.query(Swipe).filter(
        Swipe.user_id == user.id,
        Swipe.recipe_id == recipe_id
    ).first()

    if existing_swipe:
        # Update existing swipe instead of creating duplicate
        existing_swipe.liked = liked
        db.commit()
        db.refresh(existing_swipe)
        return existing_swipe

    swipe = Swipe(
        user_id=user.id,
        recipe_id=recipe_id,
        liked=liked,
        dish_type=recipe.dish_type,
        taste_profile=recipe.taste_profile
    )

    db.add(swipe)
    db.commit()
    db.refresh(swipe)

    return swipe

# get liked swipes for specific user, returns list of swipes
def get_liked_swipes(
    db: Session, 
    user_id: int
):
    query = db.query(Swipe).filter(
        Swipe.user_id == user_id,
        Swipe.liked == True
    )
      
    return query.all()

# get liked swipes for specific user, returns list of swipes
def get_disliked_swipes(
    db: Session, 
    user_id: int
):
    query = db.query(Swipe).filter(
        Swipe.user_id == user_id,
        Swipe.liked == False
    )
    
    return query.all()


