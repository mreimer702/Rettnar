import os
from jose import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify
from sqlalchemy import select

SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-change-in-production'

def encode_user_token(user_id):
    """
    Encodes a user ID into a JWT token.
    
    Args:
        user_id (int): The ID of the user to encode.
    
    Returns:
        str: The encoded JWT token.
    """
    

    payload = {
        'exp': datetime.now(timezone.utc) + timedelta(hours=24),  # Token expires in 24 hours
        'iat': datetime.now(timezone.utc),
        'sub': str(user_id)  # Token expires in 1 day'
    }
    
    user_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return user_token

def decode_user_token(user_token):
    """
    Decodes a JWT token to extract user ID.
    
    Args:
        user_token (str): The JWT token to decode.
    
    Returns:
        int: The user ID extracted from the token, or None if invalid.
    """
    try:
        payload = jwt.decode(user_token, SECRET_KEY, algorithms=["HS256"])
        return int(payload["sub"])
    except (jwt.ExpiredSignatureError, jwt.JWTError):
        return None

def user_token_required(f):
    """
    Decorator to require a valid customer token for a route.
    
    Args:
        f (function): The function to decorate.
    
    Returns:
        function: The decorated function.
    """
    
    @wraps(f)
    def decorated(*args, **kwargs):
        from app.models import User, db

        user_token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]

            if auth_header.startswith("Bearer "):
                user_token = auth_header.split(" ")[1]

        if not user_token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            data = jwt.decode(user_token, SECRET_KEY, algorithms=["HS256"])
            user_id = int(data["sub"])

            user = db.session.execute(
                select(User).where(User.user_id == user_id, User.is_active == True)
            ).scalars().first()

            if not user:
                return jsonify({"error": "User not found"}), 404
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.JWTError:
            return jsonify({"error": "Invalid token"}), 401
        
        return f(user_id, *args, **kwargs)

    return decorated

def admin_token_required(f):
    """
    Decorator to require admin role for a route.

    Args:
        f (function): The function to decorate.

    Returns:
        function: The decorated function.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        from app.models import User, db

        user_token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]

            if auth_header.startswith("Bearer "):
                user_token = auth_header.split(" ")[1]

        if not user_token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            data = jwt.decode(user_token, SECRET_KEY, algorithms=["HS256"])
            user_id = int(data["sub"])

            user = db.session.execute(
                select(User).where(User.user_id == user_id, User.is_active == True)
            ).scalars().first()

            if not user:
                return jsonify({"error": "User not found"}), 404
            
            admin_role = any(role.name.lower() == "admin" for role in user.roles)
            if not admin_role:
                return jsonify({"error": "Admin access required"}), 403
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.JWTError:
            return jsonify({"error": "Invalid token"}), 401
        
        return f(user_id, *args, **kwargs)
    
    return decorated

def resource_owner_required(f):
    """
    Decorator to check if user owns the resource or is admin.
    This should be used in combination with user_token_required.
    
    Args:
        f (function): The function to decorate.
    
    Returns:
        function: The decorated function.
    """
    @wraps(f)
    def decorated(user_id, *args, **kwargs):
        from app.models import User, db  # Import here to avoid circular imports
        
        # Get the user to check for admin role
        user = db.session.execute(
            select(User).where(User.user_id == user_id)
        ).scalars().first()
        
        # If user is admin, allow access
        if user and any(role.name.lower() == 'admin' for role in user.roles):
            return f(user_id, *args, **kwargs)
        
        # Otherwise, the route function should implement ownership checking
        return f(user_id, *args, **kwargs)
    
    return decorated