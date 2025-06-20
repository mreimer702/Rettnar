from flask import request, jsonify
from sqlalchemy import select
from marshmallow import ValidationError
from app.models import User, db
from app.blueprints.users.schemas import user_schema
from app.blueprints.users import users_bp

@users_bp.route("/users", methods = ['POST'])  # <------------------------------------------ Create User Route
def create_user():
    try:
        user_data = user_schema.load(request.get_json())
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    query = select(User).where(User.email == user_data['email'])
    existing_user = db.session.execute(query).scalars().all()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400
    
    new_user = User(**user_data)
    db.session.add(new_user)
    db.session.commit()
    return user_schema.jsonify(new_user), 201