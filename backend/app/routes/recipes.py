from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.crud.user import get_or_create_user
from app.models import Recipe

#creates router object wiht the prefix and tag
router = APIRouter(
    prefix="/recipes",
    tags=["recipes"]
)

@router.get("/feed") #right now has error for deviceid 422!!
def get_recipe_feed(
    device_id: str = Query(...),
    limit: int = Query(5), #has default value
    db: Session = Depends(get_db),
):  
    #gives max/min for limit
    limit = max(1, min(limit, 20))

    # Call get or create user
    user = get_or_create_user(db, device_id)

    # fetch recipes
    recipes = (
        db.query(Recipe)
        .limit(limit)
        .all()
    )
    return recipes

