from flask import request, jsonify
from sqlalchemy import select
from marshmallow import ValidationError
from app.blueprints.auth import auth_bp
from app.utils.util import encode_user_token
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import User, db
from app.blueprints.users.schemas import login_schema
from app.blueprints.auth.schemas import AuthUserSchema
from app.extensions import limiter
import secrets
from datetime import datetime, timedelta

@auth_bp.route("/login", methods=["POST"])
@limiter.limit('10 per minute')
def login_user():
    """
    Authenticate user with email and password
    Returns JWT token and user data on success
    """
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
    auth_user_schema = AuthUserSchema()
    return jsonify({
        "token": token,
        "user": auth_user_schema.dump(user)
    }), 200

@auth_bp.route("/logout", methods=["POST"])
def logout_user():
    """
    Logout user (JWT tokens are stateless, so this is handled client-side)
    This endpoint exists for consistency but doesn't need to do server-side token invalidation
    """
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route("/forgot-password", methods=["POST"])
@limiter.limit('5 per minute')
def forgot_password():
    """
    Request password reset - generates reset token
    In production, this would send an email with the reset link
    """
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
            
        user = db.session.execute(
            select(User).where(User.email == email)
        ).scalars().first()
        
        if user:
            # Generate reset token (in production, this would be sent via email)
            reset_token = secrets.token_urlsafe(32)
            # In a real app, you'd store this token with expiration in the database
            # For now, we'll just return it (NOT secure for production)
            return jsonify({
                "message": "Password reset instructions sent to your email",
                "reset_token": reset_token  # Remove this in production
            }), 200
        else:
            # Don't reveal if email exists or not for security
            return jsonify({
                "message": "Password reset instructions sent to your email"
            }), 200
            
    except Exception as e:
        return jsonify({"error": "An error occurred processing your request"}), 500

@auth_bp.route("/reset-password", methods=["POST"])
@limiter.limit('5 per minute')
def reset_password():
    """
    Reset password using reset token
    In production, this would validate the token from the database
    """
    try:
        data = request.get_json()
        email = data.get('email')
        reset_token = data.get('reset_token')
        new_password = data.get('new_password')
        
        if not all([email, reset_token, new_password]):
            return jsonify({"error": "Email, reset token, and new password are required"}), 400
            
        if len(new_password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400
            
        user = db.session.execute(
            select(User).where(User.email == email)
        ).scalars().first()
        
        if not user:
            return jsonify({"error": "Invalid reset token"}), 400
            
        # In production, validate the reset token from database and check expiration
        # For now, we'll accept any token (NOT secure for production)
        
        # Update password
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        return jsonify({"message": "Password has been reset successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": "An error occurred processing your request"}), 500