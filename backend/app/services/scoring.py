# Recipe scoring and similarity calculations
import math
from typing import Dict, List, Tuple
from app.models import Recipe

DIMENSIONS = {
        "fattiness",
        "saltiness",
        "spiciness",
        "sweetness",
        "bitterness"}

# Calculates similarity between recipe and taste profile (Euclidean distance) (Score between 0 and 1)
def calculate_similarity(
    recipe_taste: Dict[str, float], # recipes taste profile
    profile_taste: Dict[str, float] # regular taste profile
) -> float:
    
    distance_squared = 0
    for dim in DIMENSIONS:
        distance_squared += (recipe_taste.get(dim, 50.0) - profile_taste.get(dim, 50.0)) ** 2
    
    distance = math.sqrt(distance_squared)

    # calculates similarity score (0-1 Scale)
    similarity = 1 / (1 + distance) # i dont fully understand how this works

    return similarity


# Scores a single recipe agains a users category-specific taste profile
def score_recipe(
    recipe: Recipe,
    user_profiles: Dict[str, Dict[str, float]],
    default_score: float = 0.5
) -> float:
    
    # Get recipe's category just takes the first one
    if recipe.dish_type:
        category = recipe.dish_type[0]
    else:
        category = "Other"

    # Check if we have a profile for this category
    if category not in user_profiles:
        return default_score  # No profile yet - neutral score
    
    recipe_taste = recipe.taste_profile

    score = calculate_similarity(recipe_taste, user_profiles[category])

    return score

# scores a list of recipes and returns a list of (recipe, score) tuples
def score_recipes(
    recipes: List[Recipe],
    user_profiles: Dict[str, Dict[str, float]]
) -> List[Tuple[Recipe, float]]:
    scored_recipes = []
    
    for recipe in recipes:
        score = score_recipe(recipe, user_profiles)
        scored_recipes.append((recipe, score))
    
    return scored_recipes