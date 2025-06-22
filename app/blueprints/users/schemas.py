from app.extensions import ma
from app.models import User
from ..roles.schemas import RoleSchema
from ..locations.schemas import LocationSchema
from marshmallow import fields

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx USER Schemas xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

class UserSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Users Schema
    roles = fields.Nested(RoleSchema, many=True, dump_only=True)
    location = fields.Nested(LocationSchema, dump_only=True)
    
    address = fields.String(required=True)
    city = fields.String(required=True)
    state = fields.String(required=True)
    zip_code = fields.String(required=True)
    country = fields.String(required=True)

    role_ids = fields.List(fields.Integer(), load_only=True, required=True, error_messages={"required": "Role is required."})
    class Meta:
        model = User
        load_instance = True
        include_fk = True

user_schema = UserSchema()
users_schema = UserSchema(many=True)