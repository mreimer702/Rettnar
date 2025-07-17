import os
from pathlib import Path

# Base directory for the backend
BASE_DIR = Path(__file__).parent

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CACHE_TYPE = 'SimpleCache'
    
class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    # Use SQLite for easier development setup
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f'sqlite:///{BASE_DIR}/rettnar_dev.db'

class DevelopmentMySQLConfig(Config):
    """Development configuration with MySQL (original setup)"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://root:MRYW%405172020@localhost:3306/rettnar'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///rettnar.db'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'development_mysql': DevelopmentMySQLConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}