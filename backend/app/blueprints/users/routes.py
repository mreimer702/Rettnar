from flask import request, jsonify
from sqlalchemy import select, func
from marshmallow import ValidationError
from app.models import User, Role, Location, db
from app.blueprints.users.schemas import (
    user_schema, users_schema, role_schema, roles_schema, 
    user_update_schema, user_registration_schema, login_schema
)
from app.blueprints.users import users_bp
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.util import encode_user_token, user_token_required, admin_token_required
from app.extensions import limiter

# ========================================
# PUBLIC ROUTES (No Authentication Required)
# ========================================

@users_bp.route("/register", methods=["POST"])
@limiter.limit('5 per minute')
def register_user():
    try:
        data = request.get_json()
        validated_data = user_registration_schema.load(data)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    # Check if email already exists
    existing_user = db.session.execute(
        select(User).where(User.email == validated_data["email"])
    ).scalars().first()
    
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    # Create location if provided
    location = None
    if any(field in validated_data for field in ['address', 'city', 'state', 'country', 'zip_code']):
        location = Location(
            address=validated_data.get('address', ''),
            city=validated_data.get('city', ''),
            state=validated_data.get('state', ''),
            country=validated_data.get('country', ''),
            zip_code=validated_data.get('zip_code', '')
        )
        db.session.add(location)
        db.session.flush()

    # Create user
    hashed_password = generate_password_hash(validated_data["password"])
    new_user = User(
        first_name=validated_data["first_name"],
        email=validated_data["email"],
        password_hash=hashed_password,
        location_id=location.location_id if location else None
    )
    
    db.session.add(new_user)
    db.session.commit()

    token = encode_user_token(new_user.user_id)
    return jsonify({
        "message": "User registered successfully",
        "token": token,
        "user": user_schema.dump(new_user)
    }), 201

@users_bp.route("/login", methods=["POST"])
@limiter.limit('10 per minute')
def login_user():
    try:
        data = request.get_json()
        validated_data = login_schema.load(data)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    user = db.session.execute(
        select(User).where(User.email == validated_data["email"])
    ).scalars().first()
    
    if not user or not check_password_hash(user.password_hash, validated_data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.is_active:
        return jsonify({"error": "Account is deactivated"}), 401

    token = encode_user_token(user.user_id)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user_schema.dump(user)
    }), 200

@users_bp.route("/roles", methods=["GET"])
def get_roles():
    """Public endpoint to get all roles"""
    roles = db.session.execute(select(Role)).scalars().all()
    return roles_schema.jsonify(roles), 200

# ========================================
# PROTECTED ROUTES (Authentication Required)
# ========================================

@users_bp.route("/profile", methods=["GET"])
@user_token_required
def get_profile(user_id):
    """Get current user's profile"""
    user = db.session.execute(
        select(User).where(User.user_id == user_id)
    ).scalars().first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return user_schema.jsonify(user), 200

@users_bp.route("/profile", methods=["PUT"])
@user_token_required
@limiter.limit('10 per minute')
def update_profile(user_id):
    """Update current user's profile"""
    user = db.session.execute(
        select(User).where(User.user_id == user_id)
    ).scalars().first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        data = request.get_json()
        validated_data = user_update_schema.load(data, partial=True)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    # Handle password change
    if 'current_password' in validated_data:
        if not check_password_hash(user.password_hash, validated_data['current_password']):
            return jsonify({"error": "Current password is incorrect"}), 400
        user.password_hash = generate_password_hash(validated_data['new_password'])

    # Update basic fields
    for field in ['first_name', 'last_name', 'phone']:
        if field in validated_data:
            setattr(user, field, validated_data[field])

    # Handle email change
    if 'email' in validated_data:
        existing_user = db.session.execute(
            select(User).where(User.email == validated_data['email'], User.user_id != user_id)
        ).scalars().first()
        if existing_user:
            return jsonify({"error": "Email already exists"}), 400
        user.email = validated_data['email']

    # Handle location update
    location_fields = ['address', 'city', 'state', 'zip_code', 'country']
    if any(field in validated_data for field in location_fields):
        if user.location:
            for field in location_fields:
                if field in validated_data:
                    setattr(user.location, field, validated_data[field])
        else:
            location = Location(
                address=validated_data.get('address', ''),
                city=validated_data.get('city', ''),
                state=validated_data.get('state', ''),
                zip_code=validated_data.get('zip_code', ''),
                country=validated_data.get('country', '')
            )
            db.session.add(location)
            db.session.flush()
            user.location_id = location.location_id

    db.session.commit()
    return user_schema.jsonify(user), 200

# ========================================
# ADMIN-ONLY ROUTES
# ========================================

@users_bp.route("/users", methods=["GET"])
@admin_token_required
@limiter.limit('20 per minute')
def get_all_users(user_id):
    """Admin: Get all users with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    query = select(User)
    total = db.session.execute(select(func.count(User.user_id))).scalar()
    
    offset = (page - 1) * per_page
    users = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
    
    return jsonify({
        'users': users_schema.dump(users),
        'pagination': pagination_info
    }), 200

@users_bp.route("/users/<int:target_user_id>", methods=["GET"])
@admin_token_required
@limiter.limit('30 per minute')
def get_user_by_id(user_id, target_user_id):
    """Admin: Get user by ID"""
    user = db.session.execute(
        select(User).where(User.user_id == target_user_id)
    ).scalars().first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return user_schema.jsonify(user), 200

@users_bp.route("/users/<int:target_user_id>/deactivate", methods=["PUT"])
@admin_token_required
@limiter.limit('10 per minute')
def deactivate_user(user_id, target_user_id):
    """Admin: Deactivate a user"""
    user = db.session.execute(
        select(User).where(User.user_id == target_user_id)
    ).scalars().first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.is_active = False
    db.session.commit()
    
    return jsonify({"message": "User deactivated successfully"}), 200

@users_bp.route("/users/<int:target_user_id>/activate", methods=["PUT"])
@admin_token_required
@limiter.limit('10 per minute')
def activate_user(user_id, target_user_id):
    """Admin: Activate a user"""
    user = db.session.execute(
        select(User).where(User.user_id == target_user_id)
    ).scalars().first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.is_active = True
    db.session.commit()
    
    return jsonify({"message": "User activated successfully"}), 200

@users_bp.route("/roles", methods=["POST"])
@admin_token_required
@limiter.limit('5 per minute')
def create_role(user_id):
    """Admin: Create a new role"""
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

@users_bp.route("/roles/<int:role_id>", methods=["GET"])
@admin_token_required
def get_role(user_id, role_id):
    """Admin: Get role by ID"""
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404
    return role_schema.jsonify(role), 200

@users_bp.route("/roles/<int:role_id>", methods=["PUT"])
@admin_token_required
@limiter.limit('5 per minute')
def update_role(user_id, role_id):
    """Admin: Update a role"""
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

@users_bp.route("/roles/<int:role_id>", methods=["DELETE"])
@admin_token_required
@limiter.limit('5 per minute')
def delete_role(user_id, role_id):
    """Admin: Delete a role"""
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404

    db.session.delete(role)
    db.session.commit()
    return jsonify({"message": f"Role '{role.name}' deleted successfully"}), 200