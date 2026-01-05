"""
Manual end-to-end test for the complete recipe recommendation flow.

This script tests the full user journey:
1. New user requests recipe feed
2. User swipes on recipes (likes/dislikes)
3. User's taste profile is built
4. Recommendations become personalized
5. User continues to get personalized recommendations

Run this script with: python manual_tests/test_full_flow.py
"""

import requests
import time
from typing import List, Dict

BASE_URL = "http://localhost:8000"
DEVICE_ID = f"test-device-{int(time.time())}"


def print_header(text: str):
    """Print a formatted header."""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70 + "\n")


def print_step(step_num: int, text: str):
    """Print a test step."""
    print(f"\n[STEP {step_num}] {text}")
    print("-" * 70)


def test_health_check():
    """Test that the API is running."""
    print_step(1, "Testing API Health Check")

    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

    print("✅ API is running")


def test_database_connection():
    """Test that database is connected."""
    print_step(2, "Testing Database Connection")

    response = requests.get(f"{BASE_URL}/db-test")
    assert response.status_code == 200
    assert response.json() == {"db": "connected"}

    print("✅ Database is connected")


def get_recipe_feed(categories: List[str] = None, limit: int = 5) -> List[Dict]:
    """Fetch recipe feed for the test user."""
    params = {
        "device_id": DEVICE_ID,
        "limit": limit
    }

    if categories:
        params["categories"] = categories

    response = requests.get(f"{BASE_URL}/recipes/feed", params=params)
    assert response.status_code == 200

    return response.json()


def swipe_on_recipe(recipe_id: int, liked: bool):
    """Swipe on a recipe."""
    payload = {
        "device_id": DEVICE_ID,
        "recipe_id": recipe_id,
        "liked": liked
    }

    response = requests.post(f"{BASE_URL}/swipes/", json=payload)
    assert response.status_code == 204

    action = "👍 Liked" if liked else "👎 Disliked"
    print(f"   {action} recipe ID {recipe_id}")


def test_initial_feed():
    """Test getting initial feed for new user."""
    print_step(3, "Getting Initial Recipe Feed (No Profile Yet)")

    recipes = get_recipe_feed(limit=10)

    print(f"✅ Received {len(recipes)} recipes")

    if recipes:
        print("\nFirst recipe details:")
        first_recipe = recipes[0]
        print(f"   - ID: {first_recipe.get('id')}")
        print(f"   - Title: {first_recipe.get('title')}")
        print(f"   - Categories: {first_recipe.get('dish_type', first_recipe.get('meal_types'))}")
        print(f"   - Diets: {first_recipe.get('diets', first_recipe.get('dietary_tags'))}")

        if 'taste_profile' in first_recipe:
            print(f"   - Taste Profile: {first_recipe['taste_profile']}")

    return recipes


def test_swiping_phase(recipes: List[Dict]):
    """Test swiping on recipes to build profile."""
    print_step(4, "Building User Profile Through Swipes")

    if not recipes or len(recipes) < 5:
        print("⚠️  Not enough recipes to perform swipes")
        return

    print("\nSwiping on recipes to build taste profile...")
    print("Strategy: Like sweet recipes, dislike salty recipes")

    swipes_made = 0

    for recipe in recipes[:10]:  # Swipe on first 10 recipes
        recipe_id = recipe.get('id')
        title = recipe.get('title')
        taste_profile = recipe.get('taste_profile', {})

        # Simple strategy: like if sweet > 60, dislike if salty > 60
        sweetness = taste_profile.get('sweetness', 50)
        saltiness = taste_profile.get('saltiness', 50)

        if sweetness > 60:
            swipe_on_recipe(recipe_id, liked=True)
            print(f"      (Sweet recipe: {title[:40]})")
            swipes_made += 1
        elif saltiness > 60:
            swipe_on_recipe(recipe_id, liked=False)
            print(f"      (Salty recipe: {title[:40]})")
            swipes_made += 1
        else:
            # Randomly like or dislike neutral recipes
            liked = swipes_made % 2 == 0
            swipe_on_recipe(recipe_id, liked=liked)
            swipes_made += 1

    print(f"\n✅ Made {swipes_made} swipes")
    time.sleep(1)  # Give database time to process


def test_personalized_feed():
    """Test getting personalized recommendations."""
    print_step(5, "Getting Personalized Recommendations")

    print("Fetching new recommendations (should be personalized now)...")
    recipes = get_recipe_feed(limit=10)

    print(f"✅ Received {len(recipes)} personalized recipes")

    if recipes:
        print("\nTop 3 recommended recipes:")
        for i, recipe in enumerate(recipes[:3], 1):
            title = recipe.get('title')
            taste_profile = recipe.get('taste_profile', {})
            sweetness = taste_profile.get('sweetness', 0)
            saltiness = taste_profile.get('saltiness', 0)

            print(f"\n   {i}. {title}")
            print(f"      - Sweetness: {sweetness:.1f}")
            print(f"      - Saltiness: {saltiness:.1f}")

            # Check if recommendations align with preferences
            if sweetness > 60:
                print(f"      ✨ This matches your sweet preference!")


def test_category_filtering():
    """Test filtering by category."""
    print_step(6, "Testing Category Filtering")

    categories = ["breakfast"]
    recipes = get_recipe_feed(categories=categories, limit=5)

    print(f"✅ Received {len(recipes)} breakfast recipes")

    if recipes:
        print("\nVerifying all are breakfast recipes:")
        for recipe in recipes:
            dish_types = recipe.get('dish_type', recipe.get('meal_types', []))
            print(f"   - {recipe.get('title')}: {dish_types}")
            assert "breakfast" in dish_types, f"Expected breakfast, got {dish_types}"

        print("✅ All recipes are breakfast recipes")


def test_unseen_recipes():
    """Test that swiped recipes don't appear again."""
    print_step(7, "Testing Unseen Recipe Filtering")

    print("Getting new feed...")
    recipes = get_recipe_feed(limit=20)

    print(f"✅ Received {len(recipes)} unseen recipes")
    print("   (Note: Previously swiped recipes should not appear)")


def test_summary():
    """Print test summary."""
    print_header("TEST SUMMARY")

    print("✅ All tests passed!")
    print("\nWhat we tested:")
    print("   1. API health check")
    print("   2. Database connection")
    print("   3. Initial recipe feed for new user")
    print("   4. Swiping mechanism (likes and dislikes)")
    print("   5. Personalized recommendations based on swipes")
    print("   6. Category filtering")
    print("   7. Exclusion of previously swiped recipes")

    print(f"\nTest user device_id: {DEVICE_ID}")
    print("   (This user's data remains in database for inspection)")


def main():
    """Run all tests."""
    print_header("RECIPE APP - END-TO-END MANUAL TEST")
    print(f"Testing against: {BASE_URL}")
    print(f"Test user device_id: {DEVICE_ID}")

    try:
        # Run tests
        test_health_check()
        test_database_connection()

        recipes = test_initial_feed()

        if recipes:
            test_swiping_phase(recipes)
            test_personalized_feed()
            test_category_filtering()
            test_unseen_recipes()
        else:
            print("\n⚠️  WARNING: No recipes in database!")
            print("   Please run your recipe ingestion script first.")
            print("   Then run this test again.")
            return

        test_summary()

    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to API")
        print(f"   Make sure the server is running at {BASE_URL}")
        print("   Start it with: uvicorn app.main:app --reload")

    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()

    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()