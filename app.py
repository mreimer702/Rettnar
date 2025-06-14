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


with app.app_context():
    db.drop_all()
    db.create_all()

app.run()
