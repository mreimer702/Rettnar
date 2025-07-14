from app.models import User, Role, Location
from app.extensions import ma
from marshmallow import fields, validate, validates_schema, ValidationError 

class LocationSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Location Schema
    class Meta:
        model = Location
        load_instance = True

class RoleSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Role Schema
    class Meta:
        model = Role
        load_instance = True

class UserSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ User Schema
    class Meta:
        model = User
        exclude = ['password_hash']
        include_relationships = True

    location = fields.Nested(LocationSchema, dump_only=True)
    roles = fields.List(fields.Nested(RoleSchema), dump_only=True)

class UserRegistrationSchema(ma.Schema):

    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    email = fields.Email(required=True, validate=validate.Length(max=100))
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    confirmed_password = fields.Str(required=True)
    
    # location fields
    address = fields.Str(validate=validate.Length(max=100))
    city = fields.Str(validate=validate.Length(max=50))
    state = fields.Str(validate=validate.Length(max=50))
    zip_code = fields.Str(validate=validate.Length(max=20))
    country = fields.Str(validate=validate.Length(max=50))

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        if data.get('password') != data.get('confirmed_password'):
            raise ValidationError("Passwords do not match", field_name='confirmed_password')
        
class UserUpdateSchema(ma.Schema):
    # Password change fields (all required if any are provided)
    current_password = fields.Str()
    new_password = fields.Str(validate=validate.Length(min=8, max=128))
    confirm_new_password = fields.Str()

    # Basic info fields
    first_name = fields.Str(validate=validate.Length(min=1, max=50))
    last_name = fields.Str(validate=validate.Length(max=50))
    phone = fields.Str(validate=validate.Length(max=20))
    email = fields.Email(validate=validate.Length(max=100))

    # Location fields
    address = fields.Str(validate=validate.Length(max=100))
    city = fields.Str(validate=validate.Length(max=50))
    state = fields.Str(validate=validate.Length(max=50))
    zip_code = fields.Str(validate=validate.Length(max=20))
    country = fields.Str(validate=validate.Length(max=50))

    @validates_schema
    def validate_password_change(self, data, **kwargs):
        password_fields = ['current_password', 'new_password', 'confirm_new_password']
        provided_password_fields = [field for field in password_fields if field in data]

        if provided_password_fields:
            missing_fields = [field for field in password_fields if field not in data]
            if missing_fields:
                raise ValidationError(f'All password fields required for password change: {missing_fields}')
            
            if data.get('new_password') != data.get('confirm_new_password'):
                raise ValidationError("New passwords do not match", field_name='confirm_new_password')
            
class LoginSchema(ma.Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

# Schema instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)
role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)
user_registration_schema = UserRegistrationSchema()
user_update_schema = UserUpdateSchema()
login_schema = LoginSchema()