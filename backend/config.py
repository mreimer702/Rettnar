import os

class DevelopmentConfig:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://root:Full-Stack-dev97@localhost:3306/rettnar'
    CACHE_TYPE = 'SimpleCache'