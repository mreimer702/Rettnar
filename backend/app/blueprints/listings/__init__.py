from flask import Blueprint

listings_bp = Blueprint('listings', __name__)

from . import routes