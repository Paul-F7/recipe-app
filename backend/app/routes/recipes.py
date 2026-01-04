from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.crud.user import get_or_create_user
from app.models import Recipe
from app.schemas.preferences import UserPreferences
from typing import Optional, List
from app.services.recommendations import get_recommendations

#creates router object wiht the prefix and tag
router = APIRouter(
    prefix="/recipes",
    tags=["recipes"]
)

@router.get("/feed") #right now has error for deviceid 422!!
def get_recipe_feed( #make sure to implement schema in this!!!!!!!!!
    device_id: str = Query(...),
    limit: int = Query(5), #has default value
    categories: Optional[List[str]] = Query(None),
    diets: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db)
):  
    #gives max/min for limit
    limit = max(1, min(limit, 20))

    # Call get or create user
    user = get_or_create_user(db, device_id)

    # builds the preferences data type 
    preferences = UserPreferences(
        categories=categories or ["Breakfast", "Lunch", "Dinner", "Dessert", "Drink"],
        diets=diets
    )
    
    recipes = get_recommendations(
        db=db,
        user_id=user.id, 
        limit=limit,
        preferences=preferences,
        exploration_rate=0.2  # for now stays at 0.2 but i can change later
    )
    return recipes

