from flask import Flask
from .models import db
from .extensions import ma, cache, limiter
from app.blueprints.users import users_bp
from app.blueprints.listings import listings_bp
from app.blueprints.listing_images import listing_images_bp
from app.blueprints.notifications import notifications_bp
from app.blueprints.search_logs import search_logs_bp
from app.blueprints.categories import categories_bp
from app.blueprints.delivery import delivery_bp
from app.blueprints.features import features_bp
from app.blueprints.messaging import messaging_bp
from app.blueprints.reviews import reviews_bp
from app.blueprints.payments import payments_bp

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
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(delivery_bp, url_prefix='/api/delivery')
    app.register_blueprint(features_bp, url_prefix='/api/features')
    app.register_blueprint(messaging_bp, url_prefix='/api/messaging')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')

    return app