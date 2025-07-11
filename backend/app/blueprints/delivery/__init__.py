from flask import Blueprint

delivery_bp = Blueprint('delivery', __name__)

from . import routes