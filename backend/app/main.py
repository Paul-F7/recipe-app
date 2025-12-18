from fastapi import FastAPI, Depends
from app.database import get_db

from sqlalchemy.orm import Session
from sqlalchemy import text


app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/db-test")
def db_test(db: Session = Depends(get_db)):
    return {"db": "connected"}


