from flask import request, jsonify
from app.blueprints.auth import auth_bp
from app.utils.util import encode_user_token
from werkzeug.security import check_password_hash
from app.models import User, db

@auth_bp.route("/login", methods=["POST"])
def login_user():
    # Logic for login
    pass