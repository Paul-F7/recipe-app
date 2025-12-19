from fastapi import FastAPI, Depends
from app.database import get_db
from app.routes import recipes, swipes


from sqlalchemy.orm import Session
from sqlalchemy import text


app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/db-test")
def db_test(db: Session = Depends(get_db)):
    return {"db": "connected"}


#connnects all routes from recipe.py into main
app.include_router(recipes.router)
app.include_router(swipes.router)
