from flask import Blueprint

features_bp = Blueprint('features', __name__)

from . import routes