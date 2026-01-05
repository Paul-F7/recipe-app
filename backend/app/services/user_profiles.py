# User taste profile calculation
from sqlalchemy.orm import Session
from typing import Dict, List
from collections import defaultdict
from app.crud.swipes import get_liked_swipes, get_disliked_swipes
from app.models import Swipe

DIMENSIONS = {
        "fattiness",
        "saltiness",
        "spiciness",
        "sweetness",
        "bitterness"}

# Groups swipes by their category into dict
def group_swipes_by_category(swipes: List[Swipe]) -> Dict[str, List[Swipe]]:
    category_swipes = defaultdict(list) # assumes that the list alr exists

    for swipe in swipes:
        for category in swipe.dish_type:
            category_swipes[category].append(swipe)
    
    return dict(category_swipes)  # Convert defaultdict to regular dict


# calculates the 5d euclidian average
def calculate_avg(swipes):
    if not swipes:
        return None
    
    n = len(swipes) # number of recipes

    # initializes sum dictionary
    avg = {dim: 0.0 for dim in DIMENSIONS}

    # Accumulate values for each dimension across all recipes
    for swipe in swipes:
        taste_profile = swipe.taste_profile #gets the taste profile of the swipe
        for dim in DIMENSIONS:
            # Add the recipe's value for this dimension
            avg[dim] += taste_profile.get(dim, 50.0)

    for dim in DIMENSIONS:
        avg[dim] /= n

    return avg

# takes in liked taste profile, disliked taste profile and returns 1 profile
def apply_dislikes(liked, disliked, weight=0.3, neutral=50.0):
    if not disliked:
        return liked

    profile = {}
    for d in liked:
        v = liked[d] - weight * (disliked.get(d, neutral) - neutral)
        profile[d] = max(0.0, min(100.0, v))

    return profile


# calculates the users category-specifc taste profile from their id 
# seperate taste categories for each 
def calculate_user_taste_profile(db: Session, user_id: int) -> dict:
    liked_swipes = get_liked_swipes(db, user_id)
    disliked_swipes = get_disliked_swipes(db, user_id)

    likes_by_cat = group_swipes_by_category(liked_swipes)
    dislikes_by_cat = group_swipes_by_category(disliked_swipes)

    profiles = {}

    for cat, cat_likes in likes_by_cat.items():
        liked_avg = calculate_avg(cat_likes)
        disliked_avg = calculate_avg(dislikes_by_cat.get(cat, []))

        profiles[cat] = apply_dislikes(liked_avg, disliked_avg)

    return profiles

#right now this is batch recalculation but it doesnt really update anything maybe make something to update

## Example Category-Based Taste Profile

# {
#     "breakfast": {"sweetness": 75.0, "spiciness": 5.0, ...},
#     "dessert": {"sweetness": 82.5, "spiciness": 3.5, ...},  
#     "dinner": {"sweetness": 15.0, "spiciness": 62.5, ...},
#     "lunch": {"sweetness": 20.0, "spiciness": 40.0, ...},
#     "drink": {"sweetness": 20.0, "spiciness": 40.0, ...}
# }

"""
# Then run these commands in the PostgreSQL prompt:
CREATE USER app WITH PASSWORD 'luap';
ALTER USER app WITH SUPERUSER;  # Or just grant specific permissions
\q  # Exit psql
"""