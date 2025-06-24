from flask import Flask
from .models import db
from .extensions import ma, cache, limiter

def create_app(config_name):

    app = Flask(__name__)
    app.config.from_object(f'config.{config_name}')

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)

    from app.blueprints.users import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/users')

    return app