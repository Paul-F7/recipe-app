# files that handles calculation for recommendation
from sqlalchemy.orm import Session
from typing import Dict, List
from collections import defaultdict
from app.crud.swipes import get_liked_swipes
from app.models.swipe import Swipe

# Groups swipes by their category into dict
def group_swipes_by_category(swipes: List[Swipe]) -> Dict[str, List[Swipe]]:
    category_swipes = defaultdict(list) # assumes that the list alr exists

    for swipe in swipes:
        for category in swipe.categories:
            category_swipes[category].append(swipe)
    
    return dict(category_swipes)  # Convert defaultdict to regular dict



# calculates the users taste profile from their id 
# seperate taste categories for each 
def calculate_user_taste_profile(user_id: int) -> dict:
    liked_recipes = get_liked_recipes(user_id)
    disliked_recipes = get_disliked_recipes(user_id)


