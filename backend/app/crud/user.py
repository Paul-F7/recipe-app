#File for CRUD helper functions for the user database
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import User

def get_or_create_user(db: Session, device_id: str) -> User:
    """
    Get existing user by device_id, or create new one.
    Handles race conditions where multiple requests try to create same user.
    """
    user = db.query(User).filter(User.device_id == device_id).first()

    if user:
        return user
    
    user = User(device_id=device_id) #creates a object from the User models class
    db.add(user) #this works like a shopping cart for the session
    
    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        # Another request created this user first
        db.rollback()
        return db.query(User).filter(User.device_id == device_id).first()