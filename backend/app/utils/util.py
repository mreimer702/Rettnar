import os
from jose import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify

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
        'exp': datetime.now(timezone.utc) + timedelta(days=0, hours=1),
        'iat': datetime.now(timezone.utc),
        'sub': str(user_id)  # Token expires in 1 day'
    }
    
    user_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return user_token

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
        user_token = None

        if "Authorization" in request.headers:
            user_token = request.headers["Authorization"].split(" ")[1]

            if not user_token:
                return jsonify({"message": "Token is missing!"}), 401
            
            try:
                data = jwt.decode(user_token, SECRET_KEY, algorithms=["HS256"])
                user_id = data["sub"]

            except jwt.exceptions.ExpriredSignatureError as e:
                return jsonify({"message": "Token has expired!"}), 401
            except jwt.exceptions.JWTError as e:
                return jsonify({"message": "Invalid token!"}), 401
            
            return f(user_id, *args, **kwargs)
        else:
            return jsonify({"message": "Token is missing!"}), 401
    
    return decorated