from flask import Blueprint

locations_bp = Blueprint("locations_bp", __name__)

from . import routes