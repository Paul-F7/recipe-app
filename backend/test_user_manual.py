"""
Manual test script for user CRUD operations
Run this to quickly test user creation and retrieval
"""

from app.database import SessionLocal
from app.crud.user import get_or_create_user
from app.models import User

def print_separator():
    print("\n" + "="*60 + "\n")

def test_user_operations():
    """Run manual tests for user operations"""
    
    print("🧪 MANUAL USER CRUD TESTS")
    print_separator()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Test 1: Create new user
        print("Test 1: Creating new user with device_id 'test-device-123'")
        user1 = get_or_create_user(db, "test-device-123")
        print(f"✅ Created user:")
        print(f"   - ID: {user1.id}")
        print(f"   - Device ID: {user1.device_id}")
        print(f"   - Created at: {user1.created_at}")
        print_separator()
        
        # Test 2: Get existing user (should return same user)
        print("Test 2: Getting existing user with same device_id")
        user2 = get_or_create_user(db, "test-device-123")
        print(f"✅ Retrieved user:")
        print(f"   - ID: {user2.id}")
        print(f"   - Device ID: {user2.device_id}")
        
        if user1.id == user2.id:
            print(f"✅ SUCCESS: Both calls returned same user (id={user1.id})")
        else:
            print(f"❌ ERROR: Different users returned! {user1.id} vs {user2.id}")
        print_separator()
        
        # Test 3: Create different user
        print("Test 3: Creating second user with device_id 'test-device-456'")
        user3 = get_or_create_user(db, "test-device-456")
        print(f"✅ Created user:")
        print(f"   - ID: {user3.id}")
        print(f"   - Device ID: {user3.device_id}")
        print(f"   - Created at: {user3.created_at}")
        print_separator()
        
        # Test 4: Verify different IDs
        print("Test 4: Verifying different device_ids create different users")
        if user1.id != user3.id:
            print(f"✅ SUCCESS: Different users have different IDs")
            print(f"   - User 1 ID: {user1.id}")
            print(f"   - User 3 ID: {user3.id}")
        else:
            print(f"❌ ERROR: Same ID for different devices!")
        print_separator()
        
        # Test 5: Count total users
        print("Test 5: Counting total users in database")
        total_users = db.query(User).count()
        print(f"📊 Total users in database: {total_users}")
        
        # List all users
        print("\n📋 All users:")
        all_users = db.query(User).all()
        for user in all_users:
            print(f"   - ID: {user.id}, Device: {user.device_id}, Created: {user.created_at}")
        print_separator()
        
        # Summary
        print("🎉 ALL TESTS COMPLETED!")
        print(f"   - Created: 2 users")
        print(f"   - Retrieved: 1 existing user")
        print(f"   - Total in database: {total_users}")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        db.close()
        print("\n🔒 Database session closed")

def cleanup_test_data():
    """Remove test users created by this script"""
    db = SessionLocal()
    
    try:
        print("\n🧹 CLEANING UP TEST DATA...")
        
        # Delete test users
        deleted_count = db.query(User).filter(
            User.device_id.like('test-device-%')
        ).delete()
        
        db.commit()
        print(f"✅ Deleted {deleted_count} test users")
        
    except Exception as e:
        print(f"❌ Cleanup error: {e}")
        db.rollback()
        
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    # Check for cleanup flag
    if len(sys.argv) > 1 and sys.argv[1] == "--cleanup":
        cleanup_test_data()
    else:
        test_user_operations()
        
        # Ask if user wants to cleanup
        print("\n" + "="*60)
        response = input("\n🗑️  Delete test data? (y/n): ").strip().lower()
        if response == 'y':
            cleanup_test_data()
        else:
            print("ℹ️  Test data kept. Run 'python test_user_manual.py --cleanup' to clean later")