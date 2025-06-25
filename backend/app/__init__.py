from flask import Flask
from .models import db
from .extensions import ma, cache, limiter
from app.blueprints.users import users_bp
from app.blueprints.listings import listings_bp

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

    return app