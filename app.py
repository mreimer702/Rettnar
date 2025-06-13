from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from passwords import password

# Instance
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://root:{password}@localhost/renttar_db'


# Initialize
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class= Base)

db.init_app(app)

app.run()