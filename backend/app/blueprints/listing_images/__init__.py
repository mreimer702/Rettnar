from flask import Blueprint

listing_images_bp = Blueprint('listing_images', __name__)
                              
from . import routes  # Import routes to register them with the blueprint