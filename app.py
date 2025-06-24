from app import create_app
from app.models import db

app = create_app('DevelopmentConfig')

with app.app_context():
    db.drop_all()     # <---------- DROPS ALL TABLES
    db.create_all()     # <---------- CREATES ALL TABLES

app.run(debug=True)
