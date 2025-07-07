from flask import Blueprint

categories_bp = Blueprint('categories', __name__)

from . import routes