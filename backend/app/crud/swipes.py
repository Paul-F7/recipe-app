#File for CRUD helper functions for the swipes database
from sqlalchemy.orm import Session
from app.models import Swipe
from app.crud.user import get_or_create_user
from app.crud.recipes import get_recipe


#create swipe from the frontend
## Improvements for Later: handle duplicate swipes
def create_swipe(
    db: Session,
    device_id: str,
    recipe_id: int,
    liked: bool,
)-> Swipe:
    user = get_or_create_user(db, device_id)
    recipe = get_recipe(db, recipe_id)
    
    swipe = Swipe( #date not created make sure its created
        user_id=user.id, #asigns user_id to user.id from the user
        recipe_id=recipe_id,
        liked=liked,
        categories=recipe.dish_type, 
        taste_profile=recipe.taste_profile
    )

    db.add(swipe)
    db.commit()
    db.refresh(swipe)

    return swipe

# get liked swipes for specific user, returns list of swipes
def get_liked_swipes(
    db: Session, 
    user_id: str
):
    query = db.query(Swipe).filter(
        Swipe.user_id == user_id,
        Swipe.liked == True
    )
      
    return query.all()


def get_disliked_swipes(
    db: Session, 
    user_id: str
):
    query = db.query(Swipe).filter(
        Swipe.user_id == user_id,
        Swipe.liked == False
    )
    
    return query.all()


