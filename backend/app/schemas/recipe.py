from pydantic import BaseModel

# Creates schema for recipe, that is sent to device 
# Database Recipe Converted to this 
class RecipeOut(BaseModel):
    id: int
    title: str
    image_url: str

    ingredients: list[str]
    instructions: Any

    nutrition: dict
    equipment: list[str]
    dish_type: list[str]
    diets: list[str]

    cook_time_minutes: int | None

    sweetness: float
    saltiness: float
    sourness: float
    bitterness: float
    savoriness: float
    fattiness: float
    spiciness: float

    # pydantic configuration class, allows pydantic to read from SQLAlchemy models
    class Config:
        orm_mode = True
