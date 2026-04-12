from sqlmodel import Session, create_engine, select
from app.models.user import User
from app.core.config import settings

# Adjust the database URL if necessary (using settings.DATABASE_URL)
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

def check_user_role(user_id):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if user:
            print(f"User found: {user.full_name}")
            print(f"Role: '{user.role}'")
            print(f"Type of role: {type(user.role)}")
        else:
            print(f"User {user_id} not found")

if __name__ == "__main__":
    check_user_role("2342039d-d09b-4f91-93e5-ccb2ffb945f2")
