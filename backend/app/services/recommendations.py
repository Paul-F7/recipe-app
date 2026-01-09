"""
Recipe recommendation generation.

This file handles:
- Generating personalized recommendations
- Balancing exploitation vs exploration
- Ensuring category diversity
"""
import random
from sqlalchemy.orm import Session
from typing import List, Tuple, Dict
from collections import defaultdict

from app.models import Recipe
from app.crud.recipes import get_unseen_recipes
from app.services.user_profiles import calculate_user_taste_profile
from app.services.scoring import score_recipes
from app.schemas.preferences import UserPreferences


# generates personalized recipe recommendation with exploration

def get_recommendations(
    db: Session,
    user_id: int,
    limit: int = 20,
    preferences: UserPreferences = None,
    exploration_rate: float = 0.2
) -> List[Recipe]:
    """
    Generate personalized recipe recommendations with exploration.
    This is the main recommendation function that ties everything together:
    1. Calculates user's taste profiles
    2. Gets unseen recipes
    3. Scores recipes against profiles
    4. Mixes high-scored with random
    5. Balances across categories
    """
    if preferences is None:
        preferences = UserPreferences()

    # gets category-specific user taste profiles
    user_profiles = calculate_user_taste_profile(db, user_id)

    # gets all the unseen preferences
    unseen_recipes = get_unseen_recipes(
        db,
        user_id,
        categories=preferences.categories,
        diets=preferences.diets
    )

    if not unseen_recipes:
        return []  # !! fix this later as you want to start showing seen recipes

    # if no user profile yet then return random recipes
    if not user_profiles:
        random.shuffle(unseen_recipes)
        return unseen_recipes[:limit] # !! how does this work if profile exiss for one recipe but not another


    scored_recipes = score_recipes(unseen_recipes, user_profiles)

    scored_recipes.sort(key=lambda x: x[1], reverse=True) # sort scored recipes by their score highest -> lowest

    exploit_count = int(limit * (1 - exploration_rate))
    explore_count = limit - exploit_count

    available_categories = get_available_categories(unseen_recipes) # gets the available cateogires from unseen recipes

    # if more than 1 avalaible categories balance otherwise get simple recommendations
    if len(available_categories) > 1:
        recommendations = get_balanced_recommendations(
            scored_recipes,
            exploit_count,
            explore_count,
            available_categories
        )
    else:
        recommendations = get_simple_recommendations(
            scored_recipes,
            exploit_count,
            explore_count
        )

    random.shuffle(recommendations)

    # Final deduplication to ensure no duplicates
    seen_ids = set()
    unique_recommendations = []
    for recipe in recommendations:
        if recipe.id not in seen_ids:
            seen_ids.add(recipe.id)
            unique_recommendations.append(recipe)

    return unique_recommendations[:limit]

def get_available_categories(recipes: List[Recipe]) -> List[str]:
    """Get list of unique categories present in recipe list."""
    categories = set()
    for recipe in recipes:
        if recipe.dish_type:
            categories.add(recipe.dish_type[0])
    return list(categories)

# gets simple recommendation without multiple categories
def get_simple_recommendations(
    scored_recipes: List[Tuple[Recipe, float]],
    exploit_count: int,
    explore_count: int
)-> List[Recipe]:
    recommendations = []

    # Exploit: Top-scored recipes
    recommendations = [recipe for recipe, score in scored_recipes[:exploit_count]]

    # Explore: Random recipes
    remaining = [recipe for recipe, score in scored_recipes[exploit_count:]]

    if remaining and explore_count > 0:
        explore_sample = random.sample( # gets random items form the list
            remaining,
            min(explore_count, len(remaining))
        )
        recommendations.extend(explore_sample) # adds new random items to list

    return recommendations

# balanced recommendation through mutliple categories
def get_balanced_recommendations(
    scored_recipes: List[Tuple[Recipe, float]],
    exploit_count: int,
    explore_count: int,
    available_categories: List[str]
) -> List[Recipe]:

    # Organizes recipes by category
    category_recipes = defaultdict(list)
    for recipe, score in scored_recipes:
        if recipe.dish_type:
            category = recipe.dish_type[0]
            if category in available_categories:
                category_recipes[category].append((recipe, score))

    # Sort each category by score
    for category in category_recipes:
        category_recipes[category].sort(key=lambda x: x[1], reverse=True)

    # Distribute exploit slots evenly across categories
    num_categories = len(category_recipes)
    if num_categories == 0:
        return []
    recipes_per_category = exploit_count // num_categories
    extra_slots = exploit_count % num_categories

    recommendations = []

    # Take top recipes from each category
    for i, (category, recipes) in enumerate(category_recipes.items()):
        take_count = recipes_per_category
        if i < extra_slots:
            take_count += 1  # Distribute extra slots

        category_recs = [recipe for recipe, score in recipes[:take_count]]
        recommendations.extend(category_recs)

    # Add exploration (random from all categories)
    all_remaining = []
    already_selected = set(rec.id for rec in recommendations)

    for category, recipes in category_recipes.items():
        remaining = [
            recipe for recipe, score in recipes
            if recipe.id not in already_selected
        ]
        all_remaining.extend(remaining)

    if all_remaining and explore_count > 0:
        explore_sample = random.sample(
            all_remaining,
            min(explore_count, len(all_remaining))
        )
        recommendations.extend(explore_sample)

    return recommendations
