from pydantic import BaseModel
from typing import Optional, List 

class UserPreferences(BaseModel):
    """User's recommendation preferences."""
    categories: List[str] = ["Breakfast", "Lunch", "Dinner", "Dessert", "Drink"]
    diets: Optional[List[str]] = None