from flask import Blueprint

location_bp = Blueprint("location_bp", __name__)

from . import routes