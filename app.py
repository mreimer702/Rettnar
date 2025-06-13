from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Integer, Enum, Text, DateTime, Boolean, Table
from datetime import date
from typing import List
from flask_marshmallow import Marshmallow
from passwords import password

# Instance
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://root:{password}@localhost/renttar_db'
class Base(DeclarativeBase): #---> Base Class
    pass

db = SQLAlchemy(model_class= Base)
ma = Marshmallow()

db.init_app(app)
ma.init_app(app)

class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    country: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[DateTime]

    listings: Mapped[List['Listing']] = relationship(back_populates="owner")
    bookings: Mapped[List['Booking']] = relationship(back_populates="renter")
    sent_messages: Mapped[List['Message']] = relationship(foreign_keys='Message.sender_id', back_populates="sender")
    received_messages: Mapped[List['Message']] = relationship(foreign_keys='Message.receiver_id', back_populates="receiver")
    reviews: Mapped[List['Review']] = relationship(back_populates="user")
    payments: Mapped[List['Payment']] = relationship(back_populates="user")
    search_logs: Mapped[List['SearchLog']] = relationship(back_populates="user")

with app.app_context():
    db.create_all()

app.run()