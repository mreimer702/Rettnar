from flask import Flask
from .extensions import ma
from .models import db
from .blueprints.roles import roles_bp
from .blueprints.users import users_bp
from .blueprints.locations import location_bp
from .blueprints.listings import listings_bp

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(f'config.{config_name}')

    #initialize Extensions
    ma.init_app(app)
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(roles_bp, url_prefix='/roles')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(location_bp, url_prefix='/locations')
    app.register_blueprint(listings_bp, url_prefix='/listings')


    return app