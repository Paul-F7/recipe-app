#File for CRUD helper functions for the swipes database
from sqlalchemy.orm import Session
from app.models import Swipe
from app.crud.user import get_or_create_user

#create swipe from the frontend
## Improvements for Later: handle duplicate swipes
def create_swipe(
    db: Session,
    device_id: str,
    recipe_id: int,
    liked: bool,
)-> Swipe:
    user = get_or_create_user(db, device_id)

    swipe = Swipe(
        user_id=user.id, #asigns user_id to user.id from the user
        recipe_id=recipe_id,
        liked=liked,
    )

    db.add(swipe)
    db.commit()
    db.refresh(swipe)

    return swipe

