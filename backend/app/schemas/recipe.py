from pydantic import BaseModel
from typing import Any

# Creates schema for recipe, that is sent to device 
# Database Recipe Converted to this 
class RecipeOut(BaseModel):
    id: int
    title: str
    image_name: str

    ingredients: list[str]
    instructions: Any

    nutrition: dict
    
    diets: list[str]
    dish_type: list[str]

    taste_profile: dict

    # pydantic configuration class, allows pydantic to read from SQLAlchemy models
    class Config:
        orm_mode = True
