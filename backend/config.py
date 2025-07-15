import os

class DevelopmentConfig:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://root:MRYW%405172020@localhost:3306/rettnar'
    CACHE_TYPE = 'SimpleCache'
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-change-in-production'