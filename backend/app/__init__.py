from flask import Flask
from .models import db
from .extensions import ma, cache, limiter
from app.blueprints.users import users_bp
from app.blueprints.listings import listings_bp
from app.blueprints.listing_images import listing_images_bp
from app.blueprints.notifications import notifications_bp
from app.blueprints.search_logs import search_logs_bp

def create_app(config_name):

    app = Flask(__name__)
    app.config.from_object(f'config.{config_name}')

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)

    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(listings_bp, url_prefix='/api/listings')
    app.register_blueprint(listing_images_bp, url_prefix='/api/listing-images')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(search_logs_bp, url_prefix='/api/search-logs')

    return app