from flask import Blueprint

search_logs_bp = Blueprint('search_logs', __name__)

from . import routes