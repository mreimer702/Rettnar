from app.models import User, Role
from app.extensions import ma
from marshmallow import fields, validate, validates_schema, ValidationError 

class RoleSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Role Schema
    class Meta:
        model = Role

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)

class UserSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ User Schema
    class Meta:
        model = User
        exclude = ['password_hash']

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class UserRegistrationSchema(ma.Schema):

    confirmed_password = fields.Str(required=True)
    address = fields.Str(validate=validate.Length(max=100))
    city = fields.Str(validate=validate.Length(max=50))
    state = fields.Str(validate=validate.Length(max=50))
    zip_code = fields.Str(validate=validate.Length(max=20))
    country = fields.Str(validate=validate.Length(max=50))

    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        if data.get('password') != data.get('confirmed_password'):
            raise ValidationError("Passwords do not match", field_name='confirmed_password')
        
class UserUpdateSchema(ma.Schema):

    current_password = fields.Str()
    new_password = fields.Str(validate=validate.Length(min=8, max=128))
    confirm_new_password = fields.Str()

    first_name = fields.Str(validate=validate.Length(min=1, max=50))
    last_name = fields.Str(validate=validate.Length(max=50))
    phone_number = fields.Str(validate=validate.Length(max=20))
    email = fields.Email(required=True, validate=validate.Length(max=100))

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
                raise ValidationError(f'Missing required fields for password change: {missing_fields}')
            
            if data.get('new_password') != data.get('confirm_new_password'):
                raise ValidationError("New passwords do not match", field_name='confirm_new_password')
            
class LoginSchema(ma.Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
            
user_registration_schema = UserRegistrationSchema()
user_update_schema = UserUpdateSchema()
login_schema = LoginSchema()