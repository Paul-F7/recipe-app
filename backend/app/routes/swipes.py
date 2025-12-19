from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.swipe import SwipeCreate
from app.crud.swipes import create_swipe


router = APIRouter(
    prefix="/swipes", 
    tags=["swipes"]
)

@router.post("/", status_code=status.HTTP_204_NO_CONTENT)#status_code means the default response for success is 204 no content
def swipe_recipe(
    payload: SwipeCreate,
    db: Session = Depends(get_db),
):
    #Records a swipe on a recipe
    create_swipe(
        db,
        device_id=payload.device_id,
        recipe_id=payload.recipe_id,
        liked=payload.liked,
    )

 # If recipe doesn't exist, foreign key constraint will raise error
 # FastAPI will catch it and return 500