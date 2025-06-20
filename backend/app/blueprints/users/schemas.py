from app.models import User, Role
from app.extensions import ma
from marshmallow import fields, validate

class RoleSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Role Schema
    class Meta:
        model = Role

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)

class UserSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ User Schema
    class Meta:
        model = User

user_schema = UserSchema()
users_schema = UserSchema(many=True)