from flask import Blueprint

roles_bp = Blueprint("roles_bp", __name__)

from . import routes