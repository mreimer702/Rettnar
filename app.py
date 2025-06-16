from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Integer, Enum, Text, DateTime, Table, text, Column
from datetime import datetime
from typing import List
from flask_marshmallow import Marshmallow
from passwords import password

# Instance
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://root:{password}@localhost/renttar_db'

class Base(DeclarativeBase):  # <------------------------------------------ Base Class
    pass

db = SQLAlchemy(model_class=Base)
ma = Marshmallow()

db.init_app(app)
ma.init_app(app)

user_roles = Table(  # <------------------------------------------ Role + user_roles association model
    'user_roles',
    Base.metadata,
    Column('user_id', ForeignKey('users.user_id'), primary_key=True),
    Column('role_id', ForeignKey('roles.role_id'), primary_key=True)
)

class Role(Base):  # <------------------------------------------ Role Model
    __tablename__ = "roles"

    role_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)

    users: Mapped[List["User"]] = relationship("User", secondary=user_roles, back_populates="roles")

class User(Base):  # <------------------------------------------ User Model
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    roles: Mapped[List["Role"]] = relationship("Role", secondary=user_roles, back_populates="users")
    listings: Mapped[List["Listing"]] = relationship("Listing", back_populates="owner")
    sent_messages: Mapped[List["Message"]] = relationship("Message", back_populates="sender", foreign_keys="[Message.sender_id]")
    received_messages: Mapped[List["Message"]] = relationship("Message", back_populates="receiver", foreign_keys="[Message.receiver_id]")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="user")

class Listing(Base):  # <------------------------------------------ Listing Model
    __tablename__ = "listings"

    listing_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    owner_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    owner: Mapped["User"] = relationship("User", back_populates="listings")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="listing")

class Message(Base):  # <------------------------------------------ Message Model
    __tablename__ = "messages"

    message_id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    sender_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)

    sender: Mapped["User"] = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver: Mapped["User"] = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")

class Payment(Base):  # <------------------------------------------ Payment Model
    __tablename__ = "payment"

    payment_id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[float] = mapped_column(nullable=False)
    paid_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.listing_id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="payments")
    listing: Mapped["Listing"] = relationship("Listing", back_populates="payments")


with app.app_context():
    db.drop_all()
    db.create_all()

app.run()
