#Deals wtih calling the recipe api 
import requests

#MAKE SURE TO PUT THIS IN A GIT IGNORE BEFORE YOU COMMIT
API_KEY = "cd4978da4b11493f9c89b9f46e117634"
AMOUNT = 2
LINK = "https://api.spoonacular.com/recipes/complexSearch?includeIngredients=true&instructionsRequired=true&addRecipeInstructions=true&addRecipeNutrition=true&number={AMOUNT}"

def fetch_recipe():
    

    