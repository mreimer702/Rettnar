from flask import request, jsonify
from sqlalchemy import select
from typing import List, cast
from marshmallow import ValidationError
from app.models import User, Role, Location, db
from app.blueprints.users.schemas import user_schema, users_schema, role_schema, roles_schema
from app.blueprints.users import users_bp

@users_bp.route("/roles", methods=["POST"])  # <------------------------------------------ CREATE ROLE ROUTE
def create_role():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Role name is required"}), 400

    existing = db.session.execute(select(Role).where(Role.name == name)).scalars().first()
    if existing:
        return jsonify({"error": "Role already exists"}), 400

    new_role = Role(name=name)
    db.session.add(new_role)
    db.session.commit()
    return role_schema.jsonify(new_role), 201

@users_bp.route("/roles", methods=["GET"])  # <------------------------------------------ GET ALL ROLES ROUTE
def get_roles():
    roles = db.session.execute(select(Role)).scalars().all()
    return roles_schema.jsonify(roles), 200

@users_bp.route("/roles/<int:role_id>", methods=["GET"])  # <------------------------------------------ GET ROLE BY ID ROUTE
def get_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404
    return role_schema.jsonify(role), 200

@users_bp.route("/roles/<int:role_id>", methods=["PUT"])  # <------------------------------------------ UPDATE ROLE
def update_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        return jsonify({"error": "New role name is required"}), 400

    existing = db.session.execute(
        select(Role).where(Role.name == new_name, Role.role_id != role_id)
    ).scalars().first()
    if existing:
        return jsonify({"error": "Role name already exists"}), 400

    role.name = new_name
    db.session.commit()
    return role_schema.jsonify(role), 200

@users_bp.route("/roles/<int:role_id>", methods=["DELETE"])  # <------------------------------------------ DELETE ROLE
def delete_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404

    db.session.delete(role)
    db.session.commit()
    return jsonify({"message": f"Role '{role.name}' deleted successfully"}), 200

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx USER ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

@users_bp.route("/users", methods=['POST'])  # <------------------------------------------ CREATE USER ROUTE
def create_user():
    try:
        incoming_data = request.get_json()
        user_data = user_schema.load(incoming_data)
    except ValidationError as e:
        return jsonify(e.messages), 400

    if db.session.execute(select(User).where(User.email == user_data.email)).scalars().first():
        return jsonify({"error": "Email already exists"}), 400

    role_ids = incoming_data.get("role_ids")
    roles_query = select(Role).where(Role.role_id.in_(role_ids))
    matched_roles = db.session.execute(roles_query).scalars().all()
    if len(matched_roles) != len(role_ids):
        return jsonify({"error": "One or more roles not found"}), 404

    new_location = Location(
        address=incoming_data["address"],
        city=incoming_data["city"],
        state=incoming_data["state"],
        zip_code=incoming_data["zip_code"],
        country=incoming_data["country"]
    )
    db.session.add(new_location)
    db.session.flush()  # to get location_id

    new_user = User(
        first_name=user_data.first_name,
        email=user_data.email,
        location_id=new_location.location_id,
        roles=matched_roles
    )

    db.session.add(new_user)
    db.session.commit()
    return user_schema.jsonify(new_user), 201

@users_bp.route("/users", methods=['GET'])  # <------------------------------------------ GET ALL USERS ROUTE
def get_users():
    users = db.session.execute(select(User)).scalars().all()
    return users_schema.jsonify(users), 200

@users_bp.route("/users/<int:user_id>", methods=['GET'])  # <------------------------------------------ GET USER BY ID ROUTE
def get_user(user_id):
    user = db.session.execute(select(User).where(User.user_id == user_id)).scalars().first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return user_schema.jsonify(user), 200

@users_bp.route("/users/<int:user_id>", methods=['PUT'])  # <------------------------------------------ UPDATE USER ROUTE
def update_user(user_id):
    user = db.session.execute(select(User).where(User.user_id == user_id)).scalars().first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        incoming_data = request.get_json()
        user_schema.load(incoming_data, partial=True)  # <--- Validating 
    except ValidationError as e:
        return jsonify(e.messages), 400

    if "first_name" in incoming_data:
        user.first_name = incoming_data["first_name"]

    if "email" in incoming_data:
        existing_user = db.session.execute(
            select(User).where(User.email == incoming_data["email"], User.user_id != user_id)
        ).scalars().first()
        if existing_user:
            return jsonify({"error": "Email already exists"}), 400
        user.email = incoming_data["email"]

    location_fields = ["address", "city", "state", "zip_code", "country"] # <--- Location Update
    if all(field in incoming_data for field in location_fields):
        new_location = Location(
            address=incoming_data["address"],
            city=incoming_data["city"],
            state=incoming_data["state"],
            zip_code=incoming_data["zip_code"],
            country=incoming_data["country"]
        )
        db.session.add(new_location)
        db.session.flush()
        user.location_id = new_location.location_id

    if "role_ids" in incoming_data: # <--- Role Update
        role_ids = incoming_data.get("role_ids")
        roles_query = select(Role).where(Role.role_id.in_(role_ids))
        matched_roles = db.session.execute(roles_query).scalars().all()
        
        if len(matched_roles) != len(role_ids):
            return jsonify({"error": "One or more roles not found"}), 404
        user.roles = cast(List[Role], matched_roles)

    db.session.commit()
    return user_schema.jsonify(user), 200


@users_bp.route("/users/<int:user_id>", methods=['DELETE'])  # <------------------------------------------ DELETE USER ROUTE
def delete_user(user_id):
    user = db.session.execute(select(User).where(User.user_id == user_id)).scalars().first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200