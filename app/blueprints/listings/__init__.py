from flask import Blueprint

listings_bp = Blueprint("listings_bp", __name__)

from . import routes